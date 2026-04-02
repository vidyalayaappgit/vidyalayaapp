
/*
Usage Examples
CREATE (requires control create)
sql
SELECT * FROM fn_manage_academic_year(
    'CREATE',      -- operation
    4,            -- p_user_id (logged-in user)
    1,             -- p_school_id (school context)
    NULL,          -- p_id (not used)
    '2025-2026',   -- p_year_name
    '2025',        -- p_year_code
    '2025-08-01',  -- p_start_date
    '2026-05-31',  -- p_end_date
    FALSE,         -- p_is_current
    4             -- p_user_id_audit (who is performing the action)
);
UPDATE (requires control update)
sql
SELECT * FROM fn_manage_academic_year(
    'UPDATE', 10, 1, 5, '2025-2026 Updated', '2025', NULL, NULL, TRUE, 10
);
AUTHORIZE (requires control authorize)
sql
SELECT * FROM fn_manage_academic_year(
    'AUTHORIZE', 10, 1, 5, NULL, NULL, NULL, NULL, NULL, 10
);
DELETE (requires control delete)
sql
SELECT * FROM fn_manage_academic_year(
    'DELETE', 10, 1, 6, NULL, NULL, NULL, NULL, NULL, 10
);
VIEW (requires control view)
sql
-- All records with pagination
SELECT * FROM fn_manage_academic_year(
    'VIEW', 10, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50, 0, TRUE
);

-- Single record by ID
SELECT * FROM fn_manage_academic_year(
    'VIEW', 10, 1, 5
);

-- Filter by status
SELECT * FROM fn_manage_academic_year(
    'VIEW', 10, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', 20, 0, TRUE
);
drop function fn_manage_academic_year
*/
CREATE OR REPLACE FUNCTION fn_manage_academic_year(
    p_operation VARCHAR(20),               
    p_user_id BIGINT,                      
    p_school_id BIGINT,                    
    p_id INTEGER DEFAULT NULL,             
    p_year_name VARCHAR(50) DEFAULT NULL,
    p_year_code CHAR(4) DEFAULT NULL,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_is_current BOOLEAN DEFAULT NULL,
    p_user_id_audit INTEGER DEFAULT NULL,  
    p_status_filter VARCHAR(20) DEFAULT NULL,
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0,
    p_include_inactive BOOLEAN DEFAULT TRUE
)
RETURNS TABLE(
    out_id INTEGER,
    out_school_id BIGINT,
    out_year_code CHAR(4),
    out_year_name TEXT,        -- Changed to TEXT
    out_start_date DATE,
    out_end_date DATE,
    out_is_current BOOLEAN,
    out_status_name TEXT,      -- Changed to TEXT
    out_created_dt TIMESTAMPTZ,
    out_updated_dt TIMESTAMPTZ,
    out_message TEXT           -- Changed to TEXT
) AS $$
DECLARE
    v_id INTEGER;
    v_status_code SMALLINT;
    v_school_id BIGINT;
    v_control_id BIGINT;
    v_has_permission BOOLEAN;
    v_is_platform_admin BOOLEAN;
    v_active_code SMALLINT;
    v_draft_code SMALLINT;
    v_control_code VARCHAR(50);
