/**
 * 树形菜单操作
 */
var TreeOp = function(){

    var self = this;

    var nodeIndex = 0;

    this.setting = {
        view: {
            showLine: false,
            nameIsHTML: true
        },
        //上级id相同分层
        data: {
            simpleData: {
                enable: true
            },
        },
        callback: {
            onClick: this.zTreeOnClick, //回调点击函数
            onRightClick: this.zTreeOnRightClick,//右键回调函数
            /*beforeDrag: this.beforeDrag,
            beforeDrop: this.beforeDrop,
            onDrop: this.onDrop*/
        },
        edit: {
            enable: false,
            showRemoveBtn: false,
            showRenameBtn: false,
            drap:{
                isCopy:false,
                isMove:false,
            }
        }
    };
}
/**
 * TreeOp prototype
 */
TreeOp.prototype = {

    beforeDrag: function(treeId, treeNodes) {
        if($.dataTrans.source=="1"){
            layer.msg("禁止移动文件");
            return false;
        }else if($.dataTrans.source=="2"){
            layer.msg("禁止在客户端进行该操作");
            return false;
        }
        var nodeLevel = 0;
        for (var i=0,l=treeNodes.length; i<l; i++) {
            if (treeNodes[i].drag === false) {
                return false;
            }
            //判断是否所有节点均为同一级别
            if(nodeLevel!=0&&nodeLevel!=treeNodes[i].level){
                return false;
            }
            nodeLevel = treeNodes[i].level;//保存移动节点的级别
        }
        return true;
    },
    beforeDrop: function(treeId, treeNodes, targetNode, moveType) {
        var isDirChange = false;
        for (var i=0,l=treeNodes.length; i<l; i++) {
            if (treeNodes[i].drag === false) {
                return false;
            }
            if(moveType=="inner"){
                //判断是否上一级别的
                if(treeNodes[i].level!=targetNode.level+1){
                    return false;
                }
                isDirChange = true;
            }else{
                //判断是否移动至同一个级别的
                if(treeNodes[i].level!=targetNode.level){
                    //不是同一个级别
                    return false;
                }else {
                    if(treeNodes[i].ownDid!=targetNode.ownDid){
                        isDirChange = true;
                    } else {
                        $.treeOp.fileMove(treeId, treeNodes, targetNode, moveType);
                        return true;
                    }
                }
            }
        }
        if(isDirChange){
            $.treeOp.fileMove(treeId, treeNodes, targetNode, moveType);
            return true;
        }
        return false;
    },
    onDrop: function (event, treeId, treeNodes, targetNode, moveType) {

    },
    resetDirectSearch:function () {
        //重置目录搜索 搜索框设为空字符串 目录树还原
        if($.treeOp.searchText==undefined||$.treeOp.searchText==""){
            return;
        }
        var treeOP = this;
        treeOP.searchText="";

        $(".direct-search input").val("")

        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var nodes = treeObj.getNodesByParam("isHidden", true);
        treeObj.showNodes(nodes);
    },
    resetFulTsearch: function () {
        //重置全文检索 搜索框设为空字符串 目录树还原
        if($.treeOp.fullSearchText==undefined||$.treeOp.fullSearchText==""){
            return;
        }
        var treeOP = this;
        treeOP.fullSearchText="";

        $(".top-search input").val("")

        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var showNodes = treeObj.getNodesByParam("isHidden", false);
        treeObj.setting.view.fontCss =  {color:""};
        for(var i=0;i<showNodes.length;i++){
            var newnode = showNodes[i];
            treeObj.updateNode(newnode);
        }

        var nodes = treeObj.getNodesByParam("isHidden", true);
        treeObj.showNodes(nodes);
    },
    isEmpty: function (treeNode) {

        var directory = $.dataTrans.dirsMap.get(treeNode.dirId);
        if(typeof directory=="undefined"){
            return false;
        }
        if(typeof directory.fileSize!="undefined"&&directory.fileSize>0){
            return false;
        }else {
            return true;
        }
        //为当前空目录
        /*if(treeNode.ntype=="cdir"){
            var directory = $.dataTrans.dirsMap.get(treeNode.dirId);
            if(directory.files.length>0){
                return false;
            }else {
                true;
            }
        }else if(treeNode.ntype=="pdir"){
            return false;
        }else {
            return true;
        }

        return !treeNode.isParent&&treeNode.level<2;*/
    },
    getEmpty: function () {
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var emptyNodes=treeObj.getNodesByFilter($.treeOp.isEmpty);
        return emptyNodes;
    },
    showEmpty: function () {
        //显示空目录，当搜索存在时，只显示搜索结果
        $.treeOp.isEmptyHidden=0;
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var _keywords=$.treeOp.searchText;
        var resultNodes;
        if(_keywords!=undefined&&_keywords!=null&&_keywords!=""){
            resultNodes = treeObj.getNodesByFilter($.treeOp.directSearchFilter);
        }else {
            resultNodes= treeObj.getNodesByParam("isHidden", true);
        }
        treeObj.showNodes(resultNodes);
    },
    hiddenEmpty: function () {
        var treeOp = $.treeOp;
        treeOp.isEmptyHidden=1;
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var emptyNodes = $.treeOp.getEmpty();
        treeObj.hideNodes(emptyNodes);
    },
    fileMove: function (treeId, treeNodes, targetNode, moveType) {
        for (var i=0,l=treeNodes.length; i<l; i++) {
            //判断文件目录进行了更改
            /*if(treeNodes[i].ownDid!=treeNodes[i].getParentNode().dirId){

                treeNodes[i].ownDid = treeNodes[i].getParentNode().dirId;

                var file = {};
                file.fileId = treeNodes[i].id;
                file.directoryId = treeNodes[i].getParentNode().dirId;

                $.dataTrans.changeFiles.push(file);
            }*/
            var nextNode;
            var targetDirectoryId;
            if(moveType=="next"){
                nextNode = targetNode.getNextNode();
                targetDirectoryId = targetNode.ownDid;
            }else if(moveType=="prev"){
                nextNode = targetNode;
                targetDirectoryId = targetNode.ownDid;
            }else {
                nextNode = null;
                targetDirectoryId = targetNode.dirId;
            }

            var param = {};
            param.thisFileId = treeNodes[i].id;
            param.thisSubCaseId = treeNodes[i].subCaseId;
            param.targetDirectoryId = targetDirectoryId;
            if(nextNode==null){
                param.nextFileId = "";
                param.nextSubCaseId = treeNodes[i].subCaseId;
            }else {
                param.nextFileId = nextNode.id;
                param.nextSubCaseId = nextNode.subCaseId;
            }

            $.dataTrans.moveFile(param, function () {

                for(var i=0;i<$.dataTrans.fileList.length;i++){
                    var fileInfo = $.dataTrans.fileList[i];
                    if(fileInfo.fileId==param.thisFileId){
                        fileInfo.directoryId=param.targetDirectoryId;
                    }
                }

                var zTreeObj = $.fn.zTree.getZTreeObj("demoZtree");
                if(moveType=="inner"){
                    $.coolalbum.refreshAlbum(targetNode);
                }else {
                    $.coolalbum.refreshAlbum(targetNode.getParentNode());
                }
            });//1.修改目录同时，修改文件目录；2.增加文件对应的子案件编号
        }
    },
    zTreeOnClick: function (event, treeId, treeNode) {

        var treeOp = $.treeOp;
        treeOp.curDirId = treeNode.dirId;

        $("#rMenu").hide();
        $("#dMenu").hide();
        $(".reset").trigger("click");
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");

        treeObj.expandNode(treeNode, true, false, true);//展开节点
        //判断节点类型
        if(treeNode.ntype=="case"){

        }else if(treeNode.ntype=="pdir"){
            var dirid = treeNode.dirId;
            var directory = $.dataTrans.dirsMap.get(dirid);
            $.coolalbum.showDirList(directory, function () {
                $.coolalbum.showListMsg(directory.directory_name, directory.children.length);
            });

        }else if(treeNode.ntype=="cdir"){
            var dirid = treeNode.dirId;
            var directory = $.dataTrans.dirsMap.get(dirid);
            if(directory.children.length>0){
                $.coolalbum.showDirList(directory, function () {
                    $.coolalbum.showListMsg(directory.directory_name, directory.children.length);
                });
            }else{
                $.coolalbum.showDirFileList(directory, function () {
                    $.coolalbum.showListMsg(directory.directory_name, directory.files.length);
                });
            }
        }

    },
    getChildFiles: function (id) {
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var childNodes = treeObj.getNodesByParam("ownDid", id, null);
        return childNodes;
    },
    zTreeOnRightClick:function (event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("demoZtree");
        var rMenu = $("#rMenu");
        $("#rMenu").show();
        if (treeNode && !treeNode.noR) {
            zTree.selectNode(treeNode);
            if($.treeOp.fileFilter(treeNode)){
                $.treeOp.showRMenu("node", event.clientX, event.clientY);
            }else if($.treeOp.secDirFilter(treeNode)){

                var childDir = zTree.getNodesByParam("nodeType", "directory", treeNode);
                if(childDir&&childDir.length>0){
                    layer.msg("不允许在此目录上传文件");
                    return;
                }

                $.treeOp.showDMenu("node", event.clientX, event.clientY);
            }
        }else {
            $("#rMenu").hide();
            $("#dMenu").hide();
        }
    },
    fileFilter: function (treeNode) {
        return (($.dataTrans.comeFrom === "1" && treeNode.level > 1) || ($.dataTrans.comeFrom === "2" && treeNode.level > 2));
    },
    secDirFilter: function (treeNode) {
        return (($.dataTrans.comeFrom === "1" && treeNode.level == 1) || ($.dataTrans.comeFrom === "2" && treeNode.level == 2));
    },
    showRMenu: function (type, x, y) {
        $("#dMenu").hide();
        var rMenu = $("#rMenu");
        $("#rMenu").show();

        if($.dataTrans.source=="1"||$.dataTrans.source=="2"){
            $("#m_delete").hide();
        }
        if (type=="root") {
            $("#m_download").hide();
        } else {
            $("#m_download").show();
        }

        y += document.body.scrollTop;
        x += document.body.scrollLeft;
        rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

        $("body").bind("mousedown", $.treeOp.onBodyMouseDown);
    },
    showDMenu: function (type, x, y) {
        $("#rMenu").hide();
        var dMenu = $("#dMenu");
        if($.dataTrans.source=="1"||$.dataTrans.source=="2"){
            dMenu.hide();
            return;
        }
        dMenu.show();
        $("#m_upload").show();

        y += document.body.scrollTop;
        x += document.body.scrollLeft;
        dMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

    },
    searchFnameFilter:function (treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var _keywords=$.treeOp.searchText;
        var index = treeNode.name.indexOf(_keywords);
        if(treeNode.isParent||index!=-1){
            var parentNode = treeNode.getParentNode();
            if(parentNode&&index!=-1){
                treeObj.expandNode(parentNode, true, true, true);
            }
            return false;
        }
        return true;
    },
    openAddDirect: function () {
        var treeOp = $.treeOp;

        var targetdir;
        var $addDirDiv = $("<div class='open-window'>\n" +
            "        <div class=''>\n" +
            "            <div class='open-title'><span>新建目录</span></div>\n" +
            "            <div class='open-body' style=''>\n" +
            "                <ul id='addTree' class='ztree open-content' style=''></ul>\n" +
            "            </div>\n" +
            "                <button class='open-close open-btn'>关闭</button>\n" +
            "                <button class='add-new open-btn'>新建目录</button>\n" +
            "        </div>\n" +
            "    </div>");

        var $shlter = $("<div style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;" +
            "z-index: 20;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>");
        $("body").append($addDirDiv);
        $("body").append($shlter);

        var setting = {
            view: {
                showLine: false,
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
            },
            //上级id相同分层
            data: {
                simpleData: {
                    enable: true
                },
            },
            callback: {
                beforeClick: function (treeId, treeNode, clickFlag) {
                    if(treeNode.name.indexOf("待分类区")>0){
                        layer.msg("待分类区下不允许新建目录 ");
                        return false;
                    }
                    /*if(treeNode.ntype=="pdir"){
                        return true;
                    }else {
                        layer.msg("请选择新建目录所在卷");
                        return false;
                    }*/
                },
                onClick: function (event, treeId, treeNode) {
                    targetdir=treeNode;
                }
            }
        };
        var dTreeObj = $.fn.zTree.init($("#addTree"), setting, $.dataTrans.directNodes);//初始化树
        $.fn.zTree.getZTreeObj("#addTree");//把得到的树赋给div

        //新建目录默认只显示卷目录
        var treeObj = $.fn.zTree.getZTreeObj("addTree");
        /*var nodes = treeObj.getNodesByParam("ntype", "cdir");
        treeObj.hideNodes(nodes);*/

        $addDirDiv.delegate("button", "click", function () {
            if($(this).hasClass("open-sure")){
                console.log("调用分类接口、预留");
            }else if($(this).hasClass("add-new")){
                if(typeof targetdir == "undefined" || targetdir == null || targetdir == ""){
                    layer.msg("请先选择所属卷");
                    return;
                }
                var $nameDiv = $("<div style=\"position: absolute;top:35%;left: 40%;width: 350px;display: block;background-color:white;;border: 1px solid #a3a3a3;z-index: 50;\">\n" +
                    "        <div class=\"\">\n" +
                    "            <div class=\"open-title\"><span>新建目录名称</span></div>\n" +
                    "            <div class=\"\" style=\"text-align:center;height: 60px;background-color:white;border: 1px 0px 1px 0px solid #CCCCCC;\">\n" +
                    "                <input style='margin: 20px;width: 70%;' type='text'>\n" +
                    "            </div>\n" +
                    "                <button class='open-btn text-close' style='margin-top: 10px;margin-bottom: 10px;'>关闭</button>\n" +
                    "                <button class='open-btn text-sure' style='margin-top: 10px;margin-bottom: 10px;'>确认</button>\n" +
                    "        </div>\n" +
                    "    </div>");
                $("body").append($nameDiv);
                $shlter.css({
                    zIndex: 40
                });
                $nameDiv.delegate("button", "click", function () {
                    if($(this).hasClass("text-sure")){
                        if(targetdir==""){
                            layer.msg("未选择卷目录，无法新建目录");
                            return;
                        }
                        var newname = $nameDiv.find("input").val();
                        if(typeof newname == "undefined" || newname == null || newname == ""){
                            layer.msg("请填写目录名");
                            return;
                        }
                        var newdir = {};
                        newdir.parent_id=targetdir.dirId;
                        newdir.directory_name=newname;
                        newdir.directory_desc="";
                        newdir.display=0;
                        newdir.directory_model_id=targetdir.modelId;
                        newdir.directory_type=1;//自定义目录
                        $.dataTrans.addDirectory(newdir, function () {
                            var demoZtree = $.fn.zTree.getZTreeObj("demoZtree");
                            var directTree = $.fn.zTree.getZTreeObj("directTree");
                            var addTree = $.fn.zTree.getZTreeObj("addTree");

                            var newNode = {name:"newNode1"};

                            $.dataTrans.getExamineData(function (data) {
                                /*$.dataTrans.parseExamineData(data);*/
                                $.dataTrans.parseDiretWithFilesData(data);
                                $.treeOp.setDirectTree($.dataTrans.directNodes, "", $.dataTrans.dirList);

                                treeOp.refreshTree("demoZtree", $.dataTrans.directNodes, treeOp.curDirId);

                                //刷新目录树
                                var dTreeObj = $.fn.zTree.init($("#addTree"), setting, $.dataTrans.directNodes);//初始化树
                                $.fn.zTree.getZTreeObj("#addTree");//把得到的树赋给div
                                if(targetdir.dirId){
                                    var zTree = $.fn.zTree.getZTreeObj("addTree");
                                    var node = zTree.getNodeByParam("dirId",targetdir.dirId);
                                    if(node){
                                        //触发默认数据的click事件
                                        treeObj.selectNode(node);
                                    }
                                }
                            });

                            /*var nodes = treeObj.getNodeByParam("id", "test", null);
                            newNode = treeObj.addNodes(null, newNode);*/
                        })
                        console.log("设置新目录名称");
                    }else if($(this).hasClass("text-close")){
                        console.log("取消新增目录");
                    }
                    $nameDiv.remove();

                    $shlter.css({
                        zIndex: 20
                    });
                });
            } else{
                $addDirDiv.remove();
                $shlter.remove();
            }

        });
    },
    search:function (value, type) {
        $.treeOp.searchText = value;
        $.treeOp.searchType = type;

        if(type=="direct"){
            var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
            treeObj.showNodes($.treeOp.hiddenNodes);

            var all = treeObj.getNodes()

            $.treeOp.hiddenNodes=treeObj.getNodesByFilter($.treeOp.searchFnameFilter);
            treeObj.hideNodes($.treeOp.hiddenNodes);
        }else if(type=="ffilter"){
            $.coolalbum.searchRs();
            $.coolalbum.state=1;//相册状态为搜索中，不允许进行拖动排序、排序重置和排序保存等操作
            if($("#dirViewer").is(':hidden')){
                layer.msg("当前未显示相册");
            }else {
                var liAll = $.coolalbum.$album.find(".child.checkul").find("li");
                var span = $.coolalbum.$album.find(".child.checkul").find("span.descript:contains("+value+")");
                liAll.each(function(i) {
                    var self = this;
                    var span= $(self).find("span.descript");
                    if(span&&span.text().indexOf(value)!=-1){
                        $(self).css({
                            display:"block",
                        });
                    }else {
                        $(self).css({
                            display:"none",
                        });
                    }
                });
            }
        }else if(type=="file"){
            $.coolalbum.searchRs();
            if($("#dirViewer").is(':hidden')){
                layer.msg("当前未显示相册");
            }else {
                var span = $.coolalbum.$album.find(".child.checkul").find("span.descript:contains("+value+")");
                span.css({
                    color:"#F00",
                });
            }
        }else if(type=="fultext"){
            //全文检索
            $.coolalbum.searchRs();
            $.treeOp.fulTsearch();
        }

    },
    directSearchShow: function (searchText) {
        var treeOP = this;
        treeOP.searchText=searchText;
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");

        $.treeOp.searchText = searchText;

        /*var nodes = treeObj.getNodesByParam("isHidden", true);
        treeObj.showNodes(nodes);*/

        var resultNodes = treeObj.getNodesByFilter(treeOP.directSearchFilter);

        treeObj.hideNodes(treeObj.getNodesByParam("ntype", "cdir", null));
        treeObj.hideNodes(treeObj.getNodesByParam("ntype", "pdir", null));
        for(var i=0;i<resultNodes.length;i++){
            var parentNode = resultNodes[i].getParentNode();
            if(parentNode){
                var childDir = $.dataTrans.dirsMap.get(resultNodes[i].dirId);
                /*if($.dataTrans.fullSearchStatus&&(childDir.isFSResult=="undefined"||!childDir.isFSResult)){
                    //全文搜索
                    continue;
                }*/
                treeObj.showNode(parentNode);
                treeObj.showNode(resultNodes[i]);
                treeObj.expandNode(parentNode, true, true, true);
            }
        }
    },
    directSearchFilter: function (treeNode) {
        var treeOP = $.treeOp;
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var _keywords=$.treeOp.searchText;
        var index = treeNode.name.indexOf(_keywords);
        if(treeNode.ntype=="cdir"&&index!=-1){
            //包含查询字段
            if(treeOP.isEmptyHidden==1&&(treeNode.children==undefined||treeNode.children.length==0)){
                return false;
            }
            return true;
        }
        return false;
    },
    fulTsearchShow: function (sFileList) {

        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        /*var allfNodes = treeObj.getNodesByParam("ntype", "file", null);
        treeObj.hideNodes(allfNodes);*/
        var cnodes = treeObj.getNodesByParam("ntype", "cdir", null);
        treeObj.hideNodes(cnodes);
        var pnodes = treeObj.getNodesByParam("ntype", "pdir", null);
        treeObj.hideNodes(pnodes);
        var fileinfos = $.dataTrans.filesMap;

        fileinfos.forEach(function(data){
            data.isFSResult = false;
        });

        if(sFileList&&sFileList.length>0){
            for(var i=0;i<sFileList.length;i++){
                var sFile = sFileList[i];
                var fileinfo = $.dataTrans.filesMap.get(sFile.fileId);
                if(typeof fileinfo == "undefined"){
                    continue;
                }
                var directory = $.dataTrans.dirsMap.get(fileinfo.directoryId);
                var pdirectory = $.dataTrans.dirsMap.get(directory.parent_id);

                //获取文件对应的目录节点
                var pnode = treeObj.getNodeByParam("dirId", fileinfo.directoryId, null);
                if(pnode){
                    //打开父节点
                    /*var pnode = node.getParentNode();*/
                    if(!$.treeOp.isNodeShow(pnode)){
                        //目录搜索并行
                        return;
                    }
                    var dnode = pnode.getParentNode();
                    treeObj.expandNode(pnode, true, false, true);
                    //显示当前节点及其父节点
                    treeObj.showNode(dnode);
                    treeObj.showNode(pnode);
                    /*treeObj.showNode(node);*/
                    //设置文件为全文搜索结果，便于在目录中高亮
                    /*node.isFSResult = true;*/
                    /*treeObj.updateNode(node);*/
                    fileinfo.isFSResult = true;
                    directory.isFSResult = true;
                    pdirectory.isFSResult = true;
                }
            }
            //默认选择第一个目录
            var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
            var nodes = treeObj.getNodesByParam("isHidden", false);
            var showNode;
            nodes.forEach(function(data){
                if (showNode==null || showNode.level<data.level){
                    showNode = data;
                    return;
                }
            });

            if(showNode){
                //触发默认数据的click事件
                $("#"+showNode.tId+"_a").click();//触发ztree点击事件
            }
            /*for(var i=0;i<sFileList.length;i++){
                var sFile = sFileList[i];

                var node = treeObj.getNodeByParam("id", sFile.fileId, null);
                if(node){
                    //修改查询到的节点样式
                    treeObj.setting.view.fontCss =  {color:"red"};
                    treeObj.updateNode(node);
                }
            }*/
        }else {
            layer.msg("未查询到匹配数据");
        }
        treeObj.setting.view.fontCss =  {};
    },
    setDirectTree: function (zNodes, rootid, directoryInfoList) {
        x = $.treeOp.directIndex;
       
        for (var i = 0; i < directoryInfoList.length; i++) {    //判断
            var pid;
            var drop;
           
            if(directoryInfoList[i].parent_id==0){
                pid = rootid;
                drop = false;
            }else {
                pid = rootid+""+directoryInfoList[i].parent_id;
                drop = true;
            }
            zNodes[x+1] = { color:directoryInfoList[i].color,id: rootid+""+directoryInfoList[i].directory_id, pId: pid, parentId:directoryInfoList[i].parent_id, modelId:directoryInfoList[i].directory_model_id, name: directoryInfoList[i].directory_name, drag:false, dirId:directoryInfoList[i].directory_id,
                iconOpen:"css/zTreeStyle/img/diy/folder_open.png",iconClose:"css/zTreeStyle/img/diy/folder_close.png", icon:"css/images/folder-nouse.png"};
            if(directoryInfoList[i].files&&directoryInfoList[i].files.length>0){
                zNodes[x+1].icon = "css/zTreeStyle/img/diy/folder_close.png"
            }else {
                zNodes[x+1].icon = "css/images/folder-nouse.png"
            }
            if(directoryInfoList[i].parent_id==0) {
                zNodes[x + 1].open = true;
                zNodes[x+1].ntype= "pdir";//卷目录
            }else {
                zNodes[x+1].ntype= "cdir";//子目录
            }
            x++;
        }
    },
    refreshDirNode:function (directory) {
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var node = treeObj.getNodeByParam("dirId",directory.directory_id);
        if(directory.files&&directory.files.length>0){
            node.icon = "css/zTreeStyle/img/diy/folder_close.png";
        }else {
            node.icon = "css/images/folder-nouse.png";
        }
        treeObj.updateNode(node);
    },
    setCaseTree: function(zNodes, rootid, directoryInfoList, fileInfoList) {
        x = $.treeOp.nodeIndex;
        for (var i = 0; i < directoryInfoList.length; i++) {    //判断
            var pid;
            var drop;
            if(directoryInfoList[i].parent_id==0){
                pid = rootid;
                drop = false;
            }else {
                pid = rootid+""+directoryInfoList[i].parent_id;
                drop = true;
            }

            zNodes[x+1] = { color:directoryInfoList[i].color,id: rootid+""+directoryInfoList[i].directory_id, pId: pid, name: directoryInfoList[i].directory_name, drag:false, dirId:directoryInfoList[i].directory_id,
                iconOpen:"css/zTreeStyle/img/diy/folder_open.png",iconClose:"css/zTreeStyle/img/diy/folder_close.png", icon:"css/images/folder-nouse.png"};
            if(directoryInfoList[i].parent_id==0) {
                zNodes[x + 1].open = true;
                zNodes[x+1].ntype= "pdir";//卷目录
            }else {
                zNodes[x+1].ntype= "cdir";//子目录
            }
            x++;
        }
        for (var i = 0;i<fileInfoList.length;i++){
            var name = fileInfoList[i].fileName;
            var index = name.lastIndexOf(".");
            var ext = name.substr(index+1);
            //文件名后缀比较
            if(ext == "jpg" || ext == "png" || ext == "jpeg")
            {
                zNodes[x+1] = { id: fileInfoList[i].fileId, pId: rootid+""+fileInfoList[i].directoryId, subCaseId:fileInfoList[i].subCaseId, name: fileInfoList[i].fileName,icon:"css/images/pic-icon.png",
                    isHidden:true,
                    ownDid: fileInfoList[i].directoryId,
                    osrc:"../../../court/download/downloadFile?fileID="+fileInfoList[i].fileId+"&subCaseId="+fileInfoList[i].subCaseId,
                    imgsrc:"../../../court/download/downloadFile?fileID="+fileInfoList[i].fileId+"&subCaseId="+fileInfoList[i].subCaseId,
                    icon:"css/images/pic-icon.png",
                    fileIndex: fileInfoList[i].fileIndex,
                    ntype:"file", ftype: "pic"};

            }else if(ext == "doc" || ext == "docx")
            {
                zNodes[x+1] = { id: fileInfoList[i].fileId, pId: rootid+""+fileInfoList[i].directoryId, subCaseId:fileInfoList[i].subCaseId, name: fileInfoList[i].fileName,icon:"css/images/word.png",
                    isHidden:true,
                    ownDid: fileInfoList[i].directoryId,
                    osrc:"../../../court/download/preview?fileID="+fileInfoList[i].fileId+"&subCaseId="+fileInfoList[i].subCaseId,
                    fileIndex: fileInfoList[i].fileIndex,
                    icon:"css/images/word.png",
                    imgsrc:"css/images/word-big.png", ntype:"file", ftype: "doc"};
            }else if(ext == "xls" || ext == "xlsx")
            {
                zNodes[x+1] = { id: fileInfoList[i].fileId, pId: rootid+""+fileInfoList[i].directoryId, subCaseId:fileInfoList[i].subCaseId, name: fileInfoList[i].fileName,icon:"css/images/word.png",
                    isHidden:true,
                    ownDid: fileInfoList[i].directoryId,
                    osrc:"../../../court/download/preview?fileID="+fileInfoList[i].fileId+"&subCaseId="+fileInfoList[i].subCaseId,
                    fileIndex: fileInfoList[i].fileIndex,
                    icon:"css/images/word.png",
                    imgsrc:"css/images/word-big.png", ntype:"file", ftype: "doc"};
            }else if(ext == "pdf")
            {
                zNodes[x+1] = { id: fileInfoList[i].fileId, pId: rootid+""+fileInfoList[i].directoryId, subCaseId:fileInfoList[i].subCaseId, name: fileInfoList[i].fileName,icon:"css/images/pdf.png",
                    isHidden:true,
                    ownDid: fileInfoList[i].directoryId,
                    osrc:"../../../court/download/preview?fileID="+fileInfoList[i].fileId+"&subCaseId="+fileInfoList[i].subCaseId,
                    fileIndex: fileInfoList[i].fileIndex,
                    icon:"css/images/pdf.png",
                    imgsrc:"css/images/pdf-big.png", ntype:"file", ftype: "pdf"};
            }else {
                zNodes[x+1] = { id: fileInfoList[i].fileId, pId: rootid+""+fileInfoList[i].directoryId, subCaseId:fileInfoList[i].subCaseId, name: fileInfoList[i].fileName,icon:"css/images/video.png",
                    isHidden:true,
                    ownDid: fileInfoList[i].directoryId,
                    osrc:"../../../court/download/downloadFile?fileID="+fileInfoList[i].fileId+"&subCaseId="+fileInfoList[i].subCaseId,
                    fileIndex: fileInfoList[i].fileIndex,
                    icon:"css/images/video.png",
                    imgsrc:"css/images/video-big.png", ntype:"file", ftype: "video"};
            }
            x++;
        }
        $.treeOp.nodeIndex = x;
    },
    addCaseTree:function(fileInfo, pnode){
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var sNode;
        if(pnode!=null){
            sNode = pnode
        }else{
            sNode = treeObj.getSelectedNodes()[0];
        }
        var index = fileInfo.fileName.lastIndexOf(".");
        var ext = fileInfo.fileName.substr(index+1);

        layer.msg(fileInfo.fileName);
        //判断后缀 ,暂时没加上pId
        if(ext == "jpg" || ext == "png" || ext == "jpeg")
        {
            if(fileInfo.tifNames != null){
                for(var x = 0;x < fileInfo.tifNames.length ;x++){
                    treeObj.addNodes(sNode,{id: fileInfo.tifNames[x], subCaseId:fileInfo.subCaseId, name: fileInfo.tifNames[x]+".jpg",icon:"css/zTreeStyle/img/diy/jpg.png", ownDid: fileInfo.directoryId});
                }
            }else{
                treeObj.addNodes(sNode,{id: fileInfo.fileId, subCaseId:fileInfo.subCaseId, name: fileInfo.fileName,icon:"css/zTreeStyle/img/diy/jpg.png", ownDid: fileInfo.directoryId});
            }

        }else if(ext == "doc" || ext == "docx")
        {
            treeObj.addNodes(sNode,{id: fileInfo.fileId, subCaseId:fileInfo.subCaseId, name: fileInfo.fileName,icon:"css/zTreeStyle/img/diy/doc.png", ownDid: fileInfo.directoryId});
        }else if(ext == "xls" || ext == "xlsx")
        {
            treeObj.addNodes(sNode,{id: fileInfo.fileId, subCaseId:fileInfo.subCaseId, name: fileInfo.fileName,icon:"css/zTreeStyle/img/diy/doc.png", ownDid: fileInfo.directoryId});
        }else if(ext == "pdf"){
            treeObj.addNodes(sNode,{id: fileInfo.fileId, subCaseId:fileInfo.subCaseId, name: fileInfo.fileName,icon:"css/zTreeStyle/img/diy/pdf.png", ownDid: fileInfo.directoryId});
        }else {
            treeObj.addNodes(sNode,{id: fileInfo.fileId, subCaseId:fileInfo.subCaseId, name: fileInfo.fileName,icon:"css/zTreeStyle/img/diy/video.png", ownDid: fileInfo.directoryId});
        }
        //treeObj.updateNode(sNodes[0]);
    },
    refreshTree:function (treeId, directNodes, selDirId, isFullSearch, fullResultList, isDirSearch, seachText, isExpand) {
        var treeOp = $.treeOp;
        var zTreeObj = $.fn.zTree.init($("#"+treeId), $.treeOp.setting, directNodes);//初始化树
        $.fn.zTree.getZTreeObj("#"+treeId);//把得到的树赋给div
        if(selDirId){
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            var node = zTree.getNodeByParam("dirId",selDirId);
            if(node){
                //触发默认数据的click事件
                $("#"+node.tId+"_a").click();//触发ztree点击事件
                zTree.expandNode(node, true, false, true);//展开节点
            }
        }
        if(isFullSearch){
            treeOp.fulTsearchShow(fullResultList);
        }
        if(isDirSearch){
            treeOp.directSearchShow(seachText);
        }
        if(isExpand){

        }
    },
    isNodeShow: function (node) {
        if($.dataTrans.fullSearchStatus){

        }
        if($.dataTrans.isDirSearch){
            var _keywords=$.treeOp.searchText;
            var index = node.name.indexOf(_keywords);
            if(index==-1){
                return false;
            }
        }
        if($.dataTrans.isExpand){

        }
        return true;
    }
}