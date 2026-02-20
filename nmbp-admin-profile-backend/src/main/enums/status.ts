export enum MenuStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export enum UserStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    DELETED = 2,
    LOCKED = 3,
    LOGGED_IN = 4,
    LOGGED_OUT = 5
}

export enum GenderStatus {
    MALE = 1,
    FEMALE = 2,
    OTHERS = 3
}

export enum RoleStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    DELETED = 2
}

export enum GridDefaultOptions {
    PAGE_SIZE = 50,
    CURRENT_PAGE = 1
}

export enum Levels {
    ADMIN = "Admin",
    SALES = "Sales",
    TECH_SUPPORT = "Tech Support",
    CUSTOMER_SUPPORT = "Customer Support"
}
