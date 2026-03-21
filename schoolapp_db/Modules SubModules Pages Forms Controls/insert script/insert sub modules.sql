-- SUB-MODULES for each module
-- First, get module IDs (assuming they are inserted in order)
-- SYSTEM SETUP (module_id = 1)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(1, 'institution_profile', 'Institution Profile', 'School details, contact, branding', 1, 1, 1, NOW()),
(1, 'academic_setup', 'Academic Setup', 'Academic years, class, section, subject', 2, 1, 1, NOW()),
(1, 'master_data', 'Master Data', 'Master types, lookup values, numbering series', 3, 1, 1, NOW()),
(1, 'system_config', 'System Configuration', 'General, email, SMS, payment settings', 4, 1, 1, NOW()),
(1, 'backup_restore', 'Backup & Restore', 'Database backup, restore, archive', 5, 1, 1, NOW());

-- ADMINISTRATION (module_id = 2)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(2, 'user_management', 'User Management', 'Users, roles, permissions', 1, 1, 1, NOW()),
(2, 'authentication', 'Authentication', 'Login, registration, password', 2, 1, 1, NOW()),
(2, 'security', 'Security', 'Login logs, sessions, audit', 3, 1, 1, NOW()),
(2, 'system_health', 'System Health', 'Performance, storage, monitoring', 4, 1, 1, NOW());

-- DASHBOARD (module_id = 3)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(3, 'admin_dashboard', 'Admin Dashboard', 'Executive summary, metrics, tasks', 1, 1, 1, NOW()),
(3, 'teacher_dashboard', 'Teacher Dashboard', 'Classes, schedule, pending work', 2, 1, 1, NOW()),
(3, 'student_dashboard', 'Student Dashboard', 'Profile, attendance, fees, exams', 3, 1, 1, NOW()),
(3, 'parent_dashboard', 'Parent Dashboard', 'Ward details, attendance, fees', 4, 1, 1, NOW()),
(3, 'accountant_dashboard', 'Accountant Dashboard', 'Collection, dues, expenses', 5, 1, 1, NOW()),
(3, 'security_dashboard', 'Security Dashboard', 'Visitors, gate activity', 6, 1, 1, NOW());

-- ACADEMIC (module_id = 4)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(4, 'curriculum', 'Curriculum', 'Syllabus, lesson plans, materials', 1, 1, 1, NOW()),
(4, 'timetable', 'Timetable', 'Master timetable, schedules', 2, 1, 1, NOW()),
(4, 'homework', 'Homework', 'Assign, submissions, grading', 3, 1, 1, NOW()),
(4, 'academic_progress', 'Academic Progress', 'Progress tracking, promotion', 4, 1, 1, NOW());

-- STUDENT (module_id = 5)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(5, 'student_records', 'Student Records', 'Details, documents, achievements', 1, 1, 1, NOW()),
(5, 'guardian_management', 'Guardian Management', 'Parent details, contacts', 2, 1, 1, NOW()),
(5, 'student_id', 'Student ID', 'ID card, roll number, login', 3, 1, 1, NOW());

-- ADMISSION (module_id = 6)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(6, 'inquiry', 'Inquiry Management', 'New inquiries, follow-ups', 1, 1, 1, NOW()),
(6, 'application', 'Application Processing', 'Applications, review, verification', 2, 1, 1, NOW()),
(6, 'entrance_test', 'Entrance Test', 'Scheduling, hall tickets, scores', 3, 1, 1, NOW()),
(6, 'interview', 'Interview Management', 'Scheduling, panel, feedback', 4, 1, 1, NOW()),
(6, 'merit_list', 'Merit List', 'Generation, waitlist, selection', 5, 1, 1, NOW()),
(6, 'enrollment', 'Enrollment', 'Offer letters, fee, documents', 6, 1, 1, NOW());

-- STAFF (module_id = 7)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(7, 'staff_records', 'Staff Records', 'Details, documents, contracts', 1, 1, 1, NOW()),
(7, 'recruitment', 'Recruitment', 'Job postings, applications', 2, 1, 1, NOW()),
(7, 'onboarding_separation', 'Onboarding & Separation', 'Induction, resignation, exit', 3, 1, 1, NOW()),
(7, 'staff_id', 'Staff ID', 'ID card, employee code', 4, 1, 1, NOW());

