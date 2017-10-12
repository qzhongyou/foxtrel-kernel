/**
 * @authors       qzhongyou
 * @date          2017-10-11 15:33:27
 * @description   工具函数 lodash本地化派生方法
 */

'use strict';
const _ = require('lodash'),
    fs = require('fs'),
    ph = require('path'),
    iconv = require('iconv-lite');


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
var readBuffer = function(buffer){
    if(isUtf8(buffer)){
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
    }

    /**
     * @description 平台
     * @returns {boolean}
     */
    isWin() {
        return process.platform.indexOf('win') === 0;
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
                    targetValue[key] = customizer(targetValue[key], srcValue[key]);
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
        new RegExp('\\.(?:' + TEXT_FILE_EXTS.join("|") + ')$', 'i');
    }

    /**
     * @description 图片类型
     * @param path
     */
    isImageFile(path) {
        new RegExp('\\.(?:' + IMAGE_FILE_EXTS.join("|") + ')$', 'i');
    }

    /**
     * @description mkdir
     * @param path
     * @param mode   权限 默认0777
     */
    mkdir(path, mode) {
        if (!this.exists(path)) {
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
            foxtrel.log.error('unable to read file[' + path + ']: No such file or directory.');
        }
        return content;
    }
}

module.exports = new Util();