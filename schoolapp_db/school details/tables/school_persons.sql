CREATE TABLE school_persons
(
    id BIGSERIAL PRIMARY KEY,

    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50),

    phone           VARCHAR(15),
    email           VARCHAR(100),

    date_of_birth   DATE,

    gender_id       BIGINT
                    REFERENCES common_master_values(id),

    created_by      BIGINT,
    created_dt      TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_school_person_phone
ON school_persons(phone);

CREATE INDEX idx_school_person_email
ON school_persons(email);


INSERT INTO school_persons
(
first_name,
last_name,
gender_id
)
VALUES
(
'Nutan',
'Agrawal',
(SELECT id FROM common_master_values 
 WHERE value_code='FEMALE' LIMIT 1)
);