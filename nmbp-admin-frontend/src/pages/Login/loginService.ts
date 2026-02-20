import { ApiResponse, post } from "../../api";


export const loginService = {
  loginWithPassword: async (
    user_name: string,
    password: string
  ): Promise<ApiResponse<any>> => {
    return await post("/api/v1/auth/admin/login", { user_name, password });
  },
};