-- HR & PAYROLL (module_id = 8)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(8, 'staff_attendance', 'Staff Attendance', 'Mark attendance, corrections', 1, 1, 1, NOW()),
(8, 'leave', 'Leave Management', 'Types, entitlement, apply/approve', 2, 1, 1, NOW()),
(8, 'payroll', 'Payroll', 'Structure, processing, disbursement', 3, 1, 1, NOW()),
(8, 'performance', 'Performance', 'Goals, appraisals, feedback', 4, 1, 1, NOW()),
(8, 'training', 'Training', 'Programs, nominations, certifications', 5, 1, 1, NOW()),
(8, 'loans_advances', 'Loans & Advances', 'Applications, approvals, repayments', 6, 1, 1, NOW());

-- ATTENDANCE (module_id = 9)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(9, 'student_attendance', 'Student Attendance', 'Daily, period-wise, bulk', 1, 1, 1, NOW()),
(9, 'staff_attendance', 'Staff Attendance', 'Daily, shift-wise', 2, 1, 1, NOW()),
(9, 'biometric_rfid', 'Biometric/RFID Integration', 'Devices, cards, sync', 3, 1, 1, NOW()),
(9, 'mobile_attendance', 'Mobile Attendance', 'Geo-tagging, selfie, offline', 4, 1, 1, NOW()),
(9, 'attendance_reports', 'Attendance Reports', 'Summaries, analytics', 5, 1, 1, NOW());

-- EXAMINATION (module_id = 10)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(10, 'exam_setup', 'Exam Setup', 'Types, details, grading', 1, 1, 1, NOW()),
(10, 'exam_schedule', 'Exam Schedule', 'Timetable, rooms, invigilation', 2, 1, 1, NOW()),
(10, 'hall_tickets', 'Hall Tickets', 'Generate, print, download', 3, 1, 1, NOW()),
(10, 'marks_entry', 'Marks Entry', 'Enter marks, verification', 4, 1, 1, NOW()),
(10, 'results', 'Results', 'Calculate, ranks, publish', 5, 1, 1, NOW()),
(10, 'report_cards', 'Report Cards', 'Generate, print, digital', 6, 1, 1, NOW());

-- FEE (module_id = 11)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(11, 'fee_structure', 'Fee Structure', 'Heads, class-wise, installments', 1, 1, 1, NOW()),
(11, 'fee_collection', 'Fee Collection', 'Counter, online, receipts', 2, 1, 1, NOW()),
(11, 'concessions', 'Concessions & Scholarships', 'Types, discounts, approvals', 3, 1, 1, NOW()),
(11, 'fee_dues', 'Fee Dues & Recovery', 'Due list, reminders', 4, 1, 1, NOW()),
(11, 'refunds', 'Refunds', 'Requests, approvals, processing', 5, 1, 1, NOW()),
(11, 'fee_reports', 'Fee Reports', 'Collection, dues, concession', 6, 1, 1, NOW());

-- ACCOUNTS (module_id = 12)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(12, 'chart_of_accounts', 'Chart of Accounts', 'Groups, ledgers, cost centers', 1, 1, 1, NOW()),
(12, 'journal_entries', 'Journal Entries', 'Create, approve, reports', 2, 1, 1, NOW()),
(12, 'expenses', 'Expenses', 'Heads, entry, approvals', 3, 1, 1, NOW()),
(12, 'income', 'Income', 'Heads, entry, reports', 4, 1, 1, NOW()),
(12, 'banking', 'Banking', 'Accounts, reconciliation', 5, 1, 1, NOW()),
(12, 'budget', 'Budget', 'Planning, allocation, variance', 6, 1, 1, NOW()),
(12, 'assets', 'Assets', 'Register, depreciation', 7, 1, 1, NOW()),
(12, 'financial_reports', 'Financial Reports', 'Trial balance, statements', 8, 1, 1, NOW());

