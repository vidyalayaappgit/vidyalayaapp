
--Modules
DROP TABLE IF EXISTS modules CASCADE;

CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,

    module_code VARCHAR(50) NOT NULL UNIQUE,
    module_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),

    display_order INT DEFAULT 1,

    status SMALLINT NOT NULL DEFAULT 1
        CHECK (status IN (0,1)),

    created_by BIGINT NOT NULL,
    created_dt TIMESTAMP NOT NULL DEFAULT NOW(),

    modified_by BIGINT,
    modified_dt TIMESTAMP,

    CONSTRAINT chk_module_code_lower
        CHECK (module_code = LOWER(module_code))
);

CREATE INDEX idx_modules_navigation
ON modules(status, display_order);




select *From modules
--Sub-Modules
DROP TABLE IF EXISTS sub_modules CASCADE;

CREATE TABLE sub_modules (
    id BIGSERIAL PRIMARY KEY,

    module_id BIGINT NOT NULL,

    sub_module_code VARCHAR(50) NOT NULL,
    sub_module_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),

    display_order INT DEFAULT 1,

    status SMALLINT NOT NULL DEFAULT 1
        CHECK (status IN (0,1)),

    created_by BIGINT NOT NULL,
    created_dt TIMESTAMP NOT NULL DEFAULT NOW(),

    modified_by BIGINT,
    modified_dt TIMESTAMP,

    CONSTRAINT fk_submodule_module
        FOREIGN KEY (module_id)
        REFERENCES modules(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_module_submodule
        UNIQUE (module_id, sub_module_code),

    CONSTRAINT chk_submodule_code_lower
        CHECK (sub_module_code = LOWER(sub_module_code))
);

CREATE INDEX idx_submodules_navigation
ON sub_modules(module_id, status, display_order);



select *from sub_modules

--Pages (level 3 i.e. last level of navigation)
DROP TABLE IF EXISTS pages CASCADE;

