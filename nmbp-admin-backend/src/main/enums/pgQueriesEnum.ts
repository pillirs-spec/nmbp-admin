export enum UserQueries {
  USERS_LIST = `SELECT * from vw_m_users WHERE status <> 2`,
  LATEST_UPDATED_CHECK = `SELECT COUNT(*) as count FROM vw_m_users WHERE date_updated >= NOW() - INTERVAL '5 minutes'`,
  GET_USER_BY_ID = `SELECT * from  m_users WHERE user_id = $1 AND status <> 2`,
  UPDATE_USER_STATUS = `UPDATE m_users SET status = $2, updated_by = $3, date_updated = NOW() WHERE user_id = $1`,
  EXISTS_BY_MOBILE_NUMBER = `SELECT EXISTS (SELECT 1 FROM m_users WHERE mobile_number = $1 AND status <> 2)`,
  EXISTS_BY_USER_ID = `SELECT EXISTS (SELECT 1 FROM m_users WHERE user_id = $1)`,
  CREATE_USER = `INSERT INTO m_users(user_name, first_name, last_name, display_name, dob, gender, mobile_number, password, role_id, state_id, district_id, email_id, created_by, updated_by,  date_created, date_updated)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()) RETURNING user_id`,
  UPDATE_USER = `UPDATE m_users SET first_name = $2, last_name = $3, dob = $4, gender = $5, mobile_number = $6, email_id = $7, updated_by = $8, role_id = $9, state_id = $10, district_id = $11, display_name = $12, date_updated = NOW() WHERE user_id = $1`,
  GET_USERS_BY_ROLE_ID = `SELECT user_id, user_name, initcap(display_name) as display_name, mobile_number from m_users where role_id = $1 AND status <> 2`,
  RESET_PASSWORD_FOR_USER_ID = `UPDATE m_users SET password = $2, password_last_updated = NOW(), date_updated = NOW() WHERE user_id = $1`,
  USERS_COUNT = `SELECT count(*) as count from vw_m_users WHERE status <> 2`,
}

export enum MenuQueries {
  ADD_MENU = `INSERT INTO m_menus(menu_name, menu_description, status, menu_order, route_url, icon_class, date_created, date_updated)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
  EXISTS_BY_MENU_NAME = `SELECT EXISTS (SELECT 1 FROM m_menus WHERE menu_name = $1 AND status <> 2)`,
  EXISTS_BY_MENU_ID = `SELECT EXISTS (SELECT 1 FROM m_menus WHERE menu_id = $1 AND status <> 2)`,
  UPDATE_MENU = `UPDATE m_menus SET menu_name = $2, menu_description = $3, status = $4, menu_order = $5, route_url = $6, icon_class = $7, date_updated = NOW() WHERE menu_id = $1`,
  GET_MENU_BY_ID = `SELECT menu_name, menu_description, status, menu_order, route_url, icon_class, date_created, date_updated FROM m_menus WHERE menu_id = $1 AND status <> 2`,
  LIST_MENUS = `SELECT menu_id, menu_name, menu_description, status, menu_order, route_url, icon_class FROM m_menus WHERE status <> 2 ORDER BY menu_order, date_updated DESC`,
  UPDATE_MENU_STATUS = `UPDATE m_menus SET status = $2, date_updated = NOW() WHERE menu_id = $1`,
}

export enum StateQueries {
  LIST_STATES = `SELECT state_id, state_name, created_at FROM m_states ORDER BY state_name ASC`,
}

export enum DistrictQueries {
  LIST_DISTRICTS_BY_STATE = `SELECT district_id, district_name FROM m_districts WHERE state_id = $1 ORDER BY district_name ASC`,
}

export enum ActivityQueries {
  LIST_ACTIVITIES = `SELECT activity_id, activity_name FROM m_activities ORDER BY activity_name ASC`,
}

export enum PasswordPolicyQueries {
  ADD_PASSWORD_POLICY = `INSERT INTO password_policies(password_expiry, password_history, minimum_password_length, complexity, alphabetical, "numeric", special_characters, allowed_special_characters, maximum_invalid_attempts, date_created, date_updated)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
  LIST_PASSWORD_POLICIES = `SELECT id, password_expiry, password_history, minimum_password_length, complexity, alphabetical, numeric, special_characters, allowed_special_characters, maximum_invalid_attempts FROM password_policies ORDER BY date_updated DESC`,
  UPDATE_PASSWORD_POLICY = `UPDATE password_policies SET password_expiry = $2, password_history = $3, minimum_password_length = $4, complexity = $5, alphabetical = $6, numeric = $7, special_characters = $8, allowed_special_characters = $9, maximum_invalid_attempts = $10, date_updated = NOW() WHERE id = $1`,
  EXISTS_BY_PASSWORD_POLICY_ID = `SELECT EXISTS (SELECT 1 FROM password_policies WHERE id = $1)`,
  GET_PASSWORD_POLICY_BY_ID = `SELECT password_expiry, password_history, minimum_password_length, complexity, alphabetical, numeric, special_characters, allowed_special_characters, maximum_invalid_attempts FROM password_policies WHERE id = $1`,
}

