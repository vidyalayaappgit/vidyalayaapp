/*
select *from academic_years
select p.id,p.page_code,page_name,f.id,f.form_code,f.form_name,c.id,c.control_code,c.control_name
from pages p,forms f,form_controls fc,controls c
where p.id=page_id 
and f.id=fc.form_id
and fc.control_id=c.id
and p.id=5


Usage Examples
CREATE (requires control create)

SELECT * FROM fn_manage_academic_year('create', 4, 1, NULL, 'AY 2025', '2025', '2025-04-01', '2026-03-31', TRUE);

UPDATE (requires control update)
SELECT * FROM fn_manage_academic_year(
'edit',4,1,4,          -- id
'2028-2029 Updated',NULL,'2028-04-01', '2029-03-31',NULL,NULL,NULL);

AUTHORIZE (requires control authorize)
SELECT * FROM fn_manage_academic_year(
'authorize',4,1,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL
);
DELETE (requires control delete)
SELECT * FROM fn_manage_academic_year(
'delete',4,1,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL
);
VIEW (requires control view)

-- All records with pagination
SELECT * FROM fn_manage_academic_year(
'view',4,1,NULL,NULL,NULL,NULL,NULL,NULL,
10,   -- limit
0     -- offset
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
    p_offset      INTEGER DEFAULT 0
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
    v_status            SMALLINT;
    v_fresh_status      SMALLINT;
    v_authorised_status SMALLINT;
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
    WHERE LOWER(form_code) = 'academic_years_main';

    IF v_form_id IS NULL THEN
        RAISE EXCEPTION 'Form not configured: academic_years_main';
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
    SELECT status_id
    INTO v_fresh_status
    FROM form_status_master
    WHERE form_id = v_form_id
      AND LOWER(status_name) = 'fresh';

    SELECT status_id
    INTO v_authorised_status
    FROM form_status_master
    WHERE form_id = v_form_id
      AND LOWER(status_name) = 'authorised';

    ----------------------------------------------------------------
    -- 7. CREATE
    ----------------------------------------------------------------
    IF p_operation = 'create' THEN
        IF p_year_name IS NULL OR p_start_date IS NULL OR p_end_date IS NULL THEN
            RAISE EXCEPTION 'Missing required fields';
        END IF;

        IF p_start_date >= p_end_date THEN
            RAISE EXCEPTION 'Invalid date range';
        END IF;

        IF EXISTS (
            SELECT 1
            FROM academic_years
            WHERE school_id = p_school_id
              AND daterange(start_date, end_date, '[]')
                  && daterange(p_start_date, p_end_date, '[]')
        ) THEN
            RAISE EXCEPTION 'Academic year overlaps with existing';
        END IF;

        IF p_is_current = TRUE THEN
            UPDATE academic_years
            SET is_current = FALSE,
                updated_by = p_user_id,
                updated_dt = NOW()
            WHERE school_id = p_school_id;
        END IF;

        INSERT INTO academic_years (
            form_id,
            school_id,
            year_code,
            year_name,
            start_date,
            end_date,
            is_current,
            status,
            created_by,
            updated_by
        )
        VALUES (
            v_form_id,
            p_school_id,
            p_year_code,
            p_year_name,
            p_start_date,
            p_end_date,
            COALESCE(p_is_current, FALSE),
            v_fresh_status,
            p_user_id,
            p_user_id
        )
        RETURNING id INTO v_id;

    ----------------------------------------------------------------
    -- 8. UPDATE
    ----------------------------------------------------------------
    ELSIF p_operation = 'edit' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for update';
        END IF;

        IF COALESCE(p_start_date, (SELECT start_date FROM academic_years WHERE id = p_id)) >=
           COALESCE(p_end_date,   (SELECT end_date   FROM academic_years WHERE id = p_id)) THEN
            RAISE EXCEPTION 'Invalid date range';
        END IF;

        IF EXISTS (
            SELECT 1
            FROM academic_years
            WHERE school_id = p_school_id
              AND id <> p_id
              AND daterange(start_date, end_date, '[]') &&
                  daterange(
                      COALESCE(p_start_date, start_date),
                      COALESCE(p_end_date, end_date),
                      '[]'
                  )
        ) THEN
            RAISE EXCEPTION 'Academic year overlaps with existing';
        END IF;

        IF p_is_current = TRUE THEN
            UPDATE academic_years
            SET is_current = FALSE,
                updated_by = p_user_id,
                updated_dt = NOW()
            WHERE school_id = p_school_id
              AND id <> p_id;
        END IF;

        UPDATE academic_years
        SET year_name  = COALESCE(p_year_name, year_name),
            year_code  = COALESCE(p_year_code, year_code),
            start_date = COALESCE(p_start_date, start_date),
            end_date   = COALESCE(p_end_date, end_date),
            is_current = COALESCE(p_is_current, is_current),
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id
          AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

    ----------------------------------------------------------------
    -- 9. DELETE
    ----------------------------------------------------------------
    ELSIF p_operation = 'delete' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for delete';
        END IF;

        SELECT status
        INTO v_status
        FROM academic_years
        WHERE id = p_id
          AND school_id = p_school_id;

        IF v_status IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

        IF v_status = v_authorised_status THEN
            RAISE EXCEPTION 'Can''t delete: Year already authorised';
        END IF;

        DELETE FROM academic_years
        WHERE id = p_id
          AND school_id = p_school_id
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
            NULL::TEXT,
            NULL::TIMESTAMPTZ,
            NOW()::TIMESTAMPTZ,
            'SUCCESS'::TEXT;
        RETURN;

    ----------------------------------------------------------------
    -- 10. AUTHORIZE
    ----------------------------------------------------------------
    ELSIF p_operation = 'authorize' THEN
        IF p_id IS NULL THEN
            RAISE EXCEPTION 'ID required for authorize';
        END IF;

        UPDATE academic_years
        SET status = v_authorised_status,
            updated_by = p_user_id,
            updated_dt = NOW()
        WHERE id = p_id
          AND school_id = p_school_id
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
            RAISE EXCEPTION 'Record not found';
        END IF;

    ----------------------------------------------------------------
    -- 11. VIEW
    ----------------------------------------------------------------
    ELSIF p_operation = 'view' THEN
        RETURN QUERY
        SELECT
            a.id::INTEGER,
            a.school_id::BIGINT,
			a.year_code::VARCHAR(4) AS "yearCode",
			a.year_name::TEXT AS "yearName",
			a.start_date::DATE AS "startDate",
			a.end_date::DATE AS "endDate",
			a.is_current::BOOLEAN AS "isCurrent",
			fsm.status_name::TEXT AS "status",
            a.created_dt::TIMESTAMPTZ,
            a.updated_dt::TIMESTAMPTZ,
            'SUCCESS'::TEXT
        FROM academic_years a
        LEFT JOIN form_status_master fsm
               ON fsm.form_id = a.form_id
              AND fsm.status_id = a.status
        WHERE (p_id IS NULL OR a.id = p_id)
          AND (p_school_id IS NULL OR a.school_id = p_school_id)
        ORDER BY a.start_date DESC
        LIMIT p_limit OFFSET p_offset;

        RETURN;

    ELSE
        RAISE EXCEPTION 'Unsupported operation: %', p_operation;
    END IF;

    ----------------------------------------------------------------
    -- 12. SINGLE ROW RETURN FOR CREATE / UPDATE / AUTHORIZE
    ----------------------------------------------------------------
    RETURN QUERY
    SELECT
        a.id::INTEGER,
        a.school_id::BIGINT,
		a.year_code::VARCHAR(4) AS "yearCode",
		a.year_name::TEXT AS "yearName",
		a.start_date::DATE AS "startDate",
		a.end_date::DATE AS "endDate",
		a.is_current::BOOLEAN AS "isCurrent",
		fsm.status_name::TEXT AS "status",
        a.created_dt::TIMESTAMPTZ,
        a.updated_dt::TIMESTAMPTZ,
        'SUCCESS'::TEXT
    FROM academic_years a
    LEFT JOIN form_status_master fsm
           ON fsm.form_id = a.form_id
          AND fsm.status_id = a.status
    WHERE a.id = v_id
      AND a.school_id = p_school_id;

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
            NULL::TIMESTAMPTZ,
            NULL::TIMESTAMPTZ,
            SQLERRM::TEXT;
END;
$$ LANGUAGE plpgsql;