


INSERT INTO roles
(
    school_group_id,
    role_code,
    role_name,
    status,
    created_by
)
VALUES
(
    1,
    'schooladmin',
    'School Administrator',
    1,
    1
);
select * From roles


INSERT INTO users
(
    school_group_id,
    user_code,
    user_name,
    password_hash,
    email,
    status,
    effective_fr,
    default_school_id,
    default_role_id,
    created_by
)
VALUES
(
    1,
    'schooladmin',
    'School Administrator',
    crypt('123@abc', gen_salt('bf')),
    'schooladmin@school.com',
    1,
    NOW(),
    1,
    (SELECT id FROM roles 
     WHERE role_code='schooladmin' 
     AND school_group_id=1),
    1
);

select *from users

INSERT INTO user_school_roles
(
    school_group_id,
    user_id,
    school_id,
    role_id,
    status
)
SELECT
    1,
    u.id,
    1,
    r.id,
    1
FROM users u
JOIN roles r
    ON r.role_code = 'schooladmin'
WHERE u.user_code = 'schooladmin'
AND u.school_group_id = 1;

select *from role_page_access

INSERT INTO role_page_access
(
    school_group_id,
    role_id,
    page_id,
    can_access
)
SELECT
    1,
    r.id,
    p.id,
    TRUE
FROM pages p
JOIN roles r
    ON r.role_code = 'schooladmin'
AND r.school_group_id = 1;

select *from role_page_access

select *from role_form_control_access
INSERT INTO role_form_control_access
(
    school_group_id,
    role_id,
    form_id,
    control_id,
    can_access
)
SELECT
    1,
	1,
    r.form_id,
    r.control_id,
    TRUE
FROM  form_controls r

