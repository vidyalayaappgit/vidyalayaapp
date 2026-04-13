-- =========================================================
-- BASIC CRUD CONTROLS
-- =========================================================

INSERT INTO controls (control_code, control_name, control_type, display_order, status, created_by, created_dt) VALUES
('view','View','READ',1,1,1,NOW()),
('create','Create','WRITE',2,1,1,NOW()),
('edit','Edit','WRITE',3,1,1,NOW()),
('delete','Delete','DELETE',4,1,1,NOW()),
('save','Save','WRITE',5,1,1,NOW()),
('copy','Copy','WRITE',6,1,1,NOW()),
('bulk_create','Bulk Create','WRITE',7,1,1,NOW()),
('bulk_edit','Bulk Edit','WRITE',8,1,1,NOW()),
('bulk_delete','Bulk Delete','DELETE',9,1,1,NOW());

-- =========================================================
-- WORKFLOW CONTROLS
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'submit','Submit','ACTION',10,1,1,NOW(),NULL,NULL),
(DEFAULT,'approve','Approve','ACTION',11,1,1,NOW(),NULL,NULL),
(DEFAULT,'reject','Reject','ACTION',12,1,1,NOW(),NULL,NULL),
(DEFAULT,'verify','Verify','ACTION',13,1,1,NOW(),NULL,NULL),
(DEFAULT,'authorize','Authorize','ACTION',14,1,1,NOW(),NULL,NULL),
(DEFAULT,'cancel','Cancel','ACTION',15,1,1,NOW(),NULL,NULL),
(DEFAULT,'close','Close','ACTION',16,1,1,NOW(),NULL,NULL),
(DEFAULT,'reopen','Reopen','ACTION',17,1,1,NOW(),NULL,NULL),
(DEFAULT,'hold','Hold','ACTION',18,1,1,NOW(),NULL,NULL),
(DEFAULT,'release','Release','ACTION',19,1,1,NOW(),NULL,NULL);

-- =========================================================
-- DOCUMENT OPERATIONS
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'upload','Upload','ACTION',20,1,1,NOW(),NULL,NULL),
(DEFAULT,'download','Download','ACTION',21,1,1,NOW(),NULL,NULL),
(DEFAULT,'print','Print','ACTION',22,1,1,NOW(),NULL,NULL),
(DEFAULT,'export','Export','ACTION',23,1,1,NOW(),NULL,NULL),
(DEFAULT,'import','Import','ACTION',24,1,1,NOW(),NULL,NULL),
(DEFAULT,'attach','Attach','ACTION',25,1,1,NOW(),NULL,NULL),
(DEFAULT,'preview','Preview','READ',26,1,1,NOW(),NULL,NULL);

-- =========================================================
-- REPORT OPERATIONS
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'generate_report','Generate Report','ACTION',27,1,1,NOW(),NULL,NULL),
(DEFAULT,'view_report','View Report','READ',28,1,1,NOW(),NULL,NULL),
(DEFAULT,'schedule_report','Schedule Report','ACTION',29,1,1,NOW(),NULL,NULL),
(DEFAULT,'export_report','Export Report','ACTION',30,1,1,NOW(),NULL,NULL),
(DEFAULT,'print_report','Print Report','ACTION',31,1,1,NOW(),NULL,NULL);

-- =========================================================
-- DASHBOARD / ANALYTICS
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'view_dashboard','View Dashboard','READ',32,1,1,NOW(),NULL,NULL),
(DEFAULT,'view_analytics','View Analytics','READ',33,1,1,NOW(),NULL,NULL),
(DEFAULT,'customize_dashboard','Customize Dashboard','WRITE',34,1,1,NOW(),NULL,NULL);

-- =========================================================
-- COMMUNICATION
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'send_sms','Send SMS','ACTION',35,1,1,NOW(),NULL,NULL),
(DEFAULT,'send_email','Send Email','ACTION',36,1,1,NOW(),NULL,NULL),
(DEFAULT,'send_notification','Send Notification','ACTION',37,1,1,NOW(),NULL,NULL),
(DEFAULT,'send_message','Send Message','ACTION',38,1,1,NOW(),NULL,NULL),
(DEFAULT,'bulk_sms','Bulk SMS','ACTION',39,1,1,NOW(),NULL,NULL),
(DEFAULT,'bulk_email','Bulk Email','ACTION',40,1,1,NOW(),NULL,NULL);

-- =========================================================
-- STUDENT ACTIONS
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'enroll','Enroll','WRITE',41,1,1,NOW(),NULL,NULL),
(DEFAULT,'promote','Promote','WRITE',42,1,1,NOW(),NULL,NULL),
(DEFAULT,'transfer','Transfer','WRITE',43,1,1,NOW(),NULL,NULL),
(DEFAULT,'withdraw','Withdraw','WRITE',44,1,1,NOW(),NULL,NULL),
(DEFAULT,'generate_id_card','Generate ID Card','ACTION',45,1,1,NOW(),NULL,NULL);

