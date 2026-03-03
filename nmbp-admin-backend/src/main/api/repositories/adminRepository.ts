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

  getDnoList: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
    selectedState: number,
  ) => {
    const logPrefix = `adminRepository :: getDnoList :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter} :: selectedState :: ${selectedState}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.GET_DNO_LIST,
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

  addDocument: async (
    document_id: string,
    document_name: string,
    file: string,
    userId: number,
    file_type: string,
    file_size: number,
  ) => {
    const logPrefix = `adminRepository :: addDocument :: Parameters :: document_id :: ${document_id} :: document_name :: ${document_name} :: file :: ${file} :: file_type :: ${file_type} :: file_size :: ${file_size} :: userId :: ${userId}`;
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
};

export default adminRepository;
