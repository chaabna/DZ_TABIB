-- DZ-Tabib: Medical Specialist Directory Database
-- Comprehensive Normalized Database Schema with Authentication

-- Database Creation
CREATE DATABASE IF NOT EXISTS dz_tabib_medical;
USE dz_tabib_medical;

-- 1. Users Table (Centralized Authentication)
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    account_type ENUM('patient', 'doctor', 'admin') NOT NULL,
    is_suspended BOOLEAN DEFAULT FALSE,
    suspension_reason TEXT,
    suspended_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Specialties Table
CREATE TABLE Specialties (
    specialty_id INT PRIMARY KEY AUTO_INCREMENT,
    specialty_name VARCHAR(100) NOT NULL UNIQUE,
    specialty_description TEXT
);

-- 3. Languages Table
CREATE TABLE Languages (
    language_id INT PRIMARY KEY AUTO_INCREMENT,
    language_name VARCHAR(50) NOT NULL UNIQUE,
    language_code VARCHAR(5)
);

-- 4. Provinces Table
CREATE TABLE Provinces (
    province_id INT PRIMARY KEY AUTO_INCREMENT,
    province_name VARCHAR(100) NOT NULL UNIQUE,
    province_code VARCHAR(10)
);

-- 5. Addresses Table
CREATE TABLE Addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    street_address VARCHAR(255) NOT NULL,
    additional_details VARCHAR(100),
    province_id INT NOT NULL,
    FOREIGN KEY (province_id) REFERENCES Provinces(province_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Consultation Types Table
CREATE TABLE ConsultationTypes (
    consultation_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    type_description TEXT
);

-- 7. Mutuelles (Insurance) Table
CREATE TABLE Mutuelles (
    mutuelle_id INT PRIMARY KEY AUTO_INCREMENT,
    mutuelle_name VARCHAR(100) NOT NULL UNIQUE,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20)
);