-- =========================================================
-- ATTENDANCE
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'mark_attendance','Mark Attendance','WRITE',46,1,1,NOW(),NULL,NULL),
(DEFAULT,'bulk_attendance','Bulk Attendance','WRITE',47,1,1,NOW(),NULL,NULL),
(DEFAULT,'correct_attendance','Correct Attendance','WRITE',48,1,1,NOW(),NULL,NULL),
(DEFAULT,'sync_biometric','Sync Biometric','ACTION',49,1,1,NOW(),NULL,NULL);

-- =========================================================
-- FEES / FINANCE
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'collect_fee','Collect Fee','WRITE',50,1,1,NOW(),NULL,NULL),
(DEFAULT,'grant_concession','Grant Concession','WRITE',51,1,1,NOW(),NULL,NULL),
(DEFAULT,'process_refund','Process Refund','WRITE',52,1,1,NOW(),NULL,NULL),
(DEFAULT,'approve_refund','Approve Refund','ACTION',53,1,1,NOW(),NULL,NULL),
(DEFAULT,'view_dues','View Dues','READ',54,1,1,NOW(),NULL,NULL);

-- =========================================================
-- EXAMINATION
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'enter_marks','Enter Marks','WRITE',55,1,1,NOW(),NULL,NULL),
(DEFAULT,'verify_marks','Verify Marks','ACTION',56,1,1,NOW(),NULL,NULL),
(DEFAULT,'publish_result','Publish Result','ACTION',57,1,1,NOW(),NULL,NULL),
(DEFAULT,'generate_report_card','Generate Report Card','ACTION',58,1,1,NOW(),NULL,NULL);

-- =========================================================
-- LIBRARY
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'issue_book','Issue Book','WRITE',59,1,1,NOW(),NULL,NULL),
(DEFAULT,'return_book','Return Book','WRITE',60,1,1,NOW(),NULL,NULL),
(DEFAULT,'renew_book','Renew Book','WRITE',61,1,1,NOW(),NULL,NULL),
(DEFAULT,'reserve_book','Reserve Book','WRITE',62,1,1,NOW(),NULL,NULL),
(DEFAULT,'collect_fine','Collect Fine','WRITE',63,1,1,NOW(),NULL,NULL);

-- =========================================================
-- INVENTORY
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'manage_item','Manage Item','WRITE',64,1,1,NOW(),NULL,NULL),
(DEFAULT,'issue_item','Issue Item','WRITE',65,1,1,NOW(),NULL,NULL),
(DEFAULT,'return_item','Return Item','WRITE',66,1,1,NOW(),NULL,NULL),
(DEFAULT,'adjust_stock','Adjust Stock','WRITE',67,1,1,NOW(),NULL,NULL);

-- =========================================================
-- TRANSPORT
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'manage_vehicle','Manage Vehicle','WRITE',68,1,1,NOW(),NULL,NULL),
(DEFAULT,'manage_route','Manage Route','WRITE',69,1,1,NOW(),NULL,NULL),
(DEFAULT,'allocate_route','Allocate Route','WRITE',70,1,1,NOW(),NULL,NULL),
(DEFAULT,'track_vehicle','Track Vehicle','READ',71,1,1,NOW(),NULL,NULL);

-- =========================================================
-- SYSTEM ADMINISTRATION
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'manage_users','Manage Users','ADMIN',72,1,1,NOW(),NULL,NULL),
(DEFAULT,'manage_roles','Manage Roles','ADMIN',73,1,1,NOW(),NULL,NULL),
(DEFAULT,'manage_permissions','Manage Permissions','ADMIN',74,1,1,NOW(),NULL,NULL),
(DEFAULT,'configure_system','Configure System','ADMIN',75,1,1,NOW(),NULL,NULL),
(DEFAULT,'manage_backup','Manage Backup','ADMIN',76,1,1,NOW(),NULL,NULL),
(DEFAULT,'restore_backup','Restore Backup','ADMIN',77,1,1,NOW(),NULL,NULL),
(DEFAULT,'view_logs','View Logs','ADMIN',78,1,1,NOW(),NULL,NULL);

-- =========================================================
-- UTILITY
-- =========================================================

INSERT INTO controls VALUES
(DEFAULT,'search','Search','READ',79,1,1,NOW(),NULL,NULL),
(DEFAULT,'filter','Filter','READ',80,1,1,NOW(),NULL,NULL),
(DEFAULT,'sort','Sort','READ',81,1,1,NOW(),NULL,NULL),
(DEFAULT,'refresh','Refresh','READ',82,1,1,NOW(),NULL,NULL);


insert into controls
select 83,'activate','Activate','WRITE',83,1,1,now(),null,null



insert into controls
select 84,'deactivate','DeActivate','WRITE',83,1,1,now(),null,null
select *From controls