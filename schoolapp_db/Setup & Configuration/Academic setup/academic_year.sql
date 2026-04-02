DROP TABLE IF EXISTS academic_years CASCADE;

CREATE TABLE academic_years (
    id SERIAL PRIMARY KEY,
    form_id BIGINT NOT NULL DEFAULT 5,
    school_id BIGINT NOT NULL,
    year_code CHAR(4),
    year_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status_code SMALLINT NOT NULL,
    created_by INTEGER,
    created_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_dt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_date_range CHECK (end_date > start_date),
    CONSTRAINT unique_school_year_name UNIQUE (school_id, year_name),

    CONSTRAINT fk_academic_years_form_status
        FOREIGN KEY (form_id, status_code)
        REFERENCES form_status_master(form_id, status_code)
        ON DELETE RESTRICT,
    CONSTRAINT fk_academic_years_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_academic_years_school_id ON academic_years(school_id);
CREATE INDEX idx_academic_years_status_code ON academic_years(status_code);
CREATE INDEX idx_academic_years_is_current ON academic_years(is_current);
CREATE INDEX idx_academic_years_dates ON academic_years(start_date, end_date);