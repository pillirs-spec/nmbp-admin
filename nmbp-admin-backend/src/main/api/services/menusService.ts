import { CacheTTL, RedisKeys } from "../../enums";
import { redisKeysFormatter } from "../../helpers";
import { IMenu } from "../../types/custom";
import { menusRepository } from "../repositories";
import {logger,redis} from "ts-commons";

const menusServices={
    createMenu: async (menu: IMenu) => {
        const logPrefix = `menusServices :: createMenu :: ${JSON.stringify(menu)}`;
        try {
            await menusRepository.createMenu(menu);
            await menusServices.clearRedisCache();
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateMenu: async (menu: IMenu) => {
        const logPrefix = `menusServices :: updateMenu :: ${JSON.stringify(menu)}`;
        try {
            await menusRepository.updateMenu(menu);
            await menusServices.clearRedisCache(menu.menu_id);
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    getMenuById: async (menuId: number): Promise<IMenu> => {
        const logPrefix = `menusServices :: getMenuById :: menuId :: ${menuId}`;
        try {
            const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.MENU_BY_ID, { menuId: menuId.toString() });
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) {
                logger.debug(
                    `${logPrefix} :: returned from cachedResult :: ${cacheResult}`
                  );
                return JSON.parse(cacheResult);
            }

            const menu = await menusRepository.getMenuById(menuId);
            logger.debug(
                `${logPrefix} :: returned from DB :: ${menu}`
              );
            if (menu) {
                redis.SetRedis(key, menu, CacheTTL.LONG);
                return menu;
            }
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    listMenus: async (): Promise<IMenu[]> => {
        const logPrefix = `menusServices :: listMenus`;
        try {
            const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.MENUS, {});
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) {
                logger.debug(
                    `${logPrefix} :: returned from cachedResult :: ${cacheResult}`
                  );
                return JSON.parse(cacheResult);
            }

            const menus = await menusRepository.listMenus();
            logger.debug(
                `${logPrefix} :: returned from DB :: ${menus}`
              );
            if (menus && menus.length > 0) {
                redis.SetRedis(key, menus, CacheTTL.LONG);
                return menus;
            }
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateMenuStatus: async (menuId: number, status: number) => {
        const logPrefix = `menusServices :: updateMenuStatus :: menuId :: ${menuId} :: status :: ${status}`;
        try {
            await menusRepository.updateMenuStatus(menuId, status);
            await menusServices.clearRedisCache(menuId);
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    clearRedisCache: async (menuId?: number) => {
        const logPrefix = `menusServices :: clearRedisCache :: menuId :: ${menuId}`;
        try{
            if(menuId) await redis.deleteRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.MENU_BY_ID, { menuId: menuId.toString() }));
            await redis.deleteRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.MENUS, {}));
        }
        catch(error){
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}

export default menusServices;