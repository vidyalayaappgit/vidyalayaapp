-- COMPLETE PAGES INSERT SCRIPT
-- All pages organized by sub_module_id (assuming sub_modules inserted in order from previous script)

-- ============================================
-- SYSTEM SETUP (sub_module_ids 1-5)
-- ============================================

-- Institution Profile (sub_module_id = 1)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(1, 'school_details', 'School Details', 'Manage school information', '/setup/school-details', '/api/setup/school', 1, 1, 1, NOW()),
(1, 'contact_information', 'Contact Information', 'School contact details', '/setup/contact', '/api/setup/contact', 2, 1, 1, NOW()),
(1, 'logo_branding', 'Logo & Branding', 'Upload logo and branding', '/setup/branding', '/api/setup/branding', 3, 1, 1, NOW()),
(1, 'social_media', 'Social Media Links', 'Manage social media links', '/setup/social-media', '/api/setup/social-media', 4, 1, 1, NOW());

-- Academic Setup (sub_module_id = 2)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(2, 'academic_years', 'Academic Years', 'Manage academic years', '/setup/academic-years', '/api/academic/years', 1, 1, 1, NOW()),
(2, 'class_management', 'Class Management', 'Manage classes', '/setup/classes', '/api/academic/classes', 2, 1, 1, NOW()),
(2, 'section_management', 'Section Management', 'Manage sections', '/setup/sections', '/api/academic/sections', 3, 1, 1, NOW()),
(2, 'subject_management', 'Subject Management', 'Manage subjects', '/setup/subjects', '/api/academic/subjects', 4, 1, 1, NOW());

-- Master Data (sub_module_id = 3)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(3, 'master_types', 'Master Types', 'Manage master data types', '/setup/master-types', '/api/master/types', 1, 1, 1, NOW()),
(3, 'lookup_values', 'Lookup Values', 'Manage lookup values', '/setup/lookup-values', '/api/master/lookup', 2, 1, 1, NOW()),
(3, 'numbering_series', 'Numbering Series', 'Manage numbering series', '/setup/numbering', '/api/master/numbering', 3, 1, 1, NOW()),
(3, 'document_types', 'Document Types', 'Manage document types', '/setup/document-types', '/api/master/documents', 4, 1, 1, NOW());

-- System Configuration (sub_module_id = 4)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(4, 'general_settings', 'General Settings', 'Configure general settings', '/setup/settings/general', '/api/config/general', 1, 1, 1, NOW()),
(4, 'email_settings', 'Email Settings', 'Configure email', '/setup/settings/email', '/api/config/email', 2, 1, 1, NOW()),
(4, 'sms_settings', 'SMS Settings', 'Configure SMS', '/setup/settings/sms', '/api/config/sms', 3, 1, 1, NOW()),
(4, 'payment_settings', 'Payment Settings', 'Configure payment', '/setup/settings/payment', '/api/config/payment', 4, 1, 1, NOW()),
(4, 'module_activation', 'Module Activation', 'Activate/deactivate modules', '/setup/settings/modules', '/api/config/modules', 5, 1, 1, NOW());

-- Backup & Restore (sub_module_id = 5)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(5, 'backup', 'Backup', 'Create database backup', '/admin/backup', '/api/admin/backup', 1, 1, 1, NOW()),
(5, 'restore', 'Restore', 'Restore from backup', '/admin/restore', '/api/admin/restore', 2, 1, 1, NOW()),
(5, 'archive', 'Archive', 'Manage archives', '/admin/archive', '/api/admin/archive', 3, 1, 1, NOW());

-- ============================================
-- ADMINISTRATION (sub_module_ids 6-9)
-- ============================================

-- User Management (sub_module_id = 6)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(6, 'user_list', 'User List', 'View all users', '/admin/users', '/api/admin/users', 1, 1, 1, NOW()),
(6, 'create_user', 'Create User', 'Create new user', '/admin/users/create', '/api/admin/users', 2, 1, 1, NOW()),
(6, 'edit_user', 'Edit User', 'Edit user details', '/admin/users/edit', '/api/admin/users', 3, 1, 1, NOW()),
(6, 'user_history', 'User History', 'View user activity', '/admin/users/history', '/api/admin/users/history', 4, 1, 1, NOW()),
(6, 'role_list', 'Role List', 'View all roles', '/admin/roles', '/api/admin/roles', 5, 1, 1, NOW()),
(6, 'create_role', 'Create Role', 'Create new role', '/admin/roles/create', '/api/admin/roles', 6, 1, 1, NOW()),
(6, 'edit_role', 'Edit Role', 'Edit role details', '/admin/roles/edit', '/api/admin/roles', 7, 1, 1, NOW()),
(6, 'role_assignment', 'Role Assignment', 'Assign roles to users', '/admin/role-assignment', '/api/admin/role-assignment', 8, 1, 1, NOW()),
(6, 'permission_list', 'Permission List', 'View all permissions', '/admin/permissions', '/api/admin/permissions', 9, 1, 1, NOW()),
(6, 'module_permissions', 'Module Permissions', 'Module-wise permissions', '/admin/permissions/modules', '/api/admin/permissions/modules', 10, 1, 1, NOW()),
(6, 'role_permissions', 'Role Permissions', 'Role-wise permissions', '/admin/permissions/roles', '/api/admin/permissions/roles', 11, 1, 1, NOW());

-- Authentication (sub_module_id = 7)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(7, 'login', 'Login', 'User login page', '/auth/login', '/api/auth/login', 1, 1, 1, NOW()),
(7, 'registration', 'Registration', 'User registration', '/auth/register', '/api/auth/register', 2, 1, 1, NOW()),
(7, 'password_reset', 'Password Reset', 'Reset password', '/auth/password-reset', '/api/auth/password-reset', 3, 1, 1, NOW()),
(7, 'change_password', 'Change Password', 'Change user password', '/auth/change-password', '/api/auth/change-password', 4, 1, 1, NOW());

-- Security (sub_module_id = 8)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(8, 'login_logs', 'Login Logs', 'View login history', '/admin/login-logs', '/api/admin/logs/login', 1, 1, 1, NOW()),
(8, 'active_sessions', 'Active Sessions', 'Manage active sessions', '/admin/sessions', '/api/admin/sessions', 2, 1, 1, NOW()),
(8, 'api_logs', 'API Logs', 'View API call logs', '/admin/api-logs', '/api/admin/logs/api', 3, 1, 1, NOW()),
(8, 'audit_trail', 'Audit Trail', 'System audit logs', '/admin/audit', '/api/admin/audit', 4, 1, 1, NOW());

-- System Health (sub_module_id = 9)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(9, 'performance', 'Performance', 'System performance metrics', '/admin/health/performance', '/api/admin/health/performance', 1, 1, 1, NOW()),
(9, 'storage', 'Storage', 'Storage usage', '/admin/health/storage', '/api/admin/health/storage', 2, 1, 1, NOW()),
(9, 'monitoring', 'Monitoring', 'System monitoring', '/admin/health/monitoring', '/api/admin/health/monitoring', 3, 1, 1, NOW());

-- ============================================
-- DASHBOARD (sub_module_ids 10-15)
-- ============================================

-- Admin Dashboard (sub_module_id = 10)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(10, 'executive_summary', 'Executive Summary', 'High-level overview', '/dashboard/admin/executive', '/api/dashboard/admin/executive', 1, 1, 1, NOW()),
(10, 'key_metrics', 'Key Metrics', 'Important KPIs', '/dashboard/admin/metrics', '/api/dashboard/admin/metrics', 2, 1, 1, NOW()),
(10, 'pending_tasks', 'Pending Tasks', 'Tasks requiring attention', '/dashboard/admin/tasks', '/api/dashboard/admin/tasks', 3, 1, 1, NOW()),
(10, 'system_health', 'System Health', 'System health status', '/dashboard/admin/health', '/api/dashboard/admin/health', 4, 1, 1, NOW());

-- Teacher Dashboard (sub_module_id = 11)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(11, 'my_classes', 'My Classes', 'View assigned classes', '/dashboard/teacher/classes', '/api/dashboard/teacher/classes', 1, 1, 1, NOW()),
(11, 'today_schedule', 'Today''s Schedule', 'Today''s class schedule', '/dashboard/teacher/schedule', '/api/dashboard/teacher/schedule', 2, 1, 1, NOW()),
(11, 'pending_work', 'Pending Work', 'Tasks to complete', '/dashboard/teacher/pending', '/api/dashboard/teacher/pending', 3, 1, 1, NOW()),
(11, 'student_alerts', 'Student Alerts', 'Student alerts and notifications', '/dashboard/teacher/alerts', '/api/dashboard/teacher/alerts', 4, 1, 1, NOW());

-- Student Dashboard (sub_module_id = 12)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(12, 'my_profile', 'My Profile', 'View student profile', '/dashboard/student/profile', '/api/dashboard/student/profile', 1, 1, 1, NOW()),
(12, 'attendance_overview', 'Attendance Overview', 'View attendance', '/dashboard/student/attendance', '/api/dashboard/student/attendance', 2, 1, 1, NOW()),
(12, 'fee_status', 'Fee Status', 'View fee details', '/dashboard/student/fees', '/api/dashboard/student/fees', 3, 1, 1, NOW()),
(12, 'upcoming_exams', 'Upcoming Exams', 'View exam schedule', '/dashboard/student/exams', '/api/dashboard/student/exams', 4, 1, 1, NOW());

-- Parent Dashboard (sub_module_id = 13)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(13, 'ward_profile', 'Ward Profile', 'View child profile', '/dashboard/parent/ward', '/api/dashboard/parent/ward', 1, 1, 1, NOW()),
(13, 'ward_attendance', 'Ward Attendance', 'View child attendance', '/dashboard/parent/attendance', '/api/dashboard/parent/attendance', 2, 1, 1, NOW()),
(13, 'ward_fees', 'Ward Fees', 'View child fees', '/dashboard/parent/fees', '/api/dashboard/parent/fees', 3, 1, 1, NOW()),
(13, 'school_notices', 'School Notices', 'View school notices', '/dashboard/parent/notices', '/api/dashboard/parent/notices', 4, 1, 1, NOW());

-- Accountant Dashboard (sub_module_id = 14)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(14, 'today_collection', 'Today''s Collection', 'Today''s fee collection', '/dashboard/accountant/collection', '/api/dashboard/accountant/collection', 1, 1, 1, NOW()),
(14, 'pending_dues', 'Pending Dues', 'Outstanding fees', '/dashboard/accountant/dues', '/api/dashboard/accountant/dues', 2, 1, 1, NOW()),
(14, 'expenses_today', 'Expenses Today', 'Today''s expenses', '/dashboard/accountant/expenses', '/api/dashboard/accountant/expenses', 3, 1, 1, NOW()),
(14, 'bank_balance', 'Bank Balance', 'Current bank balance', '/dashboard/accountant/bank', '/api/dashboard/accountant/bank', 4, 1, 1, NOW());

-- Security Dashboard (sub_module_id = 15)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(15, 'today_visitors', 'Today''s Visitors', 'Today''s visitor count', '/dashboard/security/visitors', '/api/dashboard/security/visitors', 1, 1, 1, NOW()),
(15, 'pending_checkouts', 'Pending Check-outs', 'Visitors to check out', '/dashboard/security/pending', '/api/dashboard/security/pending', 2, 1, 1, NOW()),
(15, 'active_entries', 'Active Entries', 'Currently inside', '/dashboard/security/active', '/api/dashboard/security/active', 3, 1, 1, NOW()),
(15, 'gate_activity', 'Gate Activity Log', 'Recent gate activity', '/dashboard/security/activity', '/api/dashboard/security/activity', 4, 1, 1, NOW());

