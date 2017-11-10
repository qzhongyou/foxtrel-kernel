/**
 * @authors       qzhongyou
 * @date          2017-10-14 11:10:54
 * @description   缓存处理工具
 */

'use strict';

var CACHE_ROOT = "";

class Cache {

    /**
     * @description 获取缓存路径
     * @returns {*}
     */
    getCachePath() {
        if (!CACHE_ROOT) {
            CACHE_ROOT = foxtrel.project.getCachePath();
        }
        return CACHE_ROOT;
    }


    /**
     * @description 设置缓存路径
     * @returns {*}
     */
    setCachePath(path) {
        CACHE_ROOT = project.getProjectRoot(path);
    }


    /**
     * @description 删除缓存
     * @returns {*}
     */
    clean() {
        if (foxtrel.util.exists(CACHE_ROOT)) {
            if(foxtrel.util.del(CACHE_ROOT)){
                foxtrel.log.debug(`${CACHE_ROOT}, deleted successfully`);
            }
        }else{
            foxtrel.log.warning(`no such file or directory, lstat ${CACHE_ROOT}`);
        }
    }
}

module.exports = new Cache();