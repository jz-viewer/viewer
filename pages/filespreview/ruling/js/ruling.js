

var RulingCompose = function(){
    var self = this;
}

RulingCompose.prototype = {
    init: function(setting){
        var self = this;

        $.dataTrans.getRulingData();
        $.dataTrans.getRelateCases();
        $.dataTrans.getRulingStatus();

        self.bindEvent();

        self.initRulingInfo();
    },
    bindEvent: function(){
        var self = this;

        $(".ruling-info").delegate(".album-open", "click", function () {
            var dirKey = $(this).parent(".progress-msg").attr("dirKey");
            self.openFolderAlbum(dirKey);
        });
        $(".ruling-info").delegate(".open-link-div", "click", function () {
            self.openRelateCase();
        });
        $(".ruling-info").delegate(".del-btn", "click", function () {
            var dirKey = $(this).parent(".progress-msg").attr("dirKey");
            layer.confirm('将删除该案号目录下的所有文件，是否确认删除？', {
                btn: ['确认','取消'] //按钮
            }, function(){
                layer.msg('确认删除！！！');
                self.deleteFiles(dirKey);
            }, function(){
                layer.msg('取消删除！！！');
            });
        });
        $(".ruling-info").delegate(".over-upload", "click", function () {
            var dirKey = $(this).parent(".progress-msg").attr("dirKey");
            layer.confirm('覆盖上传将删除该案号目录下的所有文件，是否确认覆盖？', {
                btn: ['确认','取消'] //按钮
            }, function(){
                layer.msg('确认上传！！！');
                self.openUpload(dirKey);
            }, function(){
                layer.msg('取消上传！！！');
            });
        });

        $("body").delegate("#album-shlter", "click", function () {
            self.closeAlbum();
            self.closeRulingRelate();
        });

        $("body").delegate(".ruling-close", "click", function () {
            self.closeAlbum();
            self.closeRulingRelate();

            $("#album-shlter").remove();
            $(".ruling-relate").remove();
        });

        $("body").delegate(".ruling-btn.add", "click", function () {
            self.addRelationCase();
        });
        $("body").delegate(".goto-case-btn", "click", function () {
            var caseId = $(this).parent(".relate-list-item").attr("caseId");
            self.openNewCase(caseId);
        });
        /*$("body").delegate(".add-relate-sure", "click", function () {
            self.addRelationCase();
        });*/

        $(".ruling-tab").click(function () {
            self.showRulingTab();
        });
    },
    showRulingTab: function(){
        $(".tab-box li").removeClass("select-tab");
        $(".ruling-tab").toggleClass("select-tab");

        $(".tab-tail").removeClass("active");
        $(".ruling-info").toggleClass("active");
    },
    setTimerText: function (statusId, value) {
        var timerText = $(".ruling-timer").find(".progress-text");
        timerText.eq(statusId-1).text(value);

        var timerBlock = $(".ruling-timer").find(".progress-block");
        timerBlock.eq(statusId-1).addClass("active");

        var timerBlock = $(".progress-table").find(".progress-block");
        timerBlock.eq(statusId-1).addClass("active");
    },
    initRulingInfo: function () {
        var self = this;

        self.initRulingStatus();
        self.initRulingData();
    },
    initRulingStatus: function () {
        var self = this;

        var rulingStatus = $.dataTrans.rulingStatus;
        if(rulingStatus&&rulingStatus.length>0){
            for(var i=0;i<rulingStatus.length;i++){
                var status = rulingStatus[i];
                self.setTimerText(status.statusId, status.enterTime)
            }
        }

    },
    initRulingData: function () {
        var self = this;

        var rulingData = $.dataTrans.rulingData;
        if(rulingData){
            var first = rulingData[1];
            var fJdom = $(".progress-table tr").eq(0).find("td:last-child");
            self.loadRulingData(fJdom, first);
            var sec = rulingData[2];
            var fJdom = $(".progress-table tr").eq(1).find("td:last-child");
            self.loadRulingData(fJdom, sec);
            var three = rulingData[3];
            var fJdom = $(".progress-table tr").eq(2).find("td:last-child");
            self.loadRulingData(fJdom, three);
            var four = rulingData[4];
            var fJdom = $(".progress-table tr").eq(3).find("td:last-child");
            self.loadRulingData(fJdom, four);
            var five = rulingData[5];
            var fJdom = $(".progress-table tr").eq(4).find("td:last-child");
            self.loadRulingData(fJdom, five);
        }
    },
    loadRulingData: function (jdom, list) {
        var self = this;
        if(list){
            jdom.empty();//删除原有数据

            for(var i=0;i<list.length;i++){
                var dirData = list[i];
                var strRela = "";
                if(dirData.relationStatus==1){
                    strRela = "(关联)";
                }
                var dirKey = dirData.subCaseId+"-"+dirData.dirId;
                jdom.append("<div class='progress-msg' dirKey='"+dirKey+"'><div class='relate-msg'>" +
                    "<span>"+strRela+"</span>" +
                    "</div>" +
                    "<span>"+dirData.time+"</span>" +
                    "<div class='album-open'>"+dirData.dirName+"【"+dirData.caseName+"】"+"</div>" +
                    "                            <button class='over-upload'>覆盖上传</button><button class='del-btn'>删除</button></div>");
                this.loadAlbum(dirData.fileData, dirKey);
            }
        }
    },
    loadAlbum: function (fileList, dirKey) {
        var $album = $(".ruling-album");
        if($album.length==0){
            $album = $("<div class='ruling-album'></div>");
            $album.append("<div class='ruling-close icon-close'></div>");
            $("body").append($album);
        }
        var $dirList = $(".ruling-dir-album[dirKey="+dirKey+"]");
        if($dirList.length==0){
            $dirList = $("<div class='ruling-dir-album' dirKey='"+dirKey+"'></div>");
        }else {
            $dirList.empty();//删除相册原有文件
        }
        for(var i=0;i<fileList.length;i++){
            var file = fileList[i];

            $dirList.append("<div style='display: inline-block;' fileId='"+file.fileId+"' subCaseId='"+file.subCaseId+"'>" +
                "<a onclick='return false;' rel='"+dirKey+"[gallery]' href='../../../court/download/downloadFile?fileID="+file.fileId+"&subCaseId="+file.subCaseId+"'>" +
                "<img src=' ../../../court/download/downloadFile?fileID="+file.fileId+"&subCaseId="+file.subCaseId+"'>" +
                "</a>" +
                "</div>");
        }
        $album.append($dirList);

        $("a[rel^='"+dirKey+"']").prettyPhoto();
    },
    openFolderAlbum: function (dirKey) {
        $("body").append("<div id='album-shlter' style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;z-index: 220;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'>" +
            "</div>");

        var $album = $(".ruling-album");
        $album.addClass("active");

        $album.find(".ruling-dir-album[dirKey="+dirKey+"]").addClass("active");
    },
    openRelateCase: function () {
        $("body").append("<div id='album-shlter' style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;z-index: 220;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'>" +
            "</div>");
        var $relateCases = $("<div class='ruling-relate'></div>");

        $relateCases.append("<div><div class='ruling-close icon-close'></div></div>");
        var $relateList = $("<div class='relate-list'></div>");
        $relateCases.append($relateList);
        var relateCasesData = $.dataTrans.relateCases;
        if(relateCasesData&&relateCasesData.length>0){
            relateCasesData.forEach(function (relateCase) {
                $relateList.append("<div class='relate-list-item' caseId='"+relateCase.caseId+"'>" +                    ""+
                    "<div class='type-block'><div>"+relateCase.relationType+"</div>" +
                        "<div>"+relateCase.laDate+"</div>" +
                    "</div>" +
                    "<div class='case-name'>"+relateCase.caseName+"</div>" +
                    "<div class='ruling-btn goto-case-btn'>查看卷宗</div>" +
                    "</div>");
            });
        }
        $relateCases.append("<div class='ruling-edit style='width:400px;'><div class='ruling-btn add' style='display: block;'>补充关联案件</div></div>");
        $("body").append($relateCases);
        
    },
    reloadRelateCase: function () {
        var $relateList = $(".relate-list");
        $relateList.empty();
        var relateCasesData = $.dataTrans.relateCases;
        if(relateCasesData&&relateCasesData.length>0){
            relateCasesData.forEach(function (relateCase) {
                $relateList.append("<div class='relate-list-item'>" +                    ""+
                    "<div class='type-block'><div>"+relateCase.relationType+"</div>" +
                    "<div>"+relateCase.laDate+"</div>" +
                    "</div>" +
                    "<div class='case-name'>"+relateCase.caseName+"</div>" +
                    "<div class='goto-case-btn'>查看卷宗</div>" +
                    "</div>");
            });
        }
    },
    addRelationCase: function () {
        var self = this;

        $(".add-relate-edit").remove();

        $(".ruling-edit").append("<div class='add-relate-edit'>" +
            "<div><span>新增案号</span><input id='caseName' style='height:35px;width: 280px;'></div>" +
            "<div><span>所属阶段</span>" +
            "<select style='height:35px;width: 80px;'  id='relationType'>" +
            "<option value=''>请选择所属阶段</option>" +
            "<option value='一审'>一审</option>" +
            "<option value='二审'>二审</option>" +
            "<option value='民再'>民再</option>" +
            "<option value='首次执行'>首次执行</option>" +
            "<option value='执行恢复'>执行恢复</option>" +
            "</select>" +
            "</div>" +
            /*"<input id='relationType' style='height:35px;width: 80px;'></div>" +*/
            "<div><span>排序号</span><input id='relationIndex' style='height:35px;width: 80px;'></div>" +
            "<div class='add-relate-sure'>确认</div>" +
            "</div>");


        $(".add-relate-sure").click(function () {
            var caseName = $("#caseName").val();
            if(caseName==""){
                layer.msg("请输入案号");
                return;
            }
            var relationType = $("#relationType").val();
            if(relationType==""){
                layer.msg("请选择所属阶段");
                return;
            }
            var relationIndex = $("#relationIndex").val();

            if(relationIndex==""){
                layer.msg("请输入排序号");
                return;
            }else {

                var re = /^[1-9]+[0-9]*]*$/;

                if (!re.test(relationIndex))
                {
                    layer.msg("排序号请输入数字");
                    return false;
                }
            }
            self.savaAddRelationCase(caseName, relationType, relationIndex);
        });
    },
    savaAddRelationCase: function (caseName, relationType, relationIndex) {
        var self = this;

        $.dataTrans.addRelationCase(caseName, relationType, relationIndex, function () {
            $(".add-relate-edit").empty();
            $(".add-relate-edit").append("" +
                "<div><span>所属阶段</span>" +
                "<select style='height:35px;width: 80px;'  id='relationType'>" +
                "<option value=''>请选择所属阶段</option>" +
                "<option value='一审'>一审</option>" +
                "<option value='二审'>二审</option>" +
                "<option value='民再'>民再</option>" +
                "<option value='首次执行'>首次执行</option>" +
                "<option value='执行恢复'>执行恢复</option>" +
                "</select>" +
                "</div>" +                "<div><span>排序号</span><input id='relationIndex' style='height:35px;width: 80px;'></div>" +
                "<div class='create-relate-sure'>确认</div>" +
                "");

            $(".create-relate-sure").click(function () {
                var relationType = $("#relationType").val();
                var relationIndex = $("#relationIndex").val();

                self.saveCreateRelationCase(relationType, relationIndex);
            });
        }, function () {
            $.dataTrans.getRelateCases();
            self.reloadRelateCase();

            $(".add-relate-edit").remove();
        })
    },
    saveCreateRelationCase: function (relationType, relationIndex) {
        var self = this;

        $.dataTrans.creatRelation(relationType, relationIndex, function () {
            $.dataTrans.getRelateCases();
            self.reloadRelateCase();

            $(".add-relate-edit").remove();
        });
    },
    deleteFiles: function (dirKey) {
        var self = this;

        var files = [];
        var dirFilesJdom = $(".ruling-dir-album[dirkey="+dirKey+"]").children("div");
        for(var i=0;i<dirFilesJdom.length;i++){
            var jDom = dirFilesJdom.eq(i);

            var newFile = {};
            newFile.fileId = jDom.attr("fileId");
            newFile.subCaseId = jDom.attr("subCaseId");

            files.push(newFile);
        }

        $.dataTrans.deleteFileList(files);

        $.dataTrans.getRulingData();
        self.initRulingData();
    },
    closeAlbum: function (dirKey) {
        var self = this;

        $(".ruling-album").removeClass("active");
        $(".ruling-dir-album").removeClass("active");

        $("#album-shlter").remove();
    },
    closeRulingRelate: function (dirKey) {
        var self = this;

        $("#album-shlter").remove();
        $(".ruling-relate").remove();
    },
    openNewCase: function (caseInfoId) {
        var newCaseUrl = "../common_filespreview/page.html?caseInfoId=" + caseInfoId;
        window.open(newCaseUrl, '_blank')
    },
    openUpload: function (dirKey) {
        var self = this;

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

        var dirs = dirKey.split("-");

        var $shlter = $("<div style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;" +
            "z-index: 20;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>");
        $("body").append($uploadDiv);
        $("body").append($shlter);

        var reData = "";
        var newSubcaseId;
        layui.use('upload', function(){
            var upload = layui.upload; //得到 upload 对象//创建一个上传组件
            uploader = upload.render({
                elem: '#uploadArea',
                url: '../../../court/hbExecuteStatus/uploadSingleFile',
                auto: false,
                accept: 'file', //普通文件
                multiple: true,
                bindAction: '#sub',
                data: {
                    userName:$.dataTrans.username,
                    caseId:$.dataTrans.caseInfoId,
                    directoryId:dirs[1],
                },
                field: "filedata",
                before: function(obj){
                    /*uploader.config.data.fileIndex = reData.subIndex;*/
                    self.deleteFiles(dirKey);
                },
                choose: function(obj){
                    var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                    if(reData==""){
                        reData = $.dataTrans.genSubCaseId();
                        uploader.config.data.subCaseId = reData.subCaseId;
                        uploader.config.data.subIndex = reData.subIndex;
                        uploader.config.data.fileIndex = 1;
                        newSubcaseId = reData.subCaseId;
                    }

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

                    $.dataTrans.uploadCaseEnd(newSubcaseId);

                    $.dataTrans.getRulingData();
                    self.initRulingData();
                }
            });
        });
    }
}
$.rulingCompose = new RulingCompose();