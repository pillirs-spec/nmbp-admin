import { STATUS, logger, redis } from "ts-commons";
import { adminRepository } from "../repositories";
import { redisKeysFormatter } from "../../helpers";
import { CacheTTL, pgQueries, RedisKeys } from "../../enums";

const adminService = {
  getPledges: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
  ) => {
    const logPrefix = `adminService :: listPledges`;
    try {
      logger.info(`${logPrefix} :: Fetching pledges from database`);
      logger.debug(
        `${logPrefix} :: Parameters:: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter}`,
      );

      let key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.PLEDGES_LIST,
        {},
      );
      let whereQuery = `WHERE`;

      if (searchFilter) {
        if (searchFilter) key += `|search:${searchFilter}`;
        whereQuery += ` AND role_name ILIKE '%${searchFilter}%'`;
      }

      if (pageSize) {
        key += `|limit:${pageSize}`;
        whereQuery += ` LIMIT ${pageSize}`;
      }

      if (currentPage) {
        key += `|offset:${currentPage}`;
        whereQuery += ` OFFSET ${currentPage}`;
      }

      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.info(
          `${logPrefix} :: cached result of all pledges :: ${cachedResult}`,
        );
        return JSON.parse(cachedResult);
      }

      const pledgesList = await adminRepository.listPledges(
        pageSize,
        currentPage,
        searchFilter,
      );

      if (pledgesList && pledgesList.length > 0)
        redis.SetRedis(key, pledgesList, CacheTTL.LONG);

      return pledgesList;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error fetching pledges :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  pledgeCount: async (searchFilter: string) => {
    const logPrefix = `adminService :: pledgeCount`;
    try {
      logger.info(`${logPrefix} :: Counting pledges in database`);
      logger.debug(
        `${logPrefix} :: Parameters :: searchFilter :: ${searchFilter}`,
      );
      const count = await adminRepository.pledgeCount(searchFilter);
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting pledges :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  totalPledgeCount: async () => {
    const logPrefix = `adminService :: totalPledgeCount`;
    try {
      logger.info(`${logPrefix} :: Counting total pledges in database`);
      const count = await adminRepository.totalPledgeCount();
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting total pledges :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },
};

export default adminService;
