select *From subjects


select *from subject_class_mapping

   SELECT  *
    FROM forms
    WHERE LOWER(form_code) = 'subject_management_main';

	
   SELECT  *
    FROM forms
    WHERE LOWER(form_code) like '%subject%';

	

select *from users
select *From roles
	select *From role_form_control_access where form_id=8
	select *from controls



	insert into role_form_control_access(school_group_id,role_id,form_id,control_id,can_access,created_dt)
	select 1,1,8,true,now()


select *from classes
    