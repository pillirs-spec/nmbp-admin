import { ApiResponse, get, post } from "../../../../api";
export const pledgeReportService = {
  getAllPledgesList: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/pledges", payload);
  },
};
