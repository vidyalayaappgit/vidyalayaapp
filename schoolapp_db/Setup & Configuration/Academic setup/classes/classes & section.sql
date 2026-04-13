
-- Rooms Master Table (with building_id reference)
DROP TABLE IF EXISTS rooms CASCADE;

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    
    -- School Information
    school_id BIGINT NOT NULL,
    
    -- Building Reference
    building_id BIGINT,                    -- References common_master_values for building
    
    -- Room Identification
    room_number VARCHAR(20) NOT NULL,      -- e.g., '101', 'B-204', 'Lab-1'
    room_name VARCHAR(100),                -- e.g., 'Physics Lab', 'Computer Lab'
    
    -- Room Details
    floor_number INT,                      -- 1,2,3 or NULL for ground
    room_type VARCHAR(50),                 -- 'CLASSROOM', 'LAB', 'LIBRARY', 'AUDITORIUM', 'OFFICE'
    capacity INT DEFAULT 30,               -- Maximum occupancy
    
    -- Facilities (JSON for flexibility)
    has_projector BOOLEAN DEFAULT FALSE,
    has_ac BOOLEAN DEFAULT FALSE,
    has_smart_board BOOLEAN DEFAULT FALSE,
    has_wifi BOOLEAN DEFAULT FALSE,
    facilities JSONB,                      -- For flexible facility tracking
    
    -- Status
    status SMALLINT NOT NULL DEFAULT 1,    -- 1=Active, 2=Inactive, 3=Under Maintenance
    
    -- Audit Fields
    description TEXT,
    created_by INTEGER,
    created_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_school_room 
        UNIQUE (school_id, room_number),
    CONSTRAINT valid_capacity 
        CHECK (capacity > 0 AND capacity <= 500),
    CONSTRAINT valid_floor 
        CHECK (floor_number IS NULL OR floor_number >= 0),
    
    -- Foreign Keys
    CONSTRAINT fk_rooms_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_rooms_building
        FOREIGN KEY (building_id)
        REFERENCES common_master_values(id)
        ON DELETE SET NULL,
    
    CONSTRAINT fk_rooms_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    
    CONSTRAINT fk_rooms_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Create indexes for rooms
