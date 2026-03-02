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
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.PLEDGES_COUNT,
        { searchFilter },
      );

      const cachedCount = await redis.GetKeyRedis(key);
      if (cachedCount) {
        logger.info(
          `${logPrefix} :: cached count of pledges :: ${cachedCount}`,
        );
        return JSON.parse(cachedCount);
      }

      const count = await adminRepository.pledgeCount(searchFilter);
      if (count !== null && count !== undefined) {
        redis.SetRedis(key, count, CacheTTL.LONG);
      }
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
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.PLEDGES_TOTAL_COUNT,
        {},
      );

      const cachedTotalCount = await redis.GetKeyRedis(key);
      if (cachedTotalCount) {
        logger.info(
          `${logPrefix} :: cached total count of pledges :: ${cachedTotalCount}`,
        );
        return JSON.parse(cachedTotalCount);
      }
      const count = await adminRepository.totalPledgeCount();
      if (count !== null && count !== undefined) {
        redis.SetRedis(key, count, CacheTTL.LONG);
      }
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting total pledges :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  totalPledgeTodayCount: async () => {
    const logPrefix = `adminService :: totalPledgeTodayCount`;
    try {
      logger.info(`${logPrefix} :: Counting today's pledges in database`);
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.PLEDGES_TODAY_TOTAL_COUNT,
        {},
      );

      const cachedTodayCount = await redis.GetKeyRedis(key);
      if (cachedTodayCount) {
        logger.info(
          `${logPrefix} :: cached total count of today's pledges :: ${cachedTodayCount}`,
        );
        return JSON.parse(cachedTodayCount);
      }
      const count = await adminRepository.totalPledgeTodayCount();
      if (count !== null && count !== undefined) {
        redis.SetRedis(key, count, CacheTTL.LONG);
      }
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting today's pledges :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  getSnoList: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
    selectedState: number,
  ) => {
    const logPrefix = `adminService :: getSnoList :: Parameters :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter} :: selectedState :: ${selectedState}`;
    try {
      logger.info(`${logPrefix} :: Fetching SNO list from database`);
      let key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.SNO_LIST, {});
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
      if (selectedState) {
        key += `|state:${selectedState}`;
        whereQuery += ` AND state_id = '${selectedState}'`;
      }

      const cachedSnoList = await redis.GetKeyRedis(key);
      if (cachedSnoList) {
        logger.info(
          `${logPrefix} :: cached result of all pledges :: ${cachedSnoList}`,
        );
        return JSON.parse(cachedSnoList);
      }
      const snoList = await adminRepository.getSnoList(
        pageSize,
        currentPage,
        searchFilter,
        selectedState,
      );
      if (snoList && snoList.length > 0)
        redis.SetRedis(key, snoList, CacheTTL.LONG);

      return snoList;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error fetching SNO list :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  snoCount: async (searchFilter: string) => {
    const logPrefix = `adminService :: snoCount :: Parameters :: searchFilter :: ${searchFilter}`;
    try {
      logger.info(`${logPrefix} :: Counting SNOs in database`);
      const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.SNO_COUNT, {
        searchFilter,
      });

      const cachedCount = await redis.GetKeyRedis(key);
      if (cachedCount) {
        logger.info(`${logPrefix} :: cached count of SNOs :: ${cachedCount}`);
        return JSON.parse(cachedCount);
      }

      const count = await adminRepository.snoCount(searchFilter);
      if (count !== null && count !== undefined) {
        redis.SetRedis(key, count, CacheTTL.LONG);
      }
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting SNOs :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  totalSnoCount: async () => {
    const logPrefix = `adminService :: totalSnoCount`;
    try {
      logger.info(`${logPrefix} :: Counting total SNOs in database`);
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.SNO_TOTAL_COUNT,
        {},
      );

      const cachedTotalCount = await redis.GetKeyRedis(key);
      if (cachedTotalCount) {
        logger.info(
          `${logPrefix} :: cached total count of SNO's:: ${cachedTotalCount}`,
        );
        return JSON.parse(cachedTotalCount);
      }
      const count = await adminRepository.totalSnoCount();
      if (count !== null && count !== undefined) {
        redis.SetRedis(key, count, CacheTTL.LONG);
      }
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting total pledges :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  getDnoList: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
    selectedState: number,
  ) => {
    const logPrefix = `adminService :: getDnoList :: Parameters :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter} :: selectedState :: ${selectedState}`;
    try {
      logger.info(`${logPrefix} :: Fetching DNO list from database`);
      let key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.DNO_LIST, {});
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
      if (selectedState) {
        key += `|state:${selectedState}`;
        whereQuery += ` AND state_id = '${selectedState}'`;
      }

      const cachedSnoList = await redis.GetKeyRedis(key);
      if (cachedSnoList) {
        logger.info(
          `${logPrefix} :: cached result of all pledges :: ${cachedSnoList}`,
        );
        return JSON.parse(cachedSnoList);
      }
      const snoList = await adminRepository.getDnoList(
        pageSize,
        currentPage,
        searchFilter,
        selectedState,
      );
      if (snoList && snoList.length > 0)
        redis.SetRedis(key, snoList, CacheTTL.LONG);

      return snoList;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error fetching SNO list :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  dnoCount: async (searchFilter: string) => {
    const logPrefix = `adminService :: dnoCount :: Parameters :: searchFilter :: ${searchFilter}`;
    try {
      logger.info(`${logPrefix} :: Counting DNOs in database`);
      const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.DNO_COUNT, {
        searchFilter,
      });

      const cachedCount = await redis.GetKeyRedis(key);
      if (cachedCount) {
        logger.info(`${logPrefix} :: cached count of DNOs :: ${cachedCount}`);
        return JSON.parse(cachedCount);
      }

      const count = await adminRepository.dnoCount(searchFilter);
      if (count !== null && count !== undefined) {
        redis.SetRedis(key, count, CacheTTL.LONG);
      }
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting DNOs :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  totalDnoCount: async () => {
    const logPrefix = `adminService :: totalDnoCount`;
    try {
      logger.info(`${logPrefix} :: Counting total DNOs in database`);
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.DNO_TOTAL_COUNT,
        {},
      );

      const cachedTotalCount = await redis.GetKeyRedis(key);
      if (cachedTotalCount) {
        logger.info(
          `${logPrefix} :: cached total count of DNO's:: ${cachedTotalCount}`,
        );
        return JSON.parse(cachedTotalCount);
      }
      const count = await adminRepository.totalDnoCount();
      if (count !== null && count !== undefined) {
        redis.SetRedis(key, count, CacheTTL.LONG);
      }
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting total DNOs :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },
};

export default adminService;
