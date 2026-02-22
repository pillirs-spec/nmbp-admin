import {
  MenuStatus,
  UserStatus,
  RoleStatus,
  TenantStatus,
  FormBuilderStatus,
} from "../enums/status";

export interface IMenu {
  menu_id: number;
  menu_name: string;
  menu_description: string;
  status: MenuStatus;
  menu_order: number;
  route_url: string;
  icon_class: string;
  date_created: string | undefined;
  date_updated: string | undefined;
}

export interface IState {
  state_id: number;
  state_name: string;
  date_created: string | undefined;
}

export interface IPasswordPolicy {
  id: number;
  password_expiry: number;
  password_history: number;
  minimum_password_length: number;
  complexity: number;
  alphabetical: number;
  numeric: number;
  special_characters: number;
  allowed_special_characters: string;
  maximum_invalid_attempts: number;
  date_created: string | undefined;
  date_updated: string | undefined;
}

export interface IRole {
  role_id: number;
  role_name: string;
  role_description: string;
  status: RoleStatus;
  permissions: any;
  date_created: string | undefined;
  date_updated: string | undefined;
  created_by: number | undefined;
  updated_by: number | undefined;
}

export interface IUser {
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
  state_id: number;
  district_id: number;
  password: string;
  invalid_attempts: string;
  status: UserStatus;
  last_logged_in: string;
  date_created: string | undefined;
  date_updated: string | undefined;
  created_by: number | undefined;
  updated_by: number | undefined;
}

export interface IFormField {
  fieldId: string;
  label: string;
  fieldType: string;
  placeholder: string;
  requiredField: boolean;
  options?: string[];
  minLength?: number;
  maxLength?: number;
  regExPattern?: string;
  regExValidationMessage?: string;
  fileSize?: number;
  fileType?: string;
}

export interface IStepperFormField {
  name: string;
  fieldType?: string;
  validations?: Record<string, any>;
  [key: string]: any;
}

export interface IStepperGroup {
  label: string;
  form_fields: IFormField[];
}

export interface IStepperStep {
  label: string;
  form_fields?: IStepperFormField[];
  groups?: IStepperGroup[];
  labelName?: string;
}

export interface IStepperFormStructure {
  [stepKey: string]: IStepperStep;
}

export interface IFormProject {
  formId: string;
  projectId: string;
  tenantId?: string;
  formName: string;
  labelName: string;
  type?: "NORMAL_FORM" | "STEPPER_FORM";
  fields?: IFormField[] | IStepperFormStructure;
  createdBy: number;
  updatedBy: number;
  dateCreated?: string;
  dateUpdated?: string;
  status?: FormBuilderStatus;
  totalSteps?: number;
}

export interface ITenant {
  tenantId: string;
  tenantName: string;
  status: TenantStatus;
  createdBy: number;
  updatedBy: number;
  dateCreated?: Date;
  dateUpdated?: Date;
}

export interface IProject {
  projectId: string;
  projectName: string;
  tenantId: string;
  status: number;
  createdBy: string;
  updatedBy: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  description?: string;
}
