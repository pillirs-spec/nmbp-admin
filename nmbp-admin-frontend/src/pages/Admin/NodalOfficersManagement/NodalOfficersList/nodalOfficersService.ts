import { ApiResponse, get, post } from "../../../../api";

const nodalOfficersService = {
  getStateNodalOfficersList: async (
    payload: any,
  ): Promise<ApiResponse<any>> => {
    return await post("/api/v1/admin/sno_list", payload);
  },
};

export default nodalOfficersService;
