CREATE TABLE school_addresses
(
    id BIGSERIAL PRIMARY KEY,

    address_line1 VARCHAR(150),
    address_line2 VARCHAR(150),
    landmark      VARCHAR(100),

    city          VARCHAR(80),
    district      VARCHAR(80),
    state         VARCHAR(80),
    country       VARCHAR(50) DEFAULT 'India',

    pincode       CHAR(6),

    latitude      DECIMAL(10,8),
    longitude     DECIMAL(11,8),
    created_by BIGINT,
    created_dt TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_school_address_city
ON school_addresses(city);

CREATE INDEX idx_school_address_pincode
ON school_addresses(pincode);


INSERT INTO school_addresses
(
address_line1,
city,
state,
country,
pincode
)
VALUES
(
'New Friends Colony',
'New Delhi',
'Delhi',
'India',
'110025'
);


INSERT INTO school_addresses
(
address_line1,
city,
district,
state,
country,
pincode
)
VALUES
(
'Eksal Village, Dahej',
'Bharuch',
'Bharuch',
'Gujarat',
'India',
'392130'
);