-- TRANSPORT (module_id = 13)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(13, 'fleet', 'Fleet Management', 'Vehicles, documents, insurance', 1, 1, 1, NOW()),
(13, 'route_stop', 'Route & Stop Management', 'Routes, stops, maps', 2, 1, 1, NOW()),
(13, 'allocation', 'Allocation', 'Route, stop allocation', 3, 1, 1, NOW()),
(13, 'trip', 'Trip Management', 'Daily trips, tracking', 4, 1, 1, NOW()),
(13, 'driver', 'Driver Management', 'Drivers, license, duty', 5, 1, 1, NOW()),
(13, 'maintenance', 'Maintenance', 'Service, repairs, fuel', 6, 1, 1, NOW()),
(13, 'transport_reports', 'Transport Reports', 'Vehicle, route, expense', 7, 1, 1, NOW());

-- LIBRARY (module_id = 14)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(14, 'catalog', 'Catalog Management', 'Books, categories, search', 1, 1, 1, NOW()),
(14, 'circulation', 'Circulation', 'Issue, return, renew', 2, 1, 1, NOW()),
(14, 'members', 'Member Management', 'Students, staff, cards', 3, 1, 1, NOW()),
(14, 'fines', 'Fine Management', 'Rules, collect, history', 4, 1, 1, NOW()),
(14, 'acquisition', 'Acquisition', 'Purchase, vendors', 5, 1, 1, NOW()),
(14, 'library_reports', 'Library Reports', 'Circulation, member, fine', 6, 1, 1, NOW());

-- INVENTORY & PURCHASE (module_id = 15)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(15, 'item_master', 'Item Master', 'Categories, items', 1, 1, 1, NOW()),
(15, 'stock', 'Stock Management', 'Current stock, movements, alerts', 2, 1, 1, NOW()),
(15, 'purchase', 'Purchase Management', 'Indents, POs, GRN', 3, 1, 1, NOW()),
(15, 'suppliers', 'Supplier Management', 'List, details, evaluation', 4, 1, 1, NOW()),
(15, 'issue', 'Issue Management', 'Requests, issues, returns', 5, 1, 1, NOW()),
(15, 'reorder', 'Reorder Management', 'Levels, suggestions', 6, 1, 1, NOW()),
(15, 'inventory_reports', 'Inventory Reports', 'Stock, purchase, issue', 7, 1, 1, NOW());

-- HOSTEL (module_id = 16)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(16, 'hostel_setup', 'Hostel Setup', 'Hostels, details', 1, 1, 1, NOW()),
(16, 'room_bed', 'Room & Bed Management', 'Rooms, beds, status', 2, 1, 1, NOW()),
(16, 'allocation', 'Allocation', 'Room/bed allocation', 3, 1, 1, NOW()),
(16, 'mess', 'Mess Management', 'Meals, menu, attendance', 4, 1, 1, NOW()),
(16, 'hostel_staff', 'Hostel Staff', 'Wardens, caretakers', 5, 1, 1, NOW()),
(16, 'hostel_fees', 'Hostel Fees', 'Structure, collection', 6, 1, 1, NOW()),
(16, 'hostel_reports', 'Hostel Reports', 'Occupancy, fee, mess', 7, 1, 1, NOW());

-- COMMUNICATION (module_id = 17)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(17, 'notices', 'Notices & Announcements', 'Create, board, history', 1, 1, 1, NOW()),
(17, 'sms', 'SMS', 'Send, bulk, templates', 2, 1, 1, NOW()),
(17, 'email', 'Email', 'Send, bulk, templates', 3, 1, 1, NOW()),
(17, 'push_notifications', 'Push Notifications', 'Send, bulk, templates', 4, 1, 1, NOW()),
(17, 'in_app_messages', 'In-App Messages', 'Chat, history', 5, 1, 1, NOW()),
(17, 'communication_reports', 'Communication Reports', 'Delivery reports', 6, 1, 1, NOW());