-- ============================================
-- ACADEMIC MANAGEMENT (sub_module_ids 16-19)
-- ============================================

-- Curriculum (sub_module_id = 16)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(16, 'syllabus_planning', 'Syllabus Planning', 'Plan syllabus', '/academic/syllabus', '/api/academic/syllabus', 1, 1, 1, NOW()),
(16, 'lesson_plans', 'Lesson Plans', 'Create lesson plans', '/academic/lessons', '/api/academic/lessons', 2, 1, 1, NOW()),
(16, 'study_materials', 'Study Materials', 'Upload study materials', '/academic/materials', '/api/academic/materials', 3, 1, 1, NOW()),
(16, 'textbook_allocation', 'Textbook Allocation', 'Allocate textbooks', '/academic/textbooks', '/api/academic/textbooks', 4, 1, 1, NOW());

-- Timetable (sub_module_id = 17)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(17, 'master_timetable', 'Master Timetable', 'Create master timetable', '/academic/timetable/master', '/api/academic/timetable/master', 1, 1, 1, NOW()),
(17, 'class_schedule', 'Class Schedule', 'View class schedule', '/academic/timetable/class', '/api/academic/timetable/class', 2, 1, 1, NOW()),
(17, 'teacher_schedule', 'Teacher Schedule', 'View teacher schedule', '/academic/timetable/teacher', '/api/academic/timetable/teacher', 3, 1, 1, NOW()),
(17, 'substitutions', 'Substitutions', 'Manage substitutions', '/academic/timetable/substitutions', '/api/academic/timetable/substitutions', 4, 1, 1, NOW());

-- Homework (sub_module_id = 18)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(18, 'assign_homework', 'Assign Homework', 'Assign new homework', '/academic/homework/assign', '/api/academic/homework', 1, 1, 1, NOW()),
(18, 'submissions', 'Submissions', 'View homework submissions', '/academic/homework/submissions', '/api/academic/homework/submissions', 2, 1, 1, NOW()),
(18, 'grading', 'Grading', 'Grade homework', '/academic/homework/grading', '/api/academic/homework/grading', 3, 1, 1, NOW()),
(18, 'feedback', 'Feedback', 'Provide feedback', '/academic/homework/feedback', '/api/academic/homework/feedback', 4, 1, 1, NOW());

-- Academic Progress (sub_module_id = 19)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(19, 'progress_tracking', 'Progress Tracking', 'Track academic progress', '/academic/progress', '/api/academic/progress', 1, 1, 1, NOW()),
(19, 'remedial_classes', 'Remedial Classes', 'Manage remedial classes', '/academic/remedial', '/api/academic/remedial', 2, 1, 1, NOW()),
(19, 'class_promotion', 'Class Promotion', 'Promote students', '/academic/promotion', '/api/academic/promotion', 3, 1, 1, NOW()),
(19, 'academic_reports', 'Academic Reports', 'Generate reports', '/academic/reports', '/api/academic/reports', 4, 1, 1, NOW());

-- ============================================
-- STUDENT MANAGEMENT (sub_module_ids 20-22)
-- ============================================

-- Student Records (sub_module_id = 20)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(20, 'student_list', 'Student List', 'View all students', '/students/list', '/api/students', 1, 1, 1, NOW()),
(20, 'student_details', 'Student Details', 'Manage student information', '/students/details', '/api/students/details', 2, 1, 1, NOW()),
(20, 'student_documents', 'Student Documents', 'Manage student documents', '/students/documents', '/api/students/documents', 3, 1, 1, NOW()),
(20, 'student_achievements', 'Student Achievements', 'Track achievements', '/students/achievements', '/api/students/achievements', 4, 1, 1, NOW()),
(20, 'medical_info', 'Medical Information', 'Student medical records', '/students/medical', '/api/students/medical', 5, 1, 1, NOW()),
(20, 'previous_school', 'Previous School Info', 'Previous school details', '/students/previous-school', '/api/students/previous-school', 6, 1, 1, NOW());

-- Guardian Management (sub_module_id = 21)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(21, 'guardian_list', 'Guardian List', 'View all guardians', '/students/guardians', '/api/students/guardians', 1, 1, 1, NOW()),
(21, 'guardian_details', 'Guardian Details', 'Manage guardian information', '/students/guardians/details', '/api/students/guardians/details', 2, 1, 1, NOW()),
(21, 'emergency_contacts', 'Emergency Contacts', 'Manage emergency contacts', '/students/guardians/emergency', '/api/students/guardians/emergency', 3, 1, 1, NOW()),
(21, 'communication_preferences', 'Communication Preferences', 'Set communication preferences', '/students/guardians/communication', '/api/students/guardians/communication', 4, 1, 1, NOW());

-- Student ID (sub_module_id = 22)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(22, 'id_card_generation', 'ID Card Generation', 'Generate student ID cards', '/students/id-cards/generate', '/api/students/id-cards', 1, 1, 1, NOW()),
(22, 'roll_number_allocation', 'Roll Number Allocation', 'Allocate roll numbers', '/students/roll-numbers', '/api/students/roll-numbers', 2, 1, 1, NOW()),
(22, 'login_credentials', 'Login Credentials', 'Manage student login', '/students/credentials', '/api/students/credentials', 3, 1, 1, NOW());

-- ============================================
-- ADMISSION MANAGEMENT (sub_module_ids 23-28)
-- ============================================

-- Inquiry Management (sub_module_id = 23)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(23, 'new_inquiries', 'New Inquiries', 'View new inquiries', '/admission/inquiries/new', '/api/admission/inquiries', 1, 1, 1, NOW()),
(23, 'follow_ups', 'Follow-ups', 'Manage follow-ups', '/admission/inquiries/followup', '/api/admission/inquiries/followup', 2, 1, 1, NOW()),
(23, 'conversion_tracking', 'Conversion Tracking', 'Track inquiry conversion', '/admission/inquiries/conversion', '/api/admission/inquiries/conversion', 3, 1, 1, NOW());

-- Application Processing (sub_module_id = 24)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(24, 'online_applications', 'Online Applications', 'View applications', '/admission/applications', '/api/admission/applications', 1, 1, 1, NOW()),
(24, 'application_review', 'Application Review', 'Review applications', '/admission/applications/review', '/api/admission/applications/review', 2, 1, 1, NOW()),
(24, 'document_verification', 'Document Verification', 'Verify documents', '/admission/documents/verify', '/api/admission/documents/verify', 3, 1, 1, NOW()),
(24, 'application_status', 'Application Status', 'Update status', '/admission/applications/status', '/api/admission/applications/status', 4, 1, 1, NOW());

-- Entrance Test (sub_module_id = 25)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(25, 'test_scheduling', 'Test Scheduling', 'Schedule entrance tests', '/admission/test/schedule', '/api/admission/test/schedule', 1, 1, 1, NOW()),
(25, 'hall_tickets', 'Hall Tickets', 'Generate hall tickets', '/admission/test/halltickets', '/api/admission/test/halltickets', 2, 1, 1, NOW()),
(25, 'score_entry', 'Score Entry', 'Enter test scores', '/admission/test/scores', '/api/admission/test/scores', 3, 1, 1, NOW()),
(25, 'test_results', 'Test Results', 'Publish results', '/admission/test/results', '/api/admission/test/results', 4, 1, 1, NOW());

-- Interview Management (sub_module_id = 26)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(26, 'interview_scheduling', 'Interview Scheduling', 'Schedule interviews', '/admission/interview/schedule', '/api/admission/interview/schedule', 1, 1, 1, NOW()),
(26, 'panel_assignment', 'Panel Assignment', 'Assign interview panels', '/admission/interview/panel', '/api/admission/interview/panel', 2, 1, 1, NOW()),
(26, 'interview_feedback', 'Interview Feedback', 'Record feedback', '/admission/interview/feedback', '/api/admission/interview/feedback', 3, 1, 1, NOW());

-- Merit List (sub_module_id = 27)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(27, 'merit_generation', 'Merit Generation', 'Generate merit lists', '/admission/merit/generate', '/api/admission/merit', 1, 1, 1, NOW()),
(27, 'waitlist_management', 'Waitlist Management', 'Manage waitlist', '/admission/merit/waitlist', '/api/admission/merit/waitlist', 2, 1, 1, NOW()),
(27, 'selection', 'Selection', 'Process selections', '/admission/merit/selection', '/api/admission/merit/selection', 3, 1, 1, NOW());

-- Enrollment (sub_module_id = 28)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(28, 'offer_letters', 'Offer Letters', 'Generate offer letters', '/admission/enrollment/offers', '/api/admission/enrollment/offers', 1, 1, 1, NOW()),
(28, 'fee_collection', 'Fee Collection', 'Collect admission fees', '/admission/enrollment/fees', '/api/admission/enrollment/fees', 2, 1, 1, NOW()),
(28, 'document_collection', 'Document Collection', 'Collect documents', '/admission/enrollment/documents', '/api/admission/enrollment/documents', 3, 1, 1, NOW()),
(28, 'orientation', 'Orientation', 'Manage orientation', '/admission/enrollment/orientation', '/api/admission/enrollment/orientation', 4, 1, 1, NOW());

-- ============================================
-- STAFF MANAGEMENT (sub_module_ids 29-32)
-- ============================================

-- Staff Records (sub_module_id = 29)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(29, 'staff_list', 'Staff List', 'View all staff', '/staff/list', '/api/staff', 1, 1, 1, NOW()),
(29, 'staff_details', 'Staff Details', 'Manage staff information', '/staff/details', '/api/staff/details', 2, 1, 1, NOW()),
(29, 'staff_documents', 'Staff Documents', 'Manage staff documents', '/staff/documents', '/api/staff/documents', 3, 1, 1, NOW()),
(29, 'staff_contracts', 'Staff Contracts', 'Manage contracts', '/staff/contracts', '/api/staff/contracts', 4, 1, 1, NOW()),
(29, 'qualifications', 'Qualifications', 'Manage qualifications', '/staff/qualifications', '/api/staff/qualifications', 5, 1, 1, NOW());

-- Recruitment (sub_module_id = 30)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(30, 'job_postings', 'Job Postings', 'Manage job postings', '/staff/recruitment/jobs', '/api/staff/recruitment/jobs', 1, 1, 1, NOW()),
(30, 'applications', 'Applications', 'View applications', '/staff/recruitment/applications', '/api/staff/recruitment/applications', 2, 1, 1, NOW()),
(30, 'interview_scheduling', 'Interview Scheduling', 'Schedule interviews', '/staff/recruitment/interviews', '/api/staff/recruitment/interviews', 3, 1, 1, NOW()),
(30, 'offer_management', 'Offer Management', 'Manage offers', '/staff/recruitment/offers', '/api/staff/recruitment/offers', 4, 1, 1, NOW());