export enum RoleQueries {
  LIST_ROLES = "SELECT role_id, role_name, role_description, status from m_roles",
  LIST_ROLES_COUNT = "SELECT count(*) AS count from m_roles",
  UPDATE_ROLE = "UPDATE m_roles SET role_name = $2, role_description = $3, updated_by = $4, date_updated = NOW() WHERE role_id = $1",
  GET_ROLE = "SELECT role_name, role_description, status FROM m_roles WHERE role_id = $1 AND status IN (0, 1)",
  UPDATE_ROLE_STATUS = "UPDATE m_roles SET status = $2, updated_by = $1, date_updated = NOW() WHERE role_id = $3",
  EXISTS_BY_ROLE_ID = `SELECT EXISTS (SELECT 1 FROM m_roles WHERE role_id = $1 AND status IN (0, 1))`,
  EXISTS_BY_ROLE_NAME = `SELECT EXISTS (SELECT 1 FROM m_roles WHERE role_name = $1 AND status = 1)`,
  ADD_ROLE = "INSERT INTO m_roles (role_name, role_description, status, created_by, updated_by, date_created, date_updated) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING role_id",
  ADD_PERMISSIONS = "INSERT INTO access_control (role_id, menu_id, permission_id, created_by, updated_by) values($1, $2, $3, $4, $4)",
  DELETE_EXISTING_PERMISSIONS = "DELETE from access_control where role_id = $1",
  GET_MENUS_LIST = `SELECT menu_id, menu_name AS label, route_url as link, icon_class as icon, status, 'true' as initiallyOpened from m_menus`,
  GET_DEFAULT_ACCESS_LIST = `SELECT menu_id, menu_name, route_url, icon_class, permission_id, permission_name
                               FROM m_menus CROSS JOIN m_permissions WHERE status = 1 ORDER BY menu_id, permission_id`,
  GET_ACCESS_LIST_BY_ROLE_ID = `SELECT mm.menu_id, mm.menu_name, mm.route_url, mm.icon_class,
                               sum(CASE WHEN (ac.permission_id) = 1 THEN 1 ELSE 0 END) write_permission,
                               sum(CASE WHEN (ac.permission_id) = 2 THEN 1 ELSE 0 END) read_permission,
                               (CASE WHEN sum(COALESCE(ac.permission_id, 0)) > 0 THEN 1 ELSE 0 END) display_permission
                               FROM m_menus mm
                               LEFT OUTER JOIN access_control ac ON mm.menu_id = ac.menu_id AND ac.role_id=$1
                               LEFT OUTER JOIN m_permissions mp ON ac.permission_id = mp.permission_id
                               WHERE mm.status=1
                               GROUP BY mm.menu_id, mm.menu_name, mm.route_url, mm.icon_class, mm.menu_order
                               ORDER BY mm.menu_order ASC`,

