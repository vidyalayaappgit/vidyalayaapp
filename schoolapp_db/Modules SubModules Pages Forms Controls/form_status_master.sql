
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
