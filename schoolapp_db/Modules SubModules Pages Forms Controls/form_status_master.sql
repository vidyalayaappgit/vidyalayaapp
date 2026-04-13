
DROP TABLE IF EXISTS form_status_master CASCADE;

CREATE TABLE form_status_master (
    form_id     BIGINT NOT NULL,
    status_id SMALLINT NOT NULL,
    status_name VARCHAR(50) NOT NULL,    -- DRAFT, ACTIVE
    status_desc TEXT,
    is_active   BOOLEAN DEFAULT TRUE,

    PRIMARY KEY (form_id, status_id),

    CONSTRAINT fk_fsm_page
        FOREIGN KEY (form_id)
        REFERENCES forms(id)
        ON DELETE CASCADE
);
select *from form_status_master
INSERT INTO form_status_master VALUES
(5, 1, 'FRESH',  'Fresh'),
(5, 2, 'AUTHORISED',  'Authorised')



INSERT INTO form_status_master VALUES
(6, 0, 'DRAFT',  'Draft'),
(6, 1, 'ACTIVE',  'Active'),
(6, 2, 'INACTIVE',  'Inactive')

