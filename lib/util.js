/**
 * @authors       qzhongyou
 * @date          2017-10-11 15:33:27
 * @description   工具函数 lodash本地化派生方法
 */

'use strict';
const _ = require('lodash'),
    fs = require('fs'),
    ph = require('path'),
    iconv = require('iconv-lite'),
    crypto = require("crypto")

const TEXT_FILE_EXTS = [
        'css', 'tpl', 'js', 'php',
        'txt', 'json', 'xml', 'htm',
        'text', 'xhtml', 'html', 'md',
        'conf', 'po', 'config', 'tmpl',
        'coffee', 'less', 'sass', 'jsp',
        'scss', 'manifest', 'bak', 'asp',
        'tmp', 'haml', 'jade', 'aspx',
        'ashx', 'java', 'py', 'c', 'cpp',
        'h', 'cshtml', 'asax', 'master',
        'ascx', 'cs', 'ftl', 'vm', 'ejs',
        'styl', 'jsx', 'handlebars'
    ],
    IMAGE_FILE_EXTS = [
        'svg', 'tif', 'tiff', 'wbmp',
        'png', 'bmp', 'fax', 'gif',
        'ico', 'jfif', 'jpe', 'jpeg',
        'jpg', 'woff', 'cur', 'webp',
        'swf', 'ttf', 'eot', 'woff2'
    ];

/**
 * @description isUTF8
 * @param bytes
 */
