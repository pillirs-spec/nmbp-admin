import { Response } from "express";
import { Request } from "../../types/express";
import { STATUS, logger } from "ts-commons";
import { errorCodes } from "../../config";
import { adminService } from "../services";

const adminController = {
  health: (req: Request, res: Response): Response => {
    /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Health Check'
                #swagger.description = 'Verify that the Admin Backend service is running and responsive'
        */
    return res.status(STATUS.OK).send({
      data: null,
      message: "Admin Service is Up and Running!",
    });
  },

  getPledges: async (req: Request, res: Response) => {
    const logPrefix = `rolesController :: listRoles`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'List Pledges (Paginated)'
                #swagger.description = 'Retrieve a paginated list of pledges with optional filtering by active status and search term. Requires authentication.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        pageSize: 10,
                        currentPage: 1,
                        searchFilter: "Admin"
                    }
                }    
            */

      const pageSize = req.body.pageSize || 11;
      const currentPage = req.body.currentPage
        ? (req.body.currentPage - 1) * pageSize
        : 11;
      const searchFilter = req.body.searchFilter || "";
      logger.debug(
        `${logPrefix} :: Parsed parameters :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter}`,
      );

      const pledgesList = await adminService.getPledges(
        pageSize,
        currentPage,
        searchFilter,
      );
      const pledgesCount = await adminService.pledgeCount(searchFilter);
      const totalPledgeCount = await adminService.totalPledgeCount();
      const totalPledgeTodayCount = await adminService.totalPledgeTodayCount();

      return res.status(STATUS.OK).send({
        data: {
          pledgesList,
          pledgesCount,
          totalPledgeCount,
          totalPledgeTodayCount,
        },
        message: "Pledges fetched successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.roles.ROLE00000);
    }
  },
};

export default adminController;
