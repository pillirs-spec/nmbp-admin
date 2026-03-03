import { STATUS, logger, redis } from "ts-commons";
import { adminRepository } from "../repositories";
import { redisKeysFormatter } from "../../helpers";
import { CacheTTL, pgQueries, RedisKeys } from "../../enums";
import { IDocument } from "../../types/custom";
import { uploadToS3, getSignedS3Url } from "../../config/uploadToS3";

const adminService = {
  getPledges: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
    selectedState: number,
    selectedDistrict: number,
    dateRange: string,
  ) => {
    const logPrefix = `adminService :: listPledges`;
    try {
      logger.info(`${logPrefix} :: Fetching pledges from database`);
      logger.debug(
        `${logPrefix} :: Parameters:: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter} :: selectedState :: ${selectedState} :: selectedDistrict :: ${selectedDistrict} :: dateRange :: ${dateRange}`,
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
      if (selectedState) {
        key += `|state:${selectedState}`;
        whereQuery += ` AND state_id = '${selectedState}'`;
      }
      if (selectedDistrict) {
        key += `|district:${selectedDistrict}`;
        whereQuery += ` AND district_id = '${selectedDistrict}'`;
      }
      if (dateRange) {
        key += `|dateRange:${dateRange}`;
        whereQuery += ` AND pledge_date >= '${dateRange}'`;
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
        selectedState,
        selectedDistrict,
        dateRange,
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

  listDocuments: async (
    pageSize: number,
    currentPage: number,
    searchFilter: string,
  ) => {
    const logPrefix = `adminService :: listDocuments`;
    try {
      logger.info(`${logPrefix} :: Fetching documents from database`);
      logger.debug(
        `${logPrefix} :: Parameters:: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter}`,
      );

      const documentsList = await adminRepository.listDocuments(
        pageSize,
        currentPage,
        searchFilter,
      );

      return documentsList;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error fetching documents :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  documentsCount: async (searchFilter: string) => {
    const logPrefix = `adminService :: documentsCount`;
    try {
      logger.info(`${logPrefix} :: Counting documents in database`);
      logger.debug(
        `${logPrefix} :: Parameters :: searchFilter :: ${searchFilter}`,
      );

      const count = await adminRepository.documentsCount(searchFilter);
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting documents :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  totalDocumentsCount: async () => {
    const logPrefix = `adminService :: totalDocumentsCount`;
    try {
      logger.info(`${logPrefix} :: Counting total documents in database`);

      const count = await adminRepository.totalDocumentsCount();
      return count;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error counting total documents :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  addDocuments: async (
    document_id: string,
    document_name: string,
    file: string,
    userId: number,
    file_type: string,
    file_size: number,
  ) => {
    const logPrefix = `adminService :: addDocuments :: Parameters :: document_id :: ${document_id} :: document_name :: ${document_name} :: file_type :: ${file_type} :: file_size :: ${file_size} :: userId :: ${userId}`;
    try {
      logger.info(`${logPrefix} :: Adding document to database`);
      const addedDocument = await uploadToS3(file, userId, document_name);
      await adminRepository.addDocument(
        document_id,
        document_name,
        addedDocument,
        userId,
        file_type,
        file_size,
      );
      return addedDocument;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error adding document :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  getDocumentById: async (document_id: string) => {
    const logPrefix = `adminService :: getDocumentById :: document_id :: ${document_id}`;
    try {
      logger.info(`${logPrefix} :: Fetching document details from database`);
      const document = await adminRepository.getDocumentById(document_id);
      return document;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error fetching document :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  getDocumentDownloadUrl: async (document_id: string) => {
    const logPrefix = `adminService :: getDocumentDownloadUrl :: document_id :: ${document_id}`;
    try {
      logger.info(
        `${logPrefix} :: Fetching document and generating download URL`,
      );
      const document = await adminRepository.getDocumentById(document_id);

      if (!document) {
        logger.warn(`${logPrefix} :: Document not found`);
        return null;
      }

      const downloadUrl = await getSignedS3Url(document.file_url, 300); // 5 minutes validity
      logger.info(
        `${logPrefix} :: Download URL generated successfully for file: ${document.file_url}`,
      );
      return downloadUrl;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error generating download URL :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },
};

export default adminService;
