import { Request, Response } from "express";
import { STATUS } from "ts-commons";

const authController = {
    healthCheck: function (req: Request, res: Response): Response {
        /*
            #swagger.tags = ['Auth']
            #swagger.summary = 'Health Check'
            #swagger.description = 'Verify that the Auth Backend service is running and responsive'
        */
        return res.status(STATUS.OK).send({
            data: null,
            message: "Auth Service is Up and Running!",
        });
    }
}

export default authController;