-- Onboarding & Separation (sub_module_id = 31)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(31, 'induction', 'Induction', 'Manage induction', '/staff/onboarding/induction', '/api/staff/onboarding/induction', 1, 1, 1, NOW()),
(31, 'orientation', 'Orientation', 'Manage orientation', '/staff/onboarding/orientation', '/api/staff/onboarding/orientation', 2, 1, 1, NOW()),
(31, 'resignation', 'Resignation', 'Process resignations', '/staff/separation/resignation', '/api/staff/separation/resignation', 3, 1, 1, NOW()),
(31, 'exit_interviews', 'Exit Interviews', 'Conduct exit interviews', '/staff/separation/exit', '/api/staff/separation/exit', 4, 1, 1, NOW()),
(31, 'full_final', 'Full & Final', 'Process full & final', '/staff/separation/fnf', '/api/staff/separation/fnf', 5, 1, 1, NOW());

-- Staff ID (sub_module_id = 32)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(32, 'id_card_generation', 'ID Card Generation', 'Generate staff ID cards', '/staff/id-cards/generate', '/api/staff/id-cards', 1, 1, 1, NOW()),
(32, 'employee_code', 'Employee Code', 'Allocate employee codes', '/staff/employee-code', '/api/staff/employee-code', 2, 1, 1, NOW()),
(32, 'login_credentials', 'Login Credentials', 'Manage staff login', '/staff/credentials', '/api/staff/credentials', 3, 1, 1, NOW());

-- ============================================
-- HR & PAYROLL (sub_module_ids 33-38)
-- ============================================

-- Staff Attendance (sub_module_id = 33)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(33, 'mark_attendance', 'Mark Attendance', 'Mark staff attendance', '/hr/attendance/mark', '/api/hr/attendance', 1, 1, 1, NOW()),
(33, 'bulk_attendance', 'Bulk Attendance', 'Bulk attendance entry', '/hr/attendance/bulk', '/api/hr/attendance/bulk', 2, 1, 1, NOW()),
(33, 'attendance_corrections', 'Attendance Corrections', 'Correct attendance', '/hr/attendance/corrections', '/api/hr/attendance/corrections', 3, 1, 1, NOW()),
(33, 'attendance_reports', 'Attendance Reports', 'Staff attendance reports', '/hr/attendance/reports', '/api/hr/attendance/reports', 4, 1, 1, NOW());

-- Leave Management (sub_module_id = 34)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(34, 'leave_types', 'Leave Types', 'Manage leave types', '/hr/leave/types', '/api/hr/leave/types', 1, 1, 1, NOW()),
(34, 'leave_entitlement', 'Leave Entitlement', 'Set leave entitlement', '/hr/leave/entitlement', '/api/hr/leave/entitlement', 2, 1, 1, NOW()),
(34, 'apply_leave', 'Apply Leave', 'Apply for leave', '/hr/leave/apply', '/api/hr/leave/apply', 3, 1, 1, NOW()),
(34, 'approve_leave', 'Approve Leave', 'Approve leave requests', '/hr/leave/approve', '/api/hr/leave/approve', 4, 1, 1, NOW()),
(34, 'leave_balance', 'Leave Balance', 'View leave balance', '/hr/leave/balance', '/api/hr/leave/balance', 5, 1, 1, NOW()),
(34, 'leave_calendar', 'Leave Calendar', 'View leave calendar', '/hr/leave/calendar', '/api/hr/leave/calendar', 6, 1, 1, NOW());

-- Payroll (sub_module_id = 35)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(35, 'salary_structure', 'Salary Structure', 'Define salary structure', '/hr/payroll/structure', '/api/hr/payroll/structure', 1, 1, 1, NOW()),
(35, 'payroll_processing', 'Payroll Processing', 'Process payroll', '/hr/payroll/process', '/api/hr/payroll/process', 2, 1, 1, NOW()),
(35, 'salary_disbursement', 'Salary Disbursement', 'Disburse salaries', '/hr/payroll/disburse', '/api/hr/payroll/disburse', 3, 1, 1, NOW()),
(35, 'salary_slips', 'Salary Slips', 'Generate salary slips', '/hr/payroll/slips', '/api/hr/payroll/slips', 4, 1, 1, NOW()),
(35, 'tax_management', 'Tax Management', 'Manage taxes', '/hr/payroll/tax', '/api/hr/payroll/tax', 5, 1, 1, NOW());

-- Performance (sub_module_id = 36)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(36, 'goal_setting', 'Goal Setting', 'Set performance goals', '/hr/performance/goals', '/api/hr/performance/goals', 1, 1, 1, NOW()),
(36, 'appraisals', 'Appraisals', 'Manage appraisals', '/hr/performance/appraisals', '/api/hr/performance/appraisals', 2, 1, 1, NOW()),
(36, 'self_assessment', 'Self Assessment', 'Employee self assessment', '/hr/performance/self', '/api/hr/performance/self', 3, 1, 1, NOW()),
(36, 'feedback', 'Feedback', 'Provide feedback', '/hr/performance/feedback', '/api/hr/performance/feedback', 4, 1, 1, NOW());

-- Training (sub_module_id = 37)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(37, 'training_programs', 'Training Programs', 'Manage training', '/hr/training/programs', '/api/hr/training/programs', 1, 1, 1, NOW()),
(37, 'nominations', 'Nominations', 'Manage nominations', '/hr/training/nominations', '/api/hr/training/nominations', 2, 1, 1, NOW()),
(37, 'training_attendance', 'Training Attendance', 'Track attendance', '/hr/training/attendance', '/api/hr/training/attendance', 3, 1, 1, NOW()),
(37, 'certifications', 'Certifications', 'Issue certifications', '/hr/training/certificates', '/api/hr/training/certificates', 4, 1, 1, NOW());

-- Loans & Advances (sub_module_id = 38)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(38, 'loan_types', 'Loan Types', 'Manage loan types', '/hr/loans/types', '/api/hr/loans/types', 1, 1, 1, NOW()),
(38, 'loan_applications', 'Loan Applications', 'Apply for loans', '/hr/loans/apply', '/api/hr/loans/apply', 2, 1, 1, NOW()),
(38, 'loan_approvals', 'Loan Approvals', 'Approve loans', '/hr/loans/approve', '/api/hr/loans/approve', 3, 1, 1, NOW()),
(38, 'loan_disbursement', 'Loan Disbursement', 'Disburse loans', '/hr/loans/disburse', '/api/hr/loans/disburse', 4, 1, 1, NOW()),
(38, 'loan_repayments', 'Loan Repayments', 'Track repayments', '/hr/loans/repayments', '/api/hr/loans/repayments', 5, 1, 1, NOW());

-- ============================================
-- ATTENDANCE MANAGEMENT (sub_module_ids 39-43)
-- ============================================

-- Student Attendance (sub_module_id = 39)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(39, 'daily_attendance', 'Daily Attendance', 'Mark daily attendance', '/attendance/student/daily', '/api/attendance/student/daily', 1, 1, 1, NOW()),
(39, 'period_attendance', 'Period-wise Attendance', 'Period-wise attendance', '/attendance/student/period', '/api/attendance/student/period', 2, 1, 1, NOW()),
(39, 'bulk_attendance', 'Bulk Attendance', 'Bulk attendance entry', '/attendance/student/bulk', '/api/attendance/student/bulk', 3, 1, 1, NOW()),
(39, 'attendance_corrections', 'Attendance Corrections', 'Correct attendance', '/attendance/student/corrections', '/api/attendance/student/corrections', 4, 1, 1, NOW());

-- Staff Attendance (sub_module_id = 40)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(40, 'daily_attendance', 'Daily Attendance', 'Mark daily attendance', '/attendance/staff/daily', '/api/attendance/staff/daily', 1, 1, 1, NOW()),
(40, 'shift_attendance', 'Shift-wise Attendance', 'Shift-wise attendance', '/attendance/staff/shift', '/api/attendance/staff/shift', 2, 1, 1, NOW()),
(40, 'attendance_corrections', 'Attendance Corrections', 'Correct attendance', '/attendance/staff/corrections', '/api/attendance/staff/corrections', 3, 1, 1, NOW());

-- Biometric/RFID Integration (sub_module_id = 41)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(41, 'device_management', 'Device Management', 'Manage biometric devices', '/attendance/devices', '/api/attendance/devices', 1, 1, 1, NOW()),
(41, 'card_management', 'Card Management', 'Manage RFID cards', '/attendance/cards', '/api/attendance/cards', 2, 1, 1, NOW()),
(41, 'sync_data', 'Sync Data', 'Sync attendance data', '/attendance/sync', '/api/attendance/sync', 3, 1, 1, NOW()),
(41, 'device_logs', 'Device Logs', 'View device logs', '/attendance/devices/logs', '/api/attendance/devices/logs', 4, 1, 1, NOW());

-- Mobile Attendance (sub_module_id = 42)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(42, 'geo_tagging', 'Geo-tagging', 'Location-based attendance', '/attendance/mobile/geo', '/api/attendance/mobile/geo', 1, 1, 1, NOW()),
(42, 'selfie_attendance', 'Selfie Attendance', 'Selfie-based attendance', '/attendance/mobile/selfie', '/api/attendance/mobile/selfie', 2, 1, 1, NOW()),
(42, 'offline_sync', 'Offline Sync', 'Sync offline data', '/attendance/mobile/offline', '/api/attendance/mobile/offline', 3, 1, 1, NOW());

-- Attendance Reports (sub_module_id = 43)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(43, 'daily_summary', 'Daily Summary', 'Daily attendance summary', '/attendance/reports/daily', '/api/attendance/reports/daily', 1, 1, 1, NOW()),
(43, 'monthly_summary', 'Monthly Summary', 'Monthly attendance summary', '/attendance/reports/monthly', '/api/attendance/reports/monthly', 2, 1, 1, NOW()),
(43, 'class_reports', 'Class-wise Reports', 'Class-wise attendance', '/attendance/reports/class', '/api/attendance/reports/class', 3, 1, 1, NOW()),
(43, 'individual_reports', 'Individual Reports', 'Student/staff reports', '/attendance/reports/individual', '/api/attendance/reports/individual', 4, 1, 1, NOW()),
(43, 'analytics', 'Analytics', 'Attendance analytics', '/attendance/reports/analytics', '/api/attendance/reports/analytics', 5, 1, 1, NOW());

-- ============================================
-- EXAMINATION MANAGEMENT (sub_module_ids 44-49)
-- ============================================

-- Exam Setup (sub_module_id = 44)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(44, 'exam_types', 'Exam Types', 'Manage exam types', '/exam/types', '/api/exam/types', 1, 1, 1, NOW()),
(44, 'exam_details', 'Exam Details', 'Manage exam details', '/exam/details', '/api/exam/details', 2, 1, 1, NOW()),
(44, 'grade_scale', 'Grade Scale', 'Manage grade scales', '/exam/grading/scale', '/api/exam/grading/scale', 3, 1, 1, NOW());

-- Exam Schedule (sub_module_id = 45)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(45, 'timetable', 'Timetable/Date Sheet', 'Create exam timetable', '/exam/schedule/timetable', '/api/exam/schedule/timetable', 1, 1, 1, NOW()),
(45, 'room_allocation', 'Room Allocation', 'Allocate exam rooms', '/exam/schedule/rooms', '/api/exam/schedule/rooms', 2, 1, 1, NOW()),
(45, 'invigilation_duty', 'Invigilation Duty', 'Assign invigilators', '/exam/schedule/invigilation', '/api/exam/schedule/invigilation', 3, 1, 1, NOW());

-- Hall Tickets (sub_module_id = 46)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(46, 'generate_hall_tickets', 'Generate Hall Tickets', 'Generate hall tickets', '/exam/halltickets/generate', '/api/exam/halltickets', 1, 1, 1, NOW()),
(46, 'print_hall_tickets', 'Print Hall Tickets', 'Print hall tickets', '/exam/halltickets/print', '/api/exam/halltickets/print', 2, 1, 1, NOW()),
(46, 'download_hall_tickets', 'Download Hall Tickets', 'Download hall tickets', '/exam/halltickets/download', '/api/exam/halltickets/download', 3, 1, 1, NOW());

