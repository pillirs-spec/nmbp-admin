-- =============================================
-- RBAC/UBAC Module - Seed Data
-- Run AFTER tables.sql and views.sql
-- =============================================

-- Table: m_roles (must be before m_users due to FK)
INSERT INTO m_roles (role_id, role_name, role_description, level, status, date_created, date_updated, created_by, updated_by)
VALUES (1, 'Super Admin', 'Role for Super Admin', 'Admin', 1, NOW(), NOW(), NULL, NULL);

-- Table: m_permissions
INSERT INTO m_permissions (permission_id, permission_name) VALUES (1, 'Write');
INSERT INTO m_permissions (permission_id, permission_name) VALUES (2, 'Read');

-- Table: m_menus
INSERT INTO m_menus (menu_id, menu_name, menu_description, status, menu_order, route_url, icon_class, date_created, date_updated)
VALUES
(1, 'Dashboard', 'Menu to show Dashboard', 1, 1, '/dashboard', 'fa-solid fa-chart-line', NOW(), NOW()),
(2, 'User Management', 'Menu to manage Users', 1, 2, '/user-management', 'fa-solid fa-users', NOW(), NOW()),
(3, 'Role Management', 'Menu to manage Roles', 1, 3, '/role-management', 'fa-solid fa-user-shield', NOW(), NOW()),
(4, 'Password Policy', 'Menu to configure Password Policy', 1, 8, '/password-policy', 'fa-solid fa-lock', NOW(), NOW()),
(5, 'Tenant Management', 'Menu to manage Tenants', 1, 4, '/tenants', 'fa-solid fa-building', NOW(), NOW());

-- Table: m_users (after m_roles due to FK on role_id)
INSERT INTO m_users (user_id, user_name, display_name, first_name, last_name, mobile_number, email_id, role_id, dob, gender, password, password_last_updated, invalid_attempts, status, last_logged_in, date_created, date_updated, created_by, updated_by, profile_pic_url)
VALUES (1, '1234567890', 'Super Admin', NULL, NULL, 1234567890, NULL, 1, NULL, 1, '$2a$10$Qw03Lk5xfy45Hw5KI94kyeebbnXPKBWBAL12gJQSZvRAe6I9zpCP.', NOW(), 0, 1, NULL, NOW(), NOW(), NULL, NULL, NULL);

-- Table: m_countries
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Afghanistan', 'AF', '+93');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Aland Islands', 'AX', '+358');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Albania', 'AL', '+355');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Algeria', 'DZ', '+213');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('AmericanSamoa', 'AS', '+1684');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Andorra', 'AD', '+376');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Angola', 'AO', '+244');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Anguilla', 'AI', '+1264');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Antarctica', 'AQ', '+672');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Antigua and Barbuda', 'AG', '+1268');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Argentina', 'AR', '+54');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Armenia', 'AM', '+374');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Aruba', 'AW', '+297');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Australia', 'AU', '+61');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Austria', 'AT', '+43');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Azerbaijan', 'AZ', '+994');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Bahamas', 'BS', '+1242');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Bahrain', 'BH', '+973');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Bangladesh', 'BD', '+880');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Barbados', 'BB', '+1246');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Belarus', 'BY', '+375');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Belgium', 'BE', '+32');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Belize', 'BZ', '+501');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Benin', 'BJ', '+229');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Bermuda', 'BM', '+1441');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Bhutan', 'BT', '+975');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Bolivia, Plurinational State of', 'BO', '+591');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Bosnia and Herzegovina', 'BA', '+387');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Botswana', 'BW', '+267');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Brazil', 'BR', '+55');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('British Indian Ocean Territory', 'IO', '+246');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Brunei Darussalam', 'BN', '+673');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Bulgaria', 'BG', '+359');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Burkina Faso', 'BF', '+226');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Burundi', 'BI', '+257');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Cambodia', 'KH', '+855');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Cameroon', 'CM', '+237');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Canada', 'CA', '+1');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Cape Verde', 'CV', '+238');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Cayman Islands', 'KY', '+345');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Central African Republic', 'CF', '+236');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Chad', 'TD', '+235');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Chile', 'CL', '+56');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('China', 'CN', '+86');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Christmas Island', 'CX', '+61');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Cocos (Keeling) Islands', 'CC', '+61');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Colombia', 'CO', '+57');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Comoros', 'KM', '+269');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Congo', 'CG', '+242');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Congo, The Democratic Republic of the Congo', 'CD', '+243');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Cook Islands', 'CK', '+682');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Costa Rica', 'CR', '+506');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Cote d''Ivoire', 'CI', '+225');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Croatia', 'HR', '+385');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Cuba', 'CU', '+53');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Cyprus', 'CY', '+357');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Czech Republic', 'CZ', '+420');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Denmark', 'DK', '+45');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Djibouti', 'DJ', '+253');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Dominica', 'DM', '+1767');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Dominican Republic', 'DO', '+1849');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Ecuador', 'EC', '+593');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Egypt', 'EG', '+20');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('El Salvador', 'SV', '+503');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Equatorial Guinea', 'GQ', '+240');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Eritrea', 'ER', '+291');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Estonia', 'EE', '+372');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Ethiopia', 'ET', '+251');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Falkland Islands (Malvinas)', 'FK', '+500');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Faroe Islands', 'FO', '+298');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Fiji', 'FJ', '+679');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Finland', 'FI', '+358');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('France', 'FR', '+33');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('French Guiana', 'GF', '+594');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('French Polynesia', 'PF', '+689');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Gabon', 'GA', '+241');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Gambia', 'GM', '+220');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Georgia', 'GE', '+995');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Germany', 'DE', '+49');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Ghana', 'GH', '+233');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Gibraltar', 'GI', '+350');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Greece', 'GR', '+30');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Greenland', 'GL', '+299');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Grenada', 'GD', '+1473');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Guadeloupe', 'GP', '+590');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Guam', 'GU', '+1671');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Guatemala', 'GT', '+502');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Guernsey', 'GG', '+44');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Guinea', 'GN', '+224');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Guinea-Bissau', 'GW', '+245');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Guyana', 'GY', '+595');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Haiti', 'HT', '+509');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Holy See (Vatican City State)', 'VA', '+379');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Honduras', 'HN', '+504');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Hong Kong', 'HK', '+852');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Hungary', 'HU', '+36');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Iceland', 'IS', '+354');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('India', 'IN', '+91');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Indonesia', 'ID', '+62');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Iran, Islamic Republic of Persian Gulf', 'IR', '+98');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Iraq', 'IQ', '+964');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Ireland', 'IE', '+353');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Isle of Man', 'IM', '+44');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Israel', 'IL', '+972');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Italy', 'IT', '+39');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Jamaica', 'JM', '+1876');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Japan', 'JP', '+81');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Jersey', 'JE', '+44');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Jordan', 'JO', '+962');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Kazakhstan', 'KZ', '+77');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Kenya', 'KE', '+254');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Kiribati', 'KI', '+686');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Korea, Democratic People''s Republic of Korea', 'KP', '+850');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Korea, Republic of South Korea', 'KR', '+82');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Kuwait', 'KW', '+965');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Kyrgyzstan', 'KG', '+996');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Laos', 'LA', '+856');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Latvia', 'LV', '+371');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Lebanon', 'LB', '+961');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Lesotho', 'LS', '+266');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Liberia', 'LR', '+231');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Libyan Arab Jamahiriya', 'LY', '+218');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Liechtenstein', 'LI', '+423');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Lithuania', 'LT', '+370');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Luxembourg', 'LU', '+352');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Macao', 'MO', '+853');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Macedonia', 'MK', '+389');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Madagascar', 'MG', '+261');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Malawi', 'MW', '+265');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Malaysia', 'MY', '+60');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Maldives', 'MV', '+960');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Mali', 'ML', '+223');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Malta', 'MT', '+356');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Marshall Islands', 'MH', '+692');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Martinique', 'MQ', '+596');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Mauritania', 'MR', '+222');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Mauritius', 'MU', '+230');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Mayotte', 'YT', '+262');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Mexico', 'MX', '+52');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Micronesia, Federated States of Micronesia', 'FM', '+691');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Moldova', 'MD', '+373');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Monaco', 'MC', '+377');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Mongolia', 'MN', '+976');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Montenegro', 'ME', '+382');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Montserrat', 'MS', '+1664');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Morocco', 'MA', '+212');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Mozambique', 'MZ', '+258');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Myanmar', 'MM', '+95');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Namibia', 'NA', '+264');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Nauru', 'NR', '+674');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Nepal', 'NP', '+977');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Netherlands', 'NL', '+31');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Netherlands Antilles', 'AN', '+599');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('New Caledonia', 'NC', '+687');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('New Zealand', 'NZ', '+64');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Nicaragua', 'NI', '+505');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Niger', 'NE', '+227');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Nigeria', 'NG', '+234');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Niue', 'NU', '+683');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Norfolk Island', 'NF', '+672');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Northern Mariana Islands', 'MP', '+1670');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Norway', 'NO', '+47');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Oman', 'OM', '+968');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Pakistan', 'PK', '+92');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Palau', 'PW', '+680');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Palestinian Territory, Occupied', 'PS', '+970');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Panama', 'PA', '+507');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Papua New Guinea', 'PG', '+675');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Paraguay', 'PY', '+595');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Peru', 'PE', '+51');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Philippines', 'PH', '+63');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Pitcairn', 'PN', '+872');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Poland', 'PL', '+48');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Portugal', 'PT', '+351');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Puerto Rico', 'PR', '+1939');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Qatar', 'QA', '+974');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Romania', 'RO', '+40');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Russia', 'RU', '+7');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Rwanda', 'RW', '+250');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Reunion', 'RE', '+262');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Saint Barthelemy', 'BL', '+590');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Saint Helena, Ascension and Tristan Da Cunha', 'SH', '+290');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Saint Kitts and Nevis', 'KN', '+1869');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Saint Lucia', 'LC', '+1758');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Saint Martin', 'MF', '+590');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Saint Pierre and Miquelon', 'PM', '+508');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Saint Vincent and the Grenadines', 'VC', '+1784');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Samoa', 'WS', '+685');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('San Marino', 'SM', '+378');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Sao Tome and Principe', 'ST', '+239');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Saudi Arabia', 'SA', '+966');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Senegal', 'SN', '+221');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Serbia', 'RS', '+381');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Seychelles', 'SC', '+248');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Sierra Leone', 'SL', '+232');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Singapore', 'SG', '+65');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Slovakia', 'SK', '+421');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Slovenia', 'SI', '+386');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Solomon Islands', 'SB', '+677');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Somalia', 'SO', '+252');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('South Africa', 'ZA', '+27');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('South Sudan', 'SS', '+211');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('South Georgia and the South Sandwich Islands', 'GS', '+500');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Spain', 'ES', '+34');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Sri Lanka', 'LK', '+94');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Sudan', 'SD', '+249');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Suriname', 'SR', '+597');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Svalbard and Jan Mayen', 'SJ', '+47');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Swaziland', 'SZ', '+268');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Sweden', 'SE', '+46');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Switzerland', 'CH', '+41');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Syrian Arab Republic', 'SY', '+963');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Taiwan', 'TW', '+886');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Tajikistan', 'TJ', '+992');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Tanzania, United Republic of Tanzania', 'TZ', '+255');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Thailand', 'TH', '+66');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Timor-Leste', 'TL', '+670');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Togo', 'TG', '+228');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Tokelau', 'TK', '+690');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Tonga', 'TO', '+676');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Trinidad and Tobago', 'TT', '+1868');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Tunisia', 'TN', '+216');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Turkey', 'TR', '+90');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Turkmenistan', 'TM', '+993');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Turks and Caicos Islands', 'TC', '+1649');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Tuvalu', 'TV', '+688');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Uganda', 'UG', '+256');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Ukraine', 'UA', '+380');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('United Arab Emirates', 'AE', '+971');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('United Kingdom', 'GB', '+44');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('United States', 'US', '+1');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Uruguay', 'UY', '+598');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Uzbekistan', 'UZ', '+998');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Vanuatu', 'VU', '+678');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Venezuela, Bolivarian Republic of Venezuela', 'VE', '+58');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Vietnam', 'VN', '+84');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Virgin Islands, British', 'VG', '+1284');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Virgin Islands, U.S.', 'VI', '+1340');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Wallis and Futuna', 'WF', '+681');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Yemen', 'YE', '+967');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Zambia', 'ZM', '+260');
INSERT INTO m_countries (country_name, country_code, dial_code) VALUES ('Zimbabwe', 'ZW', '+263');

-- Table: access_control
-- For Super Admin
INSERT INTO access_control (role_id, menu_id, permission_id, date_created, date_updated, created_by, updated_by)
VALUES
(1, 2, 1, NOW(), NOW(), 1, 1),
(1, 3, 1, NOW(), NOW(), 1, 1),
(1, 4, 1, NOW(), NOW(), 1, 1),
(1, 5, 1, NOW(), NOW(), 1, 1);

-- Table: password_policies
INSERT INTO password_policies
    (id, password_expiry, password_history, minimum_password_length, complexity, alphabetical, numeric, special_characters, allowed_special_characters, maximum_invalid_attempts, date_created, date_updated)
VALUES
    (1, 99, 99, 8, 1, 1, 0, 0, '!@#$%^&*()', 99, NOW(), NOW());


    INSERT INTO m_activities (activity_id, activity_name, activity_timestamp) VALUES (1, 'Slogan Writing Competition', NOW(), 2, 'Rangoli Making Competition', NOW(), 3, 'Drawing Competition', NOW(), 4, 'Marathon / Walkthon / yclothon', NOW());

-- Reset sequences to next available value
SELECT setval('m_roles_role_id_seq', (SELECT MAX(role_id) FROM m_roles));
SELECT setval('m_permissions_permission_id_seq', (SELECT MAX(permission_id) FROM m_permissions));
SELECT setval('m_menus_menu_id_seq', (SELECT MAX(menu_id) FROM m_menus));
SELECT setval('m_users_user_id_seq', (SELECT MAX(user_id) FROM m_users));
SELECT setval('password_policies_id_seq', (SELECT MAX(id) FROM password_policies));
