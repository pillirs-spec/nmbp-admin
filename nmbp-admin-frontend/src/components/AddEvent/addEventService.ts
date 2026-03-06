import { ApiResponse, get, post } from "../../api";

const addEventService = {
  addEvent: async (data: any): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData();

      // Add event_id if updating existing event
      if (data.event_id) {
        formData.append("event_id", data.event_id);
      }

      // STEP 1 FIELDS: Activity Details
      if (data.activity_id) {
        formData.append("activity_id", data.activity_id);
      }
      if (data.activity_title) {
        formData.append("activity_title", data.activity_title);
      }
      if (data.activity_date) {
        formData.append("activity_date", data.activity_date);
      }
      if (data.coordinating_department_name) {
        formData.append(
          "coordinating_department_name",
          data.coordinating_department_name,
        );
      }
      if (
        data.number_of_participants !== undefined &&
        data.number_of_participants !== null &&
        data.number_of_participants !== ""
      ) {
        formData.append(
          "number_of_participants",
          data.number_of_participants.toString(),
        );
      }
      if (
        data.number_of_male !== undefined &&
        data.number_of_male !== null &&
        data.number_of_male !== ""
      ) {
        formData.append("number_of_male", data.number_of_male.toString());
      }
      if (
        data.number_of_female !== undefined &&
        data.number_of_female !== null &&
        data.number_of_female !== ""
      ) {
        formData.append("number_of_female", data.number_of_female.toString());
      }
      if (
        data.number_of_educational_institutions !== undefined &&
        data.number_of_educational_institutions !== null &&
        data.number_of_educational_institutions !== ""
      ) {
        formData.append(
          "number_of_educational_institutions",
          data.number_of_educational_institutions.toString(),
        );
      }
      if (data.description) {
        formData.append("description", data.description);
      }

      // STEP 2 FIELDS: Location Details
      if (data.state_id) {
        formData.append("state_id", data.state_id);
      }
      if (data.district_id) {
        formData.append("district_id", data.district_id);
      }
      if (
        data.latitude !== undefined &&
        data.latitude !== null &&
        data.latitude !== ""
      ) {
        formData.append("latitude", data.latitude.toString());
      }
      if (
        data.longitude !== undefined &&
        data.longitude !== null &&
        data.longitude !== ""
      ) {
        formData.append("longitude", data.longitude.toString());
      }

      // STEP 3 FIELDS: Media Files (single or multiple)
      if (data.media_files && data.media_files.length > 0) {
        data.media_files.forEach((file: File) => {
          formData.append("media_files", file);
        });
      }

      // Submit Flag
      formData.append(
        "event_submitted",
        data.event_submitted ? "true" : "false",
      );

      return await post("/api/v1/admin/add_event", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("addEventService :: addEvent error:", error);
      throw error;
    }
  },

  /**
   * Get Event By ID - Retrieves a specific event (draft or submitted) by ID
   * Use this to load a partially filled draft event back into the form for resume functionality
   */
  getEventById: async (event_id: string): Promise<ApiResponse<any>> => {
    try {
      return await get(`/api/v1/admin/get_event/${event_id}`);
    } catch (error) {
      console.error("addEventService :: getEventById error:", error);
      throw error;
    }
  },

  /**
   * List Events - Retrieves all SUBMITTED events with pagination
   * Used for displaying submitted/published events list
   */
  listEvents: async (filters?: any): Promise<ApiResponse<any>> => {
    try {
      return await post(
        "/api/v1/admin/list_events",
        filters || {
          pageSize: 10,
          pageNumber: 1,
        },
      );
    } catch (error) {
      console.error("addEventService :: listEvents error:", error);
      throw error;
    }
  },

  /**
   * List Draft Events - Retrieves current user's DRAFT events (event_submitted = false)
   * Used for displaying user's draft/ongoing events that can be resumed
   */
  listDraftEvents: async (filters?: any): Promise<ApiResponse<any>> => {
    try {
      return await post(
        "/api/v1/admin/list_draft_events",
        filters || {
          pageSize: 10,
          pageNumber: 1,
        },
      );
    } catch (error) {
      console.error("addEventService :: listDraftEvents error:", error);
      throw error;
    }
  },
};

export default addEventService;