-- Marks Entry (sub_module_id = 47)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(47, 'enter_marks', 'Enter Marks', 'Enter exam marks', '/exam/marks/entry', '/api/exam/marks', 1, 1, 1, NOW()),
(47, 'bulk_entry', 'Bulk Entry', 'Bulk marks entry', '/exam/marks/bulk', '/api/exam/marks/bulk', 2, 1, 1, NOW()),
(47, 'marks_verification', 'Marks Verification', 'Verify entered marks', '/exam/marks/verify', '/api/exam/marks/verify', 3, 1, 1, NOW());

-- Results (sub_module_id = 48)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(48, 'calculate_results', 'Calculate Results', 'Calculate exam results', '/exam/results/calculate', '/api/exam/results/calculate', 1, 1, 1, NOW()),
(48, 'rank_generation', 'Rank Generation', 'Generate ranks', '/exam/results/ranks', '/api/exam/results/ranks', 2, 1, 1, NOW()),
(48, 'result_verification', 'Result Verification', 'Verify results', '/exam/results/verify', '/api/exam/results/verify', 3, 1, 1, NOW()),
(48, 'result_publication', 'Result Publication', 'Publish results', '/exam/results/publish', '/api/exam/results/publish', 4, 1, 1, NOW());

-- Report Cards (sub_module_id = 49)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(49, 'generate_report_cards', 'Generate Report Cards', 'Generate report cards', '/exam/reportcards/generate', '/api/exam/reportcards', 1, 1, 1, NOW()),
(49, 'print_report_cards', 'Print Report Cards', 'Print report cards', '/exam/reportcards/print', '/api/exam/reportcards/print', 2, 1, 1, NOW()),
(49, 'digital_report_cards', 'Digital Report Cards', 'Digital report cards', '/exam/reportcards/digital', '/api/exam/reportcards/digital', 3, 1, 1, NOW()),
(49, 'download_report_cards', 'Download Report Cards', 'Download report cards', '/exam/reportcards/download', '/api/exam/reportcards/download', 4, 1, 1, NOW());

-- ============================================
-- FEE MANAGEMENT (sub_module_ids 50-55)
-- ============================================

-- Fee Structure (sub_module_id = 50)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(50, 'fee_heads', 'Fee Heads', 'Manage fee heads', '/fee/heads', '/api/fee/heads', 1, 1, 1, NOW()),
(50, 'class_wise_fees', 'Class-wise Fees', 'Set class-wise fees', '/fee/structure/class', '/api/fee/structure/class', 2, 1, 1, NOW()),
(50, 'installment_plans', 'Installment Plans', 'Manage installments', '/fee/structure/installments', '/api/fee/structure/installments', 3, 1, 1, NOW()),
(50, 'late_fee_rules', 'Late Fee Rules', 'Set late fee rules', '/fee/structure/latefee', '/api/fee/structure/latefee', 4, 1, 1, NOW());

-- Fee Collection (sub_module_id = 51)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(51, 'counter_collection', 'Counter Collection', 'Collect fees at counter', '/fee/collection/counter', '/api/fee/collection/counter', 1, 1, 1, NOW()),
(51, 'online_payments', 'Online Payments', 'View online payments', '/fee/collection/online', '/api/fee/collection/online', 2, 1, 1, NOW()),
(51, 'cheque_dd_collection', 'Cheque/DD Collection', 'Collect via cheque/DD', '/fee/collection/cheque', '/api/fee/collection/cheque', 3, 1, 1, NOW()),
(51, 'receipt_generation', 'Receipt Generation', 'Generate fee receipts', '/fee/collection/receipts', '/api/fee/collection/receipts', 4, 1, 1, NOW());

-- Concessions & Scholarships (sub_module_id = 52)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(52, 'scholarship_types', 'Scholarship Types', 'Manage scholarships', '/fee/concession/scholarships', '/api/fee/concession/scholarships', 1, 1, 1, NOW()),
(52, 'discounts_waivers', 'Discounts & Waivers', 'Manage discounts', '/fee/concession/discounts', '/api/fee/concession/discounts', 2, 1, 1, NOW()),
(52, 'concession_approvals', 'Concession Approvals', 'Approve concessions', '/fee/concession/approve', '/api/fee/concession/approve', 3, 1, 1, NOW());

-- Fee Dues & Recovery (sub_module_id = 53)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(53, 'due_list', 'Due List', 'View fee dues', '/fee/dues/list', '/api/fee/dues', 1, 1, 1, NOW()),
(53, 'reminders', 'Reminders', 'Send fee reminders', '/fee/dues/reminders', '/api/fee/dues/reminders', 2, 1, 1, NOW()),
(53, 'notices', 'Notices', 'Generate notice', '/fee/dues/notices', '/api/fee/dues/notices', 3, 1, 1, NOW());

-- Refunds (sub_module_id = 54)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(54, 'refund_requests', 'Refund Requests', 'Manage refund requests', '/fee/refunds/requests', '/api/fee/refunds/requests', 1, 1, 1, NOW()),
(54, 'refund_approvals', 'Refund Approvals', 'Approve refunds', '/fee/refunds/approve', '/api/fee/refunds/approve', 2, 1, 1, NOW()),
(54, 'refund_processing', 'Refund Processing', 'Process refunds', '/fee/refunds/process', '/api/fee/refunds/process', 3, 1, 1, NOW());

-- Fee Reports (sub_module_id = 55)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(55, 'collection_reports', 'Collection Reports', 'Daily/monthly collection', '/fee/reports/collection', '/api/fee/reports/collection', 1, 1, 1, NOW()),
(55, 'class_wise_collection', 'Class-wise Collection', 'Class-wise fee collection', '/fee/reports/classwise', '/api/fee/reports/classwise', 2, 1, 1, NOW()),
(55, 'due_reports', 'Due Reports', 'Outstanding fee reports', '/fee/reports/dues', '/api/fee/reports/dues', 3, 1, 1, NOW()),
(55, 'concession_reports', 'Concession Reports', 'Concession reports', '/fee/reports/concession', '/api/fee/reports/concession', 4, 1, 1, NOW());

-- ============================================
-- ACCOUNTS & FINANCE (sub_module_ids 56-63)
-- ============================================

-- Chart of Accounts (sub_module_id = 56)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(56, 'account_groups', 'Account Groups', 'Manage account groups', '/accounts/chart/groups', '/api/accounts/chart/groups', 1, 1, 1, NOW()),
(56, 'ledgers', 'Ledgers', 'Manage ledgers', '/accounts/chart/ledgers', '/api/accounts/chart/ledgers', 2, 1, 1, NOW()),
(56, 'cost_centers', 'Cost Centers', 'Manage cost centers', '/accounts/chart/costcenters', '/api/accounts/chart/costcenters', 3, 1, 1, NOW());

-- Journal Entries (sub_module_id = 57)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(57, 'create_entry', 'Create Entry', 'Create journal entry', '/accounts/journal/create', '/api/accounts/journal', 1, 1, 1, NOW()),
(57, 'approve_entry', 'Approve Entry', 'Approve journal entry', '/accounts/journal/approve', '/api/accounts/journal/approve', 2, 1, 1, NOW()),
(57, 'journal_reports', 'Journal Reports', 'Journal reports', '/accounts/journal/reports', '/api/accounts/journal/reports', 3, 1, 1, NOW());

-- Expenses (sub_module_id = 58)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(58, 'expense_heads', 'Expense Heads', 'Manage expense heads', '/accounts/expenses/heads', '/api/accounts/expenses/heads', 1, 1, 1, NOW()),
(58, 'expense_entry', 'Expense Entry', 'Record expenses', '/accounts/expenses/entry', '/api/accounts/expenses', 2, 1, 1, NOW()),
(58, 'expense_approvals', 'Expense Approvals', 'Approve expenses', '/accounts/expenses/approve', '/api/accounts/expenses/approve', 3, 1, 1, NOW()),
(58, 'petty_cash', 'Petty Cash', 'Manage petty cash', '/accounts/expenses/pettycash', '/api/accounts/expenses/pettycash', 4, 1, 1, NOW());

-- Income (sub_module_id = 59)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(59, 'income_heads', 'Income Heads', 'Manage income heads', '/accounts/income/heads', '/api/accounts/income/heads', 1, 1, 1, NOW()),
(59, 'income_entry', 'Income Entry', 'Record income', '/accounts/income/entry', '/api/accounts/income', 2, 1, 1, NOW()),
(59, 'income_reports', 'Income Reports', 'Income reports', '/accounts/income/reports', '/api/accounts/income/reports', 3, 1, 1, NOW());

-- Banking (sub_module_id = 60)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(60, 'bank_accounts', 'Bank Accounts', 'Manage bank accounts', '/accounts/bank/accounts', '/api/accounts/bank/accounts', 1, 1, 1, NOW()),
(60, 'transactions', 'Transactions', 'View transactions', '/accounts/bank/transactions', '/api/accounts/bank/transactions', 2, 1, 1, NOW()),
(60, 'reconciliation', 'Reconciliation', 'Bank reconciliation', '/accounts/bank/reconcile', '/api/accounts/bank/reconcile', 3, 1, 1, NOW()),
(60, 'cheque_management', 'Cheque Management', 'Manage cheques', '/accounts/bank/cheques', '/api/accounts/bank/cheques', 4, 1, 1, NOW());

-- Budget (sub_module_id = 61)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(61, 'budget_planning', 'Budget Planning', 'Plan budget', '/accounts/budget/plan', '/api/accounts/budget/plan', 1, 1, 1, NOW()),
(61, 'budget_allocation', 'Budget Allocation', 'Allocate budget', '/accounts/budget/allocate', '/api/accounts/budget/allocate', 2, 1, 1, NOW()),
(61, 'budget_monitoring', 'Budget Monitoring', 'Monitor budget', '/accounts/budget/monitor', '/api/accounts/budget/monitor', 3, 1, 1, NOW()),
(61, 'variance_analysis', 'Variance Analysis', 'Budget variance', '/accounts/budget/variance', '/api/accounts/budget/variance', 4, 1, 1, NOW());

-- Assets (sub_module_id = 62)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(62, 'asset_register', 'Asset Register', 'Manage assets', '/accounts/assets/register', '/api/accounts/assets', 1, 1, 1, NOW()),
(62, 'depreciation', 'Depreciation', 'Calculate depreciation', '/accounts/assets/depreciation', '/api/accounts/assets/depreciation', 2, 1, 1, NOW()),
(62, 'asset_disposal', 'Asset Disposal', 'Manage asset disposal', '/accounts/assets/disposal', '/api/accounts/assets/disposal', 3, 1, 1, NOW());

-- Financial Reports (sub_module_id = 63)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(63, 'trial_balance', 'Trial Balance', 'View trial balance', '/accounts/reports/trialbalance', '/api/accounts/reports/trialbalance', 1, 1, 1, NOW()),
(63, 'balance_sheet', 'Balance Sheet', 'View balance sheet', '/accounts/reports/balancesheet', '/api/accounts/reports/balancesheet', 2, 1, 1, NOW()),
(63, 'income_statement', 'Income Statement', 'View income statement', '/accounts/reports/incomestatement', '/api/accounts/reports/incomestatement', 3, 1, 1, NOW()),
(63, 'ledger_reports', 'Ledger Reports', 'View ledger reports', '/accounts/reports/ledger', '/api/accounts/reports/ledger', 4, 1, 1, NOW());

