import { ApiResponse, post } from "../../../api";


const forgotPasswordService = {
    sendOtp: async (mobile: string): Promise<ApiResponse<any>> => {
        const payload = {
          mobile_number: mobile,
        };
        return await post("/api/v1/auth/admin/getForgetPasswordOtp", payload);
      },
    
      verifyOtp: async (
        txnId: string,
        otp: string
      ): Promise<ApiResponse<any>> => {
        const payload = {
          otp,
          txnId,
        };
        return await post("/api/v1/auth/admin/verifyForgetPasswordOtp", payload);
      },
};

export default forgotPasswordService;