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
    const logPrefix = `adminService :: listDocuments :: Parameters :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter}`;
    try {
      logger.info(`${logPrefix} :: Fetching documents from database`);
      let key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.DOCUMENTS_LIST,
        {},
      );

      if (searchFilter) {
        key += `|search:${searchFilter}`;
      }

      if (pageSize) {
        key += `|limit:${pageSize}`;
      }

      if (currentPage) {
        key += `|offset:${currentPage}`;
      }

      const cachedDocumentsList = await redis.GetKeyRedis(key);
      if (cachedDocumentsList) {
        logger.info(
          `${logPrefix} :: cached result of documents :: ${cachedDocumentsList}`,
        );
        return JSON.parse(cachedDocumentsList);
      }

      const documentsList = await adminRepository.listDocuments(
        pageSize,
        currentPage,
        searchFilter,
      );
      if (documentsList && documentsList.length > 0)
        redis.SetRedis(key, documentsList, CacheTTL.LONG);

      return documentsList;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error fetching documents :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  documentsCount: async (searchFilter: string) => {
    const logPrefix = `adminService :: documentsCount :: Parameters :: searchFilter :: ${searchFilter}`;
    try {
      logger.info(`${logPrefix} :: Counting documents in database`);
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.DOCUMENTS_COUNT,
        { searchFilter },
      );

      const cachedCount = await redis.GetKeyRedis(key);
      if (cachedCount) {
        logger.info(
          `${logPrefix} :: cached count of documents :: ${cachedCount}`,
        );
        return JSON.parse(cachedCount);
      }

      const count = await adminRepository.documentsCount(searchFilter);
      if (count !== null && count !== undefined) {
        redis.SetRedis(key, count, CacheTTL.LONG);
      }
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
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.DOCUMENTS_TOTAL_COUNT,
        {},
      );

      const cachedTotalCount = await redis.GetKeyRedis(key);
      if (cachedTotalCount) {
        logger.info(
          `${logPrefix} :: cached total count of documents :: ${cachedTotalCount}`,
        );
        return JSON.parse(cachedTotalCount);
      }

      const count = await adminRepository.totalDocumentsCount();
      if (count !== null && count !== undefined) {
        redis.SetRedis(key, count, CacheTTL.LONG);
      }
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
    is_published: boolean,
  ) => {
    const logPrefix = `adminService :: addDocuments :: Parameters :: document_id :: ${document_id} :: document_name :: ${document_name} :: file_type :: ${file_type} :: file_size :: ${file_size} :: userId :: ${userId} :: is_published :: ${is_published} :: `;
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
        is_published,
      );

      await adminService.clearDocumentsRedisCache();
      logger.info(
        `${logPrefix} :: Document added and cache invalidated successfully`,
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

  updateDocument: async (
    document_id: string,
    document_name: string,
    file: any,
    userId: number,
    is_published: boolean,
  ) => {
    const logPrefix = `adminService :: updateDocument :: Parameters :: document_id :: ${document_id} :: document_name :: ${document_name} :: userId :: ${userId} :: is_published :: ${is_published}`;
    try {
      logger.info(`${logPrefix} :: Updating document in database`);

      let file_url = null;
      let file_type = null;
      let file_size = null;

      // If a new file is provided, upload it to S3
      if (file) {
        file_url = await uploadToS3(file, userId, document_name);
        file_type = file.mimetype;
        file_size = file.size;
        logger.info(`${logPrefix} :: New file uploaded to S3: ${file_url}`);
      }

      const updatedDocument = await adminRepository.updateDocument(
        document_id,
        document_name,
        file_url,
        file_type,
        file_size,
        is_published,
        userId,
      );

      await adminService.clearDocumentsRedisCache();
      logger.info(
        `${logPrefix} :: Document updated and cache invalidated successfully`,
      );

      return updatedDocument;
    } catch (error) {
      logger.error(
        `${logPrefix} :: Error updating document :: ${error.message} :: ${error}`,
      );
      throw error;
    }
  },

  clearDocumentsRedisCache: async () => {
    const logPrefix = `adminService :: clearDocumentsRedisCache`;
    try {
      const documentsKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.DOCUMENTS_LIST,
        {},
      );
      const documentsCountKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.DOCUMENTS_COUNT,
        {},
      );
      const documentsTotalCountKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.DOCUMENTS_TOTAL_COUNT,
        {},
      );

      await redis.deleteRedisKeyWithPattern(`${documentsKey}*`);
      await redis.deleteRedis(documentsCountKey);
      await redis.deleteRedis(documentsTotalCountKey);

      logger.info(`${logPrefix} :: Documents cache cleared successfully`);
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
    media_files: any[],
    userId: number,
  ) => {
    const logPrefix = `adminService :: addEvent :: event_id :: ${event_id}`;
    try {
      logger.info(
        `${logPrefix} :: ${event_id ? "Updating" : "Creating"} event`,
      );

      // Add/Update event in database
      const eventResult = await adminRepository.addEvent(
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
      );

      if (!eventResult) {
        throw new Error(`Failed to ${event_id ? "update" : "add"} event`);
      }

      // Upload media files to S3 and save to database (if provided)
      const mediaResults = [];
      if (media_files && media_files.length > 0) {
        for (const file of media_files) {
          try {
            // Upload to S3
            const fileName = `events/${eventResult.event_id}/${Date.now()}_${file.name}`;
            const s3Url = await uploadToS3(file, userId, fileName);

            if (s3Url) {
              // Save media info to database
              const mediaType = file.mimetype.startsWith("image/")
                ? "image"
                : "video";
              const mediaResult = await adminRepository.addEventMedia(
                eventResult.event_id,
                s3Url,
                mediaType,
                file.size,
              );
              mediaResults.push(mediaResult);
            }
          } catch (fileError) {
            logger.error(
              `${logPrefix} :: Error uploading file ${file.name} :: ${fileError.message}`,
            );
            // Continue with other files even if one fails
          }
        }
      }

      logger.info(
        `${logPrefix} :: Event ${event_id ? "updated" : "created"} successfully with ${mediaResults.length} media files`,
      );

      const eventsKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.EVENTS_LIST,
        {},
      );
      const eventsCountKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.EVENTS_COUNT,
        {},
      );
      const eventsTotalCountKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.EVENTS_TOTAL_COUNT,
        {},
      );

      await redis.deleteRedisKeyWithPattern(`${eventsKey}*`);
      await redis.deleteRedis(eventsCountKey);
      await redis.deleteRedis(eventsTotalCountKey);

      return {
        event: eventResult,
        media: mediaResults,
      };
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  listSubmittedEvents: async (
    pageSize: number = 10,
    pageNumber: number = 1,
    search: string = "",
  ) => {
    const logPrefix = `adminService :: listSubmittedEvents`;
    try {
      logger.info(
        `${logPrefix} :: pageSize :: ${pageSize} :: pageNumber :: ${pageNumber} :: search :: ${search}`,
      );

      let key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.EVENTS_LIST,
        {},
      );

      if (search) {
        key += `|search:${search}`;
      }

      if (pageSize) {
        key += `|limit:${pageSize}`;
      }

      if (pageNumber) {
        key += `|offset:${pageNumber}`;
      }

      const cachedEvents = await redis.GetKeyRedis(key);
      if (cachedEvents) {
        logger.info(
          `${logPrefix} :: cached result of submitted events :: ${cachedEvents}`,
        );
        return JSON.parse(cachedEvents);
      }

      const events = await adminRepository.listSubmittedEvents(
        pageSize,
        pageNumber,
        search,
      );

      if (events && events.length > 0) {
        redis.SetRedis(key, events, CacheTTL.LONG);
      }

      return events;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getSubmittedEventsCount: async (search: string = "") => {
    const logPrefix = `adminService :: getSubmittedEventsCount`;
    try {
      logger.info(`${logPrefix} :: search :: ${search}`);

      const count = await adminRepository.getSubmittedEventsCount(search);

      logger.info(`${logPrefix} :: Total count :: ${count}`);
      return count;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  listDraftEvents: async (
    userId: number,
    pageSize: number = 10,
    pageNumber: number = 1,
  ) => {
    const logPrefix = `adminService :: listDraftEvents :: userId :: ${userId}`;
    try {
      logger.info(
        `${logPrefix} :: pageSize :: ${pageSize} :: pageNumber :: ${pageNumber}`,
      );

      const events = await adminRepository.listDraftEvents(
        userId,
        pageSize,
        pageNumber,
      );

      logger.info(`${logPrefix} :: Retrieved ${events.length} draft events`);
      return events;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getEventById: async (event_id: string) => {
    const logPrefix = `adminService :: getEventById :: event_id :: ${event_id}`;
    try {
      const event = await adminRepository.getEventById(event_id);

      if (!event) {
        throw new Error("Event not found");
      }

      logger.info(`${logPrefix} :: Event retrieved successfully`);
      return event;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  deleteEvent: async (event_id: string) => {
    const logPrefix = `adminService :: deleteEvent :: event_id :: ${event_id}`;
    try {
      const result = await adminRepository.deleteEvent(event_id);

      logger.info(`${logPrefix} :: Event deleted successfully`);
      const eventsKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.EVENTS_LIST,
        {},
      );
      const eventsCountKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.EVENTS_COUNT,
        {},
      );
      const eventsTotalCountKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.EVENTS_TOTAL_COUNT,
        {},
      );

      await redis.deleteRedisKeyWithPattern(`${eventsKey}*`);
      await redis.deleteRedis(eventsCountKey);
      await redis.deleteRedis(eventsTotalCountKey);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  addFeedback: async (userId: number, feedback: string) => {
    const logPrefix = `adminService :: addFeedback :: userId :: ${userId}`;
    try {
      logger.info(`${logPrefix} :: Adding feedback to database`);

      const feedbackResult = await adminRepository.addFeedback(
        userId,
        feedback,
      );

      if (!feedbackResult) {
        throw new Error(`Failed to add feedback`);
      }

      logger.info(`${logPrefix} :: Feedback added successfully`);

      const feedbackKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.FEEDBACK_LIST,
        {},
      );
      const feedbackCountKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.FEEDBACK_COUNT,
        {},
      );
      const feedbackTotalCountKey = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.FEEDBACK_TOTAL_COUNT,
        {},
      );

      await redis.deleteRedisKeyWithPattern(`${feedbackKey}*`);
      await redis.deleteRedis(feedbackCountKey);
      await redis.deleteRedis(feedbackTotalCountKey);
      return feedbackResult;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  listFeedback: async (
    pageSize: number = 10,
    pageNumber: number = 1,
    search: string = "",
  ) => {
    const logPrefix = `adminService :: listFeedback`;
    try {
      logger.info(
        `${logPrefix} :: pageSize :: ${pageSize} :: pageNumber :: ${pageNumber} :: search :: ${search}`,
      );

      let key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.FEEDBACK_LIST,
        {},
      );

      if (search) {
        key += `|search:${search}`;
      }

      if (pageSize) {
        key += `|limit:${pageSize}`;
      }

      if (pageNumber) {
        key += `|offset:${pageNumber}`;
      }

      const cachedFeedback = await redis.GetKeyRedis(key);
      if (cachedFeedback) {
        logger.info(
          `${logPrefix} :: cached result of feedback :: ${cachedFeedback}`,
        );
        return JSON.parse(cachedFeedback);
      }

      const feedbackList = await adminRepository.listFeedback(
        pageSize,
        pageNumber,
        search,
      );

      if (feedbackList && feedbackList.length > 0) {
        redis.SetRedis(key, feedbackList, CacheTTL.LONG);
      }

      return feedbackList;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
};

export default adminService;