  GET_COMBINED_ACCESS_BY_ROLE_ID = `
        SELECT
            m.menu_name,
            m.icon_class,
            m.route_url,
            p.permission_name AS access
        FROM
            access_control ac
        JOIN
            m_menus m ON ac.menu_id = m.menu_id
        JOIN
            m_permissions p ON ac.permission_id = p.permission_id
        WHERE
            ac.role_id = $1
        ORDER BY
            m.menu_order ASC,
            m.date_created ASC;
    `,
}

export enum AdminQueries {
  LIST_PLEDGES = `
    SELECT 
      u.pledge_id,
      u.full_name,
      u.mobile_number,
      u.age,
      u.email_id,
      s.state_name,
      d.district_name,
      u.date_updated
    FROM t_pledge_users u
    LEFT JOIN m_states s ON u.state_id = s.state_id
    LEFT JOIN m_districts d ON u.district_id = d.district_id
    WHERE (
      u.full_name ILIKE '%' || $3 || '%'
      OR s.state_name ILIKE '%' || $3 || '%'
      OR d.district_name ILIKE '%' || $3 || '%'
    )
    AND ($4 = 0 OR u.state_id = $4 )
    AND ($5 = 0 OR u.district_id = $5)
    AND (
      $6 = '' 
      OR (
          u.date_updated >= split_part($6, ',', 1)::date
          AND
          u.date_updated < (split_part($6, ',', 2)::date + INTERVAL '1 day')
      )
    )
    ORDER BY u.date_updated DESC
    LIMIT $1 OFFSET $2
`,

  PLEDGE_COUNT = `
    SELECT COUNT(*) as count
    FROM t_pledge_users u
    LEFT JOIN m_states s ON u.state_id = s.state_id
    LEFT JOIN m_districts d ON u.district_id = d.district_id
    WHERE (
      u.full_name ILIKE '%' || $1 || '%'
      OR s.state_name ILIKE '%' || $1 || '%'
      OR d.district_name ILIKE '%' || $1 || '%'
    )
  `,

  TOTAL_PLEDGE_COUNT = `
    SELECT COUNT(*) as count FROM t_pledge_users
   `,

  TOTAL_PLEDGE_TODAY_COUNT = `
    SELECT COUNT(*) as count FROM t_pledge_users WHERE date_updated >= CURRENT_DATE
   `,

  GET_SNO_LIST = `
  SELECT 
    u.user_id,
    u.display_name,
    u.mobile_number,
    u.email_id,
    s.state_id,
    s.state_name,
    d.district_id,
    d.district_name,
    r.role_name,
    u.date_updated
  FROM m_users u
  INNER JOIN m_roles r ON u.role_id = r.role_id
  LEFT JOIN m_states s ON u.state_id = s.state_id
  LEFT JOIN m_districts d ON u.district_id = d.district_id
  WHERE u.role_id = (
      SELECT role_id 
      FROM m_roles 
      WHERE role_name = 'State Nodal Officer'
  ) 
  AND ($4 = 0 OR u.state_id = $4)
  AND (
      u.display_name ILIKE '%' || $3 || '%'
      OR s.state_name ILIKE '%' || $3 || '%'
      OR d.district_name ILIKE '%' || $3 || '%'
  )
  ORDER BY u.date_updated DESC
  LIMIT $1 OFFSET $2
`,

  SNO_COUNT = `
    SELECT COUNT(*) as count
    FROM m_users u
    LEFT JOIN m_states s ON u.state_id = s.state_id
    LEFT JOIN m_districts d ON u.district_id = d.district_id
    LEFT JOIN m_roles r ON u.role_id = r.role_id
    WHERE r.role_name = 'State Nodal Officer'
    AND (
      u.display_name ILIKE '%' || $1 || '%'
      OR s.state_name ILIKE '%' || $1 || '%'
      OR d.district_name ILIKE '%' || $1 || '%'
    )
  `,

