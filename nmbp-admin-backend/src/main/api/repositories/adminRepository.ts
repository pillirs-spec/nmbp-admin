import { STATUS, logger, pg } from "ts-commons";
import { pgQueries } from "../../enums";

const adminRepository = {
  listPledges: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
    selectedState: number,
    selectedDistrict: number,
    dateRange: string,
  ) => {
    const logPrefix = `adminRepository :: listPledges :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter} :: selectedState :: ${selectedState} :: selectedDistrict :: ${selectedDistrict} :: dateRange :: ${dateRange}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.LIST_PLEDGES,
        values: [
          pageSize,
          currentPage,
          searchFilter,
          selectedState,
          selectedDistrict,
          dateRange,
        ],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result : [];
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  pledgeCount: async (searchFilter: string) => {
    const logPrefix = `adminRepository :: pledgeCount :: searchFilter :: ${searchFilter}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.PLEDGE_COUNT,
        values: [searchFilter],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  totalPledgeCount: async () => {
    const logPrefix = `adminRepository :: totalPledgeCount`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.TOTAL_PLEDGE_COUNT,
        values: [],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  totalPledgeTodayCount: async () => {
    const logPrefix = `adminRepository :: totalPledgeTodayCount`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.TOTAL_PLEDGE_TODAY_COUNT,
        values: [],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getSnoList: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
    selectedState: number,
  ) => {
    const logPrefix = `adminRepository :: getSnoList :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter} :: selectedState :: ${selectedState}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.GET_SNO_LIST,
        values: [pageSize, currentPage, searchFilter, selectedState],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result : [];
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  snoCount: async (searchFilter: string) => {
    const logPrefix = `adminRepository :: snoCount :: searchFilter :: ${searchFilter}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.SNO_COUNT,
        values: [searchFilter],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  totalSnoCount: async () => {
    const logPrefix = `adminRepository :: totalSnoCount`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.TOTAL_SNO_COUNT,
        values: [],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getUserByUserId: async (userId: number) => {
    const logPrefix = `adminRepository :: getUserByUserId :: userId :: ${userId}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.GET_USER_BY_USER_ID,
        values: [userId],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0] : null;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getDnoList: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
    selectedState: number,
    stateId: number,
    userRoleName: string,
  ) => {
    const logPrefix = `adminRepository :: getDnoList :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter} :: selectedState :: ${selectedState} :: stateId :: ${stateId} :: userRoleName :: ${userRoleName}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.GET_DNO_LIST,
        values: [
          pageSize,
          currentPage,
          searchFilter,
          selectedState,
          stateId,
          userRoleName,
        ],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result : [];
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  dnoCount: async (searchFilter: string) => {
    const logPrefix = `adminRepository :: dnoCount :: searchFilter :: ${searchFilter}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.DNO_COUNT,
        values: [searchFilter],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  totalDnoCount: async () => {
    const logPrefix = `adminRepository :: totalDnoCount`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.TOTAL_DNO_COUNT,
        values: [],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  listDocuments: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
  ) => {
    const logPrefix = `adminRepository :: listDocuments :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.LIST_DOCUMENTS,
        values: [pageSize, currentPage, searchFilter],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result : [];
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  documentsCount: async (searchFilter: string) => {
    const logPrefix = `adminRepository :: documentsCount :: searchFilter :: ${searchFilter}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.DOCUMENTS_COUNT,
        values: [searchFilter],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  totalDocumentsCount: async () => {
    const logPrefix = `adminRepository :: totalDocumentsCount`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.TOTAL_DOCUMENTS_COUNT,
        values: [],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  addDocument: async (
    document_id: string,
    document_name: string,
    file: string,
    userId: number,
    file_type: string,
    file_size: number,
    is_published: boolean,
  ) => {
    const logPrefix = `adminRepository :: addDocument :: Parameters :: document_id :: ${document_id} :: document_name :: ${document_name} :: file :: ${file} :: file_type :: ${file_type} :: file_size :: ${file_size} :: userId :: ${userId} :: is_published :: ${is_published}`;
    try {
      // First, ensure the table exists
      const createTableQuery = {
        text: pgQueries.AdminQueries.CREATE_DOCUMENTS_TABLE,
        values: [],
      };
      await pg.executeQueryPromise(createTableQuery);
      logger.debug(`${logPrefix} :: Table created/verified`);

      // Then insert the document
      const _query = {
        text: pgQueries.AdminQueries.ADD_DOCUMENT,
        values: [
          document_id,
          document_name,
          file,
          userId,
          file_type,
          file_size,
          is_published,
        ],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0] : null;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getDocumentById: async (document_id: string) => {
    const logPrefix = `adminRepository :: getDocumentById :: document_id :: ${document_id}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.GET_DOCUMENT_BY_ID,
        values: [document_id],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0] : null;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  updateDocument: async (
    document_id: string,
    document_name: string,
    file_url: string | null,
    file_type: string | null,
    file_size: number | null,
    is_published: boolean,
    userId: number,
  ) => {
    const logPrefix = `adminRepository :: updateDocument :: Parameters :: document_id :: ${document_id} :: document_name :: ${document_name} :: file_url :: ${file_url} :: file_type :: ${file_type} :: file_size :: ${file_size} :: is_published :: ${is_published} :: userId :: ${userId}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.UPDATE_DOCUMENT,
        values: [
          document_id,
          document_name,
          file_url,
          file_type,
          file_size,
          is_published,
          userId,
        ],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0] : null;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  addEvent: async (
    event_id: string | null,
    activity_id: number | null,
    activity_date: string | null,
    activity_title: string | null,
    coordinating_department_name: string | null,
    number_of_participants: number | null,
    number_of_female: number | null,
    number_of_male: number | null,
    number_of_educational_institutions: number | null,
    description: string | null,
    state_id: number | null,
    district_id: number | null,
    latitude: number | null,
    longitude: number | null,
    event_submitted: boolean,
    userId: number,
  ) => {
    const logPrefix = `adminRepository :: addEvent :: event_id :: ${event_id}`;
    try {
      // First, ensure the tables exist
      const createEventsTableQuery = {
        text: pgQueries.AdminQueries.CREATE_EVENTS_TABLE,
        values: [],
      };
      await pg.executeQueryPromise(createEventsTableQuery);
      logger.debug(`${logPrefix} :: Events table created/verified`);

      const createEventMediaTableQuery = {
        text: pgQueries.AdminQueries.CREATE_EVENT_MEDIA_TABLE,
        values: [],
      };
      await pg.executeQueryPromise(createEventMediaTableQuery);
      logger.debug(`${logPrefix} :: Event media table created/verified`);

      let result;

      // If event_id is provided and not empty, UPDATE existing event
      if (event_id && typeof event_id === "string" && event_id.trim()) {
        logger.info(`${logPrefix} :: Updating existing event`);
        const _query = {
          text: pgQueries.AdminQueries.UPDATE_EVENT,
          values: [
            event_id,
            activity_id,
            activity_date,
            activity_title,
            coordinating_department_name,
            number_of_participants,
            number_of_female,
            number_of_male,
            number_of_educational_institutions,
            description,
            state_id,
            district_id,
            latitude,
            longitude,
            event_submitted,
            userId,
          ],
        };
        logger.debug(
          `${logPrefix} :: UPDATE query :: ${JSON.stringify(_query)}`,
        );
        const queryResult = await pg.executeQueryPromise(_query);
        result = queryResult.length ? queryResult[0] : null;
      } else {
        // INSERT new event
        logger.info(`${logPrefix} :: Creating new event`);
        const newEventId = require("uuid").v4();
        const _query = {
          text: pgQueries.AdminQueries.ADD_EVENT,
          values: [
            newEventId,
            activity_id,
            activity_date,
            activity_title,
            coordinating_department_name,
            number_of_participants,
            number_of_female,
            number_of_male,
            number_of_educational_institutions,
            description,
            state_id,
            district_id,
            latitude,
            longitude,
            userId,
          ],
        };
        logger.debug(
          `${logPrefix} :: INSERT query :: ${JSON.stringify(_query)}`,
        );
        const queryResult = await pg.executeQueryPromise(_query);
        result = queryResult.length ? queryResult[0] : null;
      }

      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  addEventMedia: async (
    event_id: string,
    media_url: string,
    media_type: string,
    file_size: number,
  ) => {
    const logPrefix = `adminRepository :: addEventMedia :: event_id :: ${event_id}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.ADD_EVENT_MEDIA,
        values: [event_id, media_url, media_type, file_size],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
      return result.length ? result[0] : null;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getEventById: async (event_id: string) => {
    const logPrefix = `adminRepository :: getEventById :: event_id :: ${event_id}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.GET_EVENT_BY_ID,
        values: [event_id],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
      return result.length ? result[0] : null;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  listSubmittedEvents: async (
    pageSize: number,
    pageNumber: number,
    search: string = "",
  ) => {
    const logPrefix = `adminRepository :: listSubmittedEvents`;
    try {
      const offset = (pageNumber - 1) * pageSize;
      const _query = {
        text: pgQueries.AdminQueries.LIST_SUBMITTED_EVENTS,
        values: [pageSize, offset, search],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result count :: ${result.length}`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getSubmittedEventsCount: async (search: string = "") => {
    const logPrefix = `adminRepository :: getSubmittedEventsCount`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.SUBMITTED_EVENTS_COUNT,
        values: [search],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: count :: ${result[0]?.count || 0}`);
      return parseInt(result[0]?.count || 0);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  listDraftEvents: async (
    userId: number,
    pageSize: number,
    pageNumber: number,
  ) => {
    const logPrefix = `adminRepository :: listDraftEvents :: userId :: ${userId}`;
    try {
      const offset = (pageNumber - 1) * pageSize;
      const _query = {
        text: pgQueries.AdminQueries.LIST_DRAFT_EVENTS,
        values: [userId, pageSize, offset],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result count :: ${result.length}`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  deleteEvent: async (event_id: string): Promise<any> => {
    const logPrefix = `adminRepository :: deleteEvent`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.DELETE_EVENT,
        values: [event_id],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: deleted`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  addFeedback: async (userId: number, feedback: string): Promise<any> => {
    const logPrefix = `adminRepository :: addFeedback :: userId :: ${userId} :: feedback :: ${feedback}`;
    try {
      const createFeedbackTableQuery = {
        text: pgQueries.FeedbackQueries.CREATE_FEEDBACK_TABLE,
        values: [],
      };
      await pg.executeQueryPromise(createFeedbackTableQuery);
      logger.debug(`${logPrefix} :: Feedback table created/verified`);

      const _query = {
        text: pgQueries.FeedbackQueries.ADD_FEEDBACK,
        values: [feedback, userId],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: feedback added`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  listFeedback: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
    userId: number,
    userRoleName: string,
  ) => {
    const logPrefix = `adminRepository :: listFeedback`;
    try {
      const offset = (Number(currentPage) - 1) * Number(pageSize);
      const _query = {
        text: pgQueries.FeedbackQueries.LIST_FEEDBACKS,
        values: [pageSize, offset, searchFilter, userId, userRoleName],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result count :: ${result.length}`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  feedbackCount: async (
    searchFilter: string,
    userId: number,
    userRoleName: string,
  ) => {
    const logPrefix = `adminRepository :: feedbackCount :: searchFilter :: ${searchFilter} :: userId :: ${userId} :: userRoleName :: ${userRoleName}`;
    try {
      const _query = {
        text: pgQueries.FeedbackQueries.FEEDBACKS_COUNT,
        values: [searchFilter, userId, userRoleName],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  totalFeedbackCount: async (userId: number) => {
    const logPrefix = `adminRepository :: totalFeedbackCount :: userId :: ${userId}`;
    try {
      const _query = {
        text: pgQueries.FeedbackQueries.TOTAL_FEEDBACKS_COUNT,
        values: [userId],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result[0].count : 0;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  deleteFeedback: async (feedback_id: number): Promise<any> => {
    const logPrefix = `adminRepository :: deleteFeedback`;
    try {
      const _query = {
        text: pgQueries.FeedbackQueries.DELETE_FEEDBACK,
        values: [feedback_id],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: deleted`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
};

export default adminRepository;
