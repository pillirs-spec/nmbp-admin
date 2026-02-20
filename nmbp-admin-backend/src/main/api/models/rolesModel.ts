import { RoleStatus } from "../../enums/status";
import { IRole } from "../../types/custom";

class Role implements IRole {
  role_id: number;
  role_name: string;
  role_description: string;
  // level: string;
  status: RoleStatus;
  permissions: any;
  date_created: string | undefined;
  date_updated: string | undefined;
  created_by: number | undefined;
  updated_by: number | undefined;

  constructor(role: IRole) {
    this.role_id = role.role_id;
    this.role_name = role.role_name;
    this.role_description = role.role_description;
    // this.level = role.level;
    this.status = role.status || RoleStatus.ACTIVE;
    this.permissions = role.permissions;
    this.date_created = role.date_created;
    this.date_updated = role.date_updated;
    this.created_by = role.created_by;
    this.updated_by = role.updated_by;
  }
}
export { Role };