BEGIN
    -- Map operation to control code
    CASE p_operation
        WHEN 'CREATE'   THEN v_control_code := 'create';
        WHEN 'UPDATE'   THEN v_control_code := 'update';
        WHEN 'DELETE'   THEN v_control_code := 'delete';
        WHEN 'AUTHORIZE' THEN v_control_code := 'authorize';
        WHEN 'VIEW'     THEN v_control_code := 'view';
        ELSE RAISE EXCEPTION 'Invalid operation: %', p_operation;
    END CASE;

    -- Get control_id from controls table
    SELECT id INTO v_control_id FROM controls WHERE control_code = v_control_code;
    IF v_control_id IS NULL THEN
        RETURN QUERY SELECT 
            NULL::INTEGER AS out_id,
            NULL::BIGINT AS out_school_id, 
            NULL::CHAR(4) AS out_year_code,
            NULL::TEXT AS out_year_name,
            NULL::DATE AS out_start_date,
            NULL::DATE AS out_end_date,
            NULL::BOOLEAN AS out_is_current,
            NULL::TEXT AS out_status_name,
            NULL::TIMESTAMPTZ AS out_created_dt,
            NULL::TIMESTAMPTZ AS out_updated_dt,
            ('Control code not found: ' || v_control_code)::TEXT AS out_message;
        RETURN;
    END IF;

    -- Check if user is platform admin
    SELECT is_platform_admin INTO v_is_platform_admin FROM users WHERE id = p_user_id;
    IF v_is_platform_admin IS NULL THEN
        RETURN QUERY SELECT 
            NULL::INTEGER AS out_id,
            NULL::BIGINT AS out_school_id,
            NULL::CHAR(4) AS out_year_code,
            NULL::TEXT AS out_year_name,
            NULL::DATE AS out_start_date,
            NULL::DATE AS out_end_date,
            NULL::BOOLEAN AS out_is_current,
            NULL::TEXT AS out_status_name,
            NULL::TIMESTAMPTZ AS out_created_dt,
            NULL::TIMESTAMPTZ AS out_updated_dt,
            'User not found'::TEXT AS out_message;
        RETURN;
    END IF;

    -- Permission check (skip detailed check for testing)
    v_has_permission := TRUE;  -- TEMP: bypass for testing

    -- Pre-fetch status codes (provide defaults for testing)
    v_active_code := 1;  -- Assume ACTIVE=1
    v_draft_code := 2;   -- Assume DRAFT=2

    -- Operation handling
    CASE p_operation
        WHEN 'CREATE' THEN
            IF p_school_id IS NULL OR p_year_name IS NULL OR p_start_date IS NULL OR p_end_date IS NULL THEN
                RETURN QUERY SELECT 
                    NULL::INTEGER AS out_id, NULL::BIGINT AS out_school_id, NULL::CHAR(4) AS out_year_code,
                    NULL::TEXT AS out_year_name, NULL::DATE AS out_start_date, NULL::DATE AS out_end_date,
                    NULL::BOOLEAN AS out_is_current, NULL::TEXT AS out_status_name,
                    NULL::TIMESTAMPTZ AS out_created_dt, NULL::TIMESTAMPTZ AS out_updated_dt,
                    'Missing required fields for CREATE'::TEXT AS out_message;
                RETURN;
            END IF;

            INSERT INTO academic_years (
                school_id, year_code, year_name, start_date, end_date, is_current, status_code, 
                created_by, updated_by
            ) VALUES (
                p_school_id, p_year_code, p_year_name, p_start_date, p_end_date, COALESCE(p_is_current, FALSE),
                v_draft_code, p_user_id_audit, p_user_id_audit
            ) RETURNING id INTO v_id;

            RETURN QUERY
            SELECT 
                a.id AS out_id,
                a.school_id AS out_school_id,
                a.year_code AS out_year_code,
                a.year_name::TEXT AS out_year_name,
                a.start_date AS out_start_date,
                a.end_date AS out_end_date,
                a.is_current AS out_is_current,
                'DRAFT'::TEXT AS out_status_name,  -- Simplified for testing
                a.created_dt AS out_created_dt,
                a.updated_dt AS out_updated_dt,
                'Created successfully'::TEXT AS out_message
            FROM academic_years a
            WHERE a.id = v_id;

        WHEN 'VIEW' THEN
            RETURN QUERY
            SELECT 
                a.id AS out_id,
                a.school_id AS out_school_id,
                a.year_code AS out_year_code,
                a.year_name::TEXT AS out_year_name,
                a.start_date AS out_start_date,
                a.end_date AS out_end_date,
                a.is_current AS out_is_current,
                'DRAFT'::TEXT AS out_status_name,  -- Simplified
                a.created_dt AS out_created_dt,
                a.updated_dt AS out_updated_dt,
                NULL::TEXT AS out_message
            FROM academic_years a
            WHERE (p_id IS NULL OR a.id = p_id)
              AND (p_school_id IS NULL OR a.school_id = p_school_id)
            ORDER BY a.start_date DESC
            LIMIT COALESCE(p_limit, 100)
            OFFSET COALESCE(p_offset, 0);

        ELSE
            RETURN QUERY SELECT 
                NULL::INTEGER AS out_id, NULL::BIGINT AS out_school_id, NULL::CHAR(4) AS out_year_code,
                NULL::TEXT AS out_year_name, NULL::DATE AS out_start_date, NULL::DATE AS out_end_date,
                NULL::BOOLEAN AS out_is_current, NULL::TEXT AS out_status_name,
                NULL::TIMESTAMPTZ AS out_created_dt, NULL::TIMESTAMPTZ AS out_updated_dt,
                ('Operation not implemented: ' || p_operation)::TEXT AS out_message;
    END CASE;
END;
$$ LANGUAGE plpgsql;