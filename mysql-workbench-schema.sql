-- CampusHire Database Schema
-- Run these scripts in MySQL Workbench to create the database and tables

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS campus_hire;
USE campus_hire;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    branch VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME(6),
    avatar VARCHAR(512),
    is_active TINYINT DEFAULT 1
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    salary VARCHAR(100),
    location VARCHAR(255),
    description TEXT,
    skills TEXT,
    posted DATE,
    deadline DATE,
    applicants INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    logo VARCHAR(512)
);

-- Job skills table (for the @ElementCollection)
CREATE TABLE IF NOT EXISTS job_skills (
    job_id BIGINT NOT NULL,
    skill VARCHAR(255),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    job_id BIGINT,
    status VARCHAR(50),
    date DATE,
    resume VARCHAR(255),
    cover_letter TEXT
);

-- Placements table
CREATE TABLE IF NOT EXISTS placements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(255),
    company_name VARCHAR(255),
    position VARCHAR(255),
    salary VARCHAR(255),
    date DATE
);

-- Sample data (optional - Spring Boot DataInitializer will add this)
INSERT IGNORE INTO users (name, email, phone, branch, role, password_hash, created_at, avatar) VALUES
('Aisha Khan', 'aisha.khan@example.com', '+91 98765 43210', 'Computer Science', 'student', 'secret', NOW(), 'https://via.placeholder.com/150'),
('Ramesh Patel', 'ramesh.patel@example.com', '+91 91234 56789', 'Information Technology', 'student', 'secret', NOW(), 'https://via.placeholder.com/150'),
('Campus Admin', 'admin@campushire.com', NULL, NULL, 'admin', 'secret', NOW(), 'https://via.placeholder.com/150');

INSERT IGNORE INTO jobs (title, company, salary, location, description, skills, posted, deadline, applicants, status, logo) VALUES
('Senior Frontend Developer', 'Tech Corp', '12-15 LPA', 'Bangalore', 'Looking for experienced React developers with strong TypeScript knowledge.', 'React,TypeScript,Node.js', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 25 DAY), 45, 'active', 'https://via.placeholder.com/100/2563eb/ffffff?text=TechCorp'),
('Full Stack Developer', 'CloudNine', '10-12 LPA', 'Pune', 'Join our team to build scalable cloud applications.', 'React,Node.js,MongoDB,AWS', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 23 DAY), 32, 'active', 'https://via.placeholder.com/100/f59e0b/ffffff?text=CloudNine');

INSERT IGNORE INTO applications (student_id, job_id, status, date, resume, cover_letter) VALUES
(1, 1, 'shortlisted', CURDATE(), 'resume-aisha.pdf', 'Excited to apply for this role.');

INSERT IGNORE INTO placements (student_name, company_name, position, salary, date) VALUES
('Aisha Khan', 'Tech Corp', 'Senior Developer', '14 LPA', DATE_SUB(CURDATE(), INTERVAL 3 DAY));