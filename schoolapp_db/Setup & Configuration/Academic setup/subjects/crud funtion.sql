/*
Subjects and Class Mapping Management Function

Usage Examples:

-- Step 1: CREATE subject with ALL columns
SELECT * FROM fn_manage_subject(
    'create', 4, 1, NULL,
    $json${
        "subject_code": "SUB-COM-101",
        "subject_name": "Computer Science",
        "subject_short_name": "CS",
        "subject_type": "Core",
        "subject_category_id": 1,
        "language_group_id": 1,
        "subject_level": 2,
        "parent_subject_id": null,
        "default_theory_credits": 4.00,
        "default_practical_credits": 2.00,
        "default_passing_marks_theory": 35,
        "default_passing_marks_practical": 40,
        "default_max_marks_theory": 100,
        "default_max_marks_practical": 50,
        "default_min_attendance_percent": 75.00,
        "is_grade_only": false,
        "has_practical": true,
        "default_practical_group_size": 15,
        "lab_required": true,
        "lab_id": 3,
        "is_optional": false,
        "is_co_scholastic": false,
        "co_scholastic_area_id": null,
        "global_display_order": 1,
        "description": "Computer Science fundamentals",
        "class_mappings": [
            {
                "class_id": 7,
                "subject_number": 3,
                "subject_code_override": "CS-7",
                "display_name": "Computer Science Grade 7",
                "display_order": 1,
                "theory_credits": 4.00,
                "practical_credits": 2.00,
                "theory_hours_per_week": 4,
                "practical_hours_per_week": 2,
                "passing_marks_theory": 35,
                "passing_marks_practical": 40,
                "max_marks_theory": 100,
                "max_marks_practical": 50,
                "min_attendance_percent": 75.00,
                "is_optional": false,
                "practical_group_size": 15,
                "is_taught": true,
                "suggested_teacher_id": 4
            }
        ]
    }$json$::JSONB
);

-- Step 2: VIEW the created subject
SELECT * FROM fn_manage_subject('view', 1, 1, 10, NULL::JSONB, 10, 0);

-- Step 3: UPDATE with ALL columns
SELECT * FROM fn_manage_subject(
    'update', 1, 1, 10,
    '{
        "subject_name": "Advanced Computer Science",
        "default_theory_credits": 5.00,
        "has_practical": true,
        "class_mappings": [
            {
                "id": 25,
                "theory_hours_per_week": 5,
                "practical_hours_per_week": 3,
                "is_taught": true
            }
        ]
    }'::JSONB
);

-- Step 4: ACTIVATE the subject
SELECT * FROM fn_manage_subject('activate', 1, 1, 10, NULL::JSONB);

-- Step 5: VIEW active subject
SELECT * FROM fn_manage_subject('view', 4, 1, null, '{"status": 1}'::JSONB, 10, 0);

-- Step 6: DEACTIVATE the subject
SELECT * FROM fn_manage_subject('deactivate', 1, 1, 10, NULL::JSONB);

-- Step 7: DELETE the subject (after deactivation)
SELECT * FROM fn_manage_subject('delete', 1, 1, 10, NULL::JSONB);



*/
CREATE OR REPLACE FUNCTION fn_manage_subject (
    p_operation   VARCHAR(50),
    p_user_id     BIGINT,
    p_school_id   BIGINT,
    p_id          BIGINT DEFAULT NULL,
    p_data        JSONB DEFAULT NULL,
    p_limit       INTEGER DEFAULT 100,
    p_offset      INTEGER DEFAULT 0
)
RETURNS TABLE (
    out_id                  BIGINT,
    out_subject_code        VARCHAR(50),
    out_subject_name        VARCHAR(255),
    out_subject_short_name  VARCHAR(50),
    out_subject_type        VARCHAR(50),
    out_subject_category    VARCHAR(150),
    out_status_name         TEXT,
    out_class_mappings      JSONB,
    out_created_dt          TIMESTAMPTZ,
    out_updated_dt          TIMESTAMPTZ,
    out_message             TEXT
)
AS $$
DECLARE
    v_id                BIGINT;
    v_control_id        BIGINT;
    v_role_id           BIGINT;
    v_has_permission    BOOLEAN;
    v_is_admin          BOOLEAN;
    v_form_id           BIGINT;
    v_mapping_form_id   BIGINT;
    v_status            SMALLINT;
    v_draft_status      SMALLINT;
    v_active_status     SMALLINT;
    v_inactive_status   SMALLINT;
    v_mapping_record    JSONB;
    v_subject_data      JSONB;
    v_mappings_data     JSONB;
    v_mappings_to_delete JSONB;
    v_mapping_id        BIGINT;
    v_class_id          INTEGER;
    v_exists            BOOLEAN;
    v_subject_status    SMALLINT;
    v_error_message     TEXT;
