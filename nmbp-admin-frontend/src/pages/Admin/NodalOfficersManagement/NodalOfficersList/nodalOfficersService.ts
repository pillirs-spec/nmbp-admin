import { ApiResponse, get, post } from "../../../../api";

const nodalOfficersService = {
  getStateNodalOfficersList: async (
    payload: any,
  ): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/sno_list", payload);
  },

  getDistrictNodalOfficersList: async (
    payload: any,
  ): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/dno_list", payload);
  },

  getStatesList: async (): Promise<ApiResponse<any>> => {
    return await get("/api/v1/admin/locations/states");
  },
};

export default nodalOfficersService;
