-- Quick MySQL Workbench Queries
-- Run these in MySQL Workbench to test and view your data

-- Test connection
SELECT VERSION();

-- Show all databases
SHOW DATABASES;

-- Use the campus_hire database
USE campus_hire;

-- Show all tables
SHOW TABLES;

-- View users
SELECT * FROM users;

-- View jobs
SELECT * FROM jobs;

-- View job skills (if using ElementCollection)
SELECT j.title, js.skill
FROM jobs j
LEFT JOIN job_skills js ON j.id = js.job_id;

-- View applications
SELECT * FROM applications;

-- View placements
SELECT * FROM placements;

-- Count records in each table
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'Applications', COUNT(*) FROM applications
UNION ALL
SELECT 'Placements', COUNT(*) FROM placements;