CREATE TABLE pages (
    id BIGSERIAL PRIMARY KEY,

    sub_module_id BIGINT NOT NULL,

    page_code VARCHAR(50) NOT NULL,
    page_name VARCHAR(150) NOT NULL,
    description VARCHAR(255),

    route VARCHAR(255) NOT NULL,
    api_base_path VARCHAR(255),

    display_order INT DEFAULT 1,

    status SMALLINT NOT NULL DEFAULT 1
        CHECK (status IN (0,1)),

    created_by BIGINT NOT NULL,
    created_dt TIMESTAMP NOT NULL DEFAULT NOW(),

    modified_by BIGINT,
    modified_dt TIMESTAMP,

    CONSTRAINT fk_pages_submodule
        FOREIGN KEY (sub_module_id)
        REFERENCES sub_modules(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_submodule_page
        UNIQUE (sub_module_id, page_code),

    CONSTRAINT chk_pages_route
        CHECK (route LIKE '/%'),

    CONSTRAINT chk_page_code_lower
        CHECK (page_code = LOWER(page_code))
);

CREATE INDEX idx_pages_navigation
ON pages(sub_module_id, status, display_order);

CREATE INDEX idx_pages_route
ON pages(route);


select *from pages
--FORMS (UI COMPOSITION ONLY – NO SECURITY)

DROP TABLE IF EXISTS forms CASCADE;

CREATE TABLE forms (
    id BIGSERIAL PRIMARY KEY,

    page_id BIGINT NOT NULL,

    form_code VARCHAR(100) NOT NULL,
    form_name VARCHAR(150) NOT NULL,

    form_type VARCHAR(20) NOT NULL
        CHECK (form_type IN ('MAIN','SEARCH','HELP','MODAL','EMBEDDED')),

    render_mode VARCHAR(20) NOT NULL
        CHECK (render_mode IN ('TAB','EMBEDDED','MODAL','DRAWER')),

    display_order INT DEFAULT 1,

    status SMALLINT NOT NULL DEFAULT 1
        CHECK (status IN (0,1)),

    created_by BIGINT NOT NULL,
    created_dt TIMESTAMP NOT NULL DEFAULT NOW(),

    modified_by BIGINT,
    modified_dt TIMESTAMP,

    CONSTRAINT fk_forms_page
        FOREIGN KEY (page_id)
        REFERENCES pages(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_page_form
        UNIQUE (page_id, form_code),

    CONSTRAINT chk_form_code_lower
        CHECK (form_code = LOWER(form_code))
);

CREATE INDEX idx_forms_navigation
ON forms(page_id, status, display_order);

/*
📌 Rule
Forms are rendered inside pages
No routing
No role access here
*/

DROP TABLE IF EXISTS form_status_master CASCADE;

CREATE TABLE form_status_master (
    form_id     BIGINT NOT NULL,
    status_code SMALLINT NOT NULL,
    status_name VARCHAR(50) NOT NULL,    -- DRAFT, ACTIVE
    status_desc TEXT,
    is_active   BOOLEAN DEFAULT TRUE,

    PRIMARY KEY (form_id, status_code),

    CONSTRAINT fk_fsm_page
        FOREIGN KEY (form_id)
        REFERENCES forms(id)
        ON DELETE CASCADE
);
select *from form_status_master
INSERT INTO form_status_master VALUES
(5, 0, 'DRAFT',   'Draft'),
(5, 1, 'ACTIVE',  'Active'),
(5, 2, 'INACTIVE',  'Inactive'),
(5, 3, 'ARCHIVED',  'Archived')




select *From forms

--CONTROLS (Atomic Permissions)

DROP TABLE IF EXISTS controls CASCADE;

CREATE TABLE controls (
    id BIGSERIAL PRIMARY KEY,

    control_code VARCHAR(50) NOT NULL UNIQUE,
    control_name VARCHAR(100) NOT NULL,
    control_type VARCHAR(50) NOT NULL,

    display_order INT DEFAULT 1,

    status SMALLINT NOT NULL DEFAULT 1
        CHECK (status IN (0,1)),

    created_by BIGINT NOT NULL,
    created_dt TIMESTAMP NOT NULL DEFAULT NOW(),

    modified_by BIGINT,
    modified_dt TIMESTAMP,

    CONSTRAINT chk_control_code_lower
        CHECK (control_code = LOWER(control_code))
);

CREATE INDEX idx_controls_navigation
ON controls(status, display_order);

select *From Controls
/*
📌 Rule:
Controls = what a user can do, not where they can go.
*/

--Final DDL: form_controls
DROP TABLE IF EXISTS form_controls CASCADE;

CREATE TABLE form_controls (
    id BIGSERIAL PRIMARY KEY,

    form_id BIGINT NOT NULL,
    control_id BIGINT NOT NULL,

    display_order INT DEFAULT 1,

    status SMALLINT NOT NULL DEFAULT 1
        CHECK (status IN (0,1)),

    created_by BIGINT NOT NULL,
    created_dt TIMESTAMP NOT NULL DEFAULT NOW(),

    modified_by BIGINT,
    modified_dt TIMESTAMP,

    CONSTRAINT fk_fc_form
        FOREIGN KEY (form_id)
        REFERENCES forms(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fc_control
        FOREIGN KEY (control_id)
        REFERENCES controls(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_form_control
        UNIQUE (form_id, control_id)
);

CREATE INDEX idx_form_controls_form
ON form_controls(form_id, status, display_order);

--School Group Module mapping -- enable/disable

DROP TABLE IF EXISTS school_group_modules CASCADE;
CREATE TABLE school_group_modules (
    id BIGSERIAL PRIMARY KEY,

    school_group_id BIGINT NOT NULL
        REFERENCES school_groups(id)
        ON DELETE CASCADE,

    module_id BIGINT NOT NULL
        REFERENCES modules(id)
        ON DELETE CASCADE,

    is_enabled BOOLEAN DEFAULT TRUE,

    created_dt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uq_school_group_module
        UNIQUE (school_group_id, module_id)
);

--School Group Pages mapping -- enable/disable


DROP TABLE IF EXISTS school_group_pages CASCADE;
CREATE TABLE school_group_pages (
    id BIGSERIAL PRIMARY KEY,

    school_group_id BIGINT NOT NULL
        REFERENCES school_groups(id)
        ON DELETE CASCADE,

    page_id BIGINT NOT NULL
        REFERENCES pages(id)
        ON DELETE CASCADE,

    is_enabled BOOLEAN DEFAULT TRUE,

    created_dt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uq_school_group_page
        UNIQUE (school_group_id, page_id)
);

--Optional: School-Level Overrides

DROP TABLE IF EXISTS school_pages CASCADE;
CREATE TABLE school_pages (
    id BIGSERIAL PRIMARY KEY,

    school_id BIGINT NOT NULL
        REFERENCES schools(id)
        ON DELETE CASCADE,

    page_id BIGINT NOT NULL
        REFERENCES pages(id)
        ON DELETE CASCADE,

    is_enabled BOOLEAN DEFAULT TRUE,

    created_dt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uq_school_page
        UNIQUE (school_id, page_id)
);



select *From role_page_access


--ROLE → PAGE ACCESS (Navigation Security)
DROP TABLE IF EXISTS role_page_access CASCADE;

CREATE TABLE role_page_access (
    id BIGSERIAL PRIMARY KEY,

    role_id BIGINT NOT NULL,
    page_id BIGINT NOT NULL,

    can_access BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_rpa_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rpa_page
        FOREIGN KEY (page_id)
        REFERENCES pages(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_role_page UNIQUE (role_id, page_id)
);
CREATE INDEX idx_role_page_access_role ON role_page_access(role_id);

CREATE INDEX idx_rpa_role_page_access
ON role_page_access(role_id, page_id)
WHERE can_access = TRUE;


INSERT INTO role_page_access (role_id, page_id)
SELECT r.id,r. p.id
FROM roles r
JOIN pages p ON p.page_code = 'user_master'
WHERE r.role_code = 'admin'
ON CONFLICT (role_id, page_id) DO NOTHING;
select *From role_page_access

select *From pages

INSERT INTO role_page_access (role_id,client_id, page_id)
SELECT r.id,r.client_id, p.id
FROM roles r
JOIN pages p ON p.page_code = 'admission_form'
WHERE r.role_code = 'schooladminrole'
ON CONFLICT (role_id, page_id) DO NOTHING;



--ROLE → PAGE → CONTROL ACCESS (Final Permission Layer)
DROP TABLE IF EXISTS role_page_control_access CASCADE;

CREATE TABLE role_page_control_access (
    id         BIGSERIAL PRIMARY KEY,
    role_id    BIGINT NOT NULL,
    page_id    BIGINT NOT NULL,
    control_id BIGINT NOT NULL,

    can_access BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_rpca_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rpca_page
        FOREIGN KEY (page_id)
        REFERENCES pages(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rpca_control
        FOREIGN KEY (control_id)
        REFERENCES controls(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_role_page_control UNIQUE (role_id, page_id, control_id)
);


CREATE INDEX idx_rpca_role_page_control
ON role_page_control_access(role_id, page_id, control_id)
WHERE can_access = TRUE;

INSERT INTO role_page_control_access (role_id,client_id, page_id, control_id)
SELECT
    r.id,    p.id,    c.id
FROM roles r
JOIN pages p    ON p.page_code = 'user_master'
JOIN controls c ON c.control_code = 'save'
WHERE r.role_code = 'admin';


INSERT INTO role_page_control_access (role_id,client_id, page_id, control_id)
SELECT
    r.id,r.client_id,    p.id,    c.id
FROM roles r
JOIN pages p    ON p.page_code = 'admission_form'
JOIN controls c ON c.control_code = 'approve'
WHERE r.role_code = 'schooladminrole';


SELECT *fROM role_page_control_access



DROP TABLE IF EXISTS form_status_master CASCADE;

CREATE TABLE form_status_master (
    form_id     BIGINT NOT NULL,
    status_code SMALLINT NOT NULL,
    status_name VARCHAR(50) NOT NULL,    -- DRAFT, ACTIVE
    status_desc TEXT,
    is_active   BOOLEAN DEFAULT TRUE,

    PRIMARY KEY (form_id, status_code),

    CONSTRAINT fk_fsm_page
        FOREIGN KEY (form_id)
        REFERENCES forms(id)
        ON DELETE CASCADE
);
select *from form_status_master
INSERT INTO form_status_master VALUES
(5, 0, 'DRAFT',   'Draft'),
(5, 1, 'ACTIVE',  'Active'),
(5, 2, 'INACTIVE',  'Inactive'),
(5, 3, 'ARCHIVED',  'Archived')

select *From form_status_master
--FINAL ARCHITECTURE (LOCK THIS)
/*
Navigation:
Module → Sub-Module → Page

UI:
Page → Forms → Controls

Security:
Role → Page → Control
*/

/*
This table answers one simple but powerful question:
“Which controls are designed to appear on this form?”
It does NOT decide permissions.
It only defines UI capability.
*/
/*
Final Architecture (Now COMPLETE)
Navigation
Module → Sub-Module → Page

UI Composition
Page → Forms → Form_Controls

Security
Role → Page → Control
*/

