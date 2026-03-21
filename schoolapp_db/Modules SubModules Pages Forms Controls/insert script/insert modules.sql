-- MODULES (22 modules as per navigation)
INSERT INTO modules (module_code, module_name, description, display_order, status, created_by, created_dt) VALUES
('system_setup', 'System Setup & Configuration', 'School configuration, master data and academic setup', 1, 1, 1, NOW()),
('administration', 'Administration & Security', 'User management, roles, permissions and security', 2, 1, 1, NOW()),
('dashboard', 'Dashboard', 'Role-based dashboards and key metrics', 3, 1, 1, NOW()),
('academic', 'Academic Management', 'Curriculum, timetable, homework and progress', 4, 1, 1, NOW()),
('student', 'Student Management', 'Student records, guardians and ID management', 5, 1, 1, NOW()),
('admission', 'Admission Management', 'Inquiry to enrollment process', 6, 1, 1, NOW()),
('staff', 'Staff Management', 'Staff records, recruitment and onboarding', 7, 1, 1, NOW()),
('hr_payroll', 'HR & Payroll', 'Staff attendance, leave, payroll and performance', 8, 1, 1, NOW()),
('attendance', 'Attendance Management', 'Student and staff attendance with integrations', 9, 1, 1, NOW()),
('examination', 'Examination Management', 'Exam setup, scheduling, marks and results', 10, 1, 1, NOW()),
('fee', 'Fee Management', 'Fee structure, collection, concessions and dues', 11, 1, 1, NOW()),
('accounts', 'Accounts & Finance', 'Chart of accounts, expenses, income and reports', 12, 1, 1, NOW()),
('transport', 'Transport Management', 'Fleet, routes, trips and maintenance', 13, 1, 1, NOW()),
('library', 'Library Management', 'Catalog, circulation, members and fines', 14, 1, 1, NOW()),
('inventory_purchase', 'Inventory & Purchase', 'Stock, purchase, suppliers and issues', 15, 1, 1, NOW()),
('hostel', 'Hostel Management', 'Rooms, allocation, mess and fees', 16, 1, 1, NOW()),
('communication', 'Communication & Notification', 'Notices, SMS, email and push notifications', 17, 1, 1, NOW()),
('visitor_gate', 'Visitor & Gate Management', 'Gate entry/exit and visitor tracking', 18, 1, 1, NOW()),
('grievance', 'Grievance & Helpdesk', 'Complaints, discipline and support tickets', 19, 1, 1, NOW()),
('event', 'Event Management', 'Event planning, venue and registration', 20, 1, 1, NOW()),
('reports', 'Reports & Analytics', 'All reports and analytics dashboards', 21, 1, 1, NOW()),
('integrations', 'Integrations', 'Payment, SMS, email and API integrations', 22, 1, 1, NOW());


select *from modules