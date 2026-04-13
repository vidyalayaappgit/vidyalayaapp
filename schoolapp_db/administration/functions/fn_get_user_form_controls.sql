CREATE OR REPLACE FUNCTION fn_get_user_form_controls(
p_user_id BIGINT,
p_school_id BIGINT,
p_form_code VARCHAR
)
RETURNS TABLE (
control_code VARCHAR
)
AS $$
DECLARE
v_form_id BIGINT;
v_role_id BIGINT;
v_is_admin BOOLEAN;
BEGIN
----------------------------------------------------------------
-- 1. VALIDATE USER
----------------------------------------------------------------
SELECT is_platform_admin INTO v_is_admin
FROM users
WHERE id = p_user_id;

IF v_is_admin IS NULL THEN
    RAISE EXCEPTION 'Invalid user';
END IF;

----------------------------------------------------------------
-- 2. GET FORM ID
----------------------------------------------------------------
SELECT id INTO v_form_id
FROM forms
WHERE LOWER(form_code) = LOWER(p_form_code);

IF v_form_id IS NULL THEN
    RAISE EXCEPTION 'Invalid form_code: %', p_form_code;
END IF;

----------------------------------------------------------------
-- 3. IF ADMIN ? RETURN ALL CONTROLS
----------------------------------------------------------------
IF v_is_admin THEN
    RETURN QUERY
    SELECT c.control_code
    FROM controls c
    ORDER BY c.control_code;

    RETURN;
END IF;

----------------------------------------------------------------
-- 4. GET USER ROLE FOR SCHOOL
----------------------------------------------------------------
SELECT role_id INTO v_role_id
FROM user_school_roles
WHERE user_id = p_user_id
  AND school_id = p_school_id
  AND status = 1
LIMIT 1;

IF v_role_id IS NULL THEN
    RETURN; -- no access
END IF;

----------------------------------------------------------------
-- 5. RETURN ALLOWED CONTROLS
----------------------------------------------------------------
RETURN QUERY
SELECT c.control_code
FROM role_form_control_access rfca
JOIN controls c ON c.id = rfca.control_id
WHERE rfca.role_id = v_role_id
  AND rfca.form_id = v_form_id
  AND rfca.can_access = TRUE
ORDER BY c.control_code;


END;
$$ LANGUAGE plpgsql;