  TOTAL_SNO_COUNT = `
    SELECT COUNT(*) as count FROM m_users u
    LEFT JOIN m_roles r ON u.role_id = r.role_id
    WHERE r.role_name = 'State Nodal Officer'
   `,

  GET_USER_BY_USER_ID = `
    SELECT u.user_id, u.display_name, u.mobile_number, u.email_id, u.state_id, u.district_id, u.role_id, r.role_name
    FROM m_users u
    LEFT JOIN m_roles r ON u.role_id = r.role_id
    WHERE u.user_id = $1
    `,

  GET_DNO_LIST = `
  SELECT 
    u.user_id,
    u.display_name,
    u.mobile_number,
    u.email_id,
    s.state_id,
    s.state_name,
    d.district_id,
    d.district_name,
    r.role_name,
    u.date_updated
  FROM m_users u
  INNER JOIN m_roles r ON u.role_id = r.role_id
  LEFT JOIN m_states s ON u.state_id = s.state_id
  LEFT JOIN m_districts d ON u.district_id = d.district_id
  
  WHERE u.role_id = (
      SELECT role_id 
      FROM m_roles 
      WHERE role_name = 'District Nodal Officer'
  ) AND (
      -- If selectedState is provided (> 0), show only that state
      ($4 > 0 AND u.state_id = $4)
      -- Otherwise, apply admin/non-admin logic
      OR ($4 = 0 AND (
          ($6 ILIKE '%Admin%')
          OR (NOT $6 ILIKE '%Admin%' AND u.state_id = $5)
      ))
  )
  AND (
      u.display_name ILIKE '%' || $3 || '%'
      OR s.state_name ILIKE '%' || $3 || '%'
      OR d.district_name ILIKE '%' || $3 || '%'
  )
  ORDER BY u.date_updated DESC
  LIMIT $1 OFFSET $2
`,

  DNO_COUNT = `
    SELECT COUNT(*) as count
    FROM m_users u
    LEFT JOIN m_states s ON u.state_id = s.state_id
    LEFT JOIN m_districts d ON u.district_id = d.district_id
    LEFT JOIN m_roles r ON u.role_id = r.role_id
    WHERE r.role_name = 'District Nodal Officer'
    AND (
      u.display_name ILIKE '%' || $1 || '%'
      OR s.state_name ILIKE '%' || $1 || '%'
      OR d.district_name ILIKE '%' || $1 || '%'
    )
  `,

  TOTAL_DNO_COUNT = `
    SELECT COUNT(*) as count FROM m_users u
    LEFT JOIN m_roles r ON u.role_id = r.role_id
    WHERE r.role_name = 'District Nodal Officer'
   `,

