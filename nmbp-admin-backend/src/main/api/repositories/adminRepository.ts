import { STATUS, logger, pg } from "ts-commons";
import { pgQueries } from "../../enums";

const adminRepository = {
  listPledges: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
  ) => {
    const logPrefix = `adminRepository :: listPledges :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter}`;
    try {
      const _query = {
        text: pgQueries.AdminQueries.LIST_PLEDGES,
        values: [pageSize, currentPage, searchFilter],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.info(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result.length ? result : null;
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
};

export default adminRepository;
