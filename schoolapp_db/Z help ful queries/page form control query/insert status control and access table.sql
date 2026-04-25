 SELECT *  FROM forms WHERE LOWER(form_code) = 'academic_years_main';
delete from academic_years
select *from academic_years
select * from academic_years
insert form_status_master


delete from  form_status_master
where form_id=5

update form_status_master
set form_id=5
where form_id=6


insert 

update form_status_master
set status_name='COMPLETED',status_desc='Completed'
where form_id=6
and status_id=2


SELECT *FROM form_status_master
where form_id=5
insert into form_status_master
select 6,3,'CANCELLED','Cancelled',true


insert into form_status_master
select 5,status_id,status_name,status_desc,is_active
From form_status_master
where form_id=6


SELECT *fROM CONTROLS
WHERE CONTROL_code LIKE 'Complete%'
 83
 15

 
  SELECT *
   
    FROM controls
    WHERE LOWER(control_code) = 'complete'

insert into controls(control_code,control_name,control_type,display_order,status,created_by,created_dt,modified_by,modified_dt)
select 'complete','Complete','WRITE',85,1,1,NOW(),NULL,NULL

 SELECT *
            FROM role_form_control_access rfca
            WHERE rfca.role_id = 1
              AND rfca.form_id = 6
              AND rfca.can_access = TRUE

			  insert into role_form_control_access(school_group_id,role_id,form_id,control_id,can_access,created_dt)
			  select 1,1,6,83,true,now()



 SELECT *
            FROM role_form_control_access rfca
            WHERE rfca.role_id = 1
              AND rfca.form_id = 5		
INSERT into role_form_control_access(school_group_id,role_id,form_id,control_id,can_access,created_dt)
select 1,1,5,85,true,now()
update role_form_control_access
set form_id=5
where form_id=6
and control_id in (15,83)

			  