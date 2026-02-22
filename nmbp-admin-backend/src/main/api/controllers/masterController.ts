import { STATUS, logger } from "ts-commons";
import { Response } from "express";
import { Request } from "../../types/express";
import { errorCodes } from "../../config";
import { masterService } from "../services";

const masterController = {
  getStates: async (req: Request, res: Response) => {
    const logPrefix = `masterController :: getStates`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
            #swagger.tags = ['Locations']
            #swagger.summary = 'List All States'
            #swagger.description = 'This API is used to fetch all the states.'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'JWT token for authentication'
            }
        */
      const states = await masterService.getStates();
      return res.status(STATUS.OK).send({
        data: states,
        message: "States fetched Successfully!",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.states.STATES00000);
    }
  },

  getDistrictsByState: async (req: Request, res: Response) => {
    const logPrefix = `masterController :: getDistrictsByState`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
            #swagger.tags = ['Locations']
            #swagger.summary = 'List Districts by State ID'
            #swagger.description = 'This API is used to fetch all the districts for a given state ID.'
            #swagger.parameters['state_id'] = {
                in: 'path',
                required: true,
                type: 'string',
                description: 'ID of the state to fetch districts for'
            }
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'JWT token for authentication'
            }
        */
      const { state_id } = req.params;
      const state = await masterService.getStateByStateId(state_id);
      if (!state) {
        return res.status(STATUS.NOT_FOUND).send(errorCodes.states.STATES00001);
      }
      const districts = await masterService.getDistrictsByState(state_id);
      return res.status(STATUS.OK).send({
        data: districts,
        message: "Districts fetched Successfully!",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.states.STATES00000);
    }
  },
};

export default masterController;
