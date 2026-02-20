import { Request, Response } from "express";
import { STATUS } from "ts-commons";

export const userController = {
    health: (req: Request, res: Response): Response => {
        /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Health Check'
            #swagger.description = 'Verify that the User Backend service is running and responsive'
        */
        return res.status(STATUS.OK).send({
            data: null,
            message: "User Service is Up and Running!",
        });
    }
}

