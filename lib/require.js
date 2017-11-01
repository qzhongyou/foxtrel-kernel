/**
 * @authors       qzhongyou
 * @date          2017-10-10 17:52:11
 * @description   插件模块加载
 */

exports.prefixes = ['foxtrel']; //前缀
exports._cache = {};

module.exports = function () {
    //用slice赋值 arguments,防止被改动
    var name = Array.prototype.slice.call(arguments, 0).join('-');
    var names = [];
    for (var i = 0, len = exports.prefixes.length; i < len; i++) {
        try {
            var pluginName = exports.prefixes[i] + "-" + name;
            names.push(pluginName);
            if (exports._cache.hasOwnProperty(name)) {
                return require(exports._cache[name]);
            }
            require.resolve(pluginName);
            try {
                return exports._cache[name] = require(pluginName);
            } catch (err) {
                foxtrel.log.error('load plugin [' + pluginName + '] error : ' + err.message);
            }
        } catch (err) {
            //没有找到模块
            if (err.code !== 'MODULE_NOT_FOUND') {
                throw err;
            }
        }
    }
    foxtrel.log.error('unable to load plugin [' + names.join('] or [') + ']');
};