/**
 * 后台数据交互
 */
var DataTrans = function(){

    var self = this;
    self.layermsg =""

    self.fileList = [];
    self.dirList = [];

    self.urlParam={};
    self.caseInfoId="";
    self.comeFrom="";
    self.previewType="";
    self.serverIp = "";
    self.changeFiles = [];
}
DataTrans.prototype ={
    getServeIp:function(){
        $.ajax({
            type: "GET",
            async:false,
            url: "../../../caseCheck/caseInfo/examineDossier?"+"caseId="+$.dataTrans.urlParam.caseId+"&courtId="+$.dataTrans.urlParam.courtId+"&checkCaseResult="+$.dataTrans.urlParam.checkCaseResult,//链接地址
            /*dataType: "html",*/
            success: function (obj) {
                /*var obj = JSON.parse(obj);*/
                if(obj.code=="0"){
                    $.dataTrans.serverIp = obj.data.serverIp;
                    if(obj.data.messageType == 1){
                        $.dataTrans.layermsg = "案件无卷宗";
                    }else if(obj.data.messageType == 2){
                        $.dataTrans.layermsg = "未归目（待分类区存在文件）";
                    }else if(obj.data.messageType == 3){
                        $.dataTrans.layermsg = "目录缺少卷宗";
                    }
                }else {
                    layer.msg("加载数据失败");
                }
            },
            error:function(){
                layer.msg("加载数据失败");
            }
        });
    },
    showSecCourt: function () {
        var fileExt = this;
        var cout=0;
        if($("#sec").text()!=""){
            var text = $("#sec").text();
            cout=parseInt(text)+1;
        }
        $("#sec").text(cout);
    },
    deleteFiles: function (files, callback) {
        var successF = [];
        var errorF = [];
        var index=0;
        for(var i=0;i<files.length;i++){
            var file = files[i];
            var url = "../../../court/files/deleteFileLj?fileId="+file.fileId+"&subCaseId="+file.subCaseId;
            $.ajax(
                {
                    url:url,
                    type: 'GET',
                    contentType: 'application/json;charset=utf-8',
                    success: function (obj) {
                        if(obj.code=="0"){
                            console.log("删除文件成功");
                            successF.push(file);
                            index++;
                            callback(index, successF, errorF);
                        }else {
                            console.log("删除文件失败");
                            errorF.push(file);
                            index++;
                            callback(index, successF, errorF);
                        }
                    }
                }
            );
        }
    },
    moveToDirectory: function (subFiles, callback) {
        var url = "/court/files/updataFileLists";
        $.ajax(
            {
                url:url,
                type: 'POST',
                data: JSON.stringify(subFiles),
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.msg("移动文件成功");
                        callback();
                    }else {
                        layer.msg("移动文件失败");
                        console.log("移动文件失败，错误码为"+obj.code);
                    }
                }
            }
        );
    },
    addDirectory: function (obj, callback) {
        $.ajax(
            {
                url:'/court/directory/addDirectory',
                type: 'POST',
                data: JSON.stringify(obj),
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.msg("新增目录成功");
                        callback();
                    }else {
                        layer.msg("新增目录失败");
                        if(obj.code=="2601"){
                            console.log("目录名称为空");
                        }else if(obj.code=="2603"){
                            console.log("目录简介为空");
                        }else if(obj.code=="2605"){
                            console.log("目录所属父目录为空");
                        }else if(obj.code=="2602"){
                            console.log("目录名存在异常字符");
                        }else if(obj.code=="2611"){
                            console.log("目录名称已存在");
                        }else if(obj.code=="2612"){
                            layer.msg("无权限进行新增目录");
                        }
                    }
                }
            }
        );
    },
    getCaseInfo: function (callback) {
        $.dataTrans.getServeIp();
        $.ajax(
            {
                url:$.dataTrans.serverIp+'/court/caseInfo/queryByParam?case_id='+$.dataTrans.urlParam.caseId,
                type: 'get',
                contentType: 'application/json;charset=utf-8',
                async:false,
                success: function (obj) {
                    if(obj.code=="0"&&obj.total==1){
                        $.dataTrans.caseInfo=obj.data[0];
                        /*if(callback){
                            callback($.dataTrans.caseInfo);
                        }*/
                    }else {
                        layer.msg("未能正确获取案件信息");
                    }
                }
            }
        );
    },
    changeFileDir:function () {

        if($.dataTrans.source=="1"){
            layer.msg("不允许移动文件");
            return false;
        }else if($.dataTrans.source=="2"){
            layer.msg("禁止在客户端进行该操作");
            return;
        }
        var filesVo = {"list":$.dataTrans.changeFiles};
        $.ajax(
            {
                url:$.dataTrans.serverIp+'/court/files/classifyFiles',
                type: 'POST',
                data: JSON.stringify(filesVo),
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.open({
                            title: '移动文件'
                            ,content: '移动文件成功'
                        });
                    }else {
                        layer.open({
                            title: '移动文件'
                            ,content: '移动文件失败'
                        });
                    }
                }
            }
        );
    },
    deleteFile: function (id, subCaseId, callback) {
        if($.dataTrans.source=="1"){
            layer.msg("不允许删除文件");
            return false;
        }else if($.dataTrans.source=="2"){
            layer.msg("禁止在客户端进行该操作");
            return;
        }
        var url = $.dataTrans.serverIp+"/court/files/deleteFileLj?fileId="+id+"&subCaseId="+subCaseId;

        $.ajax(
            {
                url:url,
                type: 'GET',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.msg("删除文件成功");
                        callback(obj.code);
                    }else {
                        layer.msg("删除文件失败");
                    }
                }
            }
        );
    },
    moveFile: function (data, callback) {
        if($.dataTrans.source=="1"){
            layer.msg("不允许移动文件");
            return false;
        }else if($.dataTrans.source=="2"){
            layer.msg("禁止在客户端进行该操作");
            return;
        }
        $.ajax(
            {
                url:$.dataTrans.serverIp+'/court/files/moveFile?thisFileId='+data.thisFileId+"&thisSubCaseId="+data.thisSubCaseId+"&nextFileId="+data.nextFileId+"&nextSubCaseId="+data.nextSubCaseId+"&targetDirectoryId="+data.targetDirectoryId,
                type: 'POST',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.open({
                            title: '移动文件'
                            ,content: '移动文件成功'
                        });

                        callback(obj.code);
                    }else {
                        layer.open({
                            title: '移动文件'
                            ,content: '移动文件失败'
                        });
                    }
                }
            }
        );
    },
    getHtmlPageNum : function (fileid, subCaseId, callback) {
        $.ajax(
            {
                url:$.dataTrans.serverIp+'/court/caseInfo/getHtmlNum?fileId='+fileid+"&subCaseId="+subCaseId,
                type: 'GET',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    callback(obj.code, obj.data);
                }
            }
        );
    },
    toHtml:function (fileid, subCaseId, callback) {
        $.ajax(
            {
                url:$.dataTrans.serverIp+'/court/files/file2HTML?fileId='+fileid+"&subCaseId="+subCaseId,
                type: 'GET',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    callback(obj.code, obj.data);
                }
            }
        );
    },
    urlParse:function () {
        var url = window.location.search;
        var obj = {};
        var reg = /[?&][^?&]+=[^?&]+/g;
        var arr = url.match(reg);

        if (arr) {
            arr.forEach(function (item) {
                var tempArr = item.substring(1).split('=');
                var key = decodeURIComponent(tempArr[0]);
                var val = decodeURIComponent(tempArr[1]);
                obj[key] = val;
            });
        }
        return obj;
    },
    renameFile:function (fileid, subCaseId, newName) {
        if($.dataTrans.source=="1"){
            layer.msg("不允许文件重命名");
            return false;
        }else if($.dataTrans.source=="2"){
            layer.msg("禁止在客户端进行该操作");
            return;
        }
        $.ajax(
            {
                url:'/court/files/reNameFile?fileId='+fileid+'&fileName='+encodeURI(newName)+"&subCaseId="+subCaseId ,
                type: 'GET',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.open({
                            title: '文件重命名'
                            ,content: '文件重命名成功'
                        });
                    }else {
                        layer.open({
                            title: '文件重命名'
                            ,content: '文件重命名失败'
                        });
                    }
                }
            }
        );
    },
    download: function (fileid, subCaseId) {

        var url = $.dataTrans.serverIp+"/court/download/downloadFile?fileID="+fileid+"&subCaseId="+subCaseId;

        var iframe = document.createElement("iframe")
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
    },
    zipFiles: function (files, callback) {
        layer.msg("文件开始下载，请稍后");
        $.ajax(
            {
                url:$.dataTrans.serverIp+'/court/download/zipSelFiles',
                type: 'POST',
                data: JSON.stringify(files),
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        var data = obj.data;
                        callback(data.fileId, data.subCaseId, data.zipName);
                    }else {
                        layer.msg("文件压缩失败，无法下载");
                    }
                }
            }
        );
    },
    downloadFiles: function (fileId, subCaseId, zipName) {
        var url = "../../../court/download/downloadSelFiles?fileId="+fileId+"&zipName="+zipName+"&subCaseId="+subCaseId;

        var iframe = document.createElement("iframe")
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
    },
    changeFilesIndex: function (data, callback) {
        $.ajax(
            {
                url:'/court/files/changeFilesIndex',
                type: 'POST',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(data),
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.msg("保存新的排序成功");
                        callback();
                    }else {
                        layer.msg("保存新的排序失败");
                    }
                }
            }
        );

    },
    paramParse:function () {
        $.dataTrans.urlParam = $.dataTrans.urlParse();   //解析url,获取url中需要的参数
        $.dataTrans.urlParam.caseId = $.dataTrans.urlParam["caseId"];  //将取到的案件列表页的id传给caseInfoId
        $.dataTrans.comeFrom = $.dataTrans.urlParam["comeFrom"]; //来源 1:信访 2:审判
        $.dataTrans.previewType = $.dataTrans.urlParam["previewType"];    //查看类型 0:全部,1:本审,2:原审
        $.dataTrans.source = $.dataTrans.urlParam["source"];    //页面打开来源 2：客户端
        $.dataTrans.username = $.dataTrans.urlParam["username"];

        if($.dataTrans.source&&$.dataTrans.source=="1"){
            $(".tab-text .pre-text").html("<a  style='color: #fff;' href='../../model/HN_user_subcase_manager/page.html'>操作记录</a>");
        }
    },
    getExamineData:function (parseMethod) {
        $.ajax({
            type: "GET",
            // async:false,
            url: "../../../caseCheck/caseInfo/examineDossier?"+"caseId="+$.dataTrans.urlParam.caseId+"&courtId="+$.dataTrans.urlParam.courtId+"&checkCaseResult="+$.dataTrans.urlParam.checkCaseResult,//链接地址
            /*dataType: "html",*/
            success: function (obj) {
                /*var obj = JSON.parse(obj);*/
                if(obj.code=="0"){
                    $.dataTrans.serverIp = obj.data.serverIp;
                    parseMethod(obj.data);
                }else {
                    layer.msg("加载案件失败");
                }
            }
        });
    },
    parseDiretWithFilesData: function (data) {
        var self=this;
        var caseInfoMap;
        var fileList;
        var dirList;
        var filesMap = new Map();
        var dirsMap = new Map();
        
        var pdirmap = new Map();

        var zNodes = new Array();
        var directNodes = new Array();
       
        var caseNode  = data;
        var dId = [];
        for (let i = 0; i < caseNode.directoryInfoList.length; i++) {
            var caseNodeelement = caseNode.directoryInfoList[i];
            for (let index = 0; index <  caseNodeelement.children.length; index++) {
                var element =  caseNodeelement.children[index];
                if(element.color == "red"){
                    dId.push(element.directory_id);
                }
            }
        }
        for (let i = 0; i < caseNode.directoryInfoList.length; i++) {
            var caseNodeelement = caseNode.directoryInfoList[i];
            for (let index = 0; index < dId.length; index++) {
                var elementD = dId[index];
                if(caseNodeelement.directory_id == elementD){
                    caseNodeelement.color = "red";
                }
            }
            
        }
       
        //默认 案件目录
        var rootDir = new Object();
        rootDir.directory_id=0;
        rootDir.children=new Array();
        dirsMap.set(0, rootDir);
        pdirmap.set(0, rootDir.children);
        if(caseNode){
            fileList = caseNode.fileInfoList;
            dirList = caseNode.directoryInfoList;
            //遍历目录
           
            for(var i = 0,len=dirList.length; i < len; i++) {
                var dir = dirList[i];
                dir.files = [];
                dirsMap.set(dir.directory_id, dir);

                //设置当前目录所在父目录
                var pChildList = pdirmap.get(dir.parent_id);
                if(typeof pChildList == "object"){
                    pChildList.push(dir);
                }else {
                    pChildList = new Array();
                    pdirmap.set(dir.parent_id, pChildList);
                    pChildList.push(dir);
                }
                //设置当前目录的子目录
                var childList = dir.children;
                if(typeof pChildList == "Array"){

                }else {
                    var newchildList = pdirmap.get(dir.directory_id);
                    if(newchildList&&newchildList.length>0){

                    }else {
                        newchildList = new Array();
                        pdirmap.set(dir.directory_id, newchildList);
                    }
                    dir.children=newchildList;
                }
            }
            //遍历文件
            for(j = 0,len=fileList.length; j < len; j++) {
                var file = fileList[j];
               
                //设置显示图标或图片
                var name = file.fileName;
                var index = name.lastIndexOf(".");
                var ext = name.substr(index+1);
                //文件名后缀比较
                if(ext == "jpg" || ext == "png" || ext == "jpeg"){
                    file.icon="css/images/pic-icon.png";
                    file.imgsrc=$.dataTrans.serverIp+"/court/download/downloadFile?fileID="
                        +file.fileId+"&subCaseId="+file.subCaseId;
                    file.osrc=$.dataTrans.serverIp+"/court/download/downloadFile?fileID="
                        +file.fileId+"&subCaseId="+file.subCaseId;
                    file.ftype="pic";
                }else if(ext == "doc" || ext == "docx"){
                    file.icon="css/images/word.png";
                    file.imgsrc="css/images/word-big.png";
                    file.osrc=$.dataTrans.serverIp+"/court/download/preview?fileID="
                        +file.fileId+"&subCaseId="+file.subCaseId;
                    file.ftype="doc";
                }else if(ext == "xls"||ext == "xlsx")
                {
                    file.icon="/img/excel-small.png";
                    file.imgsrc="/img/excel-b.png";
                    file.osrc=$.dataTrans.serverIp+"/court/download/preview?fileID="
                        +file.fileId+"&subCaseId="+file.subCaseId;
                    file.ftype="excel";
                }else if(ext == "pdf")
                {
                    file.icon="css/images/pdf.png";
                    file.imgsrc="css/images/pdf-big.png";
                    file.osrc=$.dataTrans.serverIp+"/court/download/preview?fileID="
                        +file.fileId+"&subCaseId="+file.subCaseId;
                    file.ftype="pdf";
                }else {
                    file.icon="css/images/video.png";
                    file.imgsrc="css/images/video-big.png";
                    file.osrc=$.dataTrans.serverIp+"/court/download/preview?fileID="
                        +file.fileId+"&subCaseId="+file.subCaseId;
                    file.ftype="video";
                }
                filesMap.set(file.fileId, file);

                //设置dir和file的关联，使可以通过访问dir获取所有对应的file
                var directoryId = file.directoryId;
                if(!dirsMap.has(directoryId)){
                    //文件对应的目录在案件目录列表中不存在
                    console.warn("file's directory not exist in directory list;direcoryid:"+directoryId+";fileid:"+file.fileId);
                    continue;
                }

                var fileParentDir = dirsMap.get(directoryId);
                var dirFiles = fileParentDir.files;
                if(dirFiles&&(dirFiles.length==0||dirFiles.indexOf(file.fileId)<0)){
                    dirFiles.push(file);
                    this.addDirsFileCount(fileParentDir, dirsMap);
                }
                
            }
            //文件
        }
        $.dataTrans.fileList = fileList;
        $.dataTrans.dirList = dirList;
        $.dataTrans.filesMap = filesMap;
        $.dataTrans.dirsMap = dirsMap;
    },
    addDirsFileCount: function (directory, dirsMap) {
        var self = this;
        if(typeof directory.fileSize=="undefined"||directory.fileSize=="undefined"||directory.fileSize==0){
            directory.fileSize=1;
        }else {
            directory.fileSize++;
        }
        if(directory.parent_id!=null&&directory.parent_id!="undefined"&&directory.parent_id!="0"&&directory.parent_id!=0){var parentDir = dirsMap.get(directory.parent_id);
            self.addDirsFileCount(parentDir, dirsMap);
        }
    },
    parseExamineData: function (data) {
        var caseInfoMap;
        var fileList;
        var dirList;
        var zNodes = [];
        var directNodes = [];

        $.dataTrans.comeFrom=1;

        caseInfoMap  = data;

        if($.dataTrans.comeFrom==1){
            //获取信访
            if(caseInfoMap){
                var caseNode = caseInfoMap["ThePetition"];
                var rootid = "";
                //zNodes[0] = { id:rootid,  name: caseNode.case_code};
                //zNodes[0].open = true;
                $.treeOp.nodeIndex = -1;
                $.treeOp.directIndex = -1;
                $.treeOp.setCaseTree(zNodes, rootid, caseNode.directoryInfoList, caseNode.fileInfoList,$.treeOp.nodeIndex);
                $.treeOp.setDirectTree(directNodes, rootid, caseNode.directoryInfoList);
                fileList = caseNode.fileInfoList;
                dirList = caseNode.directoryInfoList;
            }
        }if($.dataTrans.comeFrom==1){
            //获取信访
            if(caseInfoMap){
                var caseNode = caseInfoMap["ThePetition"];
                var rootid = "";
                //zNodes[0] = { id:rootid,  name: caseNode.case_code};
                //zNodes[0].open = true;
                $.treeOp.nodeIndex = -1;
                $.treeOp.directIndex = -1;
                $.treeOp.setCaseTree(zNodes, rootid, caseNode.directoryInfoList, caseNode.fileInfoList,$.treeOp.nodeIndex);
                $.treeOp.setDirectTree(directNodes, rootid, caseNode.directoryInfoList);
                fileList = caseNode.fileInfoList;
                dirList = caseNode.directoryInfoList;
            }
        }

        $.dataTrans.fileList = fileList;
        $.dataTrans.dirList = dirList;

        var zTreeObj = $.fn.zTree.init($("#demoZtree"), $.treeOp.setting, zNodes);//初始化树
        $.fn.zTree.getZTreeObj("#demoZtree");//把得到的树赋给div
    },
    getFNotes: function (fileid, subcaseid, callback) {
        //获取批注内容
        $.ajax(
            {
                url:'/court/fileNote/getFNotes?fileId='+fileid+"&subCaseId="+subcaseid+"&timestamp="+ new Date().getTime(),
                /*url: "../../json/note.json",*/
                type: 'get',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {5
                    callback(obj.code, obj.data);
                },
                error: function () {
                    layer.msg("获取批注失败");
                }
            }
        );
    },
    addFNotes: function (data, callback) {
        if($.dataTrans.source=="1"){
            layer.msg("不允许增加文件批注");
            return false;
        }else if($.dataTrans.source=="2"){
            layer.msg("禁止在客户端进行该操作");
            return;
        }
        //获取批注内容
        $.ajax(
            {
                url:'/court/fileNote/addFNotes',
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(data),
                success: function (obj) {
                    callback(obj.code, obj.data);
                },
                error: function () {
                    layer.msg("批注失败");
                }
            }
        );
    },
    updateFNotes: function (data, callback) {
        if($.dataTrans.source=="1"){
            layer.msg("不允许修改文件批注");
            return false;
        }else if($.dataTrans.source=="2"){
            layer.msg("禁止在客户端进行该操作");
            return;
        }
        //修改批注内容
        $.ajax(
            {
                url:'/court/fileNote/updateFNotes',
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(data),
                success: function (obj) {
                    callback(obj.code);
                },
                error: function () {
                    layer.msg("批注失败");
                }
            }
        );
    },
    delFNotes: function (noteid, fileid, subcaseid, callback) {
        if($.dataTrans.source=="1"){
            layer.msg("不允许删除文件批注");
            return false;
        }else if($.dataTrans.source=="2"){
            layer.msg("禁止在客户端进行该操作");
            return;
        }
        //获取批注内容
        var data = {};
        data.noteId = noteid;
        data.fileId = fileid;
        data.subCaseId = subcaseid;
        $.ajax(
            {
                url:'/court/fileNote/delFNotes',
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(data),
                success: function (obj) {
                    callback(obj.code);
                },
                error: function () {
                    layer.msg("批注失败");
                }
            }
        );
    },
    picOcrData: function (fileId, subCaseId, callback) {
        $.ajax(
            {
                url:'/court/files/picOcrData?subCaseId='+subCaseId+'&fileId='+fileId,
                type: 'get',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    callback(obj.code, obj.data);
                },
                error: function () {
                    layer.msg("获取图片识别结果失败");
                }
            }
        );
    },
    esSearch: function (text, callback) {
        $.ajax(
            {
                url:$.dataTrans.serverIp+'/court/EsSearch/search?text='+text+'&caseId='+$.dataTrans.urlParam.caseId,
                type: 'get',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    callback(obj.code, obj.data);
                },
                error: function () {
                    layer.msg("全文检索失败");
                }
            }
        );
    },
    getCaseAnno: function (caseId, getOptFun) {
     
        var getUrl =$.dataTrans.serverIp+"/court/FileNoteController/queryByParam";
        var annoObj = {
            caseId:caseId,
        }
        $.ajax(
            {
                url:getUrl,
                type: 'post',
                data:JSON.stringify(annoObj),
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        getOptFun(obj.data);
                    }else {
                        getOptFun({});
                    }
                },
                error: function () {
                    layer.msg("获取批注失败");
                }
            }
        );
        /*var dataStr = "{\"code\":\"0\",\"message\":\"Success\",\"total\":null,\"data\":{\"1081508461974052\":[{\"fileAnnotationId\":\"1\",\"content\":\"我是批注\",\"createTime\":null,\"updataTime\":1,\"userId\":null,\"abscissa\":1.0,\"ordinate\":1.0,\"fileId\":\"1\",\"subCaseId\":\"1\",\"caseId\":\"1\",\"display\":null,\"user_name\":null}]}}";
        var data = JSON.parse(dataStr);

        getOptFun(data.data);*/
    },
    deleteAnno: function (annoId, delOptFun) {
        var delUrl = "/court/FileNoteController/delete?fileAnnotationId="+annoId;
        $.ajax(
            {
                url:delUrl,
                type: 'get',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        delOptFun(obj.code);
                    }else {
                        layer.msg("删除批注失败");
                    }
                },
                error: function () {
                    layer.msg("删除批注失败");
                }
            }
        );
    },
    saveAnno: function (annoObj, saveOptFun) {
        var saveUrl = "/court/FileNoteController/edit"
        $.ajax(
            {
                url:saveUrl,
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(annoObj),
                success: function (obj) {
                    if(obj.code=="0"){
                        saveOptFun(obj.code);
                    }else {
                        layer.msg("保存批注失败");
                    }
                },
                error: function () {
                    layer.msg("保存批注失败");
                }
            }
        );
    },
    fmtDate: function (obj) {
        var date;
        if(obj){
            date =  new Date(obj);
        }else {
            date = new Date();
        }
        var y = 1900+date.getYear();
        var m = "0"+(date.getMonth()+1);
        var d = "0"+date.getDate();
        var h = "0"+date.getHours();
        var m = "0"+date.getMinutes();
        var s = "0"+date.getSeconds();
        return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)+" "+h.substring(h.length-2,h.length)+":"+m.substring(m.length-2,m.length)+":"+s.substring(s.length-2,s.length);
    },
    getRulingData: function () {

        var getUrl = "/court/hbExecuteStatus/queryByCaseId?caseId="+$.dataTrans.urlParam.caseId;
        $.ajax(
            {
                url:getUrl,
                type: 'get',
                async:false,
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        $.dataTrans.rulingData = obj.data;
                    }else {
                        layer.msg("获取执行线索失败");
                    }
                },
                error: function () {
                    layer.msg("获取执行线索失败");
                }
            }
        );
    },
    getRulingStatus: function () {
        var getUrl = "/court/hbExecuteCaseStatus/getCaseStatusList?caseId="+$.dataTrans.urlParam.caseId;
        $.ajax(
            {
                url:getUrl,
                type: 'get',
                async:false,
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        $.dataTrans.rulingStatus = obj.data;
                    }else {
                        $.dataTrans.rulingStatus = [];
                    }
                },
                error: function () {
                    layer.msg("获取案件状态失败");
                }
            }
        );
    },
    getRelateCases: function () {
        var getUrl = "/court/hbexecute/getRelationCaseList?caseId="+$.dataTrans.urlParam.caseId;
        $.ajax(
            {
                url:getUrl,
                type: 'get',
                async:false,
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        $.dataTrans.relateCases = obj.data;
                    }else {
                        $.dataTrans.relateCases = [];
                    }
                },
                error: function () {
                    layer.msg("获取关联案件失败");
                }
            }
        );
    },
    genSubCaseId: function () {
        var reData = "";
        var getUrl = "/court/hbExecuteStatus/genSubCaseId?caseId="+$.dataTrans.urlParam.caseId;
        $.ajax(
            {
                url:getUrl,
                type: 'get',
                async:false,
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        reData = obj.data;
                    }else {
                    }
                },
                error: function () {
                    layer.msg("获取关联案件失败");
                    return "";
                }
            }
        );
        return reData;
    },
    //补充关联案件
    addRelationCase: function (caseName, relationType, relationIndex, errorCallback, successCallback) {
        var getUrl = "/court/hbexecute/addRelationCase?thisCaseId="+$.dataTrans.urlParam.caseId+"&caseName="+caseName+"&relationType="+relationType+"&relationIndex="+relationIndex;
        $.ajax(
            {
                url:getUrl,
                type: 'get',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.msg("补充成功");
                        successCallback();
                    }else if(obj.code=="2741"){
                        layer.msg("当前案件尚未存在任何关联，请添加关联");
                        errorCallback();
                    }else if(obj.code=="2701"){
                        layer.msg("输入案件案号不存在");
                    }else if(obj.code=="2742"){
                        layer.msg("输入案号已经与当前案件存在关联");
                    }else {
                        layer.msg("补充失败");
                    }
                },
                error: function () {
                    layer.msg("补充关联案件失败");
                }
            }
        );
    },
    //首次新增
    creatRelation: function (relationType, relationIndex, successCallback) {
        var getUrl = "/court/hbexecute/creatRelation?thisCaseId="+$.dataTrans.urlParam.caseId+"&relationType="+relationType+"&relationIndex="+relationIndex;
        $.ajax(
            {
                url:getUrl,
                type: 'get',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.msg("新增成功");
                        successCallback();
                    }else {
                        layer.msg("新增失败");
                    }
                },
                error: function () {
                    layer.msg("新增关联案件失败");
                }
            }
        );
    },
    deleteFileList: function (files) {
        var url = "/court/HBfiles/deleteFileList";
        $.ajax(
            {
                url:url,
                type: 'POST',
                data: JSON.stringify(files),
                contentType: 'application/json;charset=utf-8',
                async: false,
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.msg("删除文件成功");
                        /*callback();*/
                    }else {
                        layer.msg("删除文件失败");
                        console.log("移动文件失败，错误码为"+obj.code);
                    }
                }
            }
        );
    },
    uploadCaseEnd: function (subCaseId) {
        var reData = "";
        var getUrl = "/court/hbExecuteStatus/uploadCaseEnd?subCaseId="+subCaseId;
        $.ajax(
            {
                url:getUrl,
                type: 'get',
                async:false,
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        layer.msg("文件上传完成");
                    }else {
                    }
                },
                error: function () {
                    layer.msg("文件上传失败");
                    return "";
                }
            }
        );
        return reData;
    }
}