import { ApiResponse, get } from "../../../../api";

const dashboardListService = {
  activitiesList: async (): Promise<ApiResponse<any>> => {
    return await get("/api/v1/admin/locations/activities");
  },
};

export default dashboardListService;
