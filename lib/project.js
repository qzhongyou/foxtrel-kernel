/**
 * @authors       qzhongyou
 * @date          2017-10-14 11:10:54
 * @description   项目工具
 */

'use strict';

//项目根绝对目录 (类似于私有方法)
var PREJECT_ROOT = "";

//项目暂时绝对路径,包含cache,server，www
var TEMP_ROOT = "";

class Project {

    /**
     * @description 设置项目跟路径
     * @param path
     */
    setProjectRoot(path) {
        if (foxtrel.util.isDir(path)) {
            PREJECT_ROOT = foxtrel.util.realpath(path);
        } else {
            foxtrel.log.error('invalid project root path [' + path + ']');
        }
        return this;
    }

    /**
     * @description 获取目录
     * @returns {string}
     */
    getProjectRoot() {
        if (PREJECT_ROOT) {
            return foxtrel.util.realpathSafe(PREJECT_ROOT  + "/" +  [].join.call(arguments, "/"))
        } else {
            foxtrel.log.error('undefined project root');
            return false;
        }
    }

    /**
     * @description 生成临时目录
     * @param path
     */
    setTempPath(path) {
        function defaultTempRoot() {
            //配置环境变量
            var list = ['LOCALAPPDATA', 'APPDATA', 'HOME'];
            var name = foxtrel.cli && foxtrel.cli.name ? foxtrel.cli.name : 'foxtrel';
            var tmp;
            for (var i = 0, len = list.length; i < len; i++) {
                if (tmp = process.env[list[i]]) {
                    break;
                }
            }
            tmp = tmp || __dirname + '/../';
            tmp = tmp + '/.' + name + '-tmp';
            foxtrel.log.warning('unable to create dir [' + path + '] for  directory. create dir [' + tmp + '] for directory');
            return tmp;
        };
        if (!path) path = defaultTempRoot();

        if (foxtrel.util.exists(path)) {
            //传入参数非目录,使用默认目录
            if (!foxtrel.util.isDir(path)) {
                path = defaultTempRoot();
            }
        } else {
            foxtrel.util.mkdir(path);
        }
        TEMP_ROOT = foxtrel.util.realpath(path);
        return this;
    }

    /**
     * @description 临时目录
     * @returns {*}
     */
    getTempPath() {
        if (!TEMP_ROOT) {
            this.setTempPath();
        }
        return foxtrel.util.realpathSafe(TEMP_ROOT  + "/" +  [].join.call(arguments, "/"));
    }

    /**
     * @description 缓存路径
     * @returns {*}
     */
    getCachePath() {
        return foxtrel.util.realpathSafe(this.getTempPath('cache')  + "/" + [].join.call(arguments, "/"));
    }
}

module.exports = new Project();