-- ============================================
-- TRANSPORT MANAGEMENT (sub_module_ids 64-70)
-- ============================================

-- Fleet Management (sub_module_id = 64)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(64, 'vehicle_list', 'Vehicle List', 'View all vehicles', '/transport/vehicles', '/api/transport/vehicles', 1, 1, 1, NOW()),
(64, 'vehicle_details', 'Vehicle Details', 'Manage vehicle details', '/transport/vehicles/details', '/api/transport/vehicles/details', 2, 1, 1, NOW()),
(64, 'vehicle_documents', 'Vehicle Documents', 'Manage documents', '/transport/vehicles/documents', '/api/transport/vehicles/documents', 3, 1, 1, NOW()),
(64, 'insurance_tracking', 'Insurance Tracking', 'Track insurance', '/transport/vehicles/insurance', '/api/transport/vehicles/insurance', 4, 1, 1, NOW());

-- Route & Stop Management (sub_module_id = 65)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(65, 'route_list', 'Route List', 'View all routes', '/transport/routes', '/api/transport/routes', 1, 1, 1, NOW()),
(65, 'stop_list', 'Stop List', 'View all stops', '/transport/stops', '/api/transport/stops', 2, 1, 1, NOW()),
(65, 'route_maps', 'Route Maps', 'View route maps', '/transport/routes/maps', '/api/transport/routes/maps', 3, 1, 1, NOW());

-- Allocation (sub_module_id = 66)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(66, 'route_allocation', 'Route Allocation', 'Allocate routes', '/transport/allocation/route', '/api/transport/allocation/route', 1, 1, 1, NOW()),
(66, 'stop_allocation', 'Stop Allocation', 'Allocate stops', '/transport/allocation/stop', '/api/transport/allocation/stop', 2, 1, 1, NOW()),
(66, 'bulk_allocation', 'Bulk Allocation', 'Bulk allocation', '/transport/allocation/bulk', '/api/transport/allocation/bulk', 3, 1, 1, NOW());

-- Trip Management (sub_module_id = 67)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(67, 'daily_trips', 'Daily Trips', 'Manage daily trips', '/transport/trips/daily', '/api/transport/trips/daily', 1, 1, 1, NOW()),
(67, 'trip_tracking', 'Trip Tracking', 'Track trips', '/transport/trips/tracking', '/api/transport/trips/tracking', 2, 1, 1, NOW()),
(67, 'trip_logs', 'Trip Logs', 'View trip logs', '/transport/trips/logs', '/api/transport/trips/logs', 3, 1, 1, NOW());

-- Driver Management (sub_module_id = 68)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(68, 'driver_list', 'Driver List', 'View all drivers', '/transport/drivers', '/api/transport/drivers', 1, 1, 1, NOW()),
(68, 'license_tracking', 'License Tracking', 'Track licenses', '/transport/drivers/licenses', '/api/transport/drivers/licenses', 2, 1, 1, NOW()),
(68, 'duty_roster', 'Duty Roster', 'Manage duty roster', '/transport/drivers/duty', '/api/transport/drivers/duty', 3, 1, 1, NOW());

-- Maintenance (sub_module_id = 69)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(69, 'service_records', 'Service Records', 'Track service', '/transport/maintenance/service', '/api/transport/maintenance/service', 1, 1, 1, NOW()),
(69, 'repair_history', 'Repair History', 'Track repairs', '/transport/maintenance/repairs', '/api/transport/maintenance/repairs', 2, 1, 1, NOW()),
(69, 'fuel_log', 'Fuel Log', 'Track fuel', '/transport/maintenance/fuel', '/api/transport/maintenance/fuel', 3, 1, 1, NOW()),
(69, 'maintenance_schedule', 'Maintenance Schedule', 'Schedule maintenance', '/transport/maintenance/schedule', '/api/transport/maintenance/schedule', 4, 1, 1, NOW());

-- Transport Reports (sub_module_id = 70)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(70, 'vehicle_reports', 'Vehicle Reports', 'Vehicle reports', '/transport/reports/vehicles', '/api/transport/reports/vehicles', 1, 1, 1, NOW()),
(70, 'route_reports', 'Route Reports', 'Route reports', '/transport/reports/routes', '/api/transport/reports/routes', 2, 1, 1, NOW()),
(70, 'fuel_reports', 'Fuel Reports', 'Fuel reports', '/transport/reports/fuel', '/api/transport/reports/fuel', 3, 1, 1, NOW()),
(70, 'expense_reports', 'Expense Reports', 'Expense reports', '/transport/reports/expenses', '/api/transport/reports/expenses', 4, 1, 1, NOW());

-- ============================================
-- LIBRARY MANAGEMENT (sub_module_ids 71-76)
-- ============================================

-- Catalog Management (sub_module_id = 71)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(71, 'book_list', 'Book List', 'View all books', '/library/books', '/api/library/books', 1, 1, 1, NOW()),
(71, 'book_details', 'Book Details', 'Manage book details', '/library/books/details', '/api/library/books/details', 2, 1, 1, NOW()),
(71, 'book_categories', 'Book Categories', 'Manage categories', '/library/books/categories', '/api/library/books/categories', 3, 1, 1, NOW()),
(71, 'book_search', 'Book Search', 'Search books', '/library/books/search', '/api/library/books/search', 4, 1, 1, NOW());

-- Circulation (sub_module_id = 72)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(72, 'issue_book', 'Issue Book', 'Issue books', '/library/circulation/issue', '/api/library/circulation/issue', 1, 1, 1, NOW()),
(72, 'return_book', 'Return Book', 'Return books', '/library/circulation/return', '/api/library/circulation/return', 2, 1, 1, NOW()),
(72, 'renewals', 'Renewals', 'Renew books', '/library/circulation/renew', '/api/library/circulation/renew', 3, 1, 1, NOW()),
(72, 'reservations', 'Reservations', 'Manage reservations', '/library/circulation/reserve', '/api/library/circulation/reserve', 4, 1, 1, NOW()),
(72, 'current_issues', 'Current Issues', 'View current issues', '/library/circulation/current', '/api/library/circulation/current', 5, 1, 1, NOW());

-- Member Management (sub_module_id = 73)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(73, 'student_members', 'Student Members', 'Manage student members', '/library/members/students', '/api/library/members/students', 1, 1, 1, NOW()),
(73, 'staff_members', 'Staff Members', 'Manage staff members', '/library/members/staff', '/api/library/members/staff', 2, 1, 1, NOW()),
(73, 'membership_cards', 'Membership Cards', 'Generate cards', '/library/members/cards', '/api/library/members/cards', 3, 1, 1, NOW()),
(73, 'membership_renewal', 'Membership Renewal', 'Renew memberships', '/library/members/renew', '/api/library/members/renew', 4, 1, 1, NOW());

-- Fine Management (sub_module_id = 74)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(74, 'fine_rules', 'Fine Rules', 'Set fine rules', '/library/fines/rules', '/api/library/fines/rules', 1, 1, 1, NOW()),
(74, 'calculate_fine', 'Calculate Fine', 'Calculate fines', '/library/fines/calculate', '/api/library/fines/calculate', 2, 1, 1, NOW()),
(74, 'collect_fine', 'Collect Fine', 'Collect fines', '/library/fines/collect', '/api/library/fines/collect', 3, 1, 1, NOW()),
(74, 'fine_history', 'Fine History', 'View fine history', '/library/fines/history', '/api/library/fines/history', 4, 1, 1, NOW());

-- Acquisition (sub_module_id = 75)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(75, 'purchase_requests', 'Purchase Requests', 'Manage requests', '/library/acquisition/requests', '/api/library/acquisition/requests', 1, 1, 1, NOW()),
(75, 'new_arrivals', 'New Arrivals', 'Manage new arrivals', '/library/acquisition/new', '/api/library/acquisition/new', 2, 1, 1, NOW()),
(75, 'vendor_management', 'Vendor Management', 'Manage vendors', '/library/acquisition/vendors', '/api/library/acquisition/vendors', 3, 1, 1, NOW());

-- Library Reports (sub_module_id = 76)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(76, 'circulation_reports', 'Circulation Reports', 'Circulation reports', '/library/reports/circulation', '/api/library/reports/circulation', 1, 1, 1, NOW()),
(76, 'member_reports', 'Member Reports', 'Member reports', '/library/reports/members', '/api/library/reports/members', 2, 1, 1, NOW()),
(76, 'fine_reports', 'Fine Reports', 'Fine reports', '/library/reports/fines', '/api/library/reports/fines', 3, 1, 1, NOW());

-- ============================================
-- INVENTORY & PURCHASE (sub_module_ids 77-83)
-- ============================================

-- Item Master (sub_module_id = 77)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(77, 'item_categories', 'Item Categories', 'Manage categories', '/inventory/categories', '/api/inventory/categories', 1, 1, 1, NOW()),
(77, 'item_list', 'Item List', 'View all items', '/inventory/items', '/api/inventory/items', 2, 1, 1, NOW()),
(77, 'item_details', 'Item Details', 'Manage item details', '/inventory/items/details', '/api/inventory/items/details', 3, 1, 1, NOW());

-- Stock Management (sub_module_id = 78)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(78, 'current_stock', 'Current Stock', 'View current stock', '/inventory/stock/current', '/api/inventory/stock/current', 1, 1, 1, NOW()),
(78, 'stock_movements', 'Stock Movements', 'Track movements', '/inventory/stock/movements', '/api/inventory/stock/movements', 2, 1, 1, NOW()),
(78, 'stock_alerts', 'Stock Alerts', 'Low stock alerts', '/inventory/stock/alerts', '/api/inventory/stock/alerts', 3, 1, 1, NOW()),
(78, 'stock_adjustments', 'Stock Adjustments', 'Adjust stock', '/inventory/stock/adjust', '/api/inventory/stock/adjust', 4, 1, 1, NOW()),
(78, 'batch_tracking', 'Batch Tracking', 'Track batches', '/inventory/stock/batches', '/api/inventory/stock/batches', 5, 1, 1, NOW());

-- Purchase Management (sub_module_id = 79)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(79, 'purchase_requests', 'Purchase Requests', 'Create indent/request', '/inventory/purchase/requests', '/api/inventory/purchase/requests', 1, 1, 1, NOW()),
(79, 'quotations', 'Quotations', 'Manage quotations', '/inventory/purchase/quotations', '/api/inventory/purchase/quotations', 2, 1, 1, NOW()),
(79, 'purchase_orders', 'Purchase Orders', 'Create POs', '/inventory/purchase/orders', '/api/inventory/purchase/orders', 3, 1, 1, NOW()),
(79, 'goods_receipt', 'Goods Receipt', 'GRN entry', '/inventory/purchase/grn', '/api/inventory/purchase/grn', 4, 1, 1, NOW()),
(79, 'purchase_returns', 'Purchase Returns', 'Manage returns', '/inventory/purchase/returns', '/api/inventory/purchase/returns', 5, 1, 1, NOW());

