import { ApiResponse, post } from "../../../api";

const resetPasswordService = {
    resetPassword: async (
        txnId: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<ApiResponse<any>> => {
        const payload = {
            txnId,
            newPassword,
            confirmPassword,
        };
        return await post("/api/v1/auth/admin/resetForgetPassword", payload);
    },
};

export default resetPasswordService;
