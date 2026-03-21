
CREATE TABLE school_groups
(
    id BIGSERIAL PRIMARY KEY,


    group_code       VARCHAR(30) UNIQUE NOT NULL,
    group_name       VARCHAR(150) NOT NULL,
    group_short_name VARCHAR(30),

    group_type_id BIGINT
        REFERENCES common_master_values(id),

    registration_number VARCHAR(50),
    registration_date   DATE,
    registration_authority VARCHAR(100),
    registration_valid_upto DATE,

    office_address_id BIGINT
        REFERENCES school_addresses(id),

    corr_address_id BIGINT
        REFERENCES school_addresses(id),

    email_primary VARCHAR(100),
    phone_office  VARCHAR(15),
    website       VARCHAR(100),

    pan_number CHAR(10),
    tan_number CHAR(10),
    gst_number CHAR(15),
    cin_number CHAR(21),

    subscription_plan_id BIGINT
        REFERENCES common_master_values(id),

    subscription_start_date DATE,
    subscription_end_date   DATE,

    max_schools  INT DEFAULT 1,
    max_students INT,
    max_staff    INT,

    logo_light VARCHAR(255),
    logo_dark  VARCHAR(255),

    status SMALLINT NOT NULL CHECK (status IN (0,1,2)),
    -- 0 inactive
    -- 1 active
    -- 2 suspended

    effective_from TIMESTAMP DEFAULT now(),
    effective_to   TIMESTAMP,

    created_by BIGINT,
    created_dt TIMESTAMP DEFAULT now(),

    updated_by BIGINT,
    updated_dt TIMESTAMP,

    is_deleted BOOLEAN DEFAULT FALSE
);



CREATE INDEX idx_school_groups_status
ON school_groups(status);

ALTER TABLE school_groups
ADD CONSTRAINT chk_pan_length
CHECK (pan_number IS NULL OR LENGTH(pan_number)=10);


INSERT INTO school_groups
(
group_code,
group_name,
group_short_name,
group_type_id,
office_address_id,
email_primary,
phone_office,
subscription_plan_id,
status
)
VALUES
(
'LGCS',
'Lala Govindramjee Charitable Society',
'LGCS',
NULL,
1,
NULL,
NULL,
(SELECT id FROM common_master_values 
 WHERE value_code='STANDARD' LIMIT 1),
1
);



select *From school_groups