var isUTF8 = function (bytes) {
    var i = 0;
    while (i < bytes.length) {
        if ((// ASCII
                0x00 <= bytes[i] && bytes[i] <= 0x7F
            )) {
            i += 1;
            continue;
        }

        if ((// non-overlong 2-byte
                (0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
                (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF)
            )) {
            i += 2;
            continue;
        }

        if (
            (// excluding overlongs
                bytes[i] == 0xE0 &&
                (0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
            ) || (// straight 3-byte
                ((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
                bytes[i] == 0xEE ||
                bytes[i] == 0xEF) &&
                (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
            ) || (// excluding surrogates
                bytes[i] == 0xED &&
                (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x9F) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
            )
        ) {
            i += 3;
            continue;
        }

        if (
            (// planes 1-3
                bytes[i] == 0xF0 &&
                (0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
                (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
            ) || (// planes 4-15
                (0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
                (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
                (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
            ) || (// plane 16
                bytes[i] == 0xF4 &&
                (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
                (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
            )
        ) {
            i += 4;
            continue;
        }
        return false;
    }
    return true;
};
/**
 * @description buffer
 * @param buffer
 * @returns {*}
 */
var readBuffer = function (buffer) {
    if (isUtf8(buffer)) {
        buffer = buffer.toString('utf8');
        //带Bom的utf8格式文件删除第一个字符串
        if (buffer.charCodeAt(0) === 0xFEFF) {
            buffer = buffer.substr(1);
        }
    } else {
        buffer = iconv.decode(buffer, 'gbk');
    }
    return buffer;
}


class Util {
    constructor() {
        /**
         *
         * @description set
         */
        this.set = _.set;
        /**
         *
         * @description get
         */
        this.get = _.get;
        /**
         * @description 深克隆
         */
        this.clone = _.cloneDeep;
        /**
         * @description fs.existsSync具有兼容问题
         */
        this.exists = fs.existsSync || ph.existsSync;
        /**
         *@description  平台
         */
        this.isWin = process.platform.indexOf('win') === 0;
    }

    /**
     * @description 字符串填充处理
     * @param str
     * @param len
     * @param fill
     * @param pre
     * @returns {*}
     */
    pad(str, len, fill, pre) {
        if (str.length < len) {
            fill = (new Array(len)).join(fill || ' ');
            if (pre) {
                str = (fill + str).substr(-len);
            } else {
                str = (str + fill).substring(0, len);
            }
        }
        return str;
    }

    /**
     *
     * @param targetValue   目标元素
     * @param srcValue   来源元素
     * @returns {*}
     */
    merge(targetValue, srcValue) {
        if (_.isArray(targetValue) && _.isArray(srcValue)) {
            //合并去重
            targetValue = [...new Set(targetValue.concat(srcValue))];
            //异或
        } else if (_.isArray(targetValue) ^ _.isArray(srcValue)) {
            targetValue = srcValue;
        } else if (typeof targetValue === 'object' && typeof srcValue === 'object') {
            for (var key in srcValue) {
                if (srcValue.hasOwnProperty(key)) {
                    targetValue[key] = merge(targetValue[key], srcValue[key]);
                }
            }
        } else {
            targetValue = srcValue;
        }
        return targetValue;
    }

    /**
     * @description 字符串转义
     * @param str
     * @returns {string|*}
     */
    escapeReg(str) {
        return str.replace(/[\.\\\+\*\?\[\^\]\$\(\){}=!<>\|:\/]/g, '\\$&');
    };

    /**
     * @description 文本文件
     * @param path
     */
    isTextFile(path) {
        return new RegExp('\\.(?:' + TEXT_FILE_EXTS.join("|") + ')$', 'i').test(path || '');
    }

    /**
     * @description 图片类型
     * @param path
     */
    isImageFile(path) {
        new RegExp('\\.(?:' + IMAGE_FILE_EXTS.join("|") + ')$', 'i').test(path || '');
    }

    /**
     *
     * @param pattern
     * @param str
     * @returns {*}
     */

    glob(pattern, str) {
        var me = this;
        var sep = me.escapeReg('/');
        pattern = new RegExp('^' + sep + '?' +
            me.escapeReg(
                pattern
                    .replace(/\\/g, '/')
                    .replace(/^\//, '')
            )
                .replace(new RegExp(sep + '\\*\\*' + sep, 'g'), sep + '.*(?:' + sep + ')?')
                .replace(new RegExp(sep + '\\*\\*', 'g'), sep + '.*')
                .replace(/\\\*\\\*/g, '.*')
                .replace(/\\\*/g, '[^' + sep + ']*')
                .replace(/\\\?/g, '[^' + sep + ']') + '$',
            'i'
        );
        if (typeof str === 'string') {
            return pattern.test(str);
        } else {
            return pattern;
        }
    }

    /**
     * @description 文件
     * @param path
     * @returns {*}
     */
    isFile(path) {
        return this.exists(path) && fs.statSync(path).isFile();
    }

    /**
     * @description 目录
     * @param path
     * @returns {*}
     */
    isDir(path) {
        return this.exists(path) && fs.statSync(path).isDirectory();
    }

    /**
     * @description 文件绝对路径
     * @param path
     * @returns {*}
     */

    realpath(path) {
        if (path && this.exists(path)) {
            path = fs.realpathSync(path);
            if (isWin) {
                path = path.replace(/\\/g, '/');
            }
            if (path !== '/') {
                path = path.replace(/\/$/, '');
            }
            return path;
        } else {
            foxtrel.log.error(`no such file or directory, lstat ${ph.resolve(path)}`);
            return false;
        }
    }

    /**
     * @description 路径的normalize,不一定为真实路径
     * @param path
     * @returns {*}
     */
    realpathSafe(path) {
        if (typeof path !== "string") return path;
        var pth = this.realpath(path);
        if (!pth) {
            pth = ph.normalize(path.replace(/[\/\\]+/g, '/')).replace(/\\/g, '/');
            pth = ph.resolve(pth);
            if (pth !== '/') {
                pth = pth.replace(/\/$/, '');
            }
        }
        return pth;
    }

    /**
     *@description 文件信息
     * @param path
     * @returns {{ext, dirname, basename}}
     */

    pathInfo(path) {
        if (typeof path === "string") {
            path = this.realpathSafe(path);
            var ext, dirname, basename, filename,
                isFilePath = true,
                pos = path.lastIndexOf("."),
                index = path.lastIndexOf("/");

            //文件
            if (pos >= 0 && (pos > index)) {
                // .a隐藏文件
                filename = basename = path.substring(index + 1);
                if (!(index + 1 === pos)) {
                    ext = path.substring(pos + 1);
                    filename = basename.replace(new RegExp("(\\." + ext + ")$"), "");
                }
                basename = path.substring(index + 1);
                //目录
                if (index >= 0) {
                    dirname = path.substring(0, index) || "/";
                }
                //目录
            } else {
                dirname = path;
                isFilePath = false;
            }
            return {ext, dirname, basename, filename, isFilePath};
        } else {
            foxtrel.log.error("Path must be a string");
            return false;
        }
    }

    /**
     * @description mkdir
     * @param path
     * @param mode   权限 默认0777
     */
    mkdir(path, mode) {
        var me = this;
        if (!this.exists(path)) {
            path.split('/').reduce(function (prev, next) {
                if (prev && !me.exists(prev)) {
                    fs.mkdirSync(prev, mode);
                }
                return prev + '/' + next;
            });
            fs.mkdirSync(path, mode);
        } else {
            foxtrel.log.error(`file already exists, mkdir ${path}`);
        }
    }

    /**
     * @description 读取文件
     * @param path
     * @param convert  强制转换
     * @returns
     */
    readFile(path, convert) {
        var content = false;
        if (this.exists(path)) {
            content = fs.readFileSync(path);
            if (convert || this.isTextFile(path)) {
                content = readBuffer(content);
            }
        } else {
            foxtrel.log.error('unable to read file[' + path + ']: No such file.');
        }
        return content;
    }

    /**
     * @description 处理 fs.writeFileSync 写一个不存在的目录会报错
     * @param path
     * @param data
     * @param options
     * @param append
     */
    writeFile(path, data, options, append) {
        if (!this.exists(path)) {
            var pathInfo = this.pathInfo(path);
            if (!this.exists(pathInfo.dirname)) {
                this.mkdir(this.pathInfo(path).dirname);
            }
        }
        if (append) {
            fs.appendFileSync(path, data, options);
        } else {
            fs.writeFileSync(path, data, options);
        }
    }

    /**
     * @description 删除文件
     * @param rPath
     * @param include
     * @param exclude
     * @returns {boolean}
     */

    del(rPath, include, exclude) {
        var me = this;
        var removedAll = true;
        var path;
        if (rPath && me.exists(rPath)) {
            var stat = fs.lstatSync(rPath);
            var isFile = stat.isFile() || stat.isSymbolicLink();

            if (stat.isSymbolicLink()) {
                path = rPath;
            } else {
                path = me.realpath(rPath);
            }

            if (/^(?:\w:)?\/$/.test(path)) {
                foxtrel.log.error('unable to delete directory [' + rPath + '].');
            }

            if (stat.isDirectory()) {
                fs.readdirSync(path).forEach(function (name) {
                    if (name != '.' && name != '..') {
                        removedAll = me.del(path + '/' + name, include, exclude) && removedAll;
                    }
                });
                if (removedAll) {
                    fs.rmdirSync(path);
                }
            } else if (isFile && me.filter(path, include, exclude)) {
                fs.unlinkSync(path);
            } else {
                removedAll = false;
            }
        }
        return removedAll;
    }

    filter(str, include, exclude) {
        var me = this;

        function normalize(pattern) {
            var type = toString.call(pattern);
            switch (type) {
                case '[object String]':
                    return me.glob(pattern);
                case '[object RegExp]':
                    return pattern;
                default:
                    foxtrel.log.error('invalid regexp [' + pattern + '].');
            }
        }

        function match(str, patterns) {
            var matched = false;
            if (Object.prototype.toString.call(patterns) === '[object Array]') {
                patterns = [patterns];
            }
            patterns.every(function (pattern) {
                if (!pattern) {
                    return true;
                }
                matched = matched || str.search(normalize(pattern)) > -1;
                return !matched;
            });
            return matched;
        }

        var isInclude, isExclude;

        if (include) {
            isInclude = match(str, include);
        } else {
            isInclude = true;
        }

        if (exclude) {
            isExclude = match(str, exclude);
        }

        return isInclude && !isExclude;
    }

    /**
     * @description 读文件返回json
     * @param path
     * @returns {{}}
     */
    readJSON(path) {
        var json = _.read(path),
            result = {};
        try {
            result = JSON.parse(json);
        } catch (e) {
            foxtrel.log.error('parse json file[' + path + '] fail, error [' + e.message + ']');
        }
        return result;
    }

    /**
     * @description md5
     * @param data
     * @param len
     * @returns {string}
     */
    md5(data, len) {
        var md5Hash = crypto.createHash('md5'),
            encoding = typeof data === 'string' ? 'utf8' : 'binary';
        md5Hash.update(data, encoding);
        len = len || 7;
        return md5Hash.digest('hex').substring(0, len);
    }
}


module.exports = new Util();



