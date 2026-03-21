
DROP TABLE IF EXISTS schools CASCADE;
CREATE TABLE schools
(
    id BIGSERIAL PRIMARY KEY,
    school_group_id BIGINT NOT NULL
        REFERENCES school_groups(id),

    school_code VARCHAR(30) NOT NULL,
    school_name VARCHAR(200) NOT NULL,
    school_short_name VARCHAR(30),

    parent_school_id BIGINT
        REFERENCES schools(id),

    school_type_id BIGINT
        REFERENCES common_master_values(id),

    school_category_id BIGINT
        REFERENCES common_master_values(id),

    board_id BIGINT
        REFERENCES common_master_values(id),

    medium_of_instruction_id BIGINT
        REFERENCES common_master_values(id),

    established_year INT,
    opening_date DATE,

    affiliation_number VARCHAR(50),
    affiliation_date DATE,
    affiliation_valid_upto DATE,

    udise_code CHAR(11),

    address_id BIGINT
        REFERENCES school_addresses(id),

    email_primary VARCHAR(100),
    phone_office  VARCHAR(15),
    website       VARCHAR(100),

    academic_start_month_id BIGINT
        REFERENCES common_master_values(id),

    academic_end_month_id BIGINT
        REFERENCES common_master_values(id),

    session_start_date DATE,
    session_end_date   DATE,

    school_timings_from TIME,
    school_timings_to   TIME,

    about_school TEXT,
    mission_statement TEXT,
    vision_statement TEXT,

    status SMALLINT NOT NULL CHECK (status IN (0,1,2)),
    -- 0 inactive
    -- 1 active
    -- 2 closed

    effective_from TIMESTAMP DEFAULT now(),
    effective_to   TIMESTAMP,

    created_by BIGINT,
    created_dt TIMESTAMP DEFAULT now(),

    updated_by BIGINT,
    updated_dt TIMESTAMP,

    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT uq_school_group_code
        UNIQUE(school_group_id, school_code),

    CONSTRAINT uq_school_udise
        UNIQUE(udise_code),

    CONSTRAINT chk_udise_length
        CHECK (udise_code IS NULL OR LENGTH(udise_code) = 11)
);

CREATE INDEX idx_schools_group
ON schools(school_group_id);

CREATE INDEX idx_schools_board
ON schools(board_id);

CREATE INDEX idx_schools_status
ON schools(status);

CREATE INDEX idx_schools_medium
ON schools(medium_of_instruction_id);

ALTER TABLE schools
ADD CONSTRAINT chk_established_year
CHECK (established_year IS NULL OR established_year >= 1800);

ALTER TABLE schools
ADD CONSTRAINT uq_schools_group_school
UNIQUE (school_group_id, id);


INSERT INTO schools
(
school_group_id,
school_code,
school_name,
school_short_name,
school_type_id,
school_category_id,
board_id,
medium_of_instruction_id,
address_id,
status
)
VALUES
(
1,
'RABEA',
'R.A. Bhageria Educational Academy',
'RABEA',

(SELECT id FROM common_master_values 
 WHERE value_code='DAY' LIMIT 1),

(SELECT id FROM common_master_values 
 WHERE value_code='COED' LIMIT 1),

(SELECT id FROM common_master_values 
 WHERE value_code='CBSE' LIMIT 1),

(SELECT id FROM common_master_values 
 WHERE value_code='ENGLISH' LIMIT 1),

2,
1
);



