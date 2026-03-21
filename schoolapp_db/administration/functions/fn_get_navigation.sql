--select fn_get_navigation(1)
CREATE OR REPLACE FUNCTION fn_get_navigation(p_role_id BIGINT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
RETURN (
  SELECT json_agg(
    json_build_object(
      'module', m.module_name,
      'submodules',
      (
        SELECT json_agg(
          json_build_object(
            'submodule', sm.sub_module_name,
            'pages',
            (
              SELECT json_agg(
                json_build_object(
                  'page_id', p.id,
                  'page_name', p.page_name,
                  'route', p.route
                )
                ORDER BY p.display_order
              )
              FROM pages p
              JOIN role_page_access rpa ON rpa.page_id = p.id
                AND rpa.role_id = p_role_id
                AND rpa.can_access = TRUE
              WHERE p.sub_module_id = sm.id
                AND p.status = 1
            )
          )
          ORDER BY sm.display_order
        )
        FROM sub_modules sm
        WHERE sm.module_id = m.id
      )
    )
    ORDER BY m.display_order  -- Moved inside json_agg
  )
  FROM modules m
);
END;
$$;
