/*
=============================================================================
FN_MANAGE_ACADEMIC_YEAR - Complete Academic Year Management with Terms
=============================================================================
Status Workflow:
- DRAFT:     Newly created, can be edited & permanently deleted
- ACTIVE:    Current academic year (only one ACTIVE per school)
- COMPLETED: All transactions done, cannot be modified
- CANCELLED: Cancelled (if no references exist)

Operations:
- create:    Create new academic year (DRAFT status) with optional terms JSON
- edit:      Edit DRAFT or CANCELLED years with optional terms JSON
- delete:    Permanently delete DRAFT years
- activate:  Change status from DRAFT to ACTIVE
- complete:  Change status from ACTIVE to COMPLETED
- cancel:    Change status from DRAFT or ACTIVE to CANCELLED
- view:      List/Fetch academic years with terms as JSON

Parameters:
- p_terms_json: JSON array of terms for the academic year
  Format: [{"term_name":"Mid Term","term_code":"TERM1","term_order":1,"start_date":"2024-04-01","end_date":"2024-07-31"}, ...]
=============================================================================
*/
CREATE OR REPLACE FUNCTION fn_manage_academic_year (
    p_operation   VARCHAR(50),
    p_user_id     BIGINT,
    p_school_id   BIGINT,
    p_id          INTEGER DEFAULT NULL,
    p_year_name   VARCHAR(50) DEFAULT NULL,
    p_year_code   VARCHAR(4) DEFAULT NULL,
    p_start_date  DATE DEFAULT NULL,
    p_end_date    DATE DEFAULT NULL,
    p_is_current  BOOLEAN DEFAULT NULL,
    p_limit       INTEGER DEFAULT 100,
    p_offset      INTEGER DEFAULT 0,
    p_terms_json  JSONB DEFAULT NULL  -- New parameter for terms
)
RETURNS TABLE (
    out_id          INTEGER,
    out_school_id   BIGINT,
    out_year_code   VARCHAR(4),
    out_year_name   TEXT,
    out_start_date  DATE,
    out_end_date    DATE,
    out_is_current  BOOLEAN,
    out_status_name TEXT,
    out_terms       JSONB,  -- Returns terms as JSON array
    out_created_dt  TIMESTAMPTZ,
    out_updated_dt  TIMESTAMPTZ,
    out_message     TEXT
)
AS $$
DECLARE
    v_id                INTEGER;
    v_control_id        BIGINT;
    v_role_id           BIGINT;
    v_has_permission    BOOLEAN;
    v_is_admin          BOOLEAN;
    v_form_id           BIGINT;
    v_current_status    SMALLINT;
    v_draft_status      SMALLINT;
    v_active_status     SMALLINT;
    v_completed_status  SMALLINT;
    v_cancelled_status  SMALLINT;
    v_has_references    BOOLEAN;
    v_existing_active_id INTEGER;
    v_term_record       RECORD;
    v_term_start_date   DATE;
    v_term_end_date     DATE;
    v_term_name         VARCHAR(100);
    v_term_code         VARCHAR(20);
    v_term_order        INTEGER;