-- Supplier Management (sub_module_id = 80)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(80, 'supplier_list', 'Supplier List', 'View suppliers', '/inventory/suppliers', '/api/inventory/suppliers', 1, 1, 1, NOW()),
(80, 'supplier_details', 'Supplier Details', 'Manage suppliers', '/inventory/suppliers/details', '/api/inventory/suppliers/details', 2, 1, 1, NOW()),
(80, 'supplier_evaluation', 'Supplier Evaluation', 'Evaluate suppliers', '/inventory/suppliers/evaluation', '/api/inventory/suppliers/evaluation', 3, 1, 1, NOW());

-- Issue Management (sub_module_id = 81)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(81, 'issue_requests', 'Issue Requests', 'Request items', '/inventory/issue/requests', '/api/inventory/issue/requests', 1, 1, 1, NOW()),
(81, 'issue_items', 'Issue Items', 'Issue items', '/inventory/issue/issue', '/api/inventory/issue', 2, 1, 1, NOW()),
(81, 'returns', 'Returns', 'Return items', '/inventory/issue/returns', '/api/inventory/issue/returns', 3, 1, 1, NOW()),
(81, 'issue_history', 'Issue History', 'View history', '/inventory/issue/history', '/api/inventory/issue/history', 4, 1, 1, NOW());

-- Reorder Management (sub_module_id = 82)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(82, 'reorder_levels', 'Reorder Levels', 'Set reorder levels', '/inventory/reorder/levels', '/api/inventory/reorder/levels', 1, 1, 1, NOW()),
(82, 'reorder_suggestions', 'Reorder Suggestions', 'View suggestions', '/inventory/reorder/suggestions', '/api/inventory/reorder/suggestions', 2, 1, 1, NOW()),
(82, 'auto_po', 'Auto PO Generation', 'Generate POs', '/inventory/reorder/auto-po', '/api/inventory/reorder/auto-po', 3, 1, 1, NOW());

-- Inventory Reports (sub_module_id = 83)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(83, 'stock_summary', 'Stock Summary', 'Stock summary', '/inventory/reports/stock', '/api/inventory/reports/stock', 1, 1, 1, NOW()),
(83, 'stock_valuation', 'Stock Valuation', 'Stock valuation', '/inventory/reports/valuation', '/api/inventory/reports/valuation', 2, 1, 1, NOW()),
(83, 'purchase_reports', 'Purchase Reports', 'Purchase reports', '/inventory/reports/purchase', '/api/inventory/reports/purchase', 3, 1, 1, NOW()),
(83, 'issue_reports', 'Issue Reports', 'Issue reports', '/inventory/reports/issue', '/api/inventory/reports/issue', 4, 1, 1, NOW()),
(83, 'stock_aging', 'Stock Aging', 'Stock aging report', '/inventory/reports/aging', '/api/inventory/reports/aging', 5, 1, 1, NOW());

-- ============================================
-- HOSTEL MANAGEMENT (sub_module_ids 84-90)
-- ============================================

-- Hostel Setup (sub_module_id = 84)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(84, 'hostel_list', 'Hostel List', 'View hostels', '/hostel/list', '/api/hostel', 1, 1, 1, NOW()),
(84, 'hostel_details', 'Hostel Details', 'Manage hostels', '/hostel/details', '/api/hostel/details', 2, 1, 1, NOW());

-- Room & Bed Management (sub_module_id = 85)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(85, 'room_list', 'Room List', 'View rooms', '/hostel/rooms', '/api/hostel/rooms', 1, 1, 1, NOW()),
(85, 'room_types', 'Room Types', 'Manage room types', '/hostel/rooms/types', '/api/hostel/rooms/types', 2, 1, 1, NOW()),
(85, 'bed_list', 'Bed List', 'View beds', '/hostel/beds', '/api/hostel/beds', 3, 1, 1, NOW()),
(85, 'room_status', 'Room/Bed Status', 'View status', '/hostel/status', '/api/hostel/status', 4, 1, 1, NOW());

-- Allocation (sub_module_id = 86)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(86, 'room_allocation', 'Room/Bed Allocation', 'Allocate rooms', '/hostel/allocation/allocate', '/api/hostel/allocation', 1, 1, 1, NOW()),
(86, 'bulk_allocation', 'Bulk Allocation', 'Bulk allocate', '/hostel/allocation/bulk', '/api/hostel/allocation/bulk', 2, 1, 1, NOW()),
(86, 'transfer', 'Transfer', 'Transfer student', '/hostel/allocation/transfer', '/api/hostel/allocation/transfer', 3, 1, 1, NOW()),
(86, 'vacating', 'Vacating', 'Vacate room', '/hostel/allocation/vacate', '/api/hostel/allocation/vacate', 4, 1, 1, NOW());

-- Mess Management (sub_module_id = 87)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(87, 'meal_plans', 'Meal Plans', 'Manage meal plans', '/hostel/mess/plans', '/api/hostel/mess/plans', 1, 1, 1, NOW()),
(87, 'menu', 'Menu', 'Manage menu', '/hostel/mess/menu', '/api/hostel/mess/menu', 2, 1, 1, NOW()),
(87, 'mess_attendance', 'Mess Attendance', 'Track attendance', '/hostel/mess/attendance', '/api/hostel/mess/attendance', 3, 1, 1, NOW()),
(87, 'mess_fees', 'Mess Fees', 'Manage mess fees', '/hostel/mess/fees', '/api/hostel/mess/fees', 4, 1, 1, NOW());

-- Hostel Staff (sub_module_id = 88)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(88, 'wardens', 'Wardens', 'Manage wardens', '/hostel/staff/wardens', '/api/hostel/staff/wardens', 1, 1, 1, NOW()),
(88, 'caretakers', 'Caretakers', 'Manage caretakers', '/hostel/staff/caretakers', '/api/hostel/staff/caretakers', 2, 1, 1, NOW());

-- Hostel Fees (sub_module_id = 89)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(89, 'fee_structure', 'Fee Structure', 'Set hostel fees', '/hostel/fees/structure', '/api/hostel/fees/structure', 1, 1, 1, NOW()),
(89, 'fee_collection', 'Fee Collection', 'Collect fees', '/hostel/fees/collection', '/api/hostel/fees/collection', 2, 1, 1, NOW()),
(89, 'dues', 'Dues', 'View dues', '/hostel/fees/dues', '/api/hostel/fees/dues', 3, 1, 1, NOW());

-- Hostel Reports (sub_module_id = 90)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(90, 'occupancy_reports', 'Occupancy Reports', 'Occupancy reports', '/hostel/reports/occupancy', '/api/hostel/reports/occupancy', 1, 1, 1, NOW()),
(90, 'fee_reports', 'Fee Reports', 'Fee reports', '/hostel/reports/fees', '/api/hostel/reports/fees', 2, 1, 1, NOW()),
(90, 'mess_reports', 'Mess Reports', 'Mess reports', '/hostel/reports/mess', '/api/hostel/reports/mess', 3, 1, 1, NOW());

-- ============================================
-- COMMUNICATION (sub_module_ids 91-96)
-- ============================================

-- Notices & Announcements (sub_module_id = 91)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(91, 'create_notice', 'Create Notice', 'Create new notice', '/communication/notices/create', '/api/communication/notices', 1, 1, 1, NOW()),
(91, 'notice_board', 'Notice Board', 'View notice board', '/communication/notices/board', '/api/communication/notices', 2, 1, 1, NOW()),
(91, 'notice_history', 'Notice History', 'View history', '/communication/notices/history', '/api/communication/notices/history', 3, 1, 1, NOW());

-- SMS (sub_module_id = 92)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(92, 'send_sms', 'Send SMS', 'Send single SMS', '/communication/sms/send', '/api/communication/sms', 1, 1, 1, NOW()),
(92, 'bulk_sms', 'Bulk SMS', 'Send bulk SMS', '/communication/sms/bulk', '/api/communication/sms/bulk', 2, 1, 1, NOW()),
(92, 'sms_templates', 'SMS Templates', 'Manage templates', '/communication/sms/templates', '/api/communication/sms/templates', 3, 1, 1, NOW()),
(92, 'schedule_sms', 'Schedule SMS', 'Schedule SMS', '/communication/sms/schedule', '/api/communication/sms/schedule', 4, 1, 1, NOW()),
(92, 'sms_history', 'SMS History', 'View history', '/communication/sms/history', '/api/communication/sms/history', 5, 1, 1, NOW());

-- Email (sub_module_id = 93)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(93, 'send_email', 'Send Email', 'Send single email', '/communication/email/send', '/api/communication/email', 1, 1, 1, NOW()),
(93, 'bulk_email', 'Bulk Email', 'Send bulk email', '/communication/email/bulk', '/api/communication/email/bulk', 2, 1, 1, NOW()),
(93, 'email_templates', 'Email Templates', 'Manage templates', '/communication/email/templates', '/api/communication/email/templates', 3, 1, 1, NOW()),
(93, 'schedule_email', 'Schedule Email', 'Schedule email', '/communication/email/schedule', '/api/communication/email/schedule', 4, 1, 1, NOW()),
(93, 'email_history', 'Email History', 'View history', '/communication/email/history', '/api/communication/email/history', 5, 1, 1, NOW());

-- Push Notifications (sub_module_id = 94)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(94, 'send_notification', 'Send Notification', 'Send notification', '/communication/push/send', '/api/communication/push', 1, 1, 1, NOW()),
(94, 'bulk_notifications', 'Bulk Notifications', 'Bulk send', '/communication/push/bulk', '/api/communication/push/bulk', 2, 1, 1, NOW()),
(94, 'notification_templates', 'Notification Templates', 'Manage templates', '/communication/push/templates', '/api/communication/push/templates', 3, 1, 1, NOW()),
(94, 'notification_history', 'Notification History', 'View history', '/communication/push/history', '/api/communication/push/history', 4, 1, 1, NOW());

-- In-App Messages (sub_module_id = 95)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(95, 'send_message', 'Send Message', 'Send message', '/communication/messages/send', '/api/communication/messages', 1, 1, 1, NOW()),
(95, 'group_chat', 'Group Chat', 'Group chat', '/communication/messages/group', '/api/communication/messages/group', 2, 1, 1, NOW()),
(95, 'message_history', 'Message History', 'View history', '/communication/messages/history', '/api/communication/messages/history', 3, 1, 1, NOW());

-- Communication Reports (sub_module_id = 96)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(96, 'sms_reports', 'SMS Reports', 'SMS delivery reports', '/communication/reports/sms', '/api/communication/reports/sms', 1, 1, 1, NOW()),
(96, 'email_reports', 'Email Reports', 'Email reports', '/communication/reports/email', '/api/communication/reports/email', 2, 1, 1, NOW()),
(96, 'delivery_reports', 'Delivery Reports', 'Delivery status', '/communication/reports/delivery', '/api/communication/reports/delivery', 3, 1, 1, NOW());

-- ============================================
-- VISITOR & GATE MANAGEMENT (sub_module_ids 97-104)
-- ============================================

-- Pre-registration (sub_module_id = 97)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(97, 'visitor_preregistration', 'Visitor Pre-registration', 'Pre-register visitors', '/gate/preregistration', '/api/gate/preregistration', 1, 1, 1, NOW()),
(97, 'appointment_scheduling', 'Appointment Scheduling', 'Schedule appointments', '/gate/appointments', '/api/gate/appointments', 2, 1, 1, NOW()),
(97, 'preregistration_approval', 'Pre-registration Approval', 'Approve pre-registrations', '/gate/preregistration/approve', '/api/gate/preregistration/approve', 3, 1, 1, NOW()),
(97, 'expected_visitors', 'Expected Visitors List', 'View expected visitors', '/gate/expected', '/api/gate/expected', 4, 1, 1, NOW());