-- 8. Doctors Table (Modified to link with Users)
CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    specialty_id INT NOT NULL,
    phone VARCHAR(20),
    max_appointments_per_day INT DEFAULT 10 CHECK (max_appointments_per_day > 0),
    experience_years INT CHECK (experience_years >= 0),
    education_background TEXT,
    professional_statement TEXT,
    profile_image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES Specialties(specialty_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 9. Doctor-Address Mapping
CREATE TABLE DoctorAddresses (
    doctor_id INT,
    address_id INT,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (doctor_id, address_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 10. Doctor-Language Mapping
CREATE TABLE DoctorLanguages (
    doctor_id INT,
    language_id INT,
    PRIMARY KEY (doctor_id, language_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 11. Doctor-Mutuelle Mapping
CREATE TABLE DoctorMutuelles (
    doctor_id INT,
    mutuelle_id INT,
    PRIMARY KEY (doctor_id, mutuelle_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (mutuelle_id) REFERENCES Mutuelles(mutuelle_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 12. Doctor-Consultation Type Mapping
CREATE TABLE DoctorConsultationTypes (
    doctor_id INT,
    consultation_type_id INT,
    hourly_rate DECIMAL(10, 2),
    consultation_duration INT, -- in minutes
    PRIMARY KEY (doctor_id, consultation_type_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (consultation_type_id) REFERENCES ConsultationTypes(consultation_type_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 13. Patients Table (Modified to link with Users)
CREATE TABLE Patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_image_url VARCHAR(255),
    gender ENUM('M', 'F', 'Other', 'Non-Binary'),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 14. Appointments Table
CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    consultation_type_id INT NOT NULL,
    status ENUM('Confirmé', 'En attente', 'Annulé', 'Terminé') DEFAULT 'En attente',
    notes TEXT,
    medical_certificate_required BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (consultation_type_id) REFERENCES ConsultationTypes(consultation_type_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 15. Reviews Table
CREATE TABLE Reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    rating DECIMAL(2, 1) CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_consultation BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 16. Doctor Working Hours
CREATE TABLE DoctorWorkingHours (
    working_hours_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    day_of_week ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche') NOT NULL,
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 17. Admins Table
CREATE TABLE Admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('SuperAdmin', 'ContentModerator', 'UserManager', 'SystemAdmin') NOT NULL,
    contact_phone VARCHAR(20),
    hire_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 18. AdminLogs Table
CREATE TABLE AdminLogs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action_type ENUM('ACCOUNT_SUSPENSION', 'ACCOUNT_UNSUSPENSION') NOT NULL,
    affected_user_id INT NOT NULL,
    action_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (affected_user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Performance Optimization Indexes
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_doctor_specialty ON Doctors(specialty_id);
CREATE INDEX idx_doctor_address ON DoctorAddresses(doctor_id, address_id);
CREATE INDEX idx_appointment_doctor ON Appointments(doctor_id);
CREATE INDEX idx_appointment_patient ON Appointments(patient_id);
CREATE INDEX idx_appointment_date ON Appointments(appointment_date);
CREATE INDEX idx_appointment_status ON Appointments(status);
CREATE INDEX idx_review_doctor ON Reviews(doctor_id);
CREATE INDEX idx_review_rating ON Reviews(rating);
CREATE INDEX idx_review_date ON Reviews(review_date);
CREATE INDEX idx_working_hours_day ON DoctorWorkingHours(day_of_week);

-- Stored Procedure for Advanced Doctor Search
DELIMITER //
CREATE OR REPLACE PROCEDURE SearchDoctors(
    IN p_specialty_id INT,
    IN p_mutuelle_id INT,
    IN p_province_id INT,
    IN p_consultation_type_id INT,
    IN p_language_id INT
)
BEGIN
    SELECT DISTINCT d.*
    FROM Doctors d
    LEFT JOIN DoctorAddresses da ON d.doctor_id = da.doctor_id
    LEFT JOIN Addresses a ON da.address_id = a.address_id
    LEFT JOIN DoctorMutuelles dm ON d.doctor_id = dm.doctor_id
    LEFT JOIN DoctorLanguages dl ON d.doctor_id = dl.doctor_id
    LEFT JOIN DoctorConsultationTypes dct ON d.doctor_id = dct.doctor_id
    WHERE 
        (p_specialty_id IS NULL OR d.specialty_id = p_specialty_id)
        AND (p_mutuelle_id IS NULL OR dm.mutuelle_id = p_mutuelle_id)
        AND (p_province_id IS NULL OR a.province_id = p_province_id)
        AND (p_consultation_type_id IS NULL OR dct.consultation_type_id = p_consultation_type_id)
        AND (p_language_id IS NULL OR dl.language_id = p_language_id);
END //

-- Stored Procedure for User Registration (Patient)
CREATE PROCEDURE RegisterPatient(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_date_of_birth DATE,
    IN p_gender ENUM('M', 'F', 'Other', 'Non-Binary')
)
BEGIN
    DECLARE new_user_id INT;
    
    -- Insert into Users table
    INSERT INTO Users (
        username, 
        email, 
        password_hash, 
        account_type
    ) VALUES (
        p_username, 
        p_email, 
        p_password_hash, 
        'patient'
    );
    
    -- Get the newly created user ID
    SET new_user_id = LAST_INSERT_ID();
    
    -- Insert into Patients table
    INSERT INTO Patients (
        user_id,
        first_name, 
        last_name, 
        date_of_birth, 
        gender
    ) VALUES (
        new_user_id,
        p_first_name, 
        p_last_name, 
        p_date_of_birth, 
        p_gender
    );
    
    -- Return the new user ID
    SELECT new_user_id AS user_id;
END //

-- Stored Procedure for User Registration (Admin)
CREATE PROCEDURE RegisterAdmin(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_role ENUM('SuperAdmin', 'ContentModerator', 'UserManager', 'SystemAdmin')
)
BEGIN
    DECLARE new_user_id INT;
    
    -- Insert into Users table
    INSERT INTO Users (
        username, 
        email, 
        password_hash, 
        account_type
    ) VALUES (
        p_username, 
        p_email, 
        p_password_hash, 
        'admin'
    );
    
    -- Get the newly created user ID
    SET new_user_id = LAST_INSERT_ID();
    
    -- Insert into Admins table
    INSERT INTO Admins (
        user_id,
        first_name, 
        last_name, 
        role
    ) VALUES (
        new_user_id,
        p_first_name, 
        p_last_name, 
        p_role
    );
    
    -- Return the new user ID
    SELECT new_user_id AS user_id;
END //

-- Stored Procedure for User Registration (Doctor)
CREATE PROCEDURE RegisterDoctor(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_registration_number VARCHAR(50),
    IN p_specialty_id INT,
    IN p_experience_years INT,
    IN p_professional_statement TEXT
)
BEGIN
    DECLARE new_user_id INT;
    
    -- Insert into Users table
    INSERT INTO Users (
        username, 
        email, 
        password_hash, 
        account_type
    ) VALUES (
        p_username, 
        p_email, 
        p_password_hash, 
        'doctor'
    );
    
    -- Get the newly created user ID
    SET new_user_id = LAST_INSERT_ID();
    
    -- Insert into Doctors table
    INSERT INTO Doctors (
        user_id,
        first_name, 
        last_name, 
        registration_number,
        specialty_id,
        experience_years,
        professional_statement
    ) VALUES (
        new_user_id,
        p_first_name, 
        p_last_name, 
        p_registration_number,
        p_specialty_id,
        p_experience_years,
        p_professional_statement
    );
    
    -- Return the new user ID
    SELECT new_user_id AS user_id;
END //

-- Stored Procedure for User Login
CREATE PROCEDURE UserLogin(
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE login_user_id INT;
    DECLARE login_account_type ENUM('patient', 'doctor', 'admin');
    
    -- Attempt to find the user
    SELECT user_id, account_type INTO login_user_id, login_account_type
    FROM Users
    WHERE email = p_email AND password_hash = p_password_hash;
    
    -- Return the user ID and account type
    SELECT login_user_id AS user_id, login_account_type AS account_type;
END //

DELIMITER ;

-- Sample Data Insertion
-- Provinces
INSERT INTO Provinces (province_name, province_code) VALUES 
('Alger', '16'),
('Oran', '31'),
('Constantine', '25');

-- Languages
INSERT INTO Languages (language_name, language_code) VALUES 
('Français', 'fr'),
('Arabe', 'ar'),
('Anglais', 'en');

-- Specialties
INSERT INTO Specialties (specialty_name, specialty_description) VALUES 
('Cardiologie', 'Spécialiste des maladies du cœur'),
('Pédiatrie', 'Médecine des enfants et adolescents'),
('Dermatologie', 'Spécialiste des maladies de la peau');

-- Consultation Types
INSERT INTO ConsultationTypes (type_name, type_description) VALUES 
('Présentiel', 'Consultation en personne dans le cabinet médical'),
('Téléconsultation', 'Consultation médicale à distance');

-- Mutuelles
INSERT INTO Mutuelles (mutuelle_name, contact_email, contact_phone) VALUES 
('CNAS', 'contact@cnas.dz', '+213 21 XX XX XX'),
('CASNOS', 'contact@casnos.dz', '+213 21 YY YY YY');