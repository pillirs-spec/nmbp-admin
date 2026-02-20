import { ApiResponse, get, post } from "../../../../api";


export const addOrUpdateRoleService={
    getDefaultAccessList: async (): Promise<ApiResponse<any>> => {
        return await get('/api/v1/admin/roles/defaultAccessList')
    },
    getAccessList: async (roleId: number): Promise<ApiResponse<any>> => {
        return await get(`/api/v1/admin/roles/accessList/${roleId}`)
    },
    getRole: async (roleId: number): Promise<ApiResponse<any>> => {
        return await get(`/api/v1/admin/roles/${roleId}`)
    },
    addRole: async (roleName: string, roleDescription: string,  permissions: { menu_id: number, permission_id: number }[]): Promise<ApiResponse<any>> => {
        return await post('/api/v1/admin/roles/add', {
            role_name: roleName,
            role_description: roleDescription,
            // level,
            permissions
        })
    },
    updateRole: async (roleId: number, roleName: string, roleDescription: string, permissions: { menu_id: number, permission_id: number }[]): Promise<ApiResponse<any>> => {
        return await post(`/api/v1/admin/roles/update`, {
            role_id: roleId,
            role_name: roleName,
            role_description: roleDescription,
            // level,
            permissions
        })
    },
    listLevels: async (): Promise<ApiResponse<any>> => {
        return await get('/api/v1/admin/roles/listLevels')
    }
};