INSERT INTO common_master_types(type_code,type_name) VALUES
('SCHOOL_TYPE','School Type'),
('SCHOOL_CATEGORY','School Category'),
('BOARD','Education Board'),
('MEDIUM_OF_INSTRUCTION','Medium Of Instruction'),
('ORG_ROLE','Organization Roles'),
('SUBSCRIPTION_PLAN','Subscription Plan'),
('GENDER','Gender'),
('ACADEMIC_MONTH','Academic Month');


INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'ENGLISH','English'
FROM common_master_types WHERE type_code='MEDIUM_OF_INSTRUCTION';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'GUJARATI','Gujarati'
FROM common_master_types WHERE type_code='MEDIUM_OF_INSTRUCTION';

INSERT INTO common_master_values(type_id,value_code,value_name)
SELECT id,'HINDI','Hindi'
FROM common_master_types WHERE type_code='MEDIUM_OF_INSTRUCTION';