CREATE INDEX idx_rooms_school_id ON rooms(school_id);
CREATE INDEX idx_rooms_building_id ON rooms(building_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_room_type ON rooms(room_type);




-- Enhanced CLASSES Table (Final Version)
DROP TABLE IF EXISTS classes CASCADE;

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    
    -- School & Form Information
    form_id BIGINT NOT NULL DEFAULT 6,
    school_id BIGINT NOT NULL,
    
    -- Class Identification
    class_code VARCHAR(20) NOT NULL,       -- e.g., "CLS-NUR", "CLS-LKG", "CLS-01"
    class_name VARCHAR(50) NOT NULL,       -- e.g., "Nursery", "LKG", "Class 1"
    class_number INT NOT NULL,             -- 0=Nursery,1=LKG,2=UKG,3=Class1,4=Class2...
    
    -- Academic Level
    academic_level_id BIGINT NOT NULL,     -- References common_master_values id Pre-Primary,Lower-Primary
    
    -- Optional Display Fields
    class_roman_numeral VARCHAR(10),       -- For classes 1-12 only
    display_order INT,                     -- For custom UI ordering per school
    
    -- Age Requirements
    min_age_required INT,                  -- Minimum age for admission (in years)
    max_age_required INT,                  -- Maximum age for admission (in years)
    
    -- Status (Single field - no is_active needed)
    status SMALLINT NOT NULL DEFAULT 1,    -- 1=Active, 2=Inactive, 3=Fresh, 4=Authorised, etc.
    
    -- Audit Fields
    description TEXT,
    created_by INTEGER,
    created_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_school_class_code 
        UNIQUE (school_id, class_code),
    CONSTRAINT unique_school_class_name 
        UNIQUE (school_id, class_name),
    CONSTRAINT unique_school_class_number 
        UNIQUE (school_id, class_number),
    CONSTRAINT valid_class_number 
        CHECK (class_number BETWEEN 0 AND 14), -- 0=Nursery,1=LKG,2=UKG,3-14=Class1-12
    CONSTRAINT valid_display_order 
        CHECK (display_order >= 0),
    CONSTRAINT valid_age_range 
        CHECK (min_age_required IS NULL OR max_age_required IS NULL OR min_age_required < max_age_required),
    
    -- Foreign Keys
    CONSTRAINT fk_classes_form_status
        FOREIGN KEY (form_id, status)
        REFERENCES form_status_master(form_id, status_id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_classes_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_classes_academic_level
        FOREIGN KEY (academic_level_id)
        REFERENCES common_master_values(id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_classes_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    
    CONSTRAINT fk_classes_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_status ON classes(status);
CREATE INDEX idx_classes_class_number ON classes(class_number);
CREATE INDEX idx_classes_academic_level ON classes(academic_level_id);
CREATE INDEX idx_classes_display_order ON classes(display_order);

-- Composite index
CREATE INDEX idx_classes_school_status ON classes(school_id, status);



-- Sections Table (with optional default class teacher)
DROP TABLE IF EXISTS sections CASCADE;

CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    
    -- Associations
    class_id INTEGER NOT NULL,
    school_id BIGINT NOT NULL,
    
    -- Section Identification
    section_code VARCHAR(10) NOT NULL,     -- 'A', 'B', 'C', 'NUR-A', 'LKG-B'
    section_name VARCHAR(50) NOT NULL,     -- 'Section A', 'Nursery A'
    room_id INTEGER,                       -- Default room (can be overridden yearly)
    
    -- Section Details
    capacity INT DEFAULT 30,
    current_strength INT DEFAULT 0,
    
    -- Timings (default timings, can be overridden yearly)
    start_time TIME,
    end_time TIME,
    
    -- Default Teacher Assignment (for quick reference)
    default_class_teacher_id INTEGER,      -- Default teacher for this section (optional)
    default_co_teacher_id INTEGER,         -- Default co-teacher (optional)
    
    -- Status
    status SMALLINT NOT NULL DEFAULT 1,    --0=Draft 1=Active, 2=Inactive
    
    -- Audit Fields
    description TEXT,
    display_order INT,
    created_by INTEGER,
    created_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_school_class_section 
        UNIQUE (school_id, class_id, section_code),
    CONSTRAINT valid_capacity 
        CHECK (capacity > 0 AND capacity <= 200),
    CONSTRAINT valid_current_strength 
        CHECK (current_strength >= 0 AND current_strength <= capacity),
    
    -- Foreign Keys
    CONSTRAINT fk_sections_class
        FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_sections_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_sections_room
        FOREIGN KEY (room_id)
        REFERENCES rooms(id)
        ON DELETE SET NULL,
    
  
    
    
    CONSTRAINT fk_sections_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    
    CONSTRAINT fk_sections_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Create indexes for sections
CREATE INDEX idx_sections_class_id ON sections(class_id);
CREATE INDEX idx_sections_school_id ON sections(school_id);
CREATE INDEX idx_sections_status ON sections(status);
CREATE INDEX idx_sections_room_id ON sections(room_id);
CREATE INDEX idx_sections_default_teacher ON sections(default_class_teacher_id);


-- for maintaining class sections academic year wise for history

DROP TABLE IF EXISTS academic_year_class_section_history CASCADE;

CREATE TABLE academic_year_class_section_history (
    id SERIAL PRIMARY KEY,
    
    -- School & Form Information
    form_id BIGINT NOT NULL DEFAULT 5,
    school_id BIGINT NOT NULL,
    
    -- Academic Year Reference (for historical tracking)
    academic_year_id BIGINT NOT NULL,      -- References academic_years table
    
    -- Class & Section References
    class_id BIGINT NOT NULL,
    section_id BIGINT NOT NULL,            -- Changed to NOT NULL
    
    -- For schools without sections, use a default section
    -- Create a default section 'DEFAULT' or 'NOSEC' for such cases
    
    -- Academic Year Specific Information
    -- class_teacher_id BIGINT,            -- Removed - teachers table not ready
    -- co_teacher_id BIGINT,               -- Removed - teachers table not ready
    room_id BIGINT,
    
    -- Capacity & Strength for this academic year
    capacity INT,
    total_students INT DEFAULT 0,
    boy_students INT DEFAULT 0,
    girl_students INT DEFAULT 0,
    
    -- Academic Session Dates (class-section specific)
    session_start_date DATE,
    session_end_date DATE,
    
    -- Status & Flags
    is_active BOOLEAN DEFAULT TRUE,
    status SMALLINT NOT NULL DEFAULT 1,    -- 1=Active, 2=Inactive, 3=Completed
    
    -- Additional Info
    notes TEXT,
    
    -- Audit Fields
    created_by INTEGER,
    created_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_year_class_section 
        UNIQUE (academic_year_id, class_id, section_id),
    CONSTRAINT valid_student_counts 
        CHECK (total_students >= 0 AND boy_students >= 0 AND girl_students >= 0),
    CONSTRAINT valid_capacity 
        CHECK (capacity IS NULL OR capacity > 0),
    CONSTRAINT valid_dates 
        CHECK (session_start_date IS NULL OR session_end_date IS NULL OR session_start_date < session_end_date),
    
    -- Foreign Keys
    CONSTRAINT fk_class_section_history_form_status
        FOREIGN KEY (form_id, status)
        REFERENCES form_status_master(form_id, status_id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_class_section_history_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_class_section_history_academic_year
        FOREIGN KEY (academic_year_id)
        REFERENCES academic_years(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_class_section_history_class
        FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_class_section_history_section
        FOREIGN KEY (section_id)
        REFERENCES sections(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_class_section_history_room
        FOREIGN KEY (room_id)
        REFERENCES rooms(id)
        ON DELETE SET NULL,
    
    CONSTRAINT fk_class_section_history_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    
    CONSTRAINT fk_class_section_history_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_class_section_history_school_id ON academic_year_class_section_history(school_id);
CREATE INDEX idx_class_section_history_academic_year ON academic_year_class_section_history(academic_year_id);
CREATE INDEX idx_class_section_history_class_id ON academic_year_class_section_history(class_id);
CREATE INDEX idx_class_section_history_section_id ON academic_year_class_section_history(section_id);
CREATE INDEX idx_class_section_history_status ON academic_year_class_section_history(status);
CREATE INDEX idx_class_section_history_is_active ON academic_year_class_section_history(is_active);
CREATE INDEX idx_class_section_history_room ON academic_year_class_section_history(room_id);
CREATE INDEX idx_class_section_history_year_class ON academic_year_class_section_history(academic_year_id, class_id);
CREATE INDEX idx_class_section_history_school_year ON academic_year_class_section_history(school_id, academic_year_id);