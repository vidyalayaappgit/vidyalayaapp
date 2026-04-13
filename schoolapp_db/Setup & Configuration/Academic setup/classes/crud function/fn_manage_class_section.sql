/*
Classes and Sections Management Function

Usage Examples:

1. CREATE a new class with multiple sections
SELECT * FROM fn_manage_class_section(
    'create',           -- operation
    4,                  -- user_id
    1,                  -- school_id
    NULL,               -- id (NULL for create)
    '{
        "class_code": "CLS-01",
        "class_name": "Class 1",
        "class_number": 3,
        "academic_level_id": 1,
        "class_roman_numeral": "I",
        "display_order": 4,
        "min_age_required": 6,
        "max_age_required": 7,
        "description": "First standard",
        "sections": [
            {
                "section_code": "A",
                "section_name": "Section A",
                "room_id": 1,
                "capacity": 35,
                "start_time": "08:00:00",
                "end_time": "12:30:00",
                "display_order": 1
            },
            {
                "section_code": "B",
                "section_name": "Section B",
                "room_id": 2,
                "capacity": 35,
                "start_time": "08:00:00",
                "end_time": "12:30:00",
                "display_order": 2
            }
        ]
    }'::JSONB
);

2. UPDATE existing class and its sections
SELECT * FROM fn_manage_class_section(
    'update',           -- operation
    1,                  -- user_id
    1,                  -- school_id
    10,                 -- class_id
    '{
        "class_name": "Class 1 Updated",
        "class_roman_numeral": "I",
        "display_order": 4,
        "min_age_required": 6,
        "max_age_required": 7,
        "description": "Updated description",
        "sections": [
            {
                "id": 25,
                "section_code": "A",
                "section_name": "Section A Updated",
                "room_id": 1,
                "capacity": 40,
                "start_time": "08:30:00",
                "end_time": "13:00:00",
                "display_order": 1
            },
            {
                "section_code": "C",
                "section_name": "Section C",
                "room_id": 3,
                "capacity": 35,
                "start_time": "08:00:00",
                "end_time": "12:30:00",
                "display_order": 3
            }
        ],
        "sections_to_delete": [26]
    }'::JSONB
);

3. DELETE a class (cascades to sections)
SELECT * FROM fn_manage_class_section(
    'delete',           -- operation
    1,                  -- user_id
    1,                  -- school_id
    10,                 -- class_id
    NULL::JSONB
);

4. ACTIVATE/DEACTIVATE a class
SELECT * FROM fn_manage_class_section(
    'activate',         -- operation (or 'deactivate')
    1,                  -- user_id
    1,                  -- school_id
    10,                 -- class_id
    NULL::JSONB
);

5. AUTHORIZE a class
SELECT * FROM fn_manage_class_section(
    'authorize',        -- operation
    1,                  -- user_id
    1,                  -- school_id
    10,                 -- class_id
    NULL::JSONB
);

6. VIEW classes with pagination
-- All classes with pagination
SELECT * FROM fn_manage_class_section(
    'view',             -- operation
    1,                  -- user_id
    1,                  -- school_id
    NULL,               -- id
    NULL::JSONB,        -- data
    10,                 -- limit
    0                   -- offset
);

-- Single class by ID
SELECT * FROM fn_manage_class_section(
    'view',             -- operation
    1,                  -- user_id
    1,                  -- school_id
    10,                 -- id
    NULL::JSONB,        -- data
    10,                 -- limit
    0                   -- offset
);

-- Filter by status
SELECT * FROM fn_manage_class_section(
    'view',             -- operation
    1,                  -- user_id
    1,                  -- school_id
    NULL,               -- id
    '{"status": 1}'::JSONB,  -- 1=Active, 2=Inactive, 3=Fresh, 4=Authorised
    10,                 -- limit
    0                   -- offset
);
*/
CREATE OR REPLACE FUNCTION fn_manage_class_section (
    p_operation   VARCHAR(50),
    p_user_id     BIGINT,
    p_school_id   BIGINT,
    p_id          INTEGER DEFAULT NULL,
    p_data        JSONB DEFAULT NULL,
    p_limit       INTEGER DEFAULT 100,
    p_offset      INTEGER DEFAULT 0
)
RETURNS TABLE (
    out_id              INTEGER,
    out_class_code      VARCHAR(20),
    out_class_name      VARCHAR(50),
    out_class_number    INTEGER,
    out_academic_level  VARCHAR(100),
    out_status_name     TEXT,
    out_sections        JSONB,
    out_created_dt      TIMESTAMPTZ,
    out_updated_dt      TIMESTAMPTZ,
    out_message         TEXT
)
AS $$
DECLARE
    v_id                INTEGER;
    v_control_id        BIGINT;
    v_role_id           BIGINT;
    v_has_permission    BOOLEAN;
    v_is_admin          BOOLEAN;
    v_form_id           BIGINT;
    v_status            SMALLINT;
    v_draft_status      SMALLINT;
    v_active_status     SMALLINT;
    v_inactive_status   SMALLINT;
    v_section_record    RECORD;
    v_class_data        JSONB;
    v_sections_data     JSONB;
    v_sections_to_delete JSONB;
    v_section_id        INTEGER;
