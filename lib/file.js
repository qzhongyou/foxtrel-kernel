/**
 * @authors       qzhongyou
 * @date          2017-10-14 13:02:24
 * @description   文件信息
 */

'use strict';
const {util, project}  = foxtrel;


class File {
    constructor(path) {
        //绝对路径
        var realpath = util.realpath(path);

        //信息
        var pathInfo = util.pathInfo(path);
        //{ext, dirname, basename, filename, isFilePath}
        foxtrel.util.merge(this, pathInfo);

        //是否存在
        this.exists = util.exists(path);

        //是否目录
        this.isDir = util.isDir(path);

        //是否为文件
        this.isFile = util.isFile(path);

        //文本路径
        this.isTextPath = util.isTextFile(path);

        //真实文本
        this.isText = this.isFile && this.isTextPath;

        //图片路径
        this.isImagePath = util.isImageFile(path);

        //真实图片
        this.isImage = this.isFile && this.isImagePath;

        //文件内容
        this.content = util.readFile(path);

        //项目目录
        var root = project.getProjectRoot();

        if (realpath && realpath.indexOf(root) === 0) {
            var len = root.length;
            //相对项目根目录
            this.subpath = realpath.substring(len);
            //相对项目根目录
            this.subdirname = info.dirname.substring(len);
        }
    }

    toString() {
        return path;
    }

    setContent(content) {
        this.content = content;
        return this;
    }
}


module.exports  = File;