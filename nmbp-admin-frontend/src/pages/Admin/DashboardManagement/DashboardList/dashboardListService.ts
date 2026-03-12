import { ApiResponse, get, post } from "../../../../api";

const dashboardListService = {
  activitiesList: async (): Promise<ApiResponse<any>> => {
    return await get("/api/v1/admin/locations/activities");
  },

  getAllEventsList: async (payload: any): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/list_events", payload);
  },
};

export default dashboardListService;
