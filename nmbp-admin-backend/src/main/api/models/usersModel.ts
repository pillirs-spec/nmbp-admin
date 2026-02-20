import { IUser } from "../../types/custom";
import { UserStatus } from "../../enums";

class User implements IUser {
    user_id: number;
    user_name: string;
    display_name: string;
    first_name: string;
    last_name: string;
    mobile_number: number;
    email_id: string;
    gender: number;
    dob: string;
    role_id: number;
    password: string;
    invalid_attempts: string;
    status: number;
    last_logged_in: string;
    date_created: string;
    date_updated: string;
    created_by: number;
    updated_by: number;

  constructor(user: IUser) {
    this.user_id = user.user_id;
    this.user_name = user.mobile_number ? user.mobile_number.toString() : "";
    this.display_name = `${user.first_name ? user.first_name : ""} ${user.last_name ? user.last_name : ""}`;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.mobile_number = user.mobile_number;
    this.email_id = user.email_id;
    this.gender = user.gender;
    this.dob = user.dob;
    this.role_id = user.role_id;
    this.password = user.password;
    this.invalid_attempts = user.invalid_attempts;
    this.status = user.status || UserStatus.ACTIVE;
    this.last_logged_in = user.last_logged_in;
    this.date_created = user.date_created;
    this.date_updated = user.date_updated;
    this.created_by = user.created_by;
    this.updated_by = user.updated_by;
    }
}

export { User }