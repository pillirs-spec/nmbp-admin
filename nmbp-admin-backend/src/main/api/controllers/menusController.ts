import { Request, Response } from "express";
import { logger, STATUS } from "ts-commons";
import { menusModel } from "../models";
import { menusRepository } from "../repositories";
import { menusServices } from "../services";
import { errorCodes } from "../../config";
import { menusValidations } from "../validations";

const menusController = {
  createMenu: async (req: Request, res: Response) => {
    const logPrefix = `menusController :: createMenu`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /* 
           #swagger.tags = ['Menus']
           #swagger.summary = 'Create Menu'
           #swagger.description = 'Create a new navigation menu item with name, description, order, route URL, and icon class. Menu names must be unique.'
           #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'JWT token for authentication'
            }
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    menu_name: 'Categories',
                    menu_description: 'Menu to manage categories',
                    menu_order: 1,
                    route_url: '/categories',
                    icon_class: 'fa fa-menu'
                }
            }
            */

      const menu = new menusModel.Menu(req.body);
      logger.debug(`${logPrefix} :: Parsed parameters :: menu :: ${JSON.stringify(menu)}`);
      const { error } = menusValidations.validateCreateMenu(menu);
      if (error) {
          if (error.details != null)
              return res.status(STATUS.BAD_REQUEST).send({ errorCode: errorCodes.menus.MENUS000.errorCode, errorMessage: error.details[0].message });
          else return res.status(STATUS.BAD_REQUEST).send({ errorCode: errorCodes.menus.MENUS000.errorCode, errorMessage: error.message });
      }
      const menuNameExists = await menusRepository.existsByMenuName(
        menu.menu_name,
        null
      );
      if (menuNameExists)
      return res.status(STATUS.BAD_REQUEST).send(errorCodes.menus.MENUS005);
      await menusServices.createMenu(menu);
      return res.status(STATUS.OK).send({
        data: null,
        message: "Menu Created Successfully!",
      });
    } catch (error) {
        logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.menus.MENUS000);
    }
  },

  updateMenu: async (req: Request, res: Response) => {
    const logPrefix = `menusController :: updateMenu`;
      try {
        logger.info(`${logPrefix} :: Request received`);
        /*  
            #swagger.tags = ['Menus']
            #swagger.summary = 'Update Menu'
            #swagger.description = 'Update an existing menu item details including name, description, order, route URL, and icon class'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'JWT token for authentication'
            }
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    menu_id: 1,
                    menu_name: 'Categories',
                    menu_description: 'Menu to manage categories',
                    menu_order: 1,
                    route_url: '/categories',
                    icon_class: 'fa fa-menu'
                }
            }    
        */
        const menu = new menusModel.Menu(req.body);
        logger.debug(`${logPrefix} :: Parsed parameters :: menu :: ${JSON.stringify(menu)}`);

        const { error } = menusValidations.validateUpdateMenu(menu);
        if (error) {
            if (error.details != null)
                return res.status(STATUS.BAD_REQUEST).send({ errorCode: errorCodes.menus.MENUS000.errorCode, errorMessage: error.details[0].message });
            else return res.status(STATUS.BAD_REQUEST).send({ errorCode: errorCodes.menus.MENUS000.errorCode, errorMessage: error.message });
        }

        const menuIdExists = await menusRepository.existsByMenuId(menu.menu_id);
        if (!menuIdExists) return res.status(STATUS.BAD_REQUEST).send(errorCodes.menus.MENUS001);

        const menuNameExists = await menusRepository.existsByMenuName(menu.menu_name, menu.menu_id);
        if (menuNameExists) return res.status(STATUS.BAD_REQUEST).send(errorCodes.menus.MENUS005);

        await menusServices.updateMenu(menu);
        return res.status(STATUS.OK).send({
            data: null,
            message: "Menu Updated Successfully!"
        });
    } catch (error) {
        logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.menus.MENUS000);
     }
   },


   getMenus: async (req: Request, res: Response) => {
    const logPrefix = `menusController :: getMenus`;
    try {
      logger.info(`${logPrefix} :: Request received`);
       /*  
            #swagger.tags = ['Menus']
            #swagger.summary = 'List All Menus'
            #swagger.description = 'Retrieve the complete list of all navigation menu items'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'JWT token for authentication'
            }
        */
        const menus = await menusServices.listMenus();
        return res.status(STATUS.OK).send({
            data: menus,
            message: "Menus Fetched Successfully!"
        });
    } catch (error) {
        logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.menus.MENUS000);
     }
   },

    
    getMenu: async (req: Request, res: Response) => {
      const logPrefix = `menusController :: getMenu`;
      try {
        logger.info(`${logPrefix} :: Request received`);
     /*  
          #swagger.tags = ['Menus']
          #swagger.summary = 'Get Menu by ID'
          #swagger.description = 'Retrieve a specific menu item by its ID (passed as URL parameter)'
          #swagger.parameters['Authorization'] = {
              in: 'header',
              required: true,
              type: 'string',
              description: 'JWT token for authentication'
          }
      */
      const { menuId } = req.params;
      logger.debug(`${logPrefix} :: Parsed parameters :: menuId :: ${JSON.stringify(menuId)}`);
      if (!menuId) return res.status(STATUS.BAD_REQUEST).send(errorCodes.menus.MENUS002);

      const menuIdExists = await menusRepository.existsByMenuId(parseInt(menuId));
      if (!menuIdExists) return res.status(STATUS.BAD_REQUEST).send(errorCodes.menus.MENUS001);

      const menu = await menusServices.getMenuById(parseInt(menuId));
      return res.status(STATUS.OK).send({
          data: menu,
          message: "Menu Fetched Successfully!"
      });
  } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.menus.MENUS000);
      }
   },
    

   updateMenuStatus: async (req: Request, res: Response) => {
    const logPrefix = `menusController :: updateMenuStatus`;
    try {
      logger.info(`${logPrefix} :: Request received`);
   /*  
        #swagger.tags = ['Menus']
        #swagger.summary = 'Update Menu Status'
        #swagger.description = 'Endpoint to activate or deactivate a menu item by its ID'
        #swagger.parameters['Authorization'] = {
            in: 'header',
            required: true,
            type: 'string',
            description: 'JWT token for authentication'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                menuId: 1,
                status: 1
            }
        }
    */
        const { menuId, status } = req.body;
        logger.debug(`${logPrefix} :: Parsed parameters :: menuId :: ${menuId} :: status :: ${status}`);

        const { error } = menusValidations.validateUpdateMenuStatus(req.body);
        if (error) {
            if (error.details != null)
                return res.status(STATUS.BAD_REQUEST).send({ errorCode: errorCodes.menus.MENUS000.errorCode, errorMessage: error.details[0].message });
            else return res.status(STATUS.BAD_REQUEST).send({ errorCode: errorCodes.menus.MENUS000.errorCode, errorMessage: error.message });
        }

        const menuIdExists = await menusRepository.existsByMenuId(parseInt(menuId));
        if (!menuIdExists) return res.status(STATUS.BAD_REQUEST).send(errorCodes.menus.MENUS001);

        await menusServices.updateMenuStatus(parseInt(menuId), status);
        return res.status(STATUS.OK).send({
            data: null,
            message: "Menu Status Updated Successfully!"
        });
    } catch (error) {
        logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.menus.MENUS000);
    }
}
}


export default menusController;
