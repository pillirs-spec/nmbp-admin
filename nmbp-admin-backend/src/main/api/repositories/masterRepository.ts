import { pg, logger } from "ts-commons";
import { pgQueries } from "../../enums";
import { IState } from "../../types/custom";

const masterRepository = {
  getStates: async (): Promise<IState[]> => {
    const logPrefix = `masterRepository :: getStates`;
    try {
      const _query = {
        text: pgQueries.StateQueries.LIST_STATES,
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  getDistrictsByState: async (state_id: string) => {
    const logPrefix = `masterRepository :: getDistrictsByState`;
    try {
      const _query = {
        text: pgQueries.DistrictQueries.LIST_DISTRICTS_BY_STATE,
        values: [state_id],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
};

export default masterRepository;