BEGIN

    ----------------------------------------------------------------
    -- 1. NORMALIZE OPERATION
    ----------------------------------------------------------------
    p_operation := LOWER(TRIM(p_operation));

    ----------------------------------------------------------------
    -- 2. GET FORM ID
    ----------------------------------------------------------------
    SELECT id
    INTO v_form_id
    FROM forms
    WHERE LOWER(form_code) = 'class_management_main';

    IF v_form_id IS NULL THEN
        RAISE EXCEPTION 'Form not configured: classes_main';
    END IF;

    ----------------------------------------------------------------
    -- 3. VALIDATE CONTROL
    ----------------------------------------------------------------
    SELECT id
    INTO v_control_id
    FROM controls
    WHERE LOWER(control_code) = p_operation;

    IF v_control_id IS NULL THEN
        RAISE EXCEPTION 'Invalid operation/control: %', p_operation;
    END IF;

    ----------------------------------------------------------------
    -- 4. USER VALIDATION
    ----------------------------------------------------------------
    SELECT is_platform_admin
    INTO v_is_admin
    FROM users
    WHERE id = p_user_id;

    IF v_is_admin IS NULL THEN
        RAISE EXCEPTION 'Invalid user';
    END IF;

    ----------------------------------------------------------------
    -- 5. RBAC CHECK
    ----------------------------------------------------------------
    IF NOT v_is_admin THEN
        SELECT role_id
        INTO v_role_id
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
        )
        INTO v_has_permission;

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
    -- 7. CREATE
    ----------------------------------------------------------------
    IF p_operation = 'create' THEN
        IF p_data IS NULL THEN
            RAISE EXCEPTION 'Missing required data for create';
        END IF;

        -- Extract class data
        v_class_data := p_data - 'sections' - 'sections_to_delete';
        
        IF v_class_data->>'class_code' IS NULL OR 
           v_class_data->>'class_name' IS NULL OR 
           v_class_data->'class_number' IS NULL OR
           v_class_data->'academic_level_id' IS NULL THEN
            RAISE EXCEPTION 'Missing required class fields: class_code, class_name, class_number, academic_level_id';
        END IF;

        -- Check for existing class
        IF EXISTS (
            SELECT 1 FROM classes 
            WHERE school_id = p_school_id 
            AND (class_code = (v_class_data->>'class_code') 
                 OR class_name = (v_class_data->>'class_name')
                 OR class_number = ((v_class_data->>'class_number')::INT))
        ) THEN
            RAISE EXCEPTION 'Class with same code, name or number already exists';
        END IF;

        -- Insert class
        INSERT INTO classes (
            form_id, school_id, class_code, class_name, class_number,
            academic_level_id, class_roman_numeral, display_order,
            min_age_required, max_age_required, description, status,
            created_by, updated_by
        )
        VALUES (
            v_form_id, p_school_id,
            v_class_data->>'class_code',
            v_class_data->>'class_name',
            (v_class_data->>'class_number')::INT,
            (v_class_data->>'academic_level_id')::BIGINT,
            v_class_data->>'class_roman_numeral',
            (v_class_data->>'display_order')::INT,
            (v_class_data->>'min_age_required')::INT,
            (v_class_data->>'max_age_required')::INT,
            v_class_data->>'description',
            v_draft_status,
            p_user_id, p_user_id
        )
        RETURNING id INTO v_id;

        -- Insert sections
        v_sections_data := p_data->'sections';
        IF v_sections_data IS NOT NULL AND jsonb_array_length(v_sections_data) > 0 THEN
            FOR v_section_record IN 
                SELECT * FROM jsonb_array_elements(v_sections_data)
            LOOP
                INSERT INTO sections (
                    class_id, school_id, section_code, section_name,
                    room_id, capacity, start_time, end_time,
                    display_order, description, status, created_by, updated_by
                )
                VALUES (
                    v_id, p_school_id,
                    v_section_record->>'section_code',
                    v_section_record->>'section_name',
                    (v_section_record->>'room_id')::INTEGER,
                    (v_section_record->>'capacity')::INTEGER,
                    (v_section_record->>'start_time')::TIME,
                    (v_section_record->>'end_time')::TIME,
                    (v_section_record->>'display_order')::INTEGER,
                    v_section_record->>'description',
                    1,  -- Active status
                    p_user_id, p_user_id
                );
            END LOOP;
        END IF;

    ----------------------------------------------------------------
    -- 8. UPDATE
    ----------------------------------------------------------------
    ELSIF p_operation = 'update' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for update';
        END IF;

        IF p_data IS NULL THEN
            RAISE EXCEPTION 'Missing required data for update';
        END IF;

        -- Extract class data
        v_class_data := p_data - 'sections' - 'sections_to_delete';
        
        -- Check for existing class conflicts
        IF EXISTS (
            SELECT 1 FROM classes 
            WHERE school_id = p_school_id 
            AND id <> p_id
            AND (class_code = COALESCE(v_class_data->>'class_code', class_code)
                 OR class_name = COALESCE(v_class_data->>'class_name', class_name)
                 OR class_number = COALESCE((v_class_data->>'class_number')::INT, class_number))
        ) THEN
            RAISE EXCEPTION 'Class with same code, name or number already exists';
        END IF;

        -- Update class
        UPDATE classes
        SET 
            class_code = COALESCE(v_class_data->>'class_code', class_code),
            class_name = COALESCE(v_class_data->>'class_name', class_name),
            class_number = COALESCE((v_class_data->>'class_number')::INT, class_number),
            academic_level_id = COALESCE((v_class_data->>'academic_level_id')::BIGINT, academic_level_id),
            class_roman_numeral = COALESCE(v_class_data->>'class_roman_numeral', class_roman_numeral),
            display_order = COALESCE((v_class_data->>'display_order')::INT, display_order),
            min_age_required = COALESCE((v_class_data->>'min_age_required')::INT, min_age_required),
            max_age_required = COALESCE((v_class_data->>'max_age_required')::INT, max_age_required),
            description = COALESCE(v_class_data->>'description', description),
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Class not found';
        END IF;

        -- Update sections
        v_sections_data := p_data->'sections';
        IF v_sections_data IS NOT NULL THEN
            FOR v_section_record IN 
                SELECT * FROM jsonb_array_elements(v_sections_data)
            LOOP
                v_section_id := (v_section_record->>'id')::INTEGER;
                
                IF v_section_id IS NOT NULL THEN
                    -- Update existing section
                    UPDATE sections
                    SET 
                        section_code = COALESCE(v_section_record->>'section_code', section_code),
                        section_name = COALESCE(v_section_record->>'section_name', section_name),
                        room_id = COALESCE((v_section_record->>'room_id')::INTEGER, room_id),
                        capacity = COALESCE((v_section_record->>'capacity')::INTEGER, capacity),
                        start_time = COALESCE((v_section_record->>'start_time')::TIME, start_time),
                        end_time = COALESCE((v_section_record->>'end_time')::TIME, end_time),
                        display_order = COALESCE((v_section_record->>'display_order')::INTEGER, display_order),
                        description = COALESCE(v_section_record->>'description', description),
                        updated_by = p_user_id,
                        updated_dt = NOW()
                    WHERE id = v_section_id AND class_id = v_id;
                ELSE
                    -- Insert new section
                    INSERT INTO sections (
                        class_id, school_id, section_code, section_name,
                        room_id, capacity, start_time, end_time,
                        display_order, description, status, created_by, updated_by
                    )
                    VALUES (
                        v_id, p_school_id,
                        v_section_record->>'section_code',
                        v_section_record->>'section_name',
                        (v_section_record->>'room_id')::INTEGER,
                        (v_section_record->>'capacity')::INTEGER,
                        (v_section_record->>'start_time')::TIME,
                        (v_section_record->>'end_time')::TIME,
                        (v_section_record->>'display_order')::INTEGER,
                        v_section_record->>'description',
                        1, p_user_id, p_user_id
                    );
                END IF;
            END LOOP;
        END IF;

        -- Delete sections
        v_sections_to_delete := p_data->'sections_to_delete';
        IF v_sections_to_delete IS NOT NULL THEN
            FOR v_section_record IN 
                SELECT * FROM jsonb_array_elements(v_sections_to_delete)
            LOOP
                DELETE FROM sections
                WHERE id = (v_section_record->>0)::INTEGER
                AND class_id = v_id;
            END LOOP;
        END IF;

    ----------------------------------------------------------------
    -- 9. DELETE
    ----------------------------------------------------------------
    ELSIF p_operation = 'delete' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for delete';
        END IF;

        -- Check if class can be deleted (not authorised)
        SELECT status INTO v_status
        FROM classes
        WHERE id = p_id AND school_id = p_school_id;

        IF v_status IS NULL THEN
            RAISE EXCEPTION 'Class not found';
        END IF;

        IF v_status = v_active_status OR v_status = v_active_status THEN
            RAISE EXCEPTION 'Cannot delete authorised/active class. Deactivate it first.';
        END IF;

        -- Delete sections first (cascade will handle, but explicit for logging)
        DELETE FROM sections WHERE class_id = p_id;
        
        -- Delete class
        DELETE FROM classes
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Class not found';
        END IF;

        RETURN QUERY
        SELECT
            p_id::INTEGER,
            NULL::VARCHAR(20),
            NULL::VARCHAR(50),
            NULL::INTEGER,
            NULL::VARCHAR(100),
            NULL::TEXT,
            NULL::JSONB,
            NULL::TIMESTAMPTZ,
            NOW()::TIMESTAMPTZ,
            'SUCCESS - Class deleted'::TEXT;
        RETURN;

    ----------------------------------------------------------------
    -- 10. ACTIVATE
    ----------------------------------------------------------------
    ELSIF p_operation = 'activate' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for activate';
        END IF;

        UPDATE classes
        SET status = v_active_status,
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Class not found';
        END IF;

    ----------------------------------------------------------------
    -- 11. DEACTIVATE
    ----------------------------------------------------------------
    ELSIF p_operation = 'deactivate' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for deactivate';
        END IF;

        UPDATE classes
        SET status = v_inactive_status,
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Class not found';
        END IF;

    ----------------------------------------------------------------
    -- 12. AUTHORIZE
    ----------------------------------------------------------------
    ELSIF p_operation = 'authorize' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for authorize';
        END IF;

        UPDATE classes
        SET status = v_active_status,
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Class not found';
        END IF;

    ----------------------------------------------------------------
    -- 13. VIEW
    ----------------------------------------------------------------
    ELSIF p_operation = 'view' THEN
        RETURN QUERY
        SELECT
            c.id::INTEGER,
            c.class_code::VARCHAR(20),
            c.class_name::VARCHAR(50),
            c.class_number::INTEGER,
            cmv.value_name::VARCHAR(100) AS academic_level,
            fsm.status_name::TEXT AS status_name,
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', s.id,
                        'section_code', s.section_code,
                        'section_name', s.section_name,
                        'room_id', s.room_id,
                        'room_number', r.room_number,
                        'capacity', s.capacity,
                        'current_strength', s.current_strength,
                        'start_time', s.start_time,
                        'end_time', s.end_time,
                        'display_order', s.display_order,
                        'status', s.status
                    ) ORDER BY s.display_order
                )
                FROM sections s
                LEFT JOIN rooms r ON r.id = s.room_id
                WHERE s.class_id = c.id AND s.status = 1
            )::JSONB AS sections,
            c.created_dt::TIMESTAMPTZ,
            c.updated_dt::TIMESTAMPTZ,
            'SUCCESS'::TEXT
        FROM classes c
        LEFT JOIN common_master_values cmv ON cmv.id = c.academic_level_id
        LEFT JOIN form_status_master fsm ON fsm.form_id = c.form_id AND fsm.status_id = c.status
        WHERE (p_id IS NULL OR c.id = p_id)
          AND (p_school_id IS NULL OR c.school_id = p_school_id)
          AND (p_data IS NULL OR p_data->>'status' IS NULL OR c.status = (p_data->>'status')::SMALLINT)
        ORDER BY c.class_number, c.display_order
        LIMIT p_limit OFFSET p_offset;

        RETURN;

    ELSE
        RAISE EXCEPTION 'Unsupported operation: %. Supported: create, update, delete, activate, deactivate, authorize, view', p_operation;
    END IF;

    ----------------------------------------------------------------
    -- 14. SINGLE ROW RETURN FOR CREATE / UPDATE / ACTIVATE / DEACTIVATE / AUTHORIZE
    ----------------------------------------------------------------
    RETURN QUERY
    SELECT
        c.id::INTEGER,
        c.class_code::VARCHAR(20),
        c.class_name::VARCHAR(50),
        c.class_number::INTEGER,
        cmv.value_name::VARCHAR(100) AS academic_level,
        fsm.status_name::TEXT AS status_name,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', s.id,
                    'section_code', s.section_code,
                    'section_name', s.section_name,
                    'room_id', s.room_id,
                    'capacity', s.capacity,
                    'current_strength', s.current_strength,
                    'start_time', s.start_time,
                    'end_time', s.end_time,
                    'display_order', s.display_order
                ) ORDER BY s.display_order
            )
            FROM sections s
            WHERE s.class_id = c.id AND s.status = 1
        )::JSONB AS sections,
        c.created_dt::TIMESTAMPTZ,
        c.updated_dt::TIMESTAMPTZ,
        CASE 
            WHEN p_operation = 'create' THEN 'Class created successfully'::TEXT
            WHEN p_operation = 'update' THEN 'Class updated successfully'::TEXT
            WHEN p_operation = 'activate' THEN 'Class activated successfully'::TEXT
            WHEN p_operation = 'deactivate' THEN 'Class deactivated successfully'::TEXT
            WHEN p_operation = 'authorize' THEN 'Class authorized successfully'::TEXT
            ELSE 'SUCCESS'::TEXT
        END AS message
    FROM classes c
    LEFT JOIN common_master_values cmv ON cmv.id = c.academic_level_id
    LEFT JOIN form_status_master fsm ON fsm.form_id = c.form_id AND fsm.status_id = c.status
    WHERE c.id = v_id AND c.school_id = p_school_id;

EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY
        SELECT
            NULL::INTEGER,
            NULL::VARCHAR(20),
            NULL::VARCHAR(50),
            NULL::INTEGER,
            NULL::VARCHAR(100),
            NULL::TEXT,
            NULL::JSONB,
            NULL::TIMESTAMPTZ,
            NULL::TIMESTAMPTZ,
            SQLERRM::TEXT;
END;
$$ LANGUAGE plpgsql;