-- Gate Entry (sub_module_id = 98)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(98, 'quick_entry', 'Quick Entry', 'Quick visitor check-in', '/gate/entry/quick', '/api/gate/entry/quick', 1, 1, 1, NOW()),
(98, 'preregistered_checkin', 'Pre-registered Check-in', 'Check-in pre-registered', '/gate/entry/preregistered', '/api/gate/entry/preregistered', 2, 1, 1, NOW()),
(98, 'id_verification', 'ID Verification', 'Verify visitor ID', '/gate/entry/id-verify', '/api/gate/entry/id-verify', 3, 1, 1, NOW()),
(98, 'vehicle_entry', 'Vehicle Entry Registration', 'Register vehicle entry', '/gate/entry/vehicle', '/api/gate/entry/vehicle', 4, 1, 1, NOW()),
(98, 'badge_printing', 'Visitor Badge Printing', 'Print visitor badges', '/gate/entry/badge', '/api/gate/entry/badge', 5, 1, 1, NOW()),
(98, 'purpose_selection', 'Purpose Selection', 'Select visit purpose', '/gate/entry/purpose', '/api/gate/entry/purpose', 6, 1, 1, NOW()),
(98, 'meeting_with', 'Meeting With', 'Select meeting person', '/gate/entry/meeting', '/api/gate/entry/meeting', 7, 1, 1, NOW());

-- Gate Out (sub_module_id = 99)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(99, 'visitor_checkout', 'Visitor Check-out', 'Check-out visitors', '/gate/out/visitor', '/api/gate/out/visitor', 1, 1, 1, NOW()),
(99, 'vehicle_checkout', 'Vehicle Check-out', 'Check-out vehicles', '/gate/out/vehicle', '/api/gate/out/vehicle', 2, 1, 1, NOW()),
(99, 'duration_calculation', 'Duration Calculation', 'Calculate visit duration', '/gate/out/duration', '/api/gate/out/duration', 3, 1, 1, NOW()),
(99, 'parking_fee', 'Parking Fee Collection', 'Collect parking fee', '/gate/out/parking-fee', '/api/gate/out/parking-fee', 4, 1, 1, NOW()),
(99, 'badge_return', 'Badge Return', 'Return visitor badge', '/gate/out/badge-return', '/api/gate/out/badge-return', 5, 1, 1, NOW());

-- In-Progress Visits (sub_module_id = 100)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(100, 'currently_inside', 'Currently Inside', 'Visitors on campus', '/gate/inside', '/api/gate/inside', 1, 1, 1, NOW()),
(100, 'overdue_visits', 'Overdue Visits', 'Visits exceeding time', '/gate/overdue', '/api/gate/overdue', 2, 1, 1, NOW()),
(100, 'pending_checkouts', 'Pending Check-outs', 'Awaiting check-out', '/gate/pending', '/api/gate/pending', 3, 1, 1, NOW());

-- Purpose Management (sub_module_id = 101)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(101, 'visit_purposes', 'Visit Purposes', 'Manage visit purposes', '/gate/purposes', '/api/gate/purposes', 1, 1, 1, NOW()),
(101, 'staff_meetings', 'Staff Meetings', 'Staff meeting purposes', '/gate/purposes/staff', '/api/gate/purposes/staff', 2, 1, 1, NOW()),
(101, 'student_meetings', 'Student Meetings', 'Student meeting purposes', '/gate/purposes/student', '/api/gate/purposes/student', 3, 1, 1, NOW()),
(101, 'delivery_vendor', 'Delivery/Vendor', 'Delivery purposes', '/gate/purposes/vendor', '/api/gate/purposes/vendor', 4, 1, 1, NOW());

-- Blacklist Management (sub_module_id = 102)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(102, 'blacklist_visitors', 'Blacklist Visitors', 'Manage blacklisted visitors', '/gate/blacklist/visitors', '/api/gate/blacklist/visitors', 1, 1, 1, NOW()),
(102, 'blacklist_vehicles', 'Blacklist Vehicles', 'Manage blacklisted vehicles', '/gate/blacklist/vehicles', '/api/gate/blacklist/vehicles', 2, 1, 1, NOW()),
(102, 'blacklist_alerts', 'Blacklist Alerts', 'View blacklist alerts', '/gate/blacklist/alerts', '/api/gate/blacklist/alerts', 3, 1, 1, NOW());

-- Gate Dashboard (sub_module_id = 103)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(103, 'today_visitors_count', 'Today''s Visitors Count', 'Today''s visitor statistics', '/gate/dashboard/today', '/api/gate/dashboard/today', 1, 1, 1, NOW()),
(103, 'peak_entry_times', 'Peak Entry Times', 'Peak hours analysis', '/gate/dashboard/peaks', '/api/gate/dashboard/peaks', 2, 1, 1, NOW()),
(103, 'currently_inside', 'Currently Inside', 'Current occupancy', '/gate/dashboard/inside', '/api/gate/dashboard/inside', 3, 1, 1, NOW()),
(103, 'pending_checkouts', 'Pending Check-outs', 'Pending check-outs', '/gate/dashboard/pending', '/api/gate/dashboard/pending', 4, 1, 1, NOW());

-- Visitor Reports (sub_module_id = 104)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(104, 'daily_logs', 'Daily Logs', 'Daily visitor logs', '/gate/reports/daily', '/api/gate/reports/daily', 1, 1, 1, NOW()),
(104, 'weekly_logs', 'Weekly Logs', 'Weekly visitor logs', '/gate/reports/weekly', '/api/gate/reports/weekly', 2, 1, 1, NOW()),
(104, 'purpose_analysis', 'Purpose-wise Analysis', 'Analysis by purpose', '/gate/reports/purpose', '/api/gate/reports/purpose', 3, 1, 1, NOW()),
(104, 'staff_wise_visits', 'Staff-wise Visits', 'Visits by staff', '/gate/reports/staff', '/api/gate/reports/staff', 4, 1, 1, NOW()),
(104, 'peak_time_analysis', 'Peak Time Analysis', 'Peak hours report', '/gate/reports/peak', '/api/gate/reports/peak', 5, 1, 1, NOW()),
(104, 'vehicle_entry_reports', 'Vehicle Entry Reports', 'Vehicle entry logs', '/gate/reports/vehicle', '/api/gate/reports/vehicle', 6, 1, 1, NOW());

-- ============================================
-- GRIEVANCE & HELPDESK (sub_module_ids 105-109)
-- ============================================

-- Complaint Management (sub_module_id = 105)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(105, 'new_complaint', 'New Complaint', 'Register complaint', '/grievance/complaints/new', '/api/grievance/complaints', 1, 1, 1, NOW()),
(105, 'assigned_complaints', 'Assigned Complaints', 'View assigned', '/grievance/complaints/assigned', '/api/grievance/complaints/assigned', 2, 1, 1, NOW()),
(105, 'in_progress', 'In Progress', 'Complaints in progress', '/grievance/complaints/progress', '/api/grievance/complaints/progress', 3, 1, 1, NOW()),
(105, 'resolved_closed', 'Resolved/Closed', 'Resolved complaints', '/grievance/complaints/resolved', '/api/grievance/complaints/resolved', 4, 1, 1, NOW()),
(105, 'escalation', 'Escalation', 'Escalated complaints', '/grievance/complaints/escalated', '/api/grievance/complaints/escalated', 5, 1, 1, NOW());

-- Discipline Management (sub_module_id = 106)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(106, 'incident_reporting', 'Incident Reporting', 'Report incidents', '/grievance/discipline/incidents', '/api/grievance/discipline/incidents', 1, 1, 1, NOW()),
(106, 'investigation', 'Investigation', 'Manage investigations', '/grievance/discipline/investigation', '/api/grievance/discipline/investigation', 2, 1, 1, NOW()),
(106, 'warnings', 'Warnings', 'Issue warnings', '/grievance/discipline/warnings', '/api/grievance/discipline/warnings', 3, 1, 1, NOW()),
(106, 'penalties', 'Penalties', 'Manage penalties', '/grievance/discipline/penalties', '/api/grievance/discipline/penalties', 4, 1, 1, NOW());

-- Helpdesk (sub_module_id = 107)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(107, 'create_ticket', 'Create Ticket', 'Create support ticket', '/grievance/helpdesk/create', '/api/grievance/helpdesk', 1, 1, 1, NOW()),
(107, 'my_tickets', 'My Tickets', 'View my tickets', '/grievance/helpdesk/my', '/api/grievance/helpdesk/my', 2, 1, 1, NOW()),
(107, 'assigned_tickets', 'Assigned Tickets', 'View assigned', '/grievance/helpdesk/assigned', '/api/grievance/helpdesk/assigned', 3, 1, 1, NOW()),
(107, 'ticket_status', 'Ticket Status', 'Track status', '/grievance/helpdesk/status', '/api/grievance/helpdesk/status', 4, 1, 1, NOW()),
(107, 'knowledge_base', 'Knowledge Base', 'FAQs and articles', '/grievance/helpdesk/kb', '/api/grievance/helpdesk/kb', 5, 1, 1, NOW());

-- Feedback & Surveys (sub_module_id = 108)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(108, 'feedback_forms', 'Feedback Forms', 'Create feedback forms', '/grievance/feedback/forms', '/api/grievance/feedback/forms', 1, 1, 1, NOW()),
(108, 'surveys', 'Surveys', 'Create surveys', '/grievance/feedback/surveys', '/api/grievance/feedback/surveys', 2, 1, 1, NOW()),
(108, 'suggestions', 'Suggestions', 'View suggestions', '/grievance/feedback/suggestions', '/api/grievance/feedback/suggestions', 3, 1, 1, NOW()),
(108, 'analysis', 'Analysis', 'Feedback analysis', '/grievance/feedback/analysis', '/api/grievance/feedback/analysis', 4, 1, 1, NOW());

-- Grievance Reports (sub_module_id = 109)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(109, 'complaint_reports', 'Complaint Reports', 'Complaint reports', '/grievance/reports/complaints', '/api/grievance/reports/complaints', 1, 1, 1, NOW()),
(109, 'resolution_time', 'Resolution Time', 'Resolution time reports', '/grievance/reports/resolution', '/api/grievance/reports/resolution', 2, 1, 1, NOW()),
(109, 'category_analysis', 'Category-wise Analysis', 'Analysis by category', '/grievance/reports/category', '/api/grievance/reports/category', 3, 1, 1, NOW());

-- ============================================
-- EVENT MANAGEMENT (sub_module_ids 110-116)
-- ============================================

-- Event Planning (sub_module_id = 110)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(110, 'event_list', 'Event List', 'View all events', '/event/list', '/api/event', 1, 1, 1, NOW()),
(110, 'event_calendar', 'Event Calendar', 'Calendar view', '/event/calendar', '/api/event/calendar', 2, 1, 1, NOW()),
(110, 'event_templates', 'Event Templates', 'Manage templates', '/event/templates', '/api/event/templates', 3, 1, 1, NOW());

-- Venue Management (sub_module_id = 111)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(111, 'venues', 'Venues', 'Manage venues', '/event/venues', '/api/event/venues', 1, 1, 1, NOW()),
(111, 'availability', 'Availability', 'Check availability', '/event/venues/availability', '/api/event/venues/availability', 2, 1, 1, NOW()),
(111, 'booking', 'Booking', 'Book venue', '/event/venues/booking', '/api/event/venues/booking', 3, 1, 1, NOW());

