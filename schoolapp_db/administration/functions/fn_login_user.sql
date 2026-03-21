--select fn_login_user('LGCS','schooladmin','123@abc')
--select fn_login_user('platform','schoolappadmin','123@abc')
CREATE OR REPLACE FUNCTION fn_login_user
(
    p_group_code VARCHAR,
    p_user_code  VARCHAR,
    p_password   VARCHAR
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE

v_group  school_groups%ROWTYPE;
v_user   users%ROWTYPE;

v_role_id   BIGINT;
v_school_id BIGINT;

BEGIN

--------------------------------------------------
-- 1 Resolve School Group
--------------------------------------------------

SELECT *
INTO v_group
FROM school_groups
WHERE group_code = p_group_code
AND status = 1
AND is_deleted = FALSE;

IF NOT FOUND THEN
RETURN json_build_object(
'error_id',10,
'message','Invalid school group'
);
END IF;


--------------------------------------------------
-- 2 Fetch User
--------------------------------------------------

SELECT *
INTO v_user
FROM users
WHERE school_group_id = v_group.id
AND user_code = p_user_code
AND is_deleted = FALSE;

IF NOT FOUND THEN
RETURN json_build_object(
'error_id',1,
'message','User not found'
);
END IF;


--------------------------------------------------
-- 3 Password Validation
--------------------------------------------------

IF v_user.password_hash <> crypt(p_password, v_user.password_hash) THEN

UPDATE users
SET
failed_attempts = failed_attempts + 1,
last_failed_login = NOW()
WHERE id = v_user.id;

RETURN json_build_object(
'error_id',2,
'message','Invalid password'
);

END IF;


--------------------------------------------------
-- 4 Status Check
--------------------------------------------------

IF v_user.status <> 1 THEN
RETURN json_build_object(
'error_id',3,
'message','User inactive'
);
END IF;


--------------------------------------------------
-- 5 Effective Date Check
--------------------------------------------------

IF v_user.effective_fr > NOW() THEN
RETURN json_build_object(
'error_id',4,
'message','Account not active yet'
);
END IF;


IF v_user.effective_to IS NOT NULL
AND v_user.effective_to < NOW()
THEN
RETURN json_build_object(
'error_id',5,
'message','Account expired'
);
END IF;


--------------------------------------------------
-- 6 Platform Admin Check
--------------------------------------------------

IF v_user.is_platform_admin = TRUE THEN

RETURN json_build_object(

'error_id',0,
'platform_admin',TRUE,

'user',json_build_object(
  'id',v_user.id,
  'user_code',v_user.user_code,
  'user_name',v_user.user_name
),

'school', json_build_object(
  'school_group_id', v_group.id  -- ✅ ADD THIS
)

);

END IF;


--------------------------------------------------
-- 7 Default Role + School
--------------------------------------------------

v_role_id := v_user.default_role_id;
v_school_id := v_user.default_school_id;

--------------------------------------------------
-- 7 Default Role + School
--------------------------------------------------

v_role_id := v_user.default_role_id;
v_school_id := v_user.default_school_id;

IF v_role_id IS NULL OR v_role_id = 0
   OR v_school_id IS NULL OR v_school_id = 0 THEN

  SELECT
    role_id,
    school_id
  INTO
    v_role_id,
    v_school_id
  FROM user_school_roles
  WHERE user_id = v_user.id
    AND status = 1
  LIMIT 1;

END IF;


--------------------------------------------------
-- 8 Successful Login
--------------------------------------------------

UPDATE users
SET
last_login = NOW(),
failed_attempts = 0
WHERE id = v_user.id;


RETURN json_build_object(

'error_id',0,

'user',json_build_object(
'id',v_user.id,
'user_code',v_user.user_code,
'user_name',v_user.user_name
),

'school',json_build_object(
'school_id',v_school_id,
  'school_group_id', v_group.id   -- ✅ ADD THIS LINE
),

'role',json_build_object(
'role_id',v_role_id
)

);

END;
$$;