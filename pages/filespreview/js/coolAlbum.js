
var CoolAlbum = function () {
    var self = this;

    self.setting = {};
};
CoolAlbum.prototype = {
    _init: function (setting) {
        var coolalbum = this;
        coolalbum.setting = setting;
        if (location.href.indexOf("zjflag") != -1) {
            
            if(setting.onDownLoad) {
                /*var $downloadBtn = $("<button>下载</button>");*/
                var $downloadBtn = $("<span class='tool-btn download-btn' style=''><button class='icon-download'></button><span style='padding-left: 20px;'>下载</span></span>");
                $downloadBtn.click(function () {
                    coolalbum.openDownload();
                    setting.onDownLoad.call(this) ;
                });
                $(".coolbum-tool").append($downloadBtn);
            }
            if(setting.onSortSave) {
                /*var $sortSaveBtn = $("<button>保存</button>");*/
                var $sortSaveBtn = $("<span class='tool-btn sort-save' style='display: none;'><button class='icon-save'></button><span style='padding-left: 20px;'>保存</span></span>");
                $sortSaveBtn.click(function () {
                    coolalbum.toSortSave(function () {
                        $.coolalbum.refreshCoolalbum();
                    });
    
                    setting.onSortSave.call(this) ;
                });
                $(".coolbum-tool").append($sortSaveBtn);
            }
            if(setting.onSortRest) {
                /*var $sortRestBtn = $("<button>重置</button>");*/
                var $sortRestBtn = $("<span class='tool-btn sort-rest' style='display: none;'><button class='icon-reset'></button><span style='padding-left: 20px;'>重置</span></span>");
                $sortRestBtn.click(function () {
                    coolalbum.resetOrder();
                    setting.onSortRest.call(this) ;
                });
                $(".coolbum-tool").append($sortRestBtn);
            }
        }else{
            if(setting.onUpload) {
                /*var $uploadBtn = $("<button>上传</button>");*/
                var $uploadBtn = $("<span class='tool-btn upload-btn' style=''><button class='icon-upload'></button><span style='padding-left: 20px;height: 17px;'>上传</span></span>");
                $uploadBtn.click(function () {
                    coolalbum.openUpload();
                    setting.onUpload.call(this) ;
                });
                $(".coolbum-tool").append($uploadBtn);
            }
            if(setting.onMove) {
                /*var $moveBtn = $("<button>移动</button>");*/
                var $moveBtn = $("<span class='tool-btn move-btn' style=''><button class='icon-move'></button><span style='padding-left: 20px;'>移动</span></span>");
                $moveBtn.click(function () {
                    var $checkFiles = $(".file-list").find(":checked");
                    if(typeof $checkFiles == "undefined" || $checkFiles == null || $checkFiles.length==0){
                        layer.msg("请先选择需移动的文件");
                        return;
                    }
                    coolalbum.openMove();
                    setting.onMove.call(this) ;
                });
                $(".coolbum-tool").append($moveBtn);
            }
            if(setting.onDownLoad) {
                /*var $downloadBtn = $("<button>下载</button>");*/
                var $downloadBtn = $("<span class='tool-btn download-btn' style=''><button class='icon-download'></button><span style='padding-left: 20px;'>下载</span></span>");
                $downloadBtn.click(function () {
                    coolalbum.openDownload();
                    setting.onDownLoad.call(this) ;
                });
                $(".coolbum-tool").append($downloadBtn);
            }
            if(setting.onDelete) {
                /*var $deleteBtn = $("<button>删除</button>");*/
                var $deleteBtn = $("<span class='tool-btn delete-btn' style=''><button class='icon-delete'></button><span style='padding-left: 20px;'>删除</span></span>");
                $deleteBtn.click(function () {
                    coolalbum.openDelete();
                    setting.onDelete.call(this) ;
                });
                $(".coolbum-tool").append($deleteBtn);
            }
            if(setting.onSortSave) {
                /*var $sortSaveBtn = $("<button>保存</button>");*/
                var $sortSaveBtn = $("<span class='tool-btn sort-save' style='display: none;'><button class='icon-save'></button><span style='padding-left: 20px;'>保存</span></span>");
                $sortSaveBtn.click(function () {
                    coolalbum.toSortSave(function () {
                        $.coolalbum.refreshCoolalbum();
                    });
    
                    setting.onSortSave.call(this) ;
                });
                $(".coolbum-tool").append($sortSaveBtn);
            }
            if(setting.onSortRest) {
                /*var $sortRestBtn = $("<button>重置</button>");*/
                var $sortRestBtn = $("<span class='tool-btn sort-rest' style='display: none;'><button class='icon-reset'></button><span style='padding-left: 20px;'>重置</span></span>");
                $sortRestBtn.click(function () {
                    coolalbum.resetOrder();
                    setting.onSortRest.call(this) ;
                });
                $(".coolbum-tool").append($sortRestBtn);
            }
        }
        if(setting.onCheckAll) {
            var $checkABtn = $("<div><input class='file-check' id='all-check' style='vertical-align:middle;width: 18px;height: 18px;display: none;' type='checkbox'><button class='icon-list-check' style=''></button><span style='padding-left: 15px;'>全选</span><span style='padding:0 3px;'>|</span><span class='area-gr'></span></div>");
            $checkABtn.click(function () {
                var ischecked = $(this).find("input").prop("checked");
                var newChecked = !ischecked;
                $(this).find("input").prop("checked",newChecked);
                coolalbum.checkAll(newChecked);


                setting.onCheckAll.call(this) ;
            });
            $(".coolalbum-checkl").append($checkABtn);
        }
       
       
    },
    resetOrder: function () {
        var $files = $(".file-list").children("div");
        $(".file-list").empty();
        for(var i=0;i<$files.length;i++){
            var iF = $files.filter("[index='"+i+"']");
            iF.removeClass("newOrder");
            iF.appendTo($(".file-list"));
        }
        $.coolalbum.outSort();
    },

    lazyload: function () { //监听页面滚动事件
        var self = this;
        var seeHeight = $(".file-list").height(); //可见区域高度
        var scrollTop = $(".file-list")[0].scrollTop; //滚动条距离顶部高度
        var topHeight = $(".file-list")[0].offsetTop;//区域顶部高度
        var bottomHeight = topHeight+seeHeight;//区域底部高度
        var $childDiv = $(".file-list").find(".grid-file");
        for (var i = 0; i < $childDiv.length; i++) {
            if ($childDiv[i].offsetTop < bottomHeight + scrollTop) {
                if ($($childDiv[i]).children("img").attr("src") == null || $($childDiv[i]).children("img").attr("src") == "" || $($childDiv[i]).children("img").attr("src").indexOf("loading")!=-1) {
                    var imgsrc = $($childDiv[i]).children("img").attr("imgsrc");
                    $($childDiv[i]).children("img").attr("src", imgsrc);
                }
            }
        }
    },
    toSortSave: function (callback) {
        var directoryIndexs = new Array();
        var fileIds = new Array();
        var indexs = new Array();
        var subCaseIds = new Array();
        $(".newOrder").each(function (i) {
            var fileid=$(this).find("input").val();
            var index=$(this).index()+1;
            var subcid=$(this).find("input").attr("scid");
            var fileIndex=$(this).find("input").attr("fileIndex");

            fileIds.push(fileid);
            directoryIndexs.push(index);
            subCaseIds.push(subcid);
            indexs.push(parseInt(fileIndex));
        });
        var data = {
            directoryIndexs:directoryIndexs,
            fileIds:fileIds,
            subCaseIds:subCaseIds,
            indexs:indexs,
        }
        $.dataTrans.changeFilesIndex(data, function () {
            $(".newOrder").each(function (i) {
                $(this).attr("index", $(this).index());
                $(this).removeClass("newOrder");
            });
            $.coolalbum.outSort();
            callback();
        });
    },
    inSort: function () {
        $.coolalbum.state=2;//排序状态
        $(".file-list").find("input").prop("checked",false);
        $(".file-list").children("div").removeClass("checked");
        $(".coolbum-tool").children("span").hide();
        $(".coolbum-tool").children(".sort-save").show();
        $(".coolbum-tool").children(".sort-rest").show();
    },
    outSort: function () {
        $.coolalbum.state=0;
        $(".coolbum-tool").children("span").show();
        $(".coolbum-tool").children(".sort-save").hide();
        $(".coolbum-tool").children(".sort-rest").hide();
    },
    openMove: function () {
        var targetNode;
        var $moveDiv = $("<div class='open-window'>\n" +
            "        <div class='' >\n" +
            "            <div class='open-title' style=''><span>选择文件保存目录</span></div>" +
            "            <div class='open-body'>" +
            "                <ul id='directTree' class='ztree open-content' style=''></ul>" +
            "            </div>" +
            "            <div class='' style='bottom: 0px;right: 0px;'>" +
            "<div style='margin:10px;width: 260px;font-size: 12px;'>"+
            "<span class='msgleft' style='float: left;'>选中 <span class='filecount' style='color: #508aed;'></span> 个文件，由目录：" +
            "<span class='source-msg' style='color: #508aed;'></span> 移动至目录：" +
            "<span class='target-msg' style='color: #508aed;'>未选择目目录</span></span>" +
            "</div>"+
            "                <button class='open-btn open-close' style=''>关闭</button>" +
            "                <button class='open-btn open-sure' style=''>确认</button>" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>");

        var $checkFiles = $(".file-list").find(":checked");
        var filesText="";
        for(var i=0;i<$checkFiles.length;i++){
            var fileName = $($checkFiles[i]).attr("name");
            if(filesText.indexOf("...")>0){

            }else if(filesText.length>100&&filesText.indexOf("...")<0){
                filesText+="...;"
            }else {
                filesText+=fileName+";";
            }
        }

        //待移动文件所在目录
        var sourceDirectId = $.coolalbum.directoryId;
        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
        var sourceDirectNode = treeObj.getNodeByParam("id", sourceDirectId, null);
        var sourceParentNode = sourceDirectNode.getParentNode();
        var sourceDMsg = sourceParentNode.name+">"+sourceDirectNode.name;

        var setting = {
            view: {
                showLine: false,
            },
            //上级id相同分层
            data: {
                simpleData: {
                    enable: true
                },
            },
            callback: {
                beforeClick: function (treeId, treeNode, clickFlag) {
                    if(treeNode.ntype!="pdir"){
                        var curDirectId = treeNode.dirId;
                        var curDirectory = $.dataTrans.dirsMap.get(curDirectId);
                        if(curDirectory.children.length>0){
                            layer.msg("请选择可移动的目录");
                            return false;
                        }
                        return true;
                    }else {
                        layer.msg("请选择移动目标目录");
                        return false;
                    }
                },
                onClick: function (event, treeId, treeNode) {
                    targetNode=treeNode;
                    var parentNode = targetNode.getParentNode();
                    $(".target-msg").text(parentNode.name+">"+targetNode.name);

                }
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
                drap:{
                    isCopy:false,
                    isMove:true,
                    prev:true,
                    next:true,
                    inner: true,
                }
            }
        };

        $moveDiv.delegate("button", "click", function () {
            if($(this).hasClass("open-sure")){
                console.log("调用分类接口、预留");
                if(typeof targetNode == "undefined" || targetNode == null || targetNode == ""){
                    layer.msg("请先选择目标目录");
                    return;
                }else {
                    var subFiles = {};
                    var fileChanged = [];

                    var $checkFiles = $(".file-list").find(":checked");
                    if(typeof $checkFiles == "undefined" || $checkFiles == null || $checkFiles.length==0){
                        layer.msg("请先选择需移动的文件");
                        $moveDiv.remove();
                        $shlter.remove();
                        return;
                    }

                    $checkFiles.each(function (index, obj) {
                        var checkObj = $(obj);
                        var cfile = {};
                        cfile["fileId"] = checkObj.val();//fileId:主键
                        cfile["directoryId"] = targetNode.dirId+"";
                        cfile["subCaseId"] = checkObj.attr("scid");//子案件id

                        var demoZtree = $.fn.zTree.getZTreeObj("demoZtree");
                        var node = demoZtree.getNodeByParam("id", targetNode.id, null);
                        var newIndex
                        if(node.children){
                            newIndex = node.children.length+1;
                        }else {
                            newIndex = 1;
                        }
                        cfile["fileDirectoryIndex"] = newIndex+"";

                        fileChanged.push(cfile);
                    });

                    subFiles["changed"] = fileChanged;

                    var curDirectId = $.coolalbum.directoryId;
                    $.dataTrans.moveToDirectory(subFiles, function () {
                        console.log("移动文件完成");
                        $.dataTrans.getExamineData(function (data) {
                            /*$.dataTrans.parseExamineData(data);*/
                            $.dataTrans.parseDiretWithFilesData(data);

                            var curDirectory = $.dataTrans.dirsMap.get(curDirectId);
                            var targetDirecotry = $.dataTrans.dirsMap.get(targetNode.dirId);

                            $.treeOp.setDirectTree($.dataTrans.directNodes, "", $.dataTrans.dirList);

                            /*$.treeOp.refreshTree("demoZtree", $.dataTrans.directNodes, $.treeOp.curDirId);*/
                            $.treeOp.refreshDirNode(curDirectory);
                            $.treeOp.refreshDirNode(targetDirecotry);

                            if(curDirectory.children&&curDirectory.children.length>0){
                                $.coolalbum.showDirList(curDirectory, function () {
                                    $.coolalbum.showListMsg(curDirectory.name, curDirectory.files.length);
                                });
                            }else {
                                $.coolalbum.showDirFileList(curDirectory, function () {
                                    $.coolalbum.showListMsg(curDirectory.name, curDirectory.files.length);
                                });
                            }

                        });
                    })
                }
            }
            $moveDiv.remove();
            $shlter.remove();
        });

        var $shlter = $("<div style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;" +
            "z-index: 20;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>");
        $("body").append($moveDiv);
        $("body").append($shlter);
        $(".files-msg").text(filesText);
        $(".filecount").text($checkFiles.length);
        $(".source-msg").text(sourceDMsg);

        var dTreeObj = $.fn.zTree.init($("#directTree"), setting, $.dataTrans.directNodes);//初始化树
        $.fn.zTree.getZTreeObj("#directTree");//把得到的树赋给div
    },
    openUpload: function () {
        var coolalbum = this;
        var curDirectory = coolalbum.directory;
        if(curDirectory.children.length>0){
            layer.msg("不允许在该目录上传文件");
            return;
        }
        if(curDirectory.parent_id==0){
            layer.msg("无法在卷目录内上传文件");
            return;
        }
        var uploader;
        var $uploadDiv = $(" <div class='open-window'>" +
            "<div class=''>" +
            "<div class='open-title'><span>本地上传</span></div>" +
            "<div class='open-content' style=''>" +
            "<div id='uploadArea' class='layui-upload-drag ' style='width: 100%;'>"+
            "<i class=\"layui-icon\"></i>\n" +
            "  <p>点击上传，或将文件拖拽到此处</p>" +
            "</div>"+
            "<div id='previewArea'></div>"+
            "</div>" +
            "<div class=\"\" style=\"text-align: right\">" +
            "<button class='open-btn open-close'>关闭</button>" +
            "<button id='sub' class='open-btn open-sure'>确认</button>" +
            "</div>" +
            "</div>" +
            "</div>");
        $uploadDiv.delegate("button", "click", function () {
            if($(this).hasClass("open-sure")){
                console.log("调用上传接口、预留");
                if($uploadDiv.find("img")== undefined || $uploadDiv.find("img").length==0){
                    layer.msg("待上传文件数为0");
                    return;
                }
            }
            $uploadDiv.remove();
            $shlter.remove();
        });
        var $shlter = $("<div style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;" +
            "z-index: 20;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>");
        $("body").append($uploadDiv);
        $("body").append($shlter);

        layui.use('upload', function(){
            var upload = layui.upload; //得到 upload 对象//创建一个上传组件
            uploader = upload.render({
                elem: '#uploadArea',
                url: '../../../court/hnfiles/uploadFileByStream',
                auto: false,
                accept: 'file', //普通文件
                multiple: true,
                bindAction: '#sub',
                data: {
                    userName:$.dataTrans.username,
                    subCaseId:$.dataTrans.caseInfoId+"0",
                    caseId:$.dataTrans.caseInfoId,
                    directoryId:$.coolalbum.directoryId,
                },
                field: "filedata",
                choose: function(obj){
                    var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列

                    //读取本地文件
                    obj.preview(function(index, file, result){
                        var preImg;
                        if(file.type.indexOf("pdf")>=0){
                            preImg = $("<div title='"+file.name+"' style='position:relative;width: 50px;height: 50px;display:inline-block;'><img id='img-"+index+"' width='50px' style='padding: 5px;border: 1px;' height='50px' src='css/images/pdf-big.png'><span style='font-size:10px;display: block;width:50px;bottom: 0px;text-overflow:ellipsis;overflow:hidden;white-space: nowrap; '>"+file.name+"</span></div>")
                        }else if(file.type.indexOf("word")>=0){
                            preImg = $("<div title='"+file.name+"' style='position:relative;width: 50px;height: 50px;display:inline-block;'><img width='50px' style='padding: 5px;border: 1px;' height='50px' src='css/images/word-big.png'><span style='font-size:10px;display: block;width:50px;bottom: 0px;text-overflow:ellipsis;overflow:hidden;white-space: nowrap; '>"+file.name+"</span></div>")
                        }else if(file.type.indexOf("tiff")>=0){
                            preImg = $("<div title='"+file.name+"' style='position:relative;width: 50px;height: 50px;display:inline-block;'><img width='50px' style='padding: 5px;border: 1px;' height='50px' src='css/images/tif-big.png'><span style='font-size:10px;display: block;width:50px;bottom: 0px;text-overflow:ellipsis;overflow:hidden;white-space: nowrap; '>"+file.name+"</span></div>")
                        }else if(file.type.indexOf("video")>=0){
                            preImg = $("<div title='"+file.name+"' style='position:relative;width: 50px;height: 50px;display:inline-block;'><img width='50px' style='padding: 5px;border: 1px;' height='50px' src='css/images/video-big.png'><span style='font-size:10px;display: block;width:50px;bottom: 0px;text-overflow:ellipsis;overflow:hidden;white-space: nowrap; '>"+file.name+"</span></div>")
                        }else if(file.type.indexOf("excel")>=0){
                            preImg = $("<div title='"+file.name+"' style='position:relative;width: 50px;height: 50px;display:inline-block;'><img width='50px' style='padding: 5px;border: 1px;' height='50px' src='../../img/excel-small.png'><span style='font-size:10px;display: block;width:50px;bottom: 0px;text-overflow:ellipsis;overflow:hidden;white-space: nowrap; '>"+file.name+"</span></div>")
                        }else {
                            preImg = $("<div title='"+file.name+"' style='position:relative;width: 50px;height: 50px;display:inline-block;'><img width='50px' style='padding: 5px;border: 1px;' height='50px' src='css/images/png-big.png'><span style='font-size:10px;display: block;width:50px;bottom: 0px;text-overflow:ellipsis;overflow:hidden;white-space: nowrap; '>"+file.name+"</span></div>")
                        }

                        $("#previewArea").append(preImg);

                        preImg.on('click', function(){
                            delete files[index]; //删除对应的文件
                            preImg.remove();
                            uploader.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                        });
                        preImg.on("mouseenter", function () {
                            $(this).append("<div class='shelter' style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;z-index: 100;" +
                                "background-color: #777;opacity: 0.9;filter:alpha(opacity=60);-moz-opacity: 0.5;text-align: center;line-height: 50px;color: white;'>取消</div>");
                        });
                        preImg.on("mouseleave", function () {
                            $(this).children(".shelter").remove();
                        });
                    });
                },
                done: function(res, index, upload){
                    console.log(res);
                    if(res.code == 0){ //上传成功
                        return delete this.files[index];
                    }
                    this.error(index, upload);
                },
                error: function (index, upload) {

                },
                allDone: function(obj){ //当文件全部被提交后，才触发
                    console.log(obj.total); //得到总文件数
                    console.log(obj.successful); //请求成功的文件数
                    console.log(obj.aborted); //请求失败的文件数
                    layer.msg("上传完成，共上传"+obj.total+"个文件，其中"+obj.successful+"个文件上传成功，"+obj.aborted+"个文件上传失败");

                    var curDirectId = $.coolalbum.directoryId;
                    $.dataTrans.getExamineData(function (data) {
                        $.dataTrans.parseDiretWithFilesData(data);

                        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
                        var node = treeObj.getNodeByParam("dirId",curDirectId);
                        node.icon = "css/zTreeStyle/img/diy/folder_close.png";
                        treeObj.updateNode(node);

                        var curDirectory = $.dataTrans.dirsMap.get(curDirectId);

                        $.treeOp.setDirectTree($.dataTrans.directNodes, "", $.dataTrans.dirList);

                        $.coolalbum.showDirFileList(curDirectory, function () {
                            $.coolalbum.showListMsg(curDirectory.name, curDirectory.files.length);
                        });
                    });

                }
            });
        });


    },
    openDownload: function () {
        var self = this;
        /*var $downloadDiv = $("<div style=\"position: absolute;top:20%;left: 20%;width: 50%;height: 35%;display: block;\">\n" +
            "        <div class=\"panel\">\n" +
            "            <div class=\"panel-header\">设置下载路径</div>\n" +
            "            <div class=\"panel-body\" style=\"height: 80px;\">\n" +
            "                <span style=\"top: 50%;left: 35%;\">文件：ali.pdf;280177200288063.jpg;</span>\n" +
            "                <div>\n" +
            "                    <span>下载到：</span><input type=\"text\"><button style=\"height: 20px;width: 50px;\" type=\"button\" value=\"\">浏览</button>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            <div class=\"panel-footer\" style=\"text-align: right\">\n" +
            "<button class='open-sure'>确认</button>" +
            "<button class='open-close'>关闭</button>" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>");
        $downloadDiv.delegate("button", "click", function () {
            if($(this).hasClass("open-sure")){
                console.log("调用下载接口、预留");
            }
            $downloadDiv.remove();
        });
        $("body").append($downloadDiv);*/
        var files = [];
        var $checkFiles = $(".file-list").find(":checked");
        if(typeof $checkFiles == "undefined" || $checkFiles == null || $checkFiles.length==0){
            layer.msg("请先选择需下载的文件");
            return;
        }
        /*if($.coolalbum.directory.parent_id!=0){*/
            //选择目录 下载该目录下所有的文件
            for(var i=0;i<$checkFiles.length;i++){
                var $checkFile = $($checkFiles[i]);
                if($checkFile.parent(".list-file").hasClass("cool-folder")){
                    //文件夹
                    var dirId = $checkFile.val();//dir:主键

                    var directory = $.dataTrans.dirsMap.get(parseInt(dirId));
                    var dirName = directory.directory_name;
                    self.pushDirFiles(files, directory, dirName);
                    /*if(directory&&directory.files.length>0){
                        for(var j=0;j<directory.files.length;j++){
                            var fileInfo = directory.files[j];

                            var dfile = {};
                            dfile["fileId"] = fileInfo.fileId;//dir:主键
                            dfile["subCaseId"] = fileInfo.subCaseId;;//子案件id

                            files.push(dfile);
                        }
                    }else {
                        layer.msg("无法下载空目录");
                        return;
                    }*/
                }else {
                    //文件
                    var dfile = {};
                    dfile["fileId"] = $checkFile.val();//fileId:主键
                    dfile["subCaseId"] = $checkFile.attr("scid");//子案件id


                    var curDirectId = $.coolalbum.directoryId;
                    var curDirectory = $.dataTrans.dirsMap.get(parseInt(curDirectId));
                    dfile["directoryName"] = curDirectory.directory_name;//子案件id

                    files.push(dfile);
                }
            }
        /*}else {*/
           /* for(var i=0;i<$checkFiles.length;i++){
                //获取文件下的所有文件
                var dirId = $($checkFiles[i]).val();//dir:主键

            }*/
        /*}*/
        $.dataTrans.zipFiles(files, function (fileId, subCaseId, zipName) {
            layer.msg("打包成功，开始下载文件");
            $.dataTrans.downloadFiles(fileId, subCaseId, zipName);
        });
    },
    pushDirFiles: function (files, directory, directoryName) {

        var self = this;
        if(directory&&directory.files.length>0){
            for(var j=0;j<directory.files.length;j++){
                var fileInfo = directory.files[j];

                var dfile = {};
                dfile["fileId"] = fileInfo.fileId;//dir:主键
                dfile["subCaseId"] = fileInfo.subCaseId;;//子案件id
                dfile["directoryName"] = directoryName;//子案件id

                files.push(dfile);
            }
        }
        if(directory.children&&directory.children.length>0){
            for(var i=0;i<directory.children.length;i++){
                var childDir = directory.children[i];
                directoryName += "/"+childDir.directory_name;
                self.pushDirFiles(files, childDir, directoryName);
            }
        }
    },
    openDelete: function () {
        var $checkFolder = $(".cool-folder").find(":checked");
        if($checkFolder.length>0){
            layer.msg("无法删除目录");
            return;
        }
        var $checkFiles = $(".file-list").find(":checked");
        if(typeof $checkFiles == "undefined" || $checkFiles == null || $checkFiles.length==0){
            layer.msg("请先选择需删除的文件");
            return;
        }

        var deleteFiles = [];
        $checkFiles.each(function (index, obj) {
            var checkObj = $(obj);
            var dfile = {};
            dfile["fileId"] = checkObj.val();//fileId:主键
            dfile["subCaseId"] = checkObj.attr("scid");//子案件id

            deleteFiles.push(dfile);
        });
        $.dataTrans.deleteFiles(deleteFiles, function (index, succesF, errorF) {
            if(index==deleteFiles.length){
                if(succesF&&succesF.length>0){
                    layer.msg("成功删除"+succesF.length+"个文件");
                    $.dataTrans.getExamineData(function (data) {
                        /*$.dataTrans.parseExamineData(data);*/
                        $.dataTrans.parseDiretWithFilesData(data);

                        var curDirectId = $.coolalbum.directoryId;

                        var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
                        var node = treeObj.getNodeByParam("dirId",curDirectId);
                        node.icon = "css/images/folder-nouse.png";
                        treeObj.updateNode(node);

                        $.treeOp.setDirectTree($.dataTrans.directNodes, "", $.dataTrans.dirList);

                        var curDirectory = $.dataTrans.dirsMap.get(curDirectId);
                        if(curDirectory.children.length>0){
                            $.coolalbum.showDirList(curDirectory, function () {
                                $.coolalbum.showListMsg(curDirectory.name, curDirectory.files.length);
                            });
                        }else {
                            $.coolalbum.showDirFileList(curDirectory, function () {
                                $.coolalbum.showListMsg(curDirectory.name, curDirectory.files.length);
                            });
                        }
                    });
                }else {
                    layer.msg("删除文件失败");
                }
                if(errorF&&errorF.length>0){
                    layer.msg("删除"+errorF.length+"个文件失败");
                }
            }else {
                return;
            }
        })
    },
    checkAll: function (ischecked) {
        $(".file-list").find("input").prop("checked",ischecked);
        if(ischecked){
            $(".file-list").children("div").addClass("checked");
        }else {
            $(".file-list").children("div").removeClass("checked");
        }
    },
    resetCheckInput:function () {
        //重置全选状态
        $("#all-check").prop("checked",false);
        $(".file-list").find("input").prop("checked",false);
    },
    bindOrder:function () {
        var coolalbum = this;
        coolalbum.state=0;
        $(".file-list").delegate("div", "mousedown", function (e) {
            var fileDiv = this;

            coolalbum.state=1;
            var x = e.clientX;
            var y = e.clientY;

            fileDiv.onmousemove = function (e) {
                var left = e.clientX-x;
                var top = e.clientY-y;

                $(this).css({
                    left:left,
                    top:top,
                });
            }

            fileDiv.onmouseup = function () {
                coolalbum.state=0;

                this.onmousemove = undefined;
            }
        });
    },
    refreshCoolalbum: function () {
        $.dataTrans.getExamineData(function (data) {
            /*$.dataTrans.parseExamineData(data);*/
            $.dataTrans.parseDiretWithFilesData(data);

            var curDirectId = $.coolalbum.directoryId;

            var curDirectory = $.dataTrans.dirsMap.get(curDirectId);
            if(curDirectory.parent_id==0){
                $.coolalbum.showDirList(curDirectory, function () {
                    $.coolalbum.showListMsg(curDirectory.name, curDirectory.files.length);
                });
            }else {
                $.coolalbum.showDirFileList(curDirectory, function () {
                    $.coolalbum.showListMsg(curDirectory.name, curDirectory.files.length);
                });
            }
        });
    },
    showDirsBtn: function () {
        $.coolalbum.state=0;
        $(".coolbum-tool").children("span").hide();
        $(".coolbum-tool").children(".download-btn").show();
        $(".grid-show").hide();
    },
    showFilesBtn: function () {
        $.coolalbum.state=0;
        $(".coolbum-tool").children("span").show();
        $(".coolbum-tool").children(".sort-save").hide();
        $(".coolbum-tool").children(".sort-rest").hide();
        $(".grid-show").show();
    },
    showDirList: function (directory, callback) {
        var coolalbum = $.coolalbum;

        $.coolalbum.resetCheckInput();

        $.coolalbum.directoryId=directory.directory_id;
        $.coolalbum.directory=directory;
        var dirList = directory.children;
        var fileList = directory.files;

        coolalbum.showDirsBtn();

        $(".file-list").empty();
        $(".file-list").undelegate();

        $(".file-list").delegate("div", "click", function () {
            var dom = $(this).find("input");
            $(".file-list").children("div").removeClass("selected");
            $(this).addClass("selected");
            if($(this).hasClass("cool-file")){
                $.fileExt.loadFileDom(dom.val())
                return;
            }

            var dirId = dom.val();

            var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
            var node = treeObj.getNodeByParam("dirId", dirId);
            if(node){
                //触发默认数据的click事件
                $("#"+node.tId+"_a").click();//触发ztree点击事件
                treeObj.expandNode(node, true, false, true);//展开节点
            }
        });
        $(".file-list").delegate(".icon-list-check", "click", function (event) {
            event.stopPropagation();//阻止事件冒泡即可

            var $check = $(this).parent().find("input");
            var isCheck = $check.prop("checked");
            var newChecked = !isCheck;
            $check.prop("checked",newChecked);
            if(newChecked){
                $(this).parent().addClass("checked");
            }else {
                $(this).parent().removeClass("checked");
            }
            if($(".file-list").find("input:not(:checked)").length==0){
                $("#all-check").prop("checked",true);
            }else {
                $("#all-check").prop("checked",false);
            }
        });

        for(var i=0;i<dirList.length;i++){
            var childDir=dirList[i];

            if($.dataTrans.fullSearchStatus&&(typeof childDir.isFSResult=="undefined"||!childDir.isFSResult)){
                //全文搜索时，只显示搜索结果
                continue;
            }
            var icon;
            if((childDir.files&&childDir.files.length>0)||(childDir.children&&childDir.children.length>0)){
                icon = "css/zTreeStyle/img/diy/folder_close.png"
            }else {
                icon = "css/images/folder-nouse.png"
            }

            var $checkbox = $("<div index='"+i+"' class='cool-folder list-file' title='"+childDir.directory_name+"'>" +
                "<input type='checkbox' style='vertical-align:middle;display: none;' value='"+childDir.directory_id+"' name='"+childDir.directory_name+"'>" +
                "<button class='icon-list-check' style=''></button>"+
                "<span class='anno-list nodata'><img src=\"css/images/annotation.png\"></span>"+
                "<img style='' src='"+icon+"'>" +
                "<span class='pic-name' style='text-overflow:ellipsis;word-break: keep-all;width: 121px;overflow:hidden;text-align:center;'>" +childDir.directory_name+"</span>"+
                "</div>");

            $(".file-list").append($checkbox);

        }
        if(fileList.length>0){

            coolalbum.showFilesBtn();
            for(var i=0;i<fileList.length;i++){
                var file=fileList[i];
                if($.dataTrans.fullSearchStatus&&(file.isFSResult=="undefined"||!file.isFSResult)){
                    //全文搜索时，只显示搜索结果
                    continue;
                }

                var $checkbox = $("<div index='"+i+"' class='cool-file list-file' title='"+file.fileName+"'>" +
                    "<input type='checkbox' style='vertical-align:middle;display: none;' fileIndex='"+file.fileDirectoryIndex+"' osrc='"+file.osrc+"' ftype='"+file.ftype+"' value='"+file.fileId+"' name='"+file.fileName+"' scid='"+file.subCaseId+"'>" +
                    "<button class='icon-list-check' style=''></button>"+
                    "<span class='anno-list'><img src=\"css/images/annotation.png\"></span>"+
                    "<img style='' src='"+file.icon+"' icon='"+file.icon+"' imgsrc='"+file.imgsrc+"' osrc='"+file.osrc+"'>" +
                    "<span class='pic-name' style='text-overflow:ellipsis;word-break: keep-all;width: 121px;overflow:hidden;text-align:center;'>" +file.fileName+"</span>"+
                    "</div>");

                var annoData = $.dataTrans.caseAnno[file.fileId];
                if(typeof annoData == "undefined"||annoData=="undefined"||annoData==""){
                    $checkbox.find(".anno-list").addClass("nodata");
                }

                if(file.ftype=="pic"){
                    $checkbox.children("img").addClass("opng")
                }else {
                    $checkbox.children("img").addClass("icon")
                }

                if(file.isFSResult){
                    $checkbox.find("span").css({
                        color:"red"
                    });
                }
                //禁止图片拖动操作
                $checkbox.find("img").mousedown(function (e) {
                    e.preventDefault();
                });
                //图片加载事件
                $checkbox.find("img").load(function () {
                    /*console.log($(this).attr("src")+" load sucess");*/
                });
                $checkbox.find("img").error(function () {
                    /*console.log($(this).attr("src")+" load error");*/
                    $(this).attr("src", "../../img/loaderr.png");
                });


                $(".file-list").append($checkbox);
                if(i==0){
                    //初始化选择文件
                    /*$.fileExt.loadFileDom($checkbox.find("input"));*/
                    $checkbox.trigger("click");
                }
            }
        }

        if(fileList.length==0&&dirList.length==0){
            $(".file-list").append("<div style='font-size:16px;height:50px;line-height:50px;text-align: center;'><span style='text-align: center;'>无数据</span></div>");

            $.fileExt.loadFileDom();
        }
        if(callback){
            callback();
        }
    },
    showDirFileList: function (directory, callback) {
        var coolalbum = $.coolalbum;
        coolalbum.resetCheckInput();

        $.coolalbum.directoryId=directory.directory_id;
        $.coolalbum.directory=directory;

        coolalbum.showFilesBtn();

        var fileList = directory.files;

        var coolalbum = this;
        var checked = this.checked;
        $(".file-list").empty();
        $(".file-list").undelegate();
        $.fnote.annoListBind($(".file-list"));

        $(".file-list").delegate("div", "click", function () {
            if(!($(this).hasClass("list-file")||$(this).hasClass("grid-file"))){
                return;
            }
            var dom = $(this).find("input");
            $(".file-list").children("div").removeClass("selected");
            $(this).addClass("selected");

            $.fileExt.loadFileDom(dom.val())
        });
        $(".file-list").delegate(".icon-list-check", "click", function () {
            var $check = $(this).parent().find("input");
            var isCheck = $check.prop("checked");
            var newChecked = !isCheck;
            $check.prop("checked",newChecked);
            if(newChecked){
                $(this).parent().addClass("checked");
            }else {
                $(this).parent().removeClass("checked");
            }
            if($(".file-list").find("input:not(:checked)").length==0){
                $("#all-check").prop("checked",true);
            }else {
                $("#all-check").prop("checked",false);
            }
        });
        $(".file-list").delegate(".cool-file", "mousedown", function (ev) {
            if(!($(this).hasClass("list-file")||$(this).hasClass("grid-file"))){
                return;
            }
            if($(".file-list").find(".anno-list-div").length>0){
                //批注显示中 不允许拖动
                return;
            }
            if($.dataTrans.fullSearchStatus){
                //全文搜索时 不允许进行排序
                return;
            }
            var sourceLeft = $(this).offset().left;
            var sourceTop = $(this).offset().top;
            var startLeft = ev.clientX;
            var startTop = ev.clientY;
            coolalbum.state=1;//拖拽中
            coolalbum.moveDiv=$(this);
            $(this).addClass("moving");
            $(document).bind("mousemove", function (ev) {
                var x = ev.clientX-startLeft;
                var y = ev.clientY-startTop;
                coolalbum.moveDiv.stop(true).animate({
                    left:x,
                    top:y
                },10)
            })
            $(document).bind("mouseup", function (ev) {

                var endX = ev.clientX;
                var endY = ev.clientY;

                var x = ev.clientX-startLeft;
                var y = ev.clientY-startTop;

                //判断当前拖拽后的目标节点
                var $targetDiv;
                $(".file-list").children("div").each(function(i) {
                    $item = $(this);
                    if(
                        endX > $item.offset().left &&
                        endY > $item.offset().top &&
                        (endX < $item.offset().left + $item.width()) &&
                        (endY < $item.offset().top + $item.height())
                    ) {
                        if(!$item.is(coolalbum.moveDiv) ){
                            $targetDiv = $item;
                        }
                    }
                });
                if($targetDiv!=undefined&&$targetDiv.length>0&&coolalbum.moveDiv!=undefined){

                    var sourceIndex = coolalbum.moveDiv.index();
                    var targetIndex = $targetDiv.index();

                    if(sourceIndex<targetIndex){
                        coolalbum.moveDiv.insertAfter($targetDiv);
                    }else {
                        coolalbum.moveDiv.insertBefore($targetDiv);
                    }

                    $(".file-list").children("div").animate({
                        left:0,
                        top:0
                    });
                    $(".file-list").children("div").each(function () {
                        var $div = $(this);
                        if($div.index()!=$div.attr("index")){
                            $div.addClass("newOrder");
                        }else {
                            $div.removeClass("newOrder");
                        }
                    });

                    coolalbum.moveDiv.removeClass("moving");
                    coolalbum.moveDiv=undefined;
                    if($(".newOrder").length>0){
                        coolalbum.state=2;//排序中
                    }else {
                        coolalbum.state=0;//原顺序
                    }

                    if(coolalbum.state==2){
                        coolalbum.inSort();
                    }else {
                        coolalbum.outSort();
                    }
                }else {
                    if(coolalbum.moveDiv!=undefined){
                        coolalbum.moveDiv.stop(true).animate({
                            left: 0,
                            top: 0
                        }, function () {
                            coolalbum.moveDiv.removeClass("moving");
                            coolalbum.moveDiv=undefined;
                        });
                    }
                }
                $(document).off("mousemove");
                $(document).off("mouseup");
            })
        });

        for(var i=0;i<fileList.length;i++){
            var file=fileList[i];
            if($.dataTrans.fullSearchStatus&&(file.isFSResult=="undefined"||!file.isFSResult)){
                //全文搜索时，只显示搜索结果
                continue;
            }

            var $checkbox = $("<div index='"+i+"' class='cool-file list-file' title='"+file.fileName+"'>" +
                "<input type='checkbox' style='vertical-align:middle;display: none;' fileIndex='"+file.fileDirectoryIndex+"' osrc='"+file.osrc+"' ftype='"+file.ftype+"' value='"+file.fileId+"' name='"+file.fileName+"' scid='"+file.subCaseId+"'>" +
                "<button class='icon-list-check' style=''></button>"+
                "<span class='anno-list'><img src=\"css/images/annotation.png\"></span>"+
                "<img style='' src='"+file.icon+"' icon='"+file.icon+"' imgsrc='"+file.imgsrc+"' osrc='"+file.osrc+"'>" +
                "<span class='pic-name' style='text-overflow:ellipsis;word-break: keep-all;width: 121px;overflow:hidden;text-align:center;'>" +file.fileName+"</span>"+
                "</div>");

            var annoData = $.dataTrans.caseAnno[file.fileId];
            if(typeof annoData == "undefined"||annoData=="undefined"||annoData==""){
                $checkbox.find(".anno-list").addClass("nodata");
            }

            if(file.ftype=="pic"){
                $checkbox.children("img").addClass("opng")
            }else {
                $checkbox.children("img").addClass("icon")
            }

            if(file.isFSResult){
                $checkbox.find("span").css({
                    color:"red"
                });
            }
            //禁止图片拖动操作
            $checkbox.find("img").mousedown(function (e) {
                e.preventDefault();
            });
            //图片加载事件
            $checkbox.find("img").load(function () {
                /*console.log($(this).attr("src")+" load sucess");*/
            });
            $checkbox.find("img").error(function () {
                /*console.log($(this).attr("src")+" load error");*/
                $(this).attr("src", "../../img/loaderr.png");
            });


            $(".file-list").append($checkbox);
            if(i==0){
                //初始化选择文件
                /*$.fileExt.loadFileDom($checkbox.find("input"));*/
                $checkbox.trigger("click");
            }
        }
        if(callback){
            callback();
        }
        if(fileList.length==0){
            $(".file-list").append("<div style='font-size:16px;height:50px;line-height:50px;text-align: center;'><span style='text-align: center;'>无数据</span></div>");

            $.fileExt.loadFileDom();
        }

        if($(".grid-show").hasClass("active")){
            $(".grid-show").trigger("click");
        }else {
            $(".list-show").trigger("click");
        }
    },
    /*showFileList: function (fileList, callback) {

        var coolalbum = this;
        var checked = this.checked;

        $.coolalbum.resetCheckInput();
        $.coolalbum.resetOrder();

        /!*this.bindOrder();*!/

        $(".file-list").empty();
        $(".file-list").undelegate();
        $(".file-list").delegate("div", "click", function () {
            var dom = $(this).find("input");
            $(".file-list").children("div").removeClass("selected");
            $(this).addClass("selected");

            $.fileExt.loadFileDom(dom)
        });
        $(".file-list").delegate(".icon-list-check", "click", function () {
            var $check = $(this).parent().find("input");
            var isCheck = $check.prop("checked");
            var newChecked = !isCheck;
            $check.prop("checked",newChecked);
            if(newChecked){
                $(this).parent().addClass("checked");
            }else {
                $(this).parent().removeClass("checked");
            }
            if($(".file-list").find("input:not(:checked)").length==0){
                $("#all-check").prop("checked",true);
            }else {
                $("#all-check").prop("checked",false);
            }
        });
        $(".file-list").delegate("div", "mousedown", function (ev) {
            var sourceLeft = $(this).offset().left;
            var sourceTop = $(this).offset().top;
            var startLeft = ev.clientX;
            var startTop = ev.clientY;
            coolalbum.state=1;//拖拽中
            coolalbum.moveDiv=$(this);
            $(this).addClass("moving");
            $(document).bind("mousemove", function (ev) {
                var x = ev.clientX-startLeft;
                var y = ev.clientY-startTop;
                coolalbum.moveDiv.stop(true).animate({
                    left:x,
                    top:y
                },10)
            })
            $(document).bind("mouseup", function (ev) {

                var endX = ev.clientX;
                var endY = ev.clientY;

                var x = ev.clientX-startLeft;
                var y = ev.clientY-startTop;

                //判断当前拖拽后的目标节点
                var $targetDiv;
                $(".file-list").children("div").each(function(i) {
                    $item = $(this);
                    if(
                        endX > $item.offset().left &&
                        endY > $item.offset().top &&
                        (endX < $item.offset().left + $item.width()) &&
                        (endY < $item.offset().top + $item.height())
                    ) {
                        if(!$item.is(coolalbum.moveDiv) ){
                            $targetDiv = $item;
                        }
                    }
                });
                if($targetDiv!=undefined&&$targetDiv.length>0&&coolalbum.moveDiv!=undefined){

                    var sourceIndex = coolalbum.moveDiv.index();
                    var targetIndex = $targetDiv.index();

                    if(sourceIndex<targetIndex){
                        coolalbum.moveDiv.insertAfter($targetDiv);
                    }else {
                        coolalbum.moveDiv.insertBefore($targetDiv);
                    }

                    $(".file-list").children("div").animate({
                        left:0,
                        top:0
                    });
                    $(".file-list").children("div").each(function () {
                        var $div = $(this);
                        if($div.index()!=$div.attr("index")){
                            $div.addClass("newOrder");
                        }else {
                            $div.removeClass("newOrder");
                        }
                    });

                    coolalbum.moveDiv.removeClass("moving");
                    coolalbum.moveDiv=undefined;
                    if($(".newOrder").length>0){
                        coolalbum.state=2;//排序中
                    }else {
                        coolalbum.state=0;//原顺序
                    }

                    if(coolalbum.state==2){
                        coolalbum.inSort();
                    }else {
                        coolalbum.outSort();
                    }
                }else {
                    if(coolalbum.moveDiv!=undefined){
                        coolalbum.moveDiv.stop(true).animate({
                            left: 0,
                            top: 0
                        }, function () {
                            coolalbum.moveDiv.removeClass("moving");
                            coolalbum.moveDiv=undefined;
                        });
                    }
                }
                $(document).off("mousemove");
                $(document).off("mouseup");
            })
        });

        for(var i=0;i<fileList.length;i++){
            var file=fileList[i];

            var $checkbox = $("<div index='"+i+"' class='list-file' title='"+file.fileName+"'>" +
                "<input type='checkbox' style='vertical-align:middle;display: none;' fileIndex='"+file.fileDirectoryIndex+"' osrc='"+file.osrc+"' ftype='"+file.ftype+"' value='"+file.fileId+"' name='"+file.fileName+"' scid='"+file.subCaseId+"'>" +
                "<button class='icon-list-check' style=''></button>"+
                "<img style='' src='"+file.icon+"' icon='"+file.icon+"' imgsrc='"+file.imgsrc+"' osrc='"+file.osrc+"'>" +
                "<span style='text-overflow:ellipsis;word-break: keep-all;width: 121px;overflow:hidden;text-align:center;'>" +file.name+"</span>"+
                "</div>");
            if(file.ftype=="pic"){
                $checkbox.find("img").addClass("opng")
            }else {
                $checkbox.find("img").addClass("icon")
            }

            if(file.isFSResult){
                $checkbox.find("span").css({
                    color:"red"
                });
            }
            //禁止图片拖动操作
            $checkbox.find("img").mousedown(function (e) {
                e.preventDefault();
            });
            //图片加载事件
            $checkbox.find("img").load(function () {
                /!*console.log($(this).attr("src")+" load sucess");*!/
            });
            $checkbox.find("img").error(function () {
                /!*console.log($(this).attr("src")+" load error");*!/
                $(this).attr("src", "../../img/loaderr.png");
            });


            $(".file-list").append($checkbox);
            if(i==0){
                //初始化选择文件
                /!*$.fileExt.loadFileDom($checkbox.find("input"));*!/
                $checkbox.trigger("click");
            }
            if(callback){
                callback();
            }
        }

        if($(".grid-show").hasClass("active")){
            $(".grid-show").trigger("click");
        }else {
            $(".list-show").trigger("click");
        }
    },*/
    showListMsg: function (directname, fileLength) {
        $(".dmsg").text(directname);
        $(".fmsg").text(fileLength);
        if($.dataTrans.fullSearchStatus){
            $(".detail-info .area-gr").html("全文搜索<span style='padding:0 5px;'>></span>"+directname);
        }else {
            $(".detail-info .area-gr").text(directname);
        }
    }
}