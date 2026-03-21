DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,

    school_group_id BIGINT NOT NULL,

    role_code VARCHAR(50) NOT NULL,
    role_name VARCHAR(100) NOT NULL,

    status SMALLINT NOT NULL 
        CHECK (status IN (0,1)),

    created_by BIGINT,
    created_dt TIMESTAMP NOT NULL DEFAULT NOW(),

    modified_by BIGINT,
    modified_dt TIMESTAMP,

    CONSTRAINT fk_roles_school_group
        FOREIGN KEY (school_group_id)
        REFERENCES school_groups(id),

    CONSTRAINT uq_role_school_group
        UNIQUE (school_group_id, role_code),

    CONSTRAINT chk_role_code_lower
        CHECK (role_code = LOWER(role_code))
);

ALTER TABLE roles
ADD CONSTRAINT uq_roles_group_role
UNIQUE (school_group_id, id);

CREATE INDEX idx_roles_group
ON roles(school_group_id);


DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    school_group_id BIGINT NOT NULL,

    user_code VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    email VARCHAR(100),
    mobile VARCHAR(20),

    status SMALLINT NOT NULL
        CHECK (status IN (0,1,2,3)),
        -- 0 Draft
        -- 1 Active
        -- 2 Locked
        -- 3 Inactive

    effective_fr TIMESTAMP NOT NULL,
    effective_to TIMESTAMP,

    CONSTRAINT chk_user_effective
        CHECK (effective_to IS NULL OR effective_to > effective_fr),

    default_school_id BIGINT,
    default_role_id BIGINT,

    failed_attempts SMALLINT NOT NULL DEFAULT 0,
    last_failed_login TIMESTAMP,
    last_login TIMESTAMP,

    lock_until TIMESTAMP,

    -- password management
    password_updated_dt TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expiry TIMESTAMP,
    is_platform_admin BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_by BIGINT,
    created_dt TIMESTAMP NOT NULL DEFAULT NOW(),

    modified_by BIGINT,
    modified_dt TIMESTAMP,

    CONSTRAINT fk_users_school_group
        FOREIGN KEY (school_group_id)
        REFERENCES school_groups(id),

    CONSTRAINT fk_users_default_school
        FOREIGN KEY (default_school_id)
        REFERENCES schools(id),

    CONSTRAINT fk_users_default_role
        FOREIGN KEY (default_role_id)
        REFERENCES roles(id),

    CONSTRAINT uq_users_code
        UNIQUE (school_group_id, user_code),

    CONSTRAINT chk_user_code_lower
        CHECK (user_code = LOWER(user_code)),
	CONSTRAINT uq_users_group_id
       UNIQUE (school_group_id, id)
);

--insert plateform admin user with all access all groups and schools
select *from users
INSERT INTO users
(
    school_group_id,
    user_code,
    user_name,
    password_hash,
    email,
    status,
    effective_fr,
    is_platform_admin,
    created_by
)
VALUES
(
    0,
    'schoolappadmin',
    'School App Super Admin',
    crypt('123@abc', gen_salt('bf')),
    'superadmin@schoolapp.com',
    1,
    NOW(),
    TRUE,
    1
);

DROP TABLE IF EXISTS user_school_roles CASCADE;

CREATE TABLE user_school_roles
(
    id BIGSERIAL PRIMARY KEY,

    school_group_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    school_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    status SMALLINT NOT NULL DEFAULT 1
        CHECK (status IN (0,1)),

    created_dt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uq_user_school_role
        UNIQUE(user_id, school_id, role_id),

    CONSTRAINT fk_usr_group
        FOREIGN KEY (school_group_id)
        REFERENCES school_groups(id),

    CONSTRAINT fk_usr_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usr_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id),

    CONSTRAINT fk_usr_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id),

    CONSTRAINT fk_usr_user_group
        FOREIGN KEY (school_group_id, user_id)
        REFERENCES users (school_group_id, id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usr_school_group
        FOREIGN KEY (school_group_id, school_id)
        REFERENCES schools (school_group_id, id),

    CONSTRAINT fk_usr_role_group
        FOREIGN KEY (school_group_id, role_id)
        REFERENCES roles (school_group_id, id)
);


CREATE INDEX idx_usr_user
ON user_school_roles(user_id);

CREATE INDEX idx_usr_school
ON user_school_roles(school_id);

CREATE INDEX idx_usr_role
ON user_school_roles(role_id);

CREATE INDEX idx_usr_role_school
ON user_school_roles(role_id, school_id);

CREATE INDEX idx_usr_user_school
ON user_school_roles(user_id, school_id);

CREATE INDEX idx_usr_group_user
ON user_school_roles(school_group_id, user_id);

CREATE INDEX idx_usr_user_context
ON user_school_roles(user_id, role_id);

DROP TABLE IF EXISTS user_login_history CASCADE;

CREATE TABLE user_login_history
(
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL
        REFERENCES users(id),

    school_id BIGINT,
    role_id BIGINT,

    login_time TIMESTAMP DEFAULT NOW(),
    logout_time TIMESTAMP,

    ip_address VARCHAR(50),
    user_agent TEXT
);



CREATE TABLE role_page_access
(
    id BIGSERIAL PRIMARY KEY,

    school_group_id BIGINT NOT NULL,

    role_id BIGINT NOT NULL,
    page_id BIGINT NOT NULL,

    can_access BOOLEAN DEFAULT TRUE,

    created_dt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uq_role_page
        UNIQUE(role_id, page_id),

    CONSTRAINT fk_rpa_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rpa_page
        FOREIGN KEY(page_id)
        REFERENCES pages(id),

    CONSTRAINT fk_rpa_group
        FOREIGN KEY(school_group_id)
        REFERENCES school_groups(id)
);


CREATE INDEX idx_rpa_role
ON role_page_access(role_id);

CREATE INDEX idx_rpa_page
ON role_page_access(page_id);

drop table role_form_control_access
CREATE TABLE role_form_control_access
(
    id BIGSERIAL PRIMARY KEY,

    school_group_id BIGINT NOT NULL,

    role_id BIGINT NOT NULL,
    form_id BIGINT NOT NULL,
    control_id BIGINT NOT NULL,

    can_access BOOLEAN DEFAULT TRUE,

    created_dt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uq_role_form_control
        UNIQUE(role_id, form_id, control_id),

    CONSTRAINT fk_rfca_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rfca_form
        FOREIGN KEY(form_id)
        REFERENCES forms(id),

    CONSTRAINT fk_rfca_control
        FOREIGN KEY(control_id)
        REFERENCES controls(id),

    CONSTRAINT fk_rfca_group
        FOREIGN KEY(school_group_id)
        REFERENCES school_groups(id)
);


CREATE INDEX idx_rfca_role
ON role_form_control_access(role_id);

CREATE INDEX idx_rfca_form
ON role_form_control_access(form_id);

CREATE INDEX idx_rfca_role_form
ON role_form_control_access(role_id, form_id);
