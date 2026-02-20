import { Request, Response } from "express";
import { STATUS } from "ts-commons";

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
    }
}

export default adminController;