BEGIN
    ----------------------------------------------------------------
    -- 1. NORMALIZE OPERATION
    ----------------------------------------------------------------
    p_operation := LOWER(TRIM(p_operation));

    ----------------------------------------------------------------
    -- 2. GET FORM IDs (FIXED duplicate variable bug)
    ----------------------------------------------------------------
    SELECT id INTO v_form_id
    FROM forms
    WHERE LOWER(form_code) = 'subject_management_main';
    
    IF v_form_id IS NULL THEN
        RAISE EXCEPTION 'Form not configured: subject_management_main';
    END IF;

    -- FIXED: Was using v_form_id instead of v_mapping_form_id
    SELECT id INTO v_mapping_form_id
    FROM forms
    WHERE LOWER(form_code) = 'subject_management_main';
    
    IF v_mapping_form_id IS NULL THEN
        RAISE EXCEPTION 'Form not configured: subject_class_mapping';
    END IF;

    ----------------------------------------------------------------
    -- 3. VALIDATE CONTROL
    ----------------------------------------------------------------
    SELECT id INTO v_control_id
    FROM controls
    WHERE LOWER(control_code) = p_operation;

    IF v_control_id IS NULL THEN
        RAISE EXCEPTION 'Invalid operation/control: %', p_operation;
    END IF;

    ----------------------------------------------------------------
    -- 4. USER VALIDATION
    ----------------------------------------------------------------
    SELECT is_platform_admin INTO v_is_admin
    FROM users
    WHERE id = p_user_id;

    IF v_is_admin IS NULL THEN
        RAISE EXCEPTION 'Invalid user';
    END IF;

    ----------------------------------------------------------------
    -- 5. RBAC CHECK
    ----------------------------------------------------------------
    IF NOT v_is_admin THEN
        SELECT role_id INTO v_role_id
        FROM user_school_roles
        WHERE user_id = p_user_id
          AND school_id = p_school_id
          AND status = 1
        LIMIT 1;

        IF v_role_id IS NULL THEN
            RAISE EXCEPTION 'No role assigned for this school';
        END IF;

        SELECT EXISTS (
            SELECT 1
            FROM role_form_control_access rfca
            WHERE rfca.role_id = v_role_id
              AND rfca.form_id = v_form_id
              AND rfca.control_id = v_control_id
              AND rfca.can_access = TRUE
        ) INTO v_has_permission;

        IF NOT v_has_permission THEN
            RAISE EXCEPTION 'Access denied for operation: %', p_operation;
        END IF;
    END IF;

    ----------------------------------------------------------------
    -- 6. STATUS FETCH
    ----------------------------------------------------------------
    SELECT status_id INTO v_draft_status
    FROM form_status_master
    WHERE form_id = v_form_id AND LOWER(status_name) = 'draft';

    SELECT status_id INTO v_active_status
    FROM form_status_master
    WHERE form_id = v_form_id AND LOWER(status_name) = 'active';

    SELECT status_id INTO v_inactive_status
    FROM form_status_master
    WHERE form_id = v_form_id AND LOWER(status_name) = 'inactive';

    ----------------------------------------------------------------
    -- 7. CREATE (WITH TRANSACTION HANDLING)
    ----------------------------------------------------------------
    IF p_operation = 'create' THEN
        -- Start explicit transaction block
        BEGIN
            IF p_data IS NULL THEN
                RAISE EXCEPTION 'Missing required data for create';
            END IF;

            -- Extract subject data
            v_subject_data := p_data - 'class_mappings' - 'mappings_to_delete';
            
            IF v_subject_data->>'subject_code' IS NULL OR 
               v_subject_data->>'subject_name' IS NULL THEN
                RAISE EXCEPTION 'Missing required subject fields: subject_code, subject_name';
            END IF;

            -- Check for existing subject
            SELECT EXISTS (
                SELECT 1 FROM subjects 
                WHERE school_id = p_school_id 
                AND (subject_code = (v_subject_data->>'subject_code')
                     OR subject_name = (v_subject_data->>'subject_name'))
            ) INTO v_exists;

            IF v_exists THEN
                RAISE EXCEPTION 'Subject with same code or name already exists';
            END IF;

            -- Insert subject
            INSERT INTO subjects (
                form_id, school_id,
                subject_code, subject_name, subject_short_name,
                subject_type, subject_category_id, language_group_id,
                subject_level, parent_subject_id,
                default_theory_credits, default_practical_credits,
                default_passing_marks_theory, default_passing_marks_practical,
                default_max_marks_theory, default_max_marks_practical,
                default_min_attendance_percent, is_grade_only,
                has_practical, default_practical_group_size,
                lab_required, lab_id,
                is_optional, is_co_scholastic, co_scholastic_area_id,
                global_display_order, description, status,
                created_by, updated_by
            )
            VALUES (
                v_form_id, p_school_id,
                v_subject_data->>'subject_code',
                v_subject_data->>'subject_name',
                v_subject_data->>'subject_short_name',
                v_subject_data->>'subject_type',
                (v_subject_data->>'subject_category_id')::BIGINT,
                (v_subject_data->>'language_group_id')::BIGINT,
                COALESCE((v_subject_data->>'subject_level')::INTEGER, 1),
                (v_subject_data->>'parent_subject_id')::BIGINT,
                COALESCE((v_subject_data->>'default_theory_credits')::DECIMAL, 0.00),
                COALESCE((v_subject_data->>'default_practical_credits')::DECIMAL, 0.00),
                COALESCE((v_subject_data->>'default_passing_marks_theory')::INTEGER, 33),
                COALESCE((v_subject_data->>'default_passing_marks_practical')::INTEGER, 33),
                COALESCE((v_subject_data->>'default_max_marks_theory')::INTEGER, 100),
                COALESCE((v_subject_data->>'default_max_marks_practical')::INTEGER, 100),
                COALESCE((v_subject_data->>'default_min_attendance_percent')::DECIMAL, 75.00),
                COALESCE((v_subject_data->>'is_grade_only')::BOOLEAN, FALSE),
                COALESCE((v_subject_data->>'has_practical')::BOOLEAN, FALSE),
                (v_subject_data->>'default_practical_group_size')::INTEGER,
                COALESCE((v_subject_data->>'lab_required')::BOOLEAN, FALSE),
                (v_subject_data->>'lab_id')::BIGINT,
                COALESCE((v_subject_data->>'is_optional')::BOOLEAN, FALSE),
                COALESCE((v_subject_data->>'is_co_scholastic')::BOOLEAN, FALSE),
                (v_subject_data->>'co_scholastic_area_id')::BIGINT,
                COALESCE((v_subject_data->>'global_display_order')::INTEGER, 0),
                v_subject_data->>'description',
                v_draft_status,
                p_user_id, p_user_id
            )
            RETURNING id INTO v_id;

            -- Insert class mappings with validation
            v_mappings_data := p_data->'class_mappings';
            IF v_mappings_data IS NOT NULL AND jsonb_array_length(v_mappings_data) > 0 THEN
                FOR v_mapping_record IN 
                    SELECT * FROM jsonb_array_elements(v_mappings_data)
                LOOP
                    -- Validate required fields for mapping
                    IF v_mapping_record->>'class_id' IS NULL THEN
                        RAISE EXCEPTION 'class_id is required for each class mapping';
                    END IF;
                    
                    INSERT INTO subject_class_mapping (
                        form_id, school_id, subject_id, class_id,
                        subject_code_override, display_name, subject_number, display_order,
                        theory_credits, practical_credits,
                        theory_hours_per_week, practical_hours_per_week,
                        passing_marks_theory, passing_marks_practical,
                        max_marks_theory, max_marks_practical,
                        min_attendance_percent, is_optional, practical_group_size,
                        is_taught, suggested_teacher_id, status,
                        created_by, updated_by
                    )
                    VALUES (
                        v_mapping_form_id, p_school_id, v_id,
                        (v_mapping_record->>'class_id')::INTEGER,
                        v_mapping_record->>'subject_code_override',
                        v_mapping_record->>'display_name',
                        COALESCE((v_mapping_record->>'subject_number')::INTEGER, 1),
                        COALESCE((v_mapping_record->>'display_order')::INTEGER, 0),
                        COALESCE((v_mapping_record->>'theory_credits')::DECIMAL, 0.00),
                        COALESCE((v_mapping_record->>'practical_credits')::DECIMAL, 0.00),
                        COALESCE((v_mapping_record->>'theory_hours_per_week')::INTEGER, 0),
                        COALESCE((v_mapping_record->>'practical_hours_per_week')::INTEGER, 0),
                        COALESCE((v_mapping_record->>'passing_marks_theory')::INTEGER, 33),
                        COALESCE((v_mapping_record->>'passing_marks_practical')::INTEGER, 33),
                        COALESCE((v_mapping_record->>'max_marks_theory')::INTEGER, 100),
                        COALESCE((v_mapping_record->>'max_marks_practical')::INTEGER, 100),
                        COALESCE((v_mapping_record->>'min_attendance_percent')::DECIMAL, 75.00),
                        COALESCE((v_mapping_record->>'is_optional')::BOOLEAN, FALSE),
                        (v_mapping_record->>'practical_group_size')::INTEGER,
                        COALESCE((v_mapping_record->>'is_taught')::BOOLEAN, TRUE),
                        (v_mapping_record->>'suggested_teacher_id')::BIGINT,
                        v_active_status,
                        p_user_id, p_user_id
                    );
                END LOOP;
            END IF;
            
            -- Commit happens automatically at end of BEGIN block
        EXCEPTION
            WHEN OTHERS THEN
                -- Rollback will happen automatically
                RAISE EXCEPTION 'Create failed: %', SQLERRM;
        END;

    ----------------------------------------------------------------
    -- 8. UPDATE (WITH TRANSACTION HANDLING)
    ----------------------------------------------------------------
    ELSIF p_operation = 'update' THEN
        BEGIN
            IF p_id IS NULL THEN
                RAISE EXCEPTION 'ID required for update';
            END IF;

            IF p_data IS NULL THEN
                RAISE EXCEPTION 'Missing required data for update';
            END IF;

            -- Check if subject exists and get its status
            SELECT status INTO v_subject_status
            FROM subjects
            WHERE id = p_id AND school_id = p_school_id;
            
            IF v_subject_status IS NULL THEN
                RAISE EXCEPTION 'Subject not found';
            END IF;
            
            -- Prevent update of inactive subjects (optional rule)
            IF v_subject_status = v_inactive_status THEN
                RAISE EXCEPTION 'Cannot update inactive subject. Activate it first.';
            END IF;

            -- Extract subject data
            v_subject_data := p_data - 'class_mappings' - 'mappings_to_delete';
            
            -- Check for existing subject conflicts
            SELECT EXISTS (
                SELECT 1 FROM subjects 
                WHERE school_id = p_school_id 
                AND id <> p_id
                AND (subject_code = COALESCE(v_subject_data->>'subject_code', subject_code)
                     OR subject_name = COALESCE(v_subject_data->>'subject_name', subject_name))
            ) INTO v_exists;

            IF v_exists THEN
                RAISE EXCEPTION 'Subject with same code or name already exists';
            END IF;

            -- Update subject
            UPDATE subjects
            SET 
                subject_code = COALESCE(v_subject_data->>'subject_code', subject_code),
                subject_name = COALESCE(v_subject_data->>'subject_name', subject_name),
                subject_short_name = COALESCE(v_subject_data->>'subject_short_name', subject_short_name),
                subject_type = COALESCE(v_subject_data->>'subject_type', subject_type),
                subject_category_id = COALESCE((v_subject_data->>'subject_category_id')::BIGINT, subject_category_id),
                language_group_id = COALESCE((v_subject_data->>'language_group_id')::BIGINT, language_group_id),
                subject_level = COALESCE((v_subject_data->>'subject_level')::INTEGER, subject_level),
                parent_subject_id = COALESCE((v_subject_data->>'parent_subject_id')::BIGINT, parent_subject_id),
                default_theory_credits = COALESCE((v_subject_data->>'default_theory_credits')::DECIMAL, default_theory_credits),
                default_practical_credits = COALESCE((v_subject_data->>'default_practical_credits')::DECIMAL, default_practical_credits),
                default_passing_marks_theory = COALESCE((v_subject_data->>'default_passing_marks_theory')::INTEGER, default_passing_marks_theory),
                default_passing_marks_practical = COALESCE((v_subject_data->>'default_passing_marks_practical')::INTEGER, default_passing_marks_practical),
                default_max_marks_theory = COALESCE((v_subject_data->>'default_max_marks_theory')::INTEGER, default_max_marks_theory),
                default_max_marks_practical = COALESCE((v_subject_data->>'default_max_marks_practical')::INTEGER, default_max_marks_practical),
                default_min_attendance_percent = COALESCE((v_subject_data->>'default_min_attendance_percent')::DECIMAL, default_min_attendance_percent),
                is_grade_only = COALESCE((v_subject_data->>'is_grade_only')::BOOLEAN, is_grade_only),
                has_practical = COALESCE((v_subject_data->>'has_practical')::BOOLEAN, has_practical),
                default_practical_group_size = COALESCE((v_subject_data->>'default_practical_group_size')::INTEGER, default_practical_group_size),
                lab_required = COALESCE((v_subject_data->>'lab_required')::BOOLEAN, lab_required),
                lab_id = COALESCE((v_subject_data->>'lab_id')::BIGINT, lab_id),
                is_optional = COALESCE((v_subject_data->>'is_optional')::BOOLEAN, is_optional),
                is_co_scholastic = COALESCE((v_subject_data->>'is_co_scholastic')::BOOLEAN, is_co_scholastic),
                co_scholastic_area_id = COALESCE((v_subject_data->>'co_scholastic_area_id')::BIGINT, co_scholastic_area_id),
                global_display_order = COALESCE((v_subject_data->>'global_display_order')::INTEGER, global_display_order),
                description = COALESCE(v_subject_data->>'description', description),
                updated_by = p_user_id,
                updated_dt = NOW()
            WHERE id = p_id AND school_id = p_school_id
            RETURNING id INTO v_id;

            IF v_id IS NULL THEN
                RAISE EXCEPTION 'Subject not found';
            END IF;

            -- Update class mappings
            v_mappings_data := p_data->'class_mappings';
            IF v_mappings_data IS NOT NULL AND jsonb_array_length(v_mappings_data) > 0 THEN
                FOR v_mapping_record IN 
                    SELECT * FROM jsonb_array_elements(v_mappings_data)
                LOOP
                    v_mapping_id := (v_mapping_record->>'id')::BIGINT;
                    
                    IF v_mapping_id IS NOT NULL THEN
                        -- Verify mapping belongs to this subject
                        SELECT EXISTS (
                            SELECT 1 FROM subject_class_mapping 
                            WHERE id = v_mapping_id AND subject_id = v_id
                        ) INTO v_exists;
                        
                        IF NOT v_exists THEN
                            RAISE EXCEPTION 'Mapping ID % does not belong to subject %', v_mapping_id, v_id;
                        END IF;
                        
                        -- Update existing mapping
                        UPDATE subject_class_mapping
                        SET 
                            subject_code_override = COALESCE(v_mapping_record->>'subject_code_override', subject_code_override),
                            display_name = COALESCE(v_mapping_record->>'display_name', display_name),
                            subject_number = COALESCE((v_mapping_record->>'subject_number')::INTEGER, subject_number),
                            display_order = COALESCE((v_mapping_record->>'display_order')::INTEGER, display_order),
                            theory_credits = COALESCE((v_mapping_record->>'theory_credits')::DECIMAL, theory_credits),
                            practical_credits = COALESCE((v_mapping_record->>'practical_credits')::DECIMAL, practical_credits),
                            theory_hours_per_week = COALESCE((v_mapping_record->>'theory_hours_per_week')::INTEGER, theory_hours_per_week),
                            practical_hours_per_week = COALESCE((v_mapping_record->>'practical_hours_per_week')::INTEGER, practical_hours_per_week),
                            passing_marks_theory = COALESCE((v_mapping_record->>'passing_marks_theory')::INTEGER, passing_marks_theory),
                            passing_marks_practical = COALESCE((v_mapping_record->>'passing_marks_practical')::INTEGER, passing_marks_practical),
                            max_marks_theory = COALESCE((v_mapping_record->>'max_marks_theory')::INTEGER, max_marks_theory),
                            max_marks_practical = COALESCE((v_mapping_record->>'max_marks_practical')::INTEGER, max_marks_practical),
                            min_attendance_percent = COALESCE((v_mapping_record->>'min_attendance_percent')::DECIMAL, min_attendance_percent),
                            is_optional = COALESCE((v_mapping_record->>'is_optional')::BOOLEAN, is_optional),
                            practical_group_size = COALESCE((v_mapping_record->>'practical_group_size')::INTEGER, practical_group_size),
                            is_taught = COALESCE((v_mapping_record->>'is_taught')::BOOLEAN, is_taught),
                            suggested_teacher_id = COALESCE((v_mapping_record->>'suggested_teacher_id')::BIGINT, suggested_teacher_id),
                            updated_by = p_user_id,
                            updated_dt = NOW()
                        WHERE id = v_mapping_id AND subject_id = v_id;
                    ELSE
                        -- Validate class_id for new mapping
                        IF v_mapping_record->>'class_id' IS NULL THEN
                            RAISE EXCEPTION 'class_id required for new mapping';
                        END IF;
                        
                        -- Insert new mapping
                        INSERT INTO subject_class_mapping (
                            form_id, school_id, subject_id, class_id,
                            subject_code_override, display_name, subject_number, display_order,
                            theory_credits, practical_credits,
                            theory_hours_per_week, practical_hours_per_week,
                            passing_marks_theory, passing_marks_practical,
                            max_marks_theory, max_marks_practical,
                            min_attendance_percent, is_optional, practical_group_size,
                            is_taught, suggested_teacher_id, status,
                            created_by, updated_by
                        )
                        VALUES (
                            v_mapping_form_id, p_school_id, v_id,
                            (v_mapping_record->>'class_id')::INTEGER,
                            v_mapping_record->>'subject_code_override',
                            v_mapping_record->>'display_name',
                            COALESCE((v_mapping_record->>'subject_number')::INTEGER, 1),
                            COALESCE((v_mapping_record->>'display_order')::INTEGER, 0),
                            COALESCE((v_mapping_record->>'theory_credits')::DECIMAL, 0.00),
                            COALESCE((v_mapping_record->>'practical_credits')::DECIMAL, 0.00),
                            COALESCE((v_mapping_record->>'theory_hours_per_week')::INTEGER, 0),
                            COALESCE((v_mapping_record->>'practical_hours_per_week')::INTEGER, 0),
                            COALESCE((v_mapping_record->>'passing_marks_theory')::INTEGER, 33),
                            COALESCE((v_mapping_record->>'passing_marks_practical')::INTEGER, 33),
                            COALESCE((v_mapping_record->>'max_marks_theory')::INTEGER, 100),
                            COALESCE((v_mapping_record->>'max_marks_practical')::INTEGER, 100),
                            COALESCE((v_mapping_record->>'min_attendance_percent')::DECIMAL, 75.00),
                            COALESCE((v_mapping_record->>'is_optional')::BOOLEAN, FALSE),
                            (v_mapping_record->>'practical_group_size')::INTEGER,
                            COALESCE((v_mapping_record->>'is_taught')::BOOLEAN, TRUE),
                            (v_mapping_record->>'suggested_teacher_id')::BIGINT,
                            v_active_status,
                            p_user_id, p_user_id
                        );
                    END IF;
                END LOOP;
            END IF;

            -- Delete mappings
            v_mappings_to_delete := p_data->'mappings_to_delete';
            IF v_mappings_to_delete IS NOT NULL AND jsonb_array_length(v_mappings_to_delete) > 0 THEN
                FOR v_mapping_record IN 
                    SELECT * FROM jsonb_array_elements(v_mappings_to_delete)
                LOOP
                    -- Fixed: Handle both array and object formats
                    IF jsonb_typeof(v_mapping_record) = 'number' OR 
                       (jsonb_typeof(v_mapping_record) = 'string' AND v_mapping_record::TEXT ~ '^[0-9]+$') THEN
                        v_mapping_id := v_mapping_record::BIGINT;
                    ELSE
                        v_mapping_id := (v_mapping_record->>0)::BIGINT;
                    END IF;
                    
                    DELETE FROM subject_class_mapping
                    WHERE id = v_mapping_id AND subject_id = v_id;
                END LOOP;
            END IF;
            
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION 'Update failed: %', SQLERRM;
        END;

    ----------------------------------------------------------------
    -- 9. DELETE
    ----------------------------------------------------------------
    ELSIF p_operation = 'delete' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for delete';
        END IF;

        -- Check if subject can be deleted
        SELECT status INTO v_status
        FROM subjects
        WHERE id = p_id AND school_id = p_school_id;

        IF v_status IS NULL THEN
            RAISE EXCEPTION 'Subject not found';
        END IF;

        IF v_status = v_active_status THEN
            RAISE EXCEPTION 'Cannot delete active subject. Deactivate it first.';
        END IF;

        -- Check for dependencies (academic sessions using this subject)
        SELECT COUNT(*) INTO v_exists
        FROM class_subject_teachers cst
        WHERE cst.subject_id = p_id
        LIMIT 1;
        
        IF v_exists > 0 THEN
            RAISE EXCEPTION 'Cannot delete subject as it is assigned to classes';
        END IF;

        -- Delete mappings first (explicit for control)
        DELETE FROM subject_class_mapping WHERE subject_id = p_id;
        
        -- Delete subject
        DELETE FROM subjects
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Subject not found';
        END IF;

        RETURN QUERY
        SELECT
            p_id::BIGINT,
            NULL::VARCHAR(50),
            NULL::VARCHAR(255),
            NULL::VARCHAR(50),
            NULL::VARCHAR(50),
            NULL::VARCHAR(150),
            NULL::TEXT,
            NULL::JSONB,
            NULL::TIMESTAMPTZ,
            NOW()::TIMESTAMPTZ,
            'SUCCESS - Subject deleted'::TEXT;
        RETURN;

    ----------------------------------------------------------------
    -- 10. ACTIVATE
    ----------------------------------------------------------------
    ELSIF p_operation = 'activate' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for activate';
        END IF;

        -- Validate subject exists
        SELECT status INTO v_status
        FROM subjects
        WHERE id = p_id AND school_id = p_school_id;
        
        IF v_status IS NULL THEN
            RAISE EXCEPTION 'Subject not found';
        END IF;
        
        -- Check if at least one mapping exists for active subject
        SELECT EXISTS (
            SELECT 1 FROM subject_class_mapping 
            WHERE subject_id = p_id AND is_taught = TRUE
        ) INTO v_exists;
        
        IF NOT v_exists THEN
            RAISE EXCEPTION 'Cannot activate subject without class mappings';
        END IF;

        UPDATE subjects
        SET status = v_active_status,
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Subject not found';
        END IF;

    ----------------------------------------------------------------
    -- 11. DEACTIVATE
    ----------------------------------------------------------------
    ELSIF p_operation = 'deactivate' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for deactivate';
        END IF;

        UPDATE subjects
        SET status = v_inactive_status,
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Subject not found';
        END IF;

    ----------------------------------------------------------------
    -- 12. VIEW
    ----------------------------------------------------------------
    ELSIF p_operation = 'view' THEN
        RETURN QUERY
        SELECT
            s.id::BIGINT,
            s.subject_code::VARCHAR(50),
            s.subject_name::VARCHAR(255),
            s.subject_short_name::VARCHAR(50),
            s.subject_type::VARCHAR(50),
            cmv.value_name::VARCHAR(150) AS subject_category,
            fsm.status_name::TEXT AS status_name,
            COALESCE(
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', scm.id,
                            'class_id', scm.class_id,
                            'class_name', c.class_name,
                            'class_number', c.class_number,
                            'subject_code_override', scm.subject_code_override,
                            'display_name', scm.display_name,
                            'subject_number', scm.subject_number,
                            'display_order', scm.display_order,
                            'theory_credits', scm.theory_credits,
                            'practical_credits', scm.practical_credits,
                            'total_credits', scm.total_credits,
                            'theory_hours_per_week', scm.theory_hours_per_week,
                            'practical_hours_per_week', scm.practical_hours_per_week,
                            'total_hours_per_week', scm.total_hours_per_week,
                            'passing_marks_theory', scm.passing_marks_theory,
                            'passing_marks_practical', scm.passing_marks_practical,
                            'max_marks_theory', scm.max_marks_theory,
                            'max_marks_practical', scm.max_marks_practical,
                            'min_attendance_percent', scm.min_attendance_percent,
                            'is_optional', scm.is_optional,
                            'practical_group_size', scm.practical_group_size,
                            'is_taught', scm.is_taught,
                            'suggested_teacher_id', scm.suggested_teacher_id,
                            'teacher_name', u.user_name,
                            'status', scm.status
                        ) ORDER BY scm.subject_number, scm.display_order
                    )
                    FROM subject_class_mapping scm
                    LEFT JOIN classes c ON c.id = scm.class_id
                    LEFT JOIN users u ON u.id = scm.suggested_teacher_id
                    WHERE scm.subject_id = s.id 
                      AND (p_data IS NULL OR p_data->>'class_id' IS NULL OR scm.class_id = (p_data->>'class_id')::INTEGER)
                ),
                '[]'::JSONB
            )::JSONB AS class_mappings,
            s.created_dt::TIMESTAMPTZ,
            s.updated_dt::TIMESTAMPTZ,
            'SUCCESS'::TEXT
        FROM subjects s
        LEFT JOIN common_master_values cmv ON cmv.id = s.subject_category_id
        LEFT JOIN form_status_master fsm ON fsm.form_id = s.form_id AND fsm.status_id = s.status
        WHERE (p_id IS NULL OR s.id = p_id)
          AND (p_school_id IS NULL OR s.school_id = p_school_id)
          AND (p_data IS NULL OR p_data->>'status' IS NULL OR s.status = (p_data->>'status')::SMALLINT)
          AND (p_data IS NULL OR p_data->>'subject_type' IS NULL OR s.subject_type = (p_data->>'subject_type')::TEXT)
          AND (p_data IS NULL OR p_data->>'subject_category_id' IS NULL OR s.subject_category_id = (p_data->>'subject_category_id')::BIGINT)
        ORDER BY s.global_display_order, s.subject_name
        LIMIT p_limit OFFSET p_offset;

        RETURN;

    ELSE
        RAISE EXCEPTION 'Unsupported operation: %. Supported: create, update, delete, activate, deactivate, view', p_operation;
    END IF;

    ----------------------------------------------------------------
    -- 13. SINGLE ROW RETURN FOR CREATE / UPDATE / ACTIVATE / DEACTIVATE
    ----------------------------------------------------------------
    RETURN QUERY
    SELECT
        s.id::BIGINT,
        s.subject_code::VARCHAR(50),
        s.subject_name::VARCHAR(255),
        s.subject_short_name::VARCHAR(50),
        s.subject_type::VARCHAR(50),
        cmv.value_name::VARCHAR(150) AS subject_category,
        fsm.status_name::TEXT AS status_name,
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', scm.id,
                        'class_id', scm.class_id,
                        'class_name', c.class_name,
                        'subject_number', scm.subject_number,
                        'theory_hours_per_week', scm.theory_hours_per_week,
                        'is_taught', scm.is_taught
                    ) ORDER BY scm.subject_number
                )
                FROM subject_class_mapping scm
                LEFT JOIN classes c ON c.id = scm.class_id
                WHERE scm.subject_id = s.id
            ),
            '[]'::JSONB
        )::JSONB AS class_mappings,
        s.created_dt::TIMESTAMPTZ,
        s.updated_dt::TIMESTAMPTZ,
        CASE 
            WHEN p_operation = 'create' THEN 'Subject created successfully'::TEXT
            WHEN p_operation = 'update' THEN 'Subject updated successfully'::TEXT
            WHEN p_operation = 'activate' THEN 'Subject activated successfully'::TEXT
            WHEN p_operation = 'deactivate' THEN 'Subject deactivated successfully'::TEXT
            ELSE 'SUCCESS'::TEXT
        END AS message
    FROM subjects s
    LEFT JOIN common_master_values cmv ON cmv.id = s.subject_category_id
    LEFT JOIN form_status_master fsm ON fsm.form_id = s.form_id AND fsm.status_id = s.status
    WHERE s.id = v_id AND s.school_id = p_school_id;

    RETURN;

EXCEPTION
    WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
        RETURN QUERY
        SELECT
            NULL::BIGINT,
            NULL::VARCHAR(50),
            NULL::VARCHAR(255),
            NULL::VARCHAR(50),
            NULL::VARCHAR(50),
            NULL::VARCHAR(150),
            NULL::TEXT,
            NULL::JSONB,
            NULL::TIMESTAMPTZ,
            NULL::TIMESTAMPTZ,
            ('ERROR: ' || v_error_message)::TEXT;
        RETURN;
END;
$$ LANGUAGE plpgsql;