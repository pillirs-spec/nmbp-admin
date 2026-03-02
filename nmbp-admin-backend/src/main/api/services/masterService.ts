import { CacheTTL, RedisKeys } from "../../enums";
import { redisKeysFormatter } from "../../helpers";
import { IState } from "../../types/custom";
import { logger, redis } from "ts-commons";
import { masterRepository } from "../repositories";

const masterService = {
  getStates: async (): Promise<IState[]> => {
    const logPrefix = `masterService :: getStates`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.STATES, {});
      const cacheResult = await redis.GetKeyRedis(key);
      if (cacheResult) {
        logger.debug(
          `${logPrefix} :: returned from cachedResult :: ${cacheResult}`,
        );
        return JSON.parse(cacheResult);
      }

      const states = await masterRepository.getStates();
      logger.debug(`${logPrefix} :: returned from DB :: ${states}`);
      if (states && states.length > 0) {
        redis.SetRedis(key, states, CacheTTL.LONG);
        return states;
      }
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getStateByStateId: async (state_id: string): Promise<IState> => {
    const logPrefix = `masterService :: getStateByStateId`;
    try {
      const states = await masterService.getStates();
      const state = states.find(
        (state) => state.state_id === parseInt(state_id),
      );
      if (!state) {
        throw new Error("State not found");
      }
      return state;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getDistrictsByState: async (state_id: string) => {
    const logPrefix = `masterService :: getDistrictsByState`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.DISTRICTS_BY_STATE,
        { state_id },
      );
      const cacheResult = await redis.GetKeyRedis(key);
      if (cacheResult) {
        logger.debug(
          `${logPrefix} :: returned from cachedResult :: ${cacheResult}`,
        );
        return JSON.parse(cacheResult);
      }

      const districts = await masterRepository.getDistrictsByState(state_id);
      if (districts && districts.length > 0) {
        redis.SetRedis(key, districts, CacheTTL.LONG);
      }
      return districts;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getActivities: async () => {
    const logPrefix = `masterService :: getActivities`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.ACTIVITIES,
        {},
      );
      const cacheResult = await redis.GetKeyRedis(key);
      if (cacheResult) {
        logger.debug(
          `${logPrefix} :: returned from cachedResult :: ${cacheResult}`,
        );
        return JSON.parse(cacheResult);
      }

      const activities = await masterRepository.getActivities();
      logger.debug(`${logPrefix} :: returned from DB :: ${activities}`);
      if (activities && activities.length > 0) {
        redis.SetRedis(key, activities, CacheTTL.EXTRA_LONG);
        return activities;
      }
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
};

export default masterService;
