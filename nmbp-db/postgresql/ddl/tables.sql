-- =============================================
-- RBAC/UBAC Module - PostgreSQL DDL
-- =============================================

-- Table: m_roles
CREATE TABLE m_roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    role_description VARCHAR(255),
    level VARCHAR(50),
    status SMALLINT NOT NULL DEFAULT 1,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: m_permissions
CREATE TABLE m_permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) NOT NULL
);

-- Table: m_menus
CREATE TABLE m_menus (
    menu_id SERIAL PRIMARY KEY,
    menu_name VARCHAR(100) NOT NULL,
    menu_description VARCHAR(255),
    status SMALLINT NOT NULL DEFAULT 1,
    menu_order INT,
    route_url VARCHAR(255),
    icon_class VARCHAR(100),
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: m_users
CREATE TABLE m_users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    mobile_number BIGINT,
    email_id VARCHAR(255),
    role_id INT REFERENCES m_roles(role_id),
    state_id INT REFERENCES m_states(state_id),
    district_id INT REFERENCES m_districts(district_id),
    dob DATE,
    gender SMALLINT,
    password VARCHAR(255),
    password_last_updated TIMESTAMP,
    invalid_attempts INT DEFAULT 0,
    status SMALLINT NOT NULL DEFAULT 1,
    last_logged_in TIMESTAMP,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    profile_pic_url VARCHAR(500)
);

-- Table: access_control
CREATE TABLE access_control (
    role_id INT REFERENCES m_roles(role_id),
    menu_id INT REFERENCES m_menus(menu_id),
    permission_id INT REFERENCES m_permissions(permission_id),
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: password_policies
CREATE TABLE password_policies (
    id SERIAL PRIMARY KEY,
    password_expiry INT,
    password_history INT,
    minimum_password_length INT,
    complexity SMALLINT,
    alphabetical SMALLINT,
    numeric SMALLINT,
    special_characters SMALLINT,
    allowed_special_characters VARCHAR(50),
    maximum_invalid_attempts INT,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: m_countries
CREATE TABLE m_countries (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    country_code VARCHAR(10),
    dial_code VARCHAR(10)
);

CREATE table m_states (
state_id SERIAL PRIMARY KEY,
state_name VARCHAR(100) NOT NULL UNIQUE,
state_type VARCHAR(100) NOT NULL CHECK (state_type IN ('STATE', 'UNION_TERRITORY')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE m_districts (
    district_id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL,
    state_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_state
        FOREIGN KEY (state_id)
        REFERENCES states(state_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
    CONSTRAINT unique_district_per_state
        UNIQUE (district_name, state_id)
);


CREATE TABLE m_activities (
    activity_id SERIAL PRIMARY KEY,
    activity_name VARCHAR(500) NOT NULL,
    activity_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);