  CREATE_DOCUMENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS t_documents (
      document_id VARCHAR(255) PRIMARY KEY,
      document_name VARCHAR(255) NOT NULL,
      file_url TEXT NOT NULL,
      file_type VARCHAR(100),
      file_size INTEGER,
      is_published BOOLEAN DEFAULT FALSE,
      created_by INT REFERENCES m_users(user_id),
      updated_by INT REFERENCES m_users(user_id),
      date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,

  ADD_DOCUMENT = `
    INSERT INTO t_documents(document_id, document_name, file_url, created_by, updated_by, file_type, file_size, is_published, date_created, date_updated) 
    VALUES ($1, $2, $3, $4, $4, $5, $6, $7, NOW(), NOW())
    RETURNING document_id, document_name, file_url, created_by, updated_by, file_type, file_size, is_published, date_created, date_updated
  `,

  GET_DOCUMENT_BY_ID = `
  SELECT 
    t.document_id, 
    t.document_name, 
    t.file_url, 
    t.file_type, 
    t.file_size, 
    t.is_published,
    t.created_by,
    creator.user_name AS created_by,
    t.updated_by,
    updater.user_name AS updated_by,
    t.date_created, 
    t.date_updated
  FROM t_documents t
  LEFT JOIN m_users creator ON t.created_by = creator.user_id
  LEFT JOIN m_users updater ON t.updated_by = updater.user_id
  WHERE t.document_id = $1
`,

  LIST_DOCUMENTS = `
  SELECT 
    t.document_id, 
    t.document_name, 
    t.file_url, 
    t.file_type, 
    t.file_size, 
    t.is_published,
    t.created_by,
    creator.display_name AS created_by,
    t.updated_by,
    updater.display_name AS updated_by,
    t.date_created, 
    t.date_updated
  FROM t_documents t
  LEFT JOIN m_users creator ON t.created_by = creator.user_id
  LEFT JOIN m_users updater ON t.updated_by = updater.user_id
  WHERE (
    t.document_name ILIKE '%' || $3 || '%'
  )
  ORDER BY t.date_created DESC
  LIMIT $1 OFFSET $2
`,

  DOCUMENTS_COUNT = `
    SELECT COUNT(*) as count
    FROM t_documents
    WHERE (
      document_name ILIKE '%' || $1 || '%'
    )
  `,

  TOTAL_DOCUMENTS_COUNT = `
    SELECT COUNT(*) as count FROM t_documents
  `,

  UPDATE_DOCUMENT = `
    UPDATE t_documents
    SET 
      document_name = $2,
      file_url = COALESCE($3, file_url),
      file_type = COALESCE($4, file_type),
      file_size = COALESCE($5, file_size),
      is_published = $6,
      updated_by = $7,
      date_updated = NOW()
    WHERE document_id = $1
    RETURNING document_id, document_name, file_url, file_type, file_size, is_published, created_by, updated_by, date_created, date_updated
  `,
}

export enum AdminQueries {
  CREATE_EVENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS t_events (
      event_id VARCHAR(255) PRIMARY KEY,
      activity_id INTEGER,
      activity_date DATE,
      activity_title VARCHAR(255),
      coordinating_department_name VARCHAR(255),
      number_of_participants INTEGER,
      number_of_female INTEGER,
      number_of_male INTEGER,
      number_of_educational_institutions INTEGER,
      description TEXT,
      state_id INTEGER,
      district_id INTEGER,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      event_submitted BOOLEAN DEFAULT FALSE,
      created_by INTEGER REFERENCES m_users(user_id),
      updated_by INTEGER REFERENCES m_users(user_id),
      date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,

  CREATE_EVENT_MEDIA_TABLE = `
    CREATE TABLE IF NOT EXISTS t_event_media (
      event_media_id SERIAL PRIMARY KEY,
      event_id VARCHAR(255) NOT NULL REFERENCES t_events(event_id) ON DELETE CASCADE,
      media_url TEXT NOT NULL,
      media_type VARCHAR(50) NOT NULL,
      file_size INTEGER,
      date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,

  ADD_EVENT = `
    INSERT INTO t_events(
      event_id, 
      activity_id, 
      activity_date,
      activity_title,
      coordinating_department_name, 
      number_of_participants, 
      number_of_female, 
      number_of_male, 
      number_of_educational_institutions, 
      description, 
      state_id, 
      district_id, 
      latitude, 
      longitude, 
      event_submitted,
      created_by, 
      updated_by, 
      date_created, 
      date_updated
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, false, $15, $15, NOW(), NOW()) 
    RETURNING *
  `,

  UPDATE_EVENT = `
    UPDATE t_events
    SET
      activity_id = CASE WHEN $2::text IS NOT NULL AND $2::text != '' THEN $2::INTEGER ELSE activity_id END,
      activity_date = CASE WHEN $3::text IS NOT NULL AND $3::text != '' THEN $3::DATE ELSE activity_date END,
      activity_title = CASE WHEN $4::text IS NOT NULL AND $4::text != '' THEN $4 ELSE activity_title END,
      coordinating_department_name = CASE WHEN $5::text IS NOT NULL AND $5::text != '' THEN $5 ELSE coordinating_department_name END,
      number_of_participants = CASE WHEN $6::text IS NOT NULL AND $6::text != '' THEN $6::INTEGER ELSE number_of_participants END,
      number_of_female = CASE WHEN $7::text IS NOT NULL AND $7::text != '' THEN $7::INTEGER ELSE number_of_female END,
      number_of_male = CASE WHEN $8::text IS NOT NULL AND $8::text != '' THEN $8::INTEGER ELSE number_of_male END,
      number_of_educational_institutions = CASE WHEN $9::text IS NOT NULL AND $9::text != '' THEN $9::INTEGER ELSE number_of_educational_institutions END,
      description = CASE WHEN $10::text IS NOT NULL AND $10::text != '' THEN $10 ELSE description END,
      state_id = CASE WHEN $11::text IS NOT NULL AND $11::text != '' THEN $11::INTEGER ELSE state_id END,
      district_id = CASE WHEN $12::text IS NOT NULL AND $12::text != '' THEN $12::INTEGER ELSE district_id END,
      latitude = CASE WHEN $13::text IS NOT NULL AND $13::text != '' THEN $13::DECIMAL(10,8) ELSE latitude END,
      longitude = CASE WHEN $14::text IS NOT NULL AND $14::text != '' THEN $14::DECIMAL(11,8) ELSE longitude END,
      event_submitted = CASE WHEN $15::text IS NOT NULL THEN $15::BOOLEAN ELSE event_submitted END,
      updated_by = $16,
      date_updated = CURRENT_TIMESTAMP
    WHERE event_id = $1
    RETURNING *
  `,

  GET_EVENT_BY_ID = `
    SELECT e.*, 
           s.state_name,
           d.district_name,
           a.activity_name,
           array_agg(json_build_object('event_media_id', em.event_media_id, 'media_url', em.media_url, 'media_type', em.media_type, 'file_size', em.file_size)) FILTER (WHERE em.event_media_id IS NOT NULL) as media_files
    FROM t_events e
    LEFT JOIN t_event_media em ON e.event_id = em.event_id
    LEFT JOIN m_states s ON e.state_id = s.state_id
    LEFT JOIN m_districts d ON e.district_id = d.district_id
    LEFT JOIN m_activities a ON e.activity_id = a.activity_id
    WHERE e.event_id = $1
    GROUP BY e.event_id, s.state_name, d.district_name, a.activity_name
  `,

  LIST_SUBMITTED_EVENTS = `
    SELECT e.*, 
           s.state_name,
           d.district_name,
           a.activity_name,
           array_agg(json_build_object('event_media_id', em.event_media_id, 'media_url', em.media_url, 'media_type', em.media_type, 'file_size', em.file_size)) FILTER (WHERE em.event_media_id IS NOT NULL) as media_files
    FROM t_events e
    LEFT JOIN t_event_media em ON e.event_id = em.event_id
    LEFT JOIN m_states s ON e.state_id = s.state_id
    LEFT JOIN m_districts d ON e.district_id = d.district_id
    LEFT JOIN m_activities a ON e.activity_id = a.activity_id
    WHERE e.event_submitted = true
    AND (
      $3 = '' 
      OR e.activity_title ILIKE '%' || $3 || '%'
      OR a.activity_name ILIKE '%' || $3 || '%'
      OR s.state_name ILIKE '%' || $3 || '%'
      OR d.district_name ILIKE '%' || $3 || '%'
    )
    GROUP BY e.event_id, s.state_name, d.district_name, a.activity_name
    ORDER BY e.date_created DESC
    LIMIT $1 OFFSET $2
  `,

  SUBMITTED_EVENTS_COUNT = `
    SELECT COUNT(*) as count
    FROM t_events e
    LEFT JOIN m_states s ON e.state_id = s.state_id
    LEFT JOIN m_districts d ON e.district_id = d.district_id
    LEFT JOIN m_activities a ON e.activity_id = a.activity_id
    WHERE e.event_submitted = true
    AND (
      $1 = '' 
      OR e.activity_title ILIKE '%' || $1 || '%'
      OR a.activity_name ILIKE '%' || $1 || '%'
      OR s.state_name ILIKE '%' || $1 || '%'
      OR d.district_name ILIKE '%' || $1 || '%'
    )
  `,

  TOTAL_SUBMITTED_EVENTS_COUNT = `
    SELECT COUNT(*) as count FROM t_events WHERE event_submitted = true
  `,

  LIST_DRAFT_EVENTS = `
    SELECT e.*, 
           s.state_name,
           d.district_name,
           a.activity_name,
           array_agg(json_build_object('event_media_id', em.event_media_id, 'media_url', em.media_url, 'media_type', em.media_type, 'file_size', em.file_size)) FILTER (WHERE em.event_media_id IS NOT NULL) as media_files
    FROM t_events e
    LEFT JOIN t_event_media em ON e.event_id = em.event_id
    LEFT JOIN m_states s ON e.state_id = s.state_id
    LEFT JOIN m_districts d ON e.district_id = d.district_id
    LEFT JOIN m_activities a ON e.activity_id = a.activity_id
    WHERE e.event_submitted = false AND e.created_by = $1
    GROUP BY e.event_id, s.state_name, d.district_name, a.activity_name
    ORDER BY e.date_updated DESC
    LIMIT $2 OFFSET $3
  `,

  ADD_EVENT_MEDIA = `
    INSERT INTO t_event_media(event_id, media_url, media_type, file_size)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,

  DELETE_EVENT_MEDIA = `
    DELETE FROM t_event_media WHERE event_media_id = $1
  `,

  DELETE_EVENT = `
    DELETE FROM t_events WHERE event_id = $1
  `,

  SUBMIT_EVENT = `
    UPDATE t_events
    SET event_submitted = true, updated_by = $2, date_updated = NOW()
    WHERE event_id = $1
    RETURNING *
  `,
}

export enum FeedbackQueries {
  CREATE_FEEDBACK_TABLE = `
    CREATE TABLE IF NOT EXISTS t_feedback (
      feedback_id SERIAL PRIMARY KEY,
      feedback TEXT NOT NULL,
      created_by INT REFERENCES m_users(user_id),
      date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,

  ADD_FEEDBACK = `
    INSERT INTO t_feedback(feedback, created_by, date_created, date_updated)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING feedback_id, feedback, created_by, date_created, date_updated
  `,

  GET_FEEDBACK_BY_ID = `
    SELECT 
      f.feedback_id,
      f.feedback,
      f.created_by,
      u.display_name AS created_by_name,
      f.date_created,
      f.date_updated
    FROM t_feedback f
    LEFT JOIN m_users u ON f.created_by = u.user_id
    WHERE f.feedback_id = $1
  `,

  LIST_FEEDBACKS = `
    SELECT 
      f.feedback_id,
      f.feedback,
      f.created_by,
      u.display_name AS created_by_name,
      f.date_created,
      f.date_updated
    FROM t_feedback f
    LEFT JOIN m_users u ON f.created_by = u.user_id
    WHERE (
      f.feedback ILIKE '%' || $3 || '%'
    )
    AND f.created_by = $4
    ORDER BY f.date_created DESC
    LIMIT $1 OFFSET $2
  `,

  FEEDBACKS_COUNT = `
    SELECT COUNT(*) as count
    FROM t_feedback
    WHERE (
      feedback ILIKE '%' || $1 || '%'
    )
    AND created_by = $2
  `,

  TOTAL_FEEDBACKS_COUNT = `
    SELECT COUNT(*) as count FROM t_feedback WHERE created_by = $1
  `,

  UPDATE_FEEDBACK = `
    UPDATE t_feedback
    SET 
      feedback = $2,
      date_updated = NOW()
    WHERE feedback_id = $1
    RETURNING feedback_id, feedback, created_by, date_created, date_updated
  `,

  DELETE_FEEDBACK = `
    DELETE FROM t_feedback WHERE feedback_id = $1
  `,
}