-- VISITOR & GATE (module_id = 18)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(18, 'preregistration', 'Pre-registration', 'Visitor pre-registration, appointments', 1, 1, 1, NOW()),
(18, 'gate_entry', 'Gate Entry', 'Quick entry, check-in, vehicle registration', 2, 1, 1, NOW()),
(18, 'gate_out', 'Gate Out', 'Check-out, vehicle exit, badge return', 3, 1, 1, NOW()),
(18, 'in_progress_visits', 'In-Progress Visits', 'Currently inside, overdue', 4, 1, 1, NOW()),
(18, 'purpose_management', 'Purpose Management', 'Visit purposes, meeting with', 5, 1, 1, NOW()),
(18, 'blacklist', 'Blacklist Management', 'Blacklist visitors/vehicles', 6, 1, 1, NOW()),
(18, 'gate_dashboard', 'Gate Dashboard', 'Today''s count, inside', 7, 1, 1, NOW()),
(18, 'visitor_reports', 'Visitor Reports', 'Logs, analysis', 8, 1, 1, NOW());

-- GRIEVANCE (module_id = 19)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(19, 'complaints', 'Complaint Management', 'New, assigned, resolved', 1, 1, 1, NOW()),
(19, 'discipline', 'Discipline Management', 'Incidents, investigation', 2, 1, 1, NOW()),
(19, 'helpdesk', 'Helpdesk', 'Tickets, knowledge base', 3, 1, 1, NOW()),
(19, 'feedback', 'Feedback & Surveys', 'Forms, surveys, analysis', 4, 1, 1, NOW()),
(19, 'grievance_reports', 'Grievance Reports', 'Reports, resolution time', 5, 1, 1, NOW());

-- EVENT (module_id = 20)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(20, 'planning', 'Event Planning', 'List, calendar, templates', 1, 1, 1, NOW()),
(20, 'venue', 'Venue Management', 'Venues, availability', 2, 1, 1, NOW()),
(20, 'budget', 'Budget Management', 'Planning, expenses', 3, 1, 1, NOW()),
(20, 'registration', 'Registration', 'Online, participants', 4, 1, 1, NOW()),
(20, 'committee', 'Committee Management', 'Committees, members', 5, 1, 1, NOW()),
(20, 'media', 'Media Gallery', 'Photos, videos', 6, 1, 1, NOW()),
(20, 'event_reports', 'Event Reports', 'Participation, financial', 7, 1, 1, NOW());

-- REPORTS (module_id = 21)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(21, 'student_reports', 'Student Reports', 'Lists, attendance, fee', 1, 1, 1, NOW()),
(21, 'academic_reports', 'Academic Reports', 'Performance, exam', 2, 1, 1, NOW()),
(21, 'staff_reports', 'Staff Reports', 'Lists, attendance, leave', 3, 1, 1, NOW()),
(21, 'financial_reports', 'Financial Reports', 'Collection, expenses', 4, 1, 1, NOW()),
(21, 'administrative_reports', 'Administrative Reports', 'Enrollment, admission', 5, 1, 1, NOW()),
(21, 'custom_reports', 'Custom Reports', 'Builder, saved', 6, 1, 1, NOW()),
(21, 'analytics', 'Analytics', 'Trends, forecasting', 7, 1, 1, NOW());

-- INTEGRATIONS (module_id = 22)
INSERT INTO sub_modules (module_id, sub_module_code, sub_module_name, description, display_order, status, created_by, created_dt) VALUES
(22, 'payment_gateways', 'Payment Gateways', 'Configuration, logs', 1, 1, 1, NOW()),
(22, 'sms_gateways', 'SMS Gateways', 'Configuration, logs', 2, 1, 1, NOW()),
(22, 'email_gateways', 'Email Gateways', 'Configuration, logs', 3, 1, 1, NOW()),
(22, 'biometric_rfid', 'Biometric/RFID', 'Devices, sync', 4, 1, 1, NOW()),
(22, 'api_management', 'API Management', 'Keys, logs, webhooks', 5, 1, 1, NOW()),
(22, 'erp_integrations', 'ERP Integrations', 'Tally, other', 6, 1, 1, NOW());


select *from sub_modules