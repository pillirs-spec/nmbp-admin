import { ApiResponse, get, post } from "../../../../api";

const feedbackService = {
  addFeedback: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/add_feedback", payload);
  },
  getAllFeedbacks: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/list_feedback", payload);
  },
};

export default feedbackService;
