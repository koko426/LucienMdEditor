﻿(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        module.exports = mod();
    else if (typeof define == "function" && define.amd) // AMD
        return define([], mod);
    else // Plain browser env
        this.PasteArea = mod();
})(function () {

    function PasteArea(id, url, key) {
        this.element = document.getElementById(id);
        this.url = url; //后端处理图片的路径
        this.imgKey = key || "PasteAreaImgKey"; //提到到后端的name

    }
    PasteArea.prototype.paste = function (callback, formData) {
        var thatthat = this;
        this.element.addEventListener('paste', function (e) {//处理目标容器（id）的paste事件

            if (e.clipboardData && e.clipboardData.items[0].type.indexOf('image') > -1) {
                var that = this,
                    reader = new FileReader();
                file = e.clipboardData.items[0].getAsFile();//读取e.clipboardData中的数据

                reader.onload = function (e) { //reader读取完成后，xhr上传
                    var xhr = new XMLHttpRequest(),
                        fd = formData || (new FormData());;
                    xhr.open('POST', thatthat.url, true);
                    xhr.onload = function () {
                        callback.call(that, xhr);
                    }
                    fd.append(thatthat.imgKey, this.result); // this.result得到图片的base64
                    xhr.send(fd);
                }
                reader.readAsDataURL(file);//获取base64编码
            }
        }, false);
    }
    return PasteArea;
})