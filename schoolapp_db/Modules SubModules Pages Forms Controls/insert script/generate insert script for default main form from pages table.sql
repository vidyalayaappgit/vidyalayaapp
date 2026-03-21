-- Dynamic script to generate MAIN forms for all pages (with apostrophe handling)
SELECT 
    'INSERT INTO forms (page_id, form_code, form_name, form_type, render_mode, display_order, status, created_by, created_dt) VALUES ' ||
    '(' || id || ', ' ||
    '''' || page_code || '_main'', ' ||
    '''' || REPLACE(page_name, '''', '''''') || ' - Main Form'', ' ||
    '''MAIN'', ' ||
    '''TAB'', ' ||
    '1, 1, 1, NOW());' AS insert_statement
FROM pages 
ORDER BY id;