
drop table school_roles
CREATE TABLE school_roles
(
    id BIGSERIAL PRIMARY KEY,

    entity_type VARCHAR(20) NOT NULL,
    -- SCHOOL_GROUP / SCHOOL

    entity_id BIGINT NOT NULL,

    role_type_id BIGINT NOT NULL
        REFERENCES common_master_values(id),

    person_id BIGINT NOT NULL
        REFERENCES school_persons(id),

    tenure_from DATE,
    tenure_to DATE,

    is_active BOOLEAN DEFAULT TRUE,

    created_by BIGINT,
    created_dt TIMESTAMP DEFAULT now()
);


CREATE INDEX idx_school_roles_entity
ON school_roles(entity_type, entity_id);

CREATE INDEX idx_school_roles_person
ON school_roles(person_id);
--prevents 2 active principal
CREATE UNIQUE INDEX uq_school_role_active
ON school_roles(entity_type, entity_id, role_type_id)
WHERE is_active = TRUE;


ALTER TABLE school_roles
ADD CONSTRAINT chk_entity_type
CHECK (entity_type IN ('SCHOOL','SCHOOL_GROUP'));

INSERT INTO school_roles
(
entity_type,
entity_id,
role_type_id,
person_id,
tenure_from,
is_active
)
VALUES
(
'SCHOOL',
1,
(
SELECT mv.id
FROM common_master_values mv
JOIN common_master_types mt
ON mt.id = mv.type_id
WHERE mt.type_code='SCH_ROLE'
AND mv.value_code='PRINCIPAL'
),
1,
CURRENT_DATE,
TRUE
);



select *from school_roles