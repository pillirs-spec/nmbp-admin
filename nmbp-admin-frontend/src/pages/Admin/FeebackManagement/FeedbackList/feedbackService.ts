import { ApiResponse, del, post } from "../../../../api";

const feedbackService = {
  addFeedback: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/add_feedback", payload);
  },
  getAllFeedbacks: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/list_feedback", payload);
  },

  deleteFeedbackById: async (feedbackId: string): Promise<ApiResponse<any>> => {
    return await del(`/api/v1/admin/delete_feedback/${feedbackId}`);
  },
};

export default feedbackService;
