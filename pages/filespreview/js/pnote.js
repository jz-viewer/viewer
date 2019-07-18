
var Pnote = function () {
    var self = this;

    self.defaultWidth=200;
    self.defaultHeight=200;

    self.domSize = 1;//默认批注对象只会显示保存一个对象，其余清空
    self.domMap = new Map();
}
Pnote.prototype = {
    init: function () {

    },
    set: function (setting) {
        var pnote = this;
        pnote.defaultHeight=setting.height;
        pnote.defaultWidth=setting.width;
    },
    createDom:function (key, width, height, data) {
        var pnote = this;
        //生成jquery DOM并返回，使其可被加入到html中
        var $dom = $("<div class='fnote'></div>");
        $dom.css({
            position: "absolute",
            display:"inline-block",
            width: width,
            height: height
        });
        for(var i=0;i<data.length;i++){
            var $span=$("<span></span>");
            var height = data[i].height;
            $span.css({
                position: "absolute",
                display:"block",
                top:height
            });
            $span.text(data[i].content);
            $dom.append($span);
        }
        /*pnote.defaultHeight=height;
        pnote.defaultWidth=width;
        pnote.domMap.set(key, $dom);*/
        return $dom;
    },
    getDom:function (key) {
        //获取已有的dom对象
        var pnote = this;
        if(typeof pnote.domMap.get(key)=="undefined"||pnote.domMap.get(key)=="undefined"){
            pnote.createDom(key)
        }
        return pnote.domMap.get(key);
    },
    resizeDom: function (key, width, height) {
        var pnote = this;

        var $dom = pnote.getDom();
        $dom.css({
            width: width,
            height: height
        });
    },
    clearDom: function () {
        //删除保存的所有批注对象
        var pnote = this;
        pnote.domMap.clear();
    }
}
$.pnote = new Pnote();