BEGIN

    ----------------------------------------------------------------
    -- 1. NORMALIZE OPERATION
    ----------------------------------------------------------------
    p_operation := LOWER(TRIM(p_operation));

    ----------------------------------------------------------------
    -- 2. GET FORM ID
    ----------------------------------------------------------------
    SELECT id INTO v_form_id FROM forms WHERE LOWER(form_code) = 'academic_years_main';
    
    IF v_form_id IS NULL THEN
        RAISE EXCEPTION 'Form not configured: academic_years_main';
    END IF;

    ----------------------------------------------------------------
    -- 3. GET STATUS IDs
    ----------------------------------------------------------------
    SELECT status_id INTO v_draft_status 
    FROM form_status_master 
    WHERE form_id = v_form_id AND LOWER(status_name) = 'draft';
    
    SELECT status_id INTO v_active_status 
    FROM form_status_master 
    WHERE form_id = v_form_id AND LOWER(status_name) = 'active';
    
    SELECT status_id INTO v_completed_status 
    FROM form_status_master 
    WHERE form_id = v_form_id AND LOWER(status_name) = 'completed';
    
    SELECT status_id INTO v_cancelled_status 
    FROM form_status_master 
    WHERE form_id = v_form_id AND LOWER(status_name) = 'cancelled';

    ----------------------------------------------------------------
    -- 4. VALIDATE CONTROL
    ----------------------------------------------------------------
    SELECT id INTO v_control_id FROM controls WHERE LOWER(control_code) = p_operation;
    
    IF v_control_id IS NULL THEN
        RAISE EXCEPTION 'Invalid operation/control: %', p_operation;
    END IF;

    ----------------------------------------------------------------
    -- 5. USER VALIDATION
    ----------------------------------------------------------------
    SELECT is_platform_admin INTO v_is_admin FROM users WHERE id = p_user_id;
    
    IF v_is_admin IS NULL THEN
        RAISE EXCEPTION 'Invalid user';
    END IF;

    ----------------------------------------------------------------
    -- 6. RBAC CHECK
    ----------------------------------------------------------------
    IF NOT v_is_admin THEN
        SELECT role_id INTO v_role_id
        FROM user_school_roles
        WHERE user_id = p_user_id AND school_id = p_school_id AND status = 1
        LIMIT 1;

        IF v_role_id IS NULL THEN
            RAISE EXCEPTION 'No role assigned for this school';
        END IF;

        SELECT EXISTS (
            SELECT 1 FROM role_form_control_access rfca
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
    -- 7. VALIDATE TERMS JSON (if provided)
    ----------------------------------------------------------------
    IF p_terms_json IS NOT NULL THEN
        -- Check if terms is a valid JSON array
        IF jsonb_typeof(p_terms_json) <> 'array' THEN
            RAISE EXCEPTION 'terms_json must be a JSON array';
        END IF;
        
        -- Validate each term
        FOR v_term_record IN SELECT * FROM jsonb_to_recordset(p_terms_json) AS x(
            term_name VARCHAR(100),
            term_code VARCHAR(20),
            term_order INTEGER,
            start_date DATE,
            end_date DATE
        )
        LOOP
            -- Check required fields
            IF v_term_record.term_name IS NULL OR 
               v_term_record.term_code IS NULL OR 
               v_term_record.start_date IS NULL OR 
               v_term_record.end_date IS NULL THEN
                RAISE EXCEPTION 'Each term must have term_name, term_code, start_date, end_date';
            END IF;
            
            -- Check term dates are within academic year
            IF v_term_record.start_date < COALESCE(p_start_date, (SELECT start_date FROM academic_years WHERE id = p_id)) OR
               v_term_record.end_date > COALESCE(p_end_date, (SELECT end_date FROM academic_years WHERE id = p_id)) THEN
                RAISE EXCEPTION 'Term % dates must be within academic year range', v_term_record.term_name;
            END IF;
            
            -- Check term date validity
            IF v_term_record.start_date >= v_term_record.end_date THEN
                RAISE EXCEPTION 'Invalid date range for term: %', v_term_record.term_name;
            END IF;
        END LOOP;
    END IF;

    ----------------------------------------------------------------
    -- 8. CREATE (Always DRAFT status)
    ----------------------------------------------------------------
    IF p_operation = 'create' THEN
        IF p_year_name IS NULL OR p_start_date IS NULL OR p_end_date IS NULL OR p_year_code IS NULL THEN
            RAISE EXCEPTION 'Missing required fields: year_name, year_code, start_date, end_date';
        END IF;

        IF p_start_date >= p_end_date THEN
            RAISE EXCEPTION 'Start date must be before end date';
        END IF;

        -- Check overlapping with DRAFT and ACTIVE years only
        IF EXISTS (
            SELECT 1 FROM academic_years a
            JOIN form_status_master fsm ON fsm.status_id = a.status
            WHERE a.school_id = p_school_id
              AND fsm.status_name IN ('DRAFT', 'ACTIVE')
              AND daterange(a.start_date, a.end_date, '[]') && daterange(p_start_date, p_end_date, '[]')
        ) THEN
            RAISE EXCEPTION 'Academic year overlaps with existing DRAFT or ACTIVE year';
        END IF;

        -- Insert academic year
        INSERT INTO academic_years (
            form_id, school_id, year_code, year_name, start_date, end_date,
            is_current, status, created_by, updated_by
        ) VALUES (
            v_form_id, p_school_id, p_year_code, p_year_name, p_start_date, p_end_date,
            FALSE, v_draft_status, p_user_id, p_user_id
        ) RETURNING id INTO v_id;

        -- Insert terms if provided
        IF p_terms_json IS NOT NULL THEN
            FOR v_term_record IN SELECT * FROM jsonb_to_recordset(p_terms_json) AS x(
                term_name VARCHAR(100),
                term_code VARCHAR(20),
                term_order INTEGER,
                start_date DATE,
                end_date DATE
            )
            LOOP
                INSERT INTO academic_terms (
                    academic_year_id, term_name, term_code, term_order,
                    start_date, end_date, created_by, updated_by
                ) VALUES (
                    v_id, v_term_record.term_name, v_term_record.term_code,
                    COALESCE(v_term_record.term_order, v_term_record.term_order),
                    v_term_record.start_date, v_term_record.end_date,
                    p_user_id, p_user_id
                );
            END LOOP;
        END IF;

    ----------------------------------------------------------------
    -- 9. EDIT (Only DRAFT and CANCELLED status)
    ----------------------------------------------------------------
    ELSIF p_operation = 'edit' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for update';
        END IF;

        -- Get current status
        SELECT status INTO v_current_status FROM academic_years 
        WHERE id = p_id AND school_id = p_school_id;
        
        IF v_current_status IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

        -- Only DRAFT or CANCELLED can be edited
        IF v_current_status NOT IN (v_draft_status, v_cancelled_status) THEN
            RAISE EXCEPTION 'Cannot edit academic year with status other than DRAFT or CANCELLED. Current status: %', 
                (SELECT status_name FROM form_status_master WHERE status_id = v_current_status);
        END IF;

        -- Validate dates
        IF COALESCE(p_start_date, (SELECT start_date FROM academic_years WHERE id = p_id)) >=
           COALESCE(p_end_date, (SELECT end_date FROM academic_years WHERE id = p_id)) THEN
            RAISE EXCEPTION 'Start date must be before end date';
        END IF;

        -- Check overlapping (excluding self)
        IF EXISTS (
            SELECT 1 FROM academic_years a
            JOIN form_status_master fsm ON fsm.status_id = a.status
            WHERE a.school_id = p_school_id
              AND a.id <> p_id
              AND fsm.status_name IN ('DRAFT', 'ACTIVE')
              AND daterange(a.start_date, a.end_date, '[]') &&
                  daterange(
                      COALESCE(p_start_date, a.start_date),
                      COALESCE(p_end_date, a.end_date),
                      '[]'
                  )
        ) THEN
            RAISE EXCEPTION 'Academic year overlaps with existing DRAFT or ACTIVE year';
        END IF;

        -- Update academic year
        UPDATE academic_years
        SET year_name  = COALESCE(p_year_name, year_name),
            year_code  = COALESCE(p_year_code, year_code),
            start_date = COALESCE(p_start_date, start_date),
            end_date   = COALESCE(p_end_date, end_date),
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

        -- Update terms if provided (delete existing and insert new)
        IF p_terms_json IS NOT NULL THEN
            -- Delete existing terms
            DELETE FROM academic_terms WHERE academic_year_id = v_id;
            
            -- Insert updated terms
            FOR v_term_record IN SELECT * FROM jsonb_to_recordset(p_terms_json) AS x(
                term_name VARCHAR(100),
                term_code VARCHAR(20),
                term_order INTEGER,
                start_date DATE,
                end_date DATE
            )
            LOOP
                INSERT INTO academic_terms (
                    academic_year_id, term_name, term_code, term_order,
                    start_date, end_date, created_by, updated_by
                ) VALUES (
                    v_id, v_term_record.term_name, v_term_record.term_code,
                    v_term_record.term_order, v_term_record.start_date, 
                    v_term_record.end_date, p_user_id, p_user_id
                );
            END LOOP;
        END IF;

    ----------------------------------------------------------------
    -- 10. DELETE (Permanent, only DRAFT status)
    ----------------------------------------------------------------
    ELSIF p_operation = 'delete' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for delete';
        END IF;

        SELECT status INTO v_current_status
        FROM academic_years
        WHERE id = p_id AND school_id = p_school_id;

        IF v_current_status IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

        -- Only DRAFT can be permanently deleted
        IF v_current_status <> v_draft_status THEN
            RAISE EXCEPTION 'Can only delete academic years with DRAFT status. Current status: %', 
                (SELECT status_name FROM form_status_master WHERE status_id = v_current_status);
        END IF;

        -- Terms will be deleted automatically due to CASCADE
        DELETE FROM academic_years
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

        RETURN QUERY
        SELECT
            p_id::INTEGER,
            p_school_id::BIGINT,
            NULL::VARCHAR(4),
            NULL::TEXT,
            NULL::DATE,
            NULL::DATE,
            NULL::BOOLEAN,
            'DELETED'::TEXT,
            NULL::JSONB,
            NULL::TIMESTAMPTZ,
            NOW()::TIMESTAMPTZ,
            'SUCCESS - Record permanently deleted'::TEXT;
        RETURN;

    ----------------------------------------------------------------
    -- 11. ACTIVATE (DRAFT -> ACTIVE)
    ----------------------------------------------------------------
    ELSIF p_operation = 'activate' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for activation';
        END IF;

        -- Get current status
        SELECT status INTO v_current_status
        FROM academic_years
        WHERE id = p_id AND school_id = p_school_id;

        IF v_current_status IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

        -- Only DRAFT can be activated
        IF v_current_status <> v_draft_status THEN
            RAISE EXCEPTION 'Can only activate DRAFT status. Current status: %', 
                (SELECT status_name FROM form_status_master WHERE status_id = v_current_status);
        END IF;

        -- Check if there's already an ACTIVE year for this school
        SELECT id INTO v_existing_active_id
        FROM academic_years
        WHERE school_id = p_school_id AND status = v_active_status
        LIMIT 1;

        IF v_existing_active_id IS NOT NULL THEN
            RAISE EXCEPTION 'Cannot activate: School already has an ACTIVE academic year (ID: %)', v_existing_active_id;
        END IF;

        -- Check overlapping with other ACTIVE/DRAFT years
        IF EXISTS (
            SELECT 1 FROM academic_years a
            JOIN form_status_master fsm ON fsm.status_id = a.status
            WHERE a.school_id = p_school_id
              AND a.id <> p_id
              AND fsm.status_name IN ('ACTIVE', 'DRAFT')
              AND daterange(a.start_date, a.end_date, '[]') &&
                  daterange(
                      (SELECT start_date FROM academic_years WHERE id = p_id),
                      (SELECT end_date FROM academic_years WHERE id = p_id),
                      '[]'
                  )
        ) THEN
            RAISE EXCEPTION 'Cannot activate: Date range overlaps with existing DRAFT or ACTIVE year';
        END IF;

        -- Update to ACTIVE and set as current
        UPDATE academic_years
        SET status = v_active_status,
            is_current = TRUE,
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Failed to activate academic year';
        END IF;

    ----------------------------------------------------------------
    -- 12. COMPLETE (ACTIVE -> COMPLETED)
    ----------------------------------------------------------------
    ELSIF p_operation = 'complete' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for completion';
        END IF;

        SELECT status INTO v_current_status
        FROM academic_years
        WHERE id = p_id AND school_id = p_school_id;

        IF v_current_status IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

        -- Only ACTIVE can be completed
        IF v_current_status <> v_active_status THEN
            RAISE EXCEPTION 'Can only complete ACTIVE status. Current status: %', 
                (SELECT status_name FROM form_status_master WHERE status_id = v_current_status);
        END IF;

        UPDATE academic_years
        SET status = v_completed_status,
            is_current = FALSE,
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Failed to complete academic year';
        END IF;

    ----------------------------------------------------------------
    -- 13. CANCEL (DRAFT or ACTIVE -> CANCELLED)
    ----------------------------------------------------------------
    ELSIF p_operation = 'cancel' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for cancellation';
        END IF;

        SELECT status INTO v_current_status
        FROM academic_years
        WHERE id = p_id AND school_id = p_school_id;

        IF v_current_status IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

        -- Can cancel DRAFT or ACTIVE
        IF v_current_status NOT IN (v_draft_status, v_active_status) THEN
            RAISE EXCEPTION 'Can only cancel DRAFT or ACTIVE status. Current status: %', 
                (SELECT status_name FROM form_status_master WHERE status_id = v_current_status);
        END IF;

        UPDATE academic_years
        SET status = v_cancelled_status,
            is_current = CASE WHEN v_current_status = v_active_status THEN FALSE ELSE is_current END,
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Failed to cancel academic year';
        END IF;

    ----------------------------------------------------------------
    -- 14. VIEW
    ----------------------------------------------------------------
    ELSIF p_operation = 'view' THEN
        RETURN QUERY
        SELECT
            a.id::INTEGER,
            a.school_id::BIGINT,
            a.year_code::VARCHAR(4),
            a.year_name::TEXT,
            a.start_date::DATE,
            a.end_date::DATE,
            a.is_current::BOOLEAN,
            COALESCE(fsm.status_name, 'UNKNOWN')::TEXT,
            COALESCE(
                (SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', t.id,
                        'term_name', t.term_name,
                        'term_code', t.term_code,
                        'term_order', t.term_order,
                        'start_date', t.start_date,
                        'end_date', t.end_date
                    ) ORDER BY t.term_order
                ) FROM academic_terms t WHERE t.academic_year_id = a.id),
                '[]'::jsonb
            ) AS out_terms,
            a.created_dt::TIMESTAMPTZ,
            a.updated_dt::TIMESTAMPTZ,
            'SUCCESS'::TEXT
        FROM academic_years a
        LEFT JOIN form_status_master fsm ON fsm.form_id = a.form_id AND fsm.status_id = a.status
        WHERE (p_id IS NULL OR a.id = p_id)
          AND (p_school_id IS NULL OR a.school_id = p_school_id)
        ORDER BY 
            CASE WHEN fsm.status_name = 'ACTIVE' THEN 0 ELSE 1 END,
            a.start_date DESC
        LIMIT p_limit OFFSET p_offset;
        RETURN;

    ELSE
        RAISE EXCEPTION 'Unsupported operation: %. Supported operations: create, edit, delete, activate, complete, cancel, view', p_operation;
    END IF;

    ----------------------------------------------------------------
    -- 15. SINGLE ROW RETURN FOR CREATE/UPDATE/STATUS UPDATE
    ----------------------------------------------------------------
    RETURN QUERY
    SELECT
        a.id::INTEGER,
        a.school_id::BIGINT,
        a.year_code::VARCHAR(4),
        a.year_name::TEXT,
        a.start_date::DATE,
        a.end_date::DATE,
        a.is_current::BOOLEAN,
        COALESCE(fsm.status_name, 'UNKNOWN')::TEXT,
        COALESCE(
            (SELECT jsonb_agg(
                jsonb_build_object(
                    'id', t.id,
                    'term_name', t.term_name,
                    'term_code', t.term_code,
                    'term_order', t.term_order,
                    'start_date', t.start_date,
                    'end_date', t.end_date
                ) ORDER BY t.term_order
            ) FROM academic_terms t WHERE t.academic_year_id = a.id),
            '[]'::jsonb
        ) AS out_terms,
        a.created_dt::TIMESTAMPTZ,
        a.updated_dt::TIMESTAMPTZ,
        'SUCCESS'::TEXT
    FROM academic_years a
    LEFT JOIN form_status_master fsm ON fsm.form_id = a.form_id AND fsm.status_id = a.status
    WHERE a.id = v_id AND a.school_id = p_school_id;

EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY
        SELECT
            NULL::INTEGER,
            NULL::BIGINT,
            NULL::VARCHAR(4),
            NULL::TEXT,
            NULL::DATE,
            NULL::DATE,
            NULL::BOOLEAN,
            NULL::TEXT,
            NULL::JSONB,
            NULL::TIMESTAMPTZ,
            NULL::TIMESTAMPTZ,
            SQLERRM::TEXT;
END;
$$ LANGUAGE plpgsql;

/*
=============================================================================
USAGE EXAMPLES
=============================================================================

-- 1. CREATE (Always DRAFT)
-- 1. CREATE academic year with terms
SELECT * FROM fn_manage_academic_year(
    'create', 4, 1, NULL, 
    'Academic Year 2025-26', '2025', 
    '2025-04-01', '2026-03-31', 
    NULL, 100, 0,
    '[
        {"term_name":"Mid Term","term_code":"TERM1","term_order":1,"start_date":"2025-04-01","end_date":"2025-07-31"},
        {"term_name":"Final Term","term_code":"TERM2","term_order":2,"start_date":"2025-08-01","end_date":"2025-11-30"},
        {"term_name":"Summer Term","term_code":"TERM3","term_order":3,"start_date":"2025-12-01","end_date":"2026-03-31"}
    ]'::jsonb
);

-- 2. EDIT academic year and update terms
SELECT * FROM fn_manage_academic_year(
    'edit', 4, 1, 13,
    'Updated Year Name', NULL, 
    '2025-04-15', '2026-04-14', 
    NULL, 100, 0,
    '[
        {"term_name":"Term 1","term_code":"T1","term_order":1,"start_date":"2025-04-15","end_date":"2025-08-14"},
        {"term_name":"Term 2","term_code":"T2","term_order":2,"start_date":"2025-08-15","end_date":"2025-12-14"},
        {"term_name":"Term 3","term_code":"T3","term_order":3,"start_date":"2025-12-15","end_date":"2026-04-14"}
    ]'::jsonb
);

-- 3. VIEW academic years (returns terms as JSON)
SELECT * FROM fn_manage_academic_year('view', 4, 1, NULL, NULL, NULL, NULL, NULL, NULL, 20, 0, NULL);


-- 4. COMPLETE (ACTIVE -> COMPLETED)
SELECT * FROM fn_manage_academic_year('complete', 4, 1, 10, NULL, NULL, NULL, NULL, NULL, 100, 0);

-- 5. CANCEL (DRAFT or ACTIVE -> CANCELLED)
SELECT * FROM fn_manage_academic_year('cancel', 4, 1, 10, NULL, NULL, NULL, NULL, NULL, 100, 0);

-- 6. DELETE (Permanent, only DRAFT)
SELECT * FROM fn_manage_academic_year('delete', 4, 1, 11, NULL, NULL, NULL, NULL, NULL, 100, 0);

-- 7. VIEW
SELECT * FROM fn_manage_academic_year('view', 4, 1, NULL, NULL, NULL, NULL, NULL, NULL, 20, 0);
*/

/*
=============================================================================
CONTROLS TO ADD IN CONTROLS TABLE
=============================================================================
For RBAC to work properly, add these controls to your controls table:

INSERT INTO controls (control_code, control_name) VALUES
('create', 'Create Academic Year'),
('edit', 'Edit Academic Year'),
('delete', 'Delete Academic Year'),
('activate', 'Activate Academic Year'),
('complete', 'Complete Academic Year'),
('cancel', 'Cancel Academic Year'),
('view', 'View Academic Years');

Then assign these controls to roles via role_form_control_access table.
*/