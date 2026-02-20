import { pg, logger } from "ts-commons";
import { pgQueries } from "../../enums";
import { IMenu } from "../../types/custom";
import { MenuStatus } from "../../enums/status";

const menusRepository = {
    createMenu: async (menu: IMenu) => {
        const logPrefix = `menusRepository :: createMenu :: menu :: ${JSON.stringify(menu)}`;
        try {
            const _query = {
                text: pgQueries.MenuQueries.ADD_MENU,
                values: [menu.menu_name, menu.menu_description, menu.status, menu.menu_order, menu.route_url, menu.icon_class]
            }
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
  
    existsByMenuName: async (menuName: string, menuId: number): Promise<boolean> => {
        const logPrefix = `menusRepository :: existsByMenuName :: menuName :: ${menuName} :: menuId :: ${menuId}`;
        try {
            const query: {
                text: string;
                values: string[];
            } = {
                text: pgQueries.MenuQueries.EXISTS_BY_MENU_NAME,
                values: [menuName]
            };
            if (menuId) query.text = query.text.replace("status <> 2", `status <> 2 AND menu_id <> ${menuId}`);
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(query)}`);
            const result = await pg.executeQueryPromise(query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    existsByMenuId: async (menuId: number): Promise<boolean> => {
        const logPrefix = `menusRepository :: existsByMenuId :: menuId :: ${menuId}`;
        try {
            const _query = {
                text: pgQueries.MenuQueries.EXISTS_BY_MENU_ID,
                values: [menuId]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateMenu: async (menu: IMenu) => {
        const logPrefix = `menusRepository :: createMenu :: menu :: ${JSON.stringify(menu)}`;
        try {
            const _query = {
                text: pgQueries.MenuQueries.UPDATE_MENU,
                values: [menu.menu_id, menu.menu_name, menu.menu_description, menu.status, menu.menu_order, menu.route_url, menu.icon_class]
            }
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    listMenus: async (): Promise<IMenu[]> => {
        const logPrefix = `menusRepository :: listMenus`;
        try {
            const _query = {
                text: pgQueries.MenuQueries.LIST_MENUS
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
   
    getMenuById: async (menuId: number): Promise<IMenu> => {
        const logPrefix = `menusRepository :: getMenuById :: menuId :: ${menuId}`;
        try {
            const _query = {
                text: pgQueries.MenuQueries.GET_MENU_BY_ID,
                values: [menuId]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
            return result.length ? result[0] : null;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    
    updateMenuStatus: async (menuId: number, status: MenuStatus) => {
        const logPrefix = `menusRepository :: updateMenuStatus :: menuId :: ${menuId} :: status ::${status}`;
        try {
            const _query = {
                text: pgQueries.MenuQueries.UPDATE_MENU_STATUS,
                values: [menuId, status]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}

export default menusRepository;