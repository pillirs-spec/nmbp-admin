import { ApiResponse, get, post } from "../../api";

export const formService = {
  getFormByIdentifiers: async (
    payload: unknown,
  ): Promise<ApiResponse<unknown>> => {
    return await post(
      "/api/v1/admin/apiFormBulder/getFormByIdentifiers",
      payload,
    );
  },

  /**
   * Creates/submits an API form.
   * If a step key is provided (for stepper forms), it is also sent as a query param.
   */
  createApiBuilderForm: async (
    payload: unknown,
    stepKey?: string,
  ): Promise<ApiResponse<unknown>> => {
    const config =
      stepKey != null
        ? {
            params: {
              step: stepKey,
            },
          }
        : {};

    return await post(
      "/api/v1/admin/apiFormBulder/createApiFormBuilder",
      payload,
      config,
    );
  },
  getFormDetailsByIdentifiers: async (
    tenantId: string,
    projectId: string,
    formName: string,
    userId: number,
  ): Promise<ApiResponse<unknown>> => {
    return await get("/api/v1/admin/apiFormBulder/getFormDetailsByIdentifiers", {
      params: {
        tenantId,
        projectId,
        formName,
        userId,
      },
    });
  },
};
