--select fn_get_form_controls(1,1)
CREATE OR REPLACE FUNCTION fn_get_form_controls
(
p_role_id BIGINT,
p_page_id BIGINT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN

RETURN (

SELECT json_agg(

json_build_object(

'form_id',f.id,
'form_code',f.form_code,

'controls',

(
SELECT json_agg(

json_build_object(
'control_code',c.control_code,
'control_name',c.control_name
)

ORDER BY c.display_order

)

FROM controls c

JOIN form_controls fc
ON fc.control_id = c.id

JOIN role_form_control_access rfca
ON rfca.control_id = c.id
AND rfca.form_id = f.id
AND rfca.role_id = p_role_id
AND rfca.can_access = TRUE

WHERE fc.form_id = f.id
)

)

)

FROM forms f
WHERE f.page_id = p_page_id
AND f.status = 1

);

END;
$$;