-- Budget Management (sub_module_id = 112)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(112, 'budget_planning', 'Budget Planning', 'Plan event budget', '/event/budget/plan', '/api/event/budget/plan', 1, 1, 1, NOW()),
(112, 'expenses', 'Expenses', 'Track expenses', '/event/budget/expenses', '/api/event/budget/expenses', 2, 1, 1, NOW()),
(112, 'sponsorships', 'Sponsorships', 'Manage sponsorships', '/event/budget/sponsors', '/api/event/budget/sponsors', 3, 1, 1, NOW());

-- Registration (sub_module_id = 113)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(113, 'online_registration', 'Online Registration', 'Manage registrations', '/event/registration/online', '/api/event/registration', 1, 1, 1, NOW()),
(113, 'participant_list', 'Participant List', 'View participants', '/event/registration/participants', '/api/event/registration/participants', 2, 1, 1, NOW()),
(113, 'attendance', 'Attendance', 'Mark attendance', '/event/registration/attendance', '/api/event/registration/attendance', 3, 1, 1, NOW());

-- Committee Management (sub_module_id = 114)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(114, 'committees', 'Committees', 'Manage committees', '/event/committee', '/api/event/committee', 1, 1, 1, NOW()),
(114, 'committee_members', 'Committee Members', 'Manage members', '/event/committee/members', '/api/event/committee/members', 2, 1, 1, NOW()),
(114, 'tasks', 'Tasks', 'Manage tasks', '/event/committee/tasks', '/api/event/committee/tasks', 3, 1, 1, NOW());

-- Media Gallery (sub_module_id = 115)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(115, 'photos', 'Photos', 'Manage photos', '/event/media/photos', '/api/event/media/photos', 1, 1, 1, NOW()),
(115, 'videos', 'Videos', 'Manage videos', '/event/media/videos', '/api/event/media/videos', 2, 1, 1, NOW());

-- Event Reports (sub_module_id = 116)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(116, 'participation_reports', 'Participation Reports', 'Participation reports', '/event/reports/participation', '/api/event/reports/participation', 1, 1, 1, NOW()),
(116, 'financial_reports', 'Financial Reports', 'Financial reports', '/event/reports/financial', '/api/event/reports/financial', 2, 1, 1, NOW()),
(116, 'feedback_reports', 'Feedback Reports', 'Feedback reports', '/event/reports/feedback', '/api/event/reports/feedback', 3, 1, 1, NOW());

-- ============================================
-- REPORTS & ANALYTICS (sub_module_ids 117-123)
-- ============================================

-- Student Reports (sub_module_id = 117)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(117, 'student_lists', 'Student Lists', 'Generate student lists', '/reports/student/lists', '/api/reports/student/lists', 1, 1, 1, NOW()),
(117, 'attendance_reports', 'Attendance Reports', 'Student attendance', '/reports/student/attendance', '/api/reports/student/attendance', 2, 1, 1, NOW()),
(117, 'fee_reports', 'Fee Reports', 'Student fee reports', '/reports/student/fees', '/api/reports/student/fees', 3, 1, 1, NOW()),
(117, 'performance_reports', 'Performance Reports', 'Academic performance', '/reports/student/performance', '/api/reports/student/performance', 4, 1, 1, NOW());

-- Academic Reports (sub_module_id = 118)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(118, 'class_performance', 'Class Performance', 'Class-wise performance', '/reports/academic/class', '/api/reports/academic/class', 1, 1, 1, NOW()),
(118, 'subject_analysis', 'Subject Analysis', 'Subject-wise analysis', '/reports/academic/subject', '/api/reports/academic/subject', 2, 1, 1, NOW()),
(118, 'exam_results', 'Exam Results', 'Exam result reports', '/reports/academic/exams', '/api/reports/academic/exams', 3, 1, 1, NOW()),
(118, 'teacher_reports', 'Teacher Reports', 'Teacher performance', '/reports/academic/teacher', '/api/reports/academic/teacher', 4, 1, 1, NOW());

-- Staff Reports (sub_module_id = 119)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(119, 'staff_lists', 'Staff Lists', 'Generate staff lists', '/reports/staff/lists', '/api/reports/staff/lists', 1, 1, 1, NOW()),
(119, 'attendance_reports', 'Attendance Reports', 'Staff attendance', '/reports/staff/attendance', '/api/reports/staff/attendance', 2, 1, 1, NOW()),
(119, 'leave_reports', 'Leave Reports', 'Staff leave', '/reports/staff/leave', '/api/reports/staff/leave', 3, 1, 1, NOW()),
(119, 'payroll_reports', 'Payroll Reports', 'Payroll reports', '/reports/staff/payroll', '/api/reports/staff/payroll', 4, 1, 1, NOW());

-- Financial Reports (sub_module_id = 120)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(120, 'fee_collection', 'Fee Collection', 'Fee collection reports', '/reports/financial/fees', '/api/reports/financial/fees', 1, 1, 1, NOW()),
(120, 'expense_reports', 'Expense Reports', 'Expense reports', '/reports/financial/expenses', '/api/reports/financial/expenses', 2, 1, 1, NOW()),
(120, 'balance_sheet', 'Balance Sheet', 'Balance sheet', '/reports/financial/balance', '/api/reports/financial/balance', 3, 1, 1, NOW()),
(120, 'income_statement', 'Income Statement', 'Income statement', '/reports/financial/income', '/api/reports/financial/income', 4, 1, 1, NOW());

-- Administrative Reports (sub_module_id = 121)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(121, 'enrollment_reports', 'Enrollment Reports', 'Enrollment statistics', '/reports/admin/enrollment', '/api/reports/admin/enrollment', 1, 1, 1, NOW()),
(121, 'admission_reports', 'Admission Reports', 'Admission reports', '/reports/admin/admission', '/api/reports/admin/admission', 2, 1, 1, NOW()),
(121, 'transport_reports', 'Transport Reports', 'Transport reports', '/reports/admin/transport', '/api/reports/admin/transport', 3, 1, 1, NOW()),
(121, 'inventory_reports', 'Inventory Reports', 'Inventory reports', '/reports/admin/inventory', '/api/reports/admin/inventory', 4, 1, 1, NOW()),
(121, 'visitor_reports', 'Visitor Reports', 'Visitor/gate reports', '/reports/admin/visitor', '/api/reports/admin/visitor', 5, 1, 1, NOW());

-- Custom Reports (sub_module_id = 122)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(122, 'report_builder', 'Report Builder', 'Build custom reports', '/reports/custom/builder', '/api/reports/custom/builder', 1, 1, 1, NOW()),
(122, 'saved_reports', 'Saved Reports', 'View saved reports', '/reports/custom/saved', '/api/reports/custom/saved', 2, 1, 1, NOW()),
(122, 'scheduled_reports', 'Scheduled Reports', 'Schedule reports', '/reports/custom/schedule', '/api/reports/custom/schedule', 3, 1, 1, NOW());

-- Analytics (sub_module_id = 123)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(123, 'trends', 'Trends', 'Analytics trends', '/reports/analytics/trends', '/api/reports/analytics/trends', 1, 1, 1, NOW()),
(123, 'comparisons', 'Comparisons', 'Data comparisons', '/reports/analytics/comparisons', '/api/reports/analytics/comparisons', 2, 1, 1, NOW()),
(123, 'forecasting', 'Forecasting', 'Predictive analytics', '/reports/analytics/forecast', '/api/reports/analytics/forecast', 3, 1, 1, NOW()),
(123, 'insights', 'Insights', 'Key insights', '/reports/analytics/insights', '/api/reports/analytics/insights', 4, 1, 1, NOW());

-- ============================================
-- INTEGRATIONS (sub_module_ids 124-129)
-- ============================================

-- Payment Gateways (sub_module_id = 124)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(124, 'gateway_config', 'Gateway Configuration', 'Configure payment gateways', '/integrations/payment/config', '/api/integrations/payment/config', 1, 1, 1, NOW()),
(124, 'transaction_logs', 'Transaction Logs', 'View payment logs', '/integrations/payment/logs', '/api/integrations/payment/logs', 2, 1, 1, NOW()),
(124, 'error_logs', 'Error Logs', 'Payment error logs', '/integrations/payment/errors', '/api/integrations/payment/errors', 3, 1, 1, NOW());

-- SMS Gateways (sub_module_id = 125)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(125, 'gateway_config', 'Gateway Configuration', 'Configure SMS gateways', '/integrations/sms/config', '/api/integrations/sms/config', 1, 1, 1, NOW()),
(125, 'transaction_logs', 'Transaction Logs', 'View SMS logs', '/integrations/sms/logs', '/api/integrations/sms/logs', 2, 1, 1, NOW()),
(125, 'error_logs', 'Error Logs', 'SMS error logs', '/integrations/sms/errors', '/api/integrations/sms/errors', 3, 1, 1, NOW());

-- Email Gateways (sub_module_id = 126)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(126, 'gateway_config', 'Gateway Configuration', 'Configure email gateways', '/integrations/email/config', '/api/integrations/email/config', 1, 1, 1, NOW()),
(126, 'transaction_logs', 'Transaction Logs', 'View email logs', '/integrations/email/logs', '/api/integrations/email/logs', 2, 1, 1, NOW()),
(126, 'error_logs', 'Error Logs', 'Email error logs', '/integrations/email/errors', '/api/integrations/email/errors', 3, 1, 1, NOW());

-- Biometric/RFID (sub_module_id = 127)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(127, 'device_integration', 'Device Integration', 'Configure devices', '/integrations/biometric/devices', '/api/integrations/biometric/devices', 1, 1, 1, NOW()),
(127, 'device_management', 'Device Management', 'Manage devices', '/integrations/biometric/manage', '/api/integrations/biometric/manage', 2, 1, 1, NOW()),
(127, 'sync_settings', 'Sync Settings', 'Configure sync', '/integrations/biometric/sync', '/api/integrations/biometric/sync', 3, 1, 1, NOW()),
(127, 'sync_logs', 'Sync Logs', 'View sync logs', '/integrations/biometric/logs', '/api/integrations/biometric/logs', 4, 1, 1, NOW());

-- API Management (sub_module_id = 128)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(128, 'api_keys', 'API Keys', 'Manage API keys', '/integrations/api/keys', '/api/integrations/api/keys', 1, 1, 1, NOW()),
(128, 'rate_limiting', 'Rate Limiting', 'Configure rate limits', '/integrations/api/ratelimit', '/api/integrations/api/ratelimit', 2, 1, 1, NOW()),
(128, 'api_logs', 'API Logs', 'View API logs', '/integrations/api/logs', '/api/integrations/api/logs', 3, 1, 1, NOW()),
(128, 'webhooks', 'Webhooks', 'Manage webhooks', '/integrations/api/webhooks', '/api/integrations/api/webhooks', 4, 1, 1, NOW());

-- ERP Integrations (sub_module_id = 129)
INSERT INTO pages (sub_module_id, page_code, page_name, description, route, api_base_path, display_order, status, created_by, created_dt) VALUES
(129, 'tally_integration', 'Tally Integration', 'Configure Tally', '/integrations/erp/tally', '/api/integrations/erp/tally', 1, 1, 1, NOW()),
(129, 'other_erp', 'Other ERP', 'Other ERP config', '/integrations/erp/other', '/api/integrations/erp/other', 2, 1, 1, NOW());

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count total pages inserted
SELECT COUNT(*) AS total_pages FROM pages;

select *from pages