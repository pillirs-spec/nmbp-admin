import { UserStatus } from "../enums";

export interface IUser {
    user_id: number;
    user_name: string;
    display_name: string;
    first_name: string;
    last_name: string;
    mobile_number: number;
    level: string;
    email_id: string;
    gender: number;
    dob: string;
    role_id: number;
    password: string;
    invalid_attempts: string;
    status: UserStatus;
    last_logged_in: string;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}
