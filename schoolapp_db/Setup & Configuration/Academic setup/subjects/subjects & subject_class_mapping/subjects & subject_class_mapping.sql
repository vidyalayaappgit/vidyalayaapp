-- =====================================================
-- 1. SUBJECTS TABLE (Master table)
-- =====================================================
DROP TABLE IF EXISTS subjects CASCADE;

CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    
    -- Form Status
    form_id BIGINT NOT NULL DEFAULT 8,
    
    -- School Association
    school_id BIGINT NOT NULL,
    
    -- Subject Identification (Unique per school, NOT per class)
    subject_code VARCHAR(50) NOT NULL,      -- e.g., "SUB-MAT", "SUB-SCI", "SUB-ENG"
    subject_name VARCHAR(255) NOT NULL,     -- e.g., "Mathematics", "Science", "English"
    subject_short_name VARCHAR(50),         -- e.g., "Math", "Sci", "Eng"
    
    -- Subject Categorization (Global, not class-specific)
    subject_type VARCHAR(50) CHECK (subject_type IN ('Theory', 'Practical', 'Both', 'Elective', 'Core', 'Remedial')),
    subject_category_id BIGINT,             -- References common_master_values
    language_group_id BIGINT,               -- References common_master_values
    
    -- Subject Level/Difficulty (for progressive subjects across classes)
    subject_level INTEGER DEFAULT 1,        -- 1=Beginner, 2=Intermediate, 3=Advanced
    parent_subject_id BIGINT,               -- Self-reference
    
    -- Credits (Standard credits, can be overridden in mapping table)
    default_theory_credits DECIMAL(4,2) DEFAULT 0.00,
    default_practical_credits DECIMAL(4,2) DEFAULT 0.00,
    default_total_credits DECIMAL(4,2) GENERATED ALWAYS AS (default_theory_credits + default_practical_credits) STORED,
    
    -- Assessment (Global defaults)
    default_passing_marks_theory INTEGER DEFAULT 33,
    default_passing_marks_practical INTEGER DEFAULT 33,
    default_max_marks_theory INTEGER DEFAULT 100,
    default_max_marks_practical INTEGER DEFAULT 100,
    default_min_attendance_percent DECIMAL(5,2) DEFAULT 75.00,
    is_grade_only BOOLEAN DEFAULT FALSE,
    
    -- Practical Details (Global defaults)
    has_practical BOOLEAN DEFAULT FALSE,
    default_practical_group_size INTEGER,
    lab_required BOOLEAN DEFAULT FALSE,
    lab_id BIGINT,                          -- References labs table
    
    -- Subject Properties
    is_optional BOOLEAN DEFAULT FALSE,
    is_co_scholastic BOOLEAN DEFAULT FALSE,
    co_scholastic_area_id BIGINT,
    
    -- Display (Global ordering, can be overridden)
    global_display_order INTEGER DEFAULT 0,
    
    -- Description
    description TEXT,
    status SMALLINT NOT NULL DEFAULT 1,     -- 1=Draft, 2=Active, 3=Inactive
    
    -- Audit Fields
    created_by INTEGER,
    created_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_school_subject_code 
        UNIQUE (school_id, subject_code),
    CONSTRAINT unique_school_subject_name 
        UNIQUE (school_id, subject_name),
    CONSTRAINT valid_subject_level 
        CHECK (subject_level >= 1),
    
    -- Foreign Keys
    CONSTRAINT fk_subjects_form_status
        FOREIGN KEY (form_id, status)
        REFERENCES form_status_master(form_id, status_id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_subjects_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_subjects_parent_subject
        FOREIGN KEY (parent_subject_id)
        REFERENCES subjects(id)
        ON DELETE SET NULL,
    
    CONSTRAINT fk_subjects_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    
    CONSTRAINT fk_subjects_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =====================================================
-- 2. SUBJECT CLASS MAPPING TABLE (Junction table)
-- =====================================================

CREATE TABLE subject_class_mapping (
    id BIGSERIAL PRIMARY KEY,
    
    -- Form Status (for individual mappings)
    form_id BIGINT NOT NULL DEFAULT 9,
    
    -- References
    school_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    class_id INTEGER NOT NULL,              -- References classes.id
    
    -- Class-specific overrides
    subject_code_override VARCHAR(50),
    display_name VARCHAR(255),
    subject_number INTEGER,
    display_order INTEGER,
    
    -- Class-specific credits/hours
    theory_credits DECIMAL(4,2),
    practical_credits DECIMAL(4,2),
    total_credits DECIMAL(4,2) GENERATED ALWAYS AS (theory_credits + practical_credits) STORED,
    theory_hours_per_week INTEGER,
    practical_hours_per_week INTEGER,
    total_hours_per_week INTEGER GENERATED ALWAYS AS (theory_hours_per_week + practical_hours_per_week) STORED,
    
    -- Class-specific assessment
    passing_marks_theory INTEGER,
    passing_marks_practical INTEGER,
    max_marks_theory INTEGER,
    max_marks_practical INTEGER,
    min_attendance_percent DECIMAL(5,2),
    
    -- Class-specific properties
    is_optional BOOLEAN,
    practical_group_size INTEGER,
    
    -- Whether this subject is taught in this class
    is_taught BOOLEAN DEFAULT TRUE,
    
    -- Schedule info
    suggested_teacher_id BIGINT,
    status SMALLINT NOT NULL DEFAULT 1,
   
    -- Audit Fields
    created_by INTEGER,
    created_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_school_subject_class 
        UNIQUE (school_id, subject_id, class_id)
);

-- =====================================================
-- PARTIAL UNIQUE INDEXES
-- =====================================================

-- Unique subject_number only when NOT NULL
CREATE UNIQUE INDEX idx_unique_school_class_subject_number 
    ON subject_class_mapping (school_id, class_id, subject_number) 
    WHERE subject_number IS NOT NULL;

-- =====================================================
-- FOREIGN KEY CONSTRAINTS for mapping table
-- =====================================================

ALTER TABLE subject_class_mapping
    ADD CONSTRAINT fk_mapping_form_status
    FOREIGN KEY (form_id, status)
    REFERENCES form_status_master(form_id, status_id)
    ON DELETE RESTRICT;

ALTER TABLE subject_class_mapping
    ADD CONSTRAINT fk_mapping_school
    FOREIGN KEY (school_id)
    REFERENCES schools(id)
    ON DELETE RESTRICT;

ALTER TABLE subject_class_mapping
    ADD CONSTRAINT fk_mapping_subject
    FOREIGN KEY (subject_id)
    REFERENCES subjects(id)
    ON DELETE CASCADE;

ALTER TABLE subject_class_mapping
    ADD CONSTRAINT fk_mapping_class
    FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON DELETE CASCADE;

ALTER TABLE subject_class_mapping
    ADD CONSTRAINT fk_mapping_suggested_teacher
    FOREIGN KEY (suggested_teacher_id)
    REFERENCES users(id)
    ON DELETE SET NULL;

ALTER TABLE subject_class_mapping
    ADD CONSTRAINT fk_mapping_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE SET NULL;

ALTER TABLE subject_class_mapping
    ADD CONSTRAINT fk_mapping_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
    ON DELETE SET NULL;



-- Indexes for subjects table
CREATE INDEX idx_subjects_status ON subjects(form_id, status);
CREATE INDEX idx_subjects_school ON subjects(school_id);
CREATE INDEX idx_subjects_subject_type ON subjects(subject_type);
CREATE INDEX idx_subjects_subject_code ON subjects(school_id, subject_code);
CREATE INDEX idx_subjects_parent ON subjects(parent_subject_id);
CREATE INDEX idx_subjects_category ON subjects(subject_category_id);
CREATE INDEX idx_subjects_language_group ON subjects(language_group_id);
CREATE INDEX idx_subjects_co_scholastic ON subjects(co_scholastic_area_id);

-- Indexes for subject_class_mapping table
CREATE INDEX idx_mapping_status ON subject_class_mapping(form_id, status);
CREATE INDEX idx_mapping_school ON subject_class_mapping(school_id);
CREATE INDEX idx_mapping_subject ON subject_class_mapping(subject_id);
CREATE INDEX idx_mapping_class ON subject_class_mapping(class_id);
CREATE INDEX idx_mapping_subject_class ON subject_class_mapping(subject_id, class_id);
CREATE INDEX idx_mapping_display_order ON subject_class_mapping(class_id, display_order);
CREATE INDEX idx_mapping_suggested_teacher ON subject_class_mapping(suggested_teacher_id);

-- =====================================================
-- 6. INSERT SCRIPTS FOR REFERENCED TABLES
-- =====================================================

-- Insert into form_status_master (for form_id=8 - Subjects)
INSERT INTO form_status_master (form_id, status_id, status_name, status_desc, is_active) VALUES
(8, 1, 'DRAFT', 'Subject in draft mode - not yet ready for use', TRUE),
(8, 2, 'ACTIVE', 'Subject is active and available for use', TRUE),
(8, 3, 'INACTIVE', 'Subject is inactive/archived', TRUE);

-- Insert for form_id=9 - Subject Class Mapping
INSERT INTO form_status_master (form_id, status_id, status_name, status_desc, is_active) VALUES
(9, 1, 'DRAFT', 'Mapping in draft mode', TRUE),
(9, 2, 'ACTIVE', 'Mapping is active', TRUE),
(9, 3, 'INACTIVE', 'Mapping is inactive', TRUE);

-- Insert into common_master_types
INSERT INTO common_master_types (type_code, type_name, description) VALUES
('SUBJECT_CATEGORY', 'Subject Category', 'Categories like Science, Commerce, Arts, Language, Vocational'),
('LANGUAGE_GROUP', 'Language Group', 'First Language, Second Language, Third Language'),
('CO_SCHOLASTIC_AREA', 'Co-Scholastic Area', 'Art, Music, Sports, Life Skills, etc.');

-- Insert into common_master_values (Subject Categories)
INSERT INTO common_master_values (type_id, value_code, value_name, sort_order) VALUES
((SELECT id FROM common_master_types WHERE type_code = 'SUBJECT_CATEGORY'), 'SCI', 'Science', 1),
((SELECT id FROM common_master_types WHERE type_code = 'SUBJECT_CATEGORY'), 'COMM', 'Commerce', 2),
((SELECT id FROM common_master_types WHERE type_code = 'SUBJECT_CATEGORY'), 'ARTS', 'Arts', 3),
((SELECT id FROM common_master_types WHERE type_code = 'SUBJECT_CATEGORY'), 'LANG', 'Language', 4),
((SELECT id FROM common_master_types WHERE type_code = 'SUBJECT_CATEGORY'), 'VOC', 'Vocational', 5);

-- Insert into common_master_values (Language Groups)
INSERT INTO common_master_values (type_id, value_code, value_name, sort_order) VALUES
((SELECT id FROM common_master_types WHERE type_code = 'LANGUAGE_GROUP'), 'L1', 'First Language', 1),
((SELECT id FROM common_master_types WHERE type_code = 'LANGUAGE_GROUP'), 'L2', 'Second Language', 2),
((SELECT id FROM common_master_types WHERE type_code = 'LANGUAGE_GROUP'), 'L3', 'Third Language', 3);

-- Insert into common_master_values (Co-Scholastic Areas)
INSERT INTO common_master_values (type_id, value_code, value_name, sort_order) VALUES
((SELECT id FROM common_master_types WHERE type_code = 'CO_SCHOLASTIC_AREA'), 'ART', 'Art Education', 1),
((SELECT id FROM common_master_types WHERE type_code = 'CO_SCHOLASTIC_AREA'), 'MUSIC', 'Music', 2),
((SELECT id FROM common_master_types WHERE type_code = 'CO_SCHOLASTIC_AREA'), 'SPORTS', 'Physical Education & Sports', 3),
((SELECT id FROM common_master_types WHERE type_code = 'CO_SCHOLASTIC_AREA'), 'LIFE_SKILLS', 'Life Skills', 4);