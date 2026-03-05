import { ApiResponse, get, post } from "../../../..//api";
export const importantDocumentService = {
  getAllDocumentsList: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/documents/list", payload);
  },

  addDocument: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/add_documents", payload);
  },
};
