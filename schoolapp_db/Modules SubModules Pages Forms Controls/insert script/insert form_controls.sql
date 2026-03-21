--STEP 1 — Insert COMMON CONTROLS to ALL FORMS
INSERT INTO form_controls
(
form_id,
control_id,
display_order,
created_by
)
SELECT
f.id,
c.id,
ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY c.display_order),
1
FROM forms f
JOIN controls c
ON c.control_code IN
(
'view',
'create',
'edit',
'delete',
'print',
'export'
)
WHERE NOT EXISTS
(
SELECT 1
FROM form_controls fc
WHERE fc.form_id = f.id
AND fc.control_id = c.id
);

--STEP 2 — Add Special Controls ONLY for Required Pages
INSERT INTO form_controls
(form_id,control_id,display_order,created_by)
SELECT
f.id,
c.id,
10,
1
FROM forms f
JOIN pages p ON p.id=f.page_id
JOIN controls c ON c.control_code IN
(
'enter_marks',
'verify_marks',
'publish_result'
)
WHERE p.route LIKE '/exam%'
AND NOT EXISTS
(
SELECT 1 FROM form_controls fc
WHERE fc.form_id=f.id
AND fc.control_id=c.id
);

--step 3: Attendance Pages
INSERT INTO form_controls
(form_id,control_id,display_order,created_by)
SELECT
f.id,
c.id,
20,
1
FROM forms f
JOIN pages p ON p.id=f.page_id
JOIN controls c ON c.control_code IN
(
'mark_attendance',
'bulk_attendance',
'correct_attendance'
)
WHERE p.route LIKE '/attendance%'
AND NOT EXISTS
(
SELECT 1 FROM form_controls fc
WHERE fc.form_id=f.id
AND fc.control_id=c.id
);

--4 Example: Fee Pages
INSERT INTO form_controls
(form_id,control_id,display_order,created_by)
SELECT
f.id,
c.id,
30,
1
FROM forms f
JOIN pages p ON p.id=f.page_id
JOIN controls c ON c.control_code IN
(
'collect_fee',
'generate_receipt',
'process_refund'
)
WHERE p.route LIKE '/fee%'
AND NOT EXISTS
(
SELECT 1 FROM form_controls fc
WHERE fc.form_id=f.id
AND fc.control_id=c.id
);

select *From form_controls
select *from page_controls