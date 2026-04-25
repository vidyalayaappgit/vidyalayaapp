-- DROP (safe reset)
DROP TABLE IF EXISTS academic_years CASCADE;

-- CREATE TABLE
CREATE TABLE academic_years (
id SERIAL PRIMARY KEY,


form_id BIGINT NOT NULL DEFAULT 5,
school_id BIGINT NOT NULL,

year_code VARCHAR(4),  -- FIXED (was CHAR)
year_name VARCHAR(50) NOT NULL,

start_date DATE NOT NULL,
end_date DATE NOT NULL,

is_current BOOLEAN DEFAULT FALSE,

status SMALLINT NOT NULL,  --1 for Fresh, 2 for Authorised

created_by INTEGER,
created_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

updated_by INTEGER,
updated_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

----------------------------------------------------------------
-- VALIDATIONS
----------------------------------------------------------------
CONSTRAINT valid_date_range CHECK (end_date > start_date),

----------------------------------------------------------------
-- UNIQUE CONSTRAINTS (BUSINESS RULES)
----------------------------------------------------------------
CONSTRAINT unique_school_year_name 
    UNIQUE (school_id, year_name),

CONSTRAINT unique_school_year_code 
    UNIQUE (school_id, year_code),

----------------------------------------------------------------
-- FOREIGN KEYS
----------------------------------------------------------------
CONSTRAINT fk_academic_years_form_status
	    FOREIGN KEY (form_id, status)
    REFERENCES form_status_master(form_id, status_id)
    ON DELETE RESTRICT,

CONSTRAINT fk_academic_years_school
    FOREIGN KEY (school_id)
    REFERENCES schools(id)
    ON DELETE RESTRICT

);

---

## -- INDEXES (OPTIMIZED - NO DUPLICATES)

CREATE INDEX idx_academic_years_school_id
ON academic_years(school_id);

CREATE INDEX idx_academic_years_status
ON academic_years(status);

CREATE INDEX idx_academic_years_is_current
ON academic_years(is_current);

CREATE INDEX idx_academic_years_dates
ON academic_years(start_date, end_date);

---

## -- ENSURE ONLY ONE CURRENT YEAR PER SCHOOL

CREATE UNIQUE INDEX one_current_year_per_school
ON academic_years (school_id)
WHERE is_current = TRUE;



--Academic Terms
CREATE TABLE academic_terms (
    id SERIAL PRIMARY KEY,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    term_name VARCHAR(100) NOT NULL, -- 'Mid Term', 'Final Term', 'Quarter 1', etc.
    term_code VARCHAR(20) NOT NULL, -- 'TERM1', 'TERM2', 'TERM3'
    term_order INTEGER NOT NULL, -- 1, 2, 3 for ordering
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by BIGINT NOT NULL,
    updated_by BIGINT NOT NULL,
    created_dt TIMESTAMPTZ DEFAULT NOW(),
    updated_dt TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_term_per_year UNIQUE(academic_year_id, term_code),
    CONSTRAINT valid_term_dates CHECK (start_date <= end_date)
);

-- Indexes
CREATE INDEX idx_academic_terms_year ON academic_terms(academic_year_id);
CREATE INDEX idx_academic_terms_dates ON academic_terms(start_date, end_date);

