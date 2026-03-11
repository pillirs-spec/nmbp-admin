import { ApiResponse, get, post, put } from "../../../..//api";
export const importantDocumentService = {
  getAllDocumentsList: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/documents/list", payload);
  },

  addDocument: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/add_documents", payload);
  },

  updateDocument: async (
    documentId: string,
    payload: any,
  ): Promise<ApiResponse<any>> => {
    return await put(`/api/v1/admin/documents/${documentId}`, payload);
  },

  getDocumentDetailsByDocumentId: async (
    documentId: string,
  ): Promise<ApiResponse<any>> => {
    return await get(`/api/v1/admin/documents/${documentId}`);
  },

  downloadDocument: async (documentId: string): Promise<ApiResponse<any>> => {
    return await get(`/api/v1/admin/documents/${documentId}/download`);
  },
};
