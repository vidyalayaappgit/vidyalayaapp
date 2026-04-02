DROP TABLE IF EXISTS common_master_values CASCADE;
DROP TABLE IF EXISTS common_master_types CASCADE;

CREATE TABLE common_master_types
(
    id            BIGSERIAL PRIMARY KEY,
    type_code     VARCHAR(50) UNIQUE NOT NULL,
    type_name     VARCHAR(100) NOT NULL,
    description   TEXT,
    is_active     BOOLEAN DEFAULT TRUE,
    created_dt    TIMESTAMP DEFAULT now()
);


INSERT INTO common_master_types (type_code, type_name, description)
VALUES
('SCHOOL_TYPE','School Type','Day/Boarding'),
('SCHOOL_CATEGORY','School Category','Boys/Girls/CoEd'),
('BOARD','Education Board','CBSE/ICSE/State'),
('MEDIUM_OF_INSTRUCTION','Medium Of Instruction','School medium'),
('SCH_ROLE','School Role','Principal/Chairperson etc'),
('SUBSCRIPTION_PLAN','Subscription Plan','ERP subscription'),
('ACADEMIC_MONTH','Academic Month','Session months'),
('GENDER','Gender','Student gender'),
('RELIGION','Religion','Religion master'),
('CASTE','Caste','Caste master'),
('NATIONALITY','Nationality','Nationality master'),
('LANGUAGE','Language','Language master'),
('BLOOD_GROUP','Blood Group','Blood group master'),
('ADDRESS_TYPE','Address Type','Communication/Permanent'),
('GUARDIAN_TYPE','Guardian Type','Father/Mother/Guardian'),
('DOCUMENT_TYPE','Document Type','Admission documents'),
('HOBBY','Hobby','Student hobbies'),
('COUNTRY','Country','Country master'),
('STATE','State','State master'),
('CITY','City','City master');




CREATE TABLE common_master_values
(
    id            BIGSERIAL PRIMARY KEY,

    type_id       BIGINT NOT NULL
                  REFERENCES common_master_types(id),

    school_group_id INT NULL,
    -- NULL = global master
    -- value = school group specific master

    value_code    VARCHAR(50),

    value_name    VARCHAR(150) NOT NULL,

    parent_id     BIGINT REFERENCES common_master_values(id),

    sort_order    INT DEFAULT 1,

    is_active     BOOLEAN DEFAULT TRUE,

    created_dt    TIMESTAMP DEFAULT now()
);


CREATE INDEX idx_master_parent
ON common_master_values(parent_id);

CREATE INDEX idx_master_type
ON common_master_values(type_id);


--Prevent Duplicate Master Values
ALTER TABLE common_master_values
ADD CONSTRAINT uq_master_values
UNIQUE(type_id, school_group_id, value_code);




--Insert Gender Values
INSERT INTO common_master_values (type_id,value_code,value_name)
SELECT id,'M','Male'
FROM common_master_types
WHERE type_code='GENDER';

INSERT INTO common_master_values (type_id,value_code,value_name)
SELECT id,'F','Female'
FROM common_master_types
WHERE type_code='GENDER';

INSERT INTO common_master_values (type_id,value_code,value_name)
SELECT id,'O','Other'
FROM common_master_types
WHERE type_code='GENDER';

--Insert Medium Of Instruction
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'ENGLISH','English'
FROM common_master_types
WHERE type_code='MEDIUM_OF_INSTRUCTION';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'GUJARATI','Gujarati'
FROM common_master_types
WHERE type_code='MEDIUM_OF_INSTRUCTION';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'HINDI','Hindi'
FROM common_master_types
WHERE type_code='MEDIUM_OF_INSTRUCTION';


--Insert School Type
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'DAY','Day School'
FROM common_master_types
WHERE type_code='SCHOOL_TYPE';
-- Insert School Category
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'COED','Co-Educational'
FROM common_master_types
WHERE type_code='SCHOOL_CATEGORY';
1️⃣1️⃣ Insert Education Board
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'CBSE','CBSE'
FROM common_master_types
WHERE type_code='BOARD';
--Insert School Roles (SCH_ROLE)
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'CHAIRPERSON','Chairperson'
FROM common_master_types
WHERE type_code='SCH_ROLE';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'SECRETARY','Secretary'
FROM common_master_types
WHERE type_code='SCH_ROLE';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'TREASURER','Treasurer'
FROM common_master_types
WHERE type_code='SCH_ROLE';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'PRINCIPAL','Principal'
FROM common_master_types
WHERE type_code='SCH_ROLE';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'VICE_PRINCIPAL','Vice Principal'
FROM common_master_types
WHERE type_code='SCH_ROLE';
1️⃣3️⃣ Insert Subscription Plan
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'STANDARD','Standard'
FROM common_master_types
WHERE type_code='SUBSCRIPTION_PLAN';
-- Insert Academic Months
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'APR','April'
FROM common_master_types
WHERE type_code='ACADEMIC_MONTH';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'MAR','March'
FROM common_master_types
WHERE type_code='ACADEMIC_MONTH';

--Insert School Type
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'DAY','Day School'
FROM common_master_types
WHERE type_code='SCHOOL_TYPE';

--Insert School Category
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'COED','Co-Educational'
FROM common_master_types
WHERE type_code='SCHOOL_CATEGORY';

--Insert Education Board
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'CBSE','CBSE'
FROM common_master_types
WHERE type_code='BOARD';

--Insert School Roles (SCH_ROLE)
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'CHAIRPERSON','Chairperson'
FROM common_master_types
WHERE type_code='SCH_ROLE';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'SECRETARY','Secretary'
FROM common_master_types
WHERE type_code='SCH_ROLE';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'TREASURER','Treasurer'
FROM common_master_types
WHERE type_code='SCH_ROLE';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'PRINCIPAL','Principal'
FROM common_master_types
WHERE type_code='SCH_ROLE';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'VICE_PRINCIPAL','Vice Principal'
FROM common_master_types
WHERE type_code='SCH_ROLE';


--Insert Subscription Plan
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'STANDARD','Standard'
FROM common_master_types
WHERE type_code='SUBSCRIPTION_PLAN';



--Insert Academic Months
INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'APR','April'
FROM common_master_types
WHERE type_code='ACADEMIC_MONTH';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'MAR','March'
FROM common_master_types
WHERE type_code='ACADEMIC_MONTH';



SELECT
t.type_code,
v.value_code,
v.value_name
FROM common_master_values v
JOIN common_master_types t
ON t.id = v.type_id
ORDER BY t.type_code;