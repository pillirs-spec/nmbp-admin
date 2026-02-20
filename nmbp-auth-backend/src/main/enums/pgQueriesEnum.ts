export enum UserQueries {
    GET_USER_BY_USERNAME = `SELECT u.user_id, user_name, password, display_name, u.role_id, mobile_number, email_id
	from m_users u left join m_roles r on u.role_id = r.role_id
	WHERE user_name = $1 AND u.status IN (1,4,5)`,
 
    SELECT_ROLE_DETAILS_BY_ROLE_ID = `SELECT * FROM m_roles WHERE role_id = $1`,
 
    GET_INVALID_ATTEMPTS = `SELECT invalid_attempts FROM m_users WHERE user_name = $1`,
 
    GET_MAX_INVALID_LOGIN_ATTEMPTS = `SELECT maximum_invalid_attempts FROM password_policies ORDER BY date_created DESC LIMIT 1`,
 
    INCREMENT_INVALID_ATTEMPTS = `UPDATE m_users SET invalid_attempts = invalid_attempts + 1 WHERE user_name = $1`,
 
    SET_USER_INACTIVE = `UPDATE m_users SET status = 0 WHERE user_name = $1`,
 
    UPDATE_USER_LOGGED_IN_STATUS = `UPDATE m_users SET status = $2, last_logged_in = NOW() WHERE user_name = $1`,
 
    RESET_PASSWORD = `UPDATE m_users SET password = $1, password_last_updated = NOW() WHERE mobile_number = $2`,
 
    EXISTS_BY_USERNAME = `SELECT EXISTS (
                             SELECT 1
                             FROM m_users
                             WHERE user_name = $1 AND status NOT IN (0,2)
                          )`,
 
    EXISTS_BY_MOBILE_NUMBER = `SELECT EXISTS (
                                 SELECT 1
                                 FROM m_users
                                 WHERE mobile_number = $1 AND status NOT IN (0,2)
                              )`,
    RESET_INVALID_ATTEMPTS = `UPDATE m_users SET invalid_attempts = 0 WHERE user_name = $1`
 }
 