var Control = function () {
    var self = this;
}

Control.prototype = {
    init: function (setting) {
        var self = this;
        $.disputeData.init();
        $.disputeData.getDisputeList($.dataTrans.caseInfoId);

        $.dispute.init($(".dispute-info").find(".panel:first"), {
            onLinkClick: self.disputeToFileList,
            onToCorrelate: self.fileToFilebox,
            onNewSave: self.saveNewDispute,
            onRemove:self.removeDispute,
        });
        $.dispute.showDisputeList($.disputeData.disputeList);

        $.disptAlbum.init({
            getFileInfo: self.getFileInfo,
            dataCancelRelate: $.disputeData.cancelRelateToFile,
            dataAddRelate: $.disputeData.relateDisputeToFile,
            onToCorrelate: self.fileToFilebox
        });

        $(".displute-body").find(".dispute-div:first").find(".dispute-a").trigger("click");
        $(".displute-body").find(".dispute-div:first").addClass("active");


        $.control.bindEvent();
    },
    bindEvent: function () {
        var self = this;
        $(".dispute-tab").click(function () {
            self.showDisputeTab();
        });
    },
    showDisputeTab: function () {
        $(".tab-box li").removeClass("select-tab");
        $(".dispute-tab").toggleClass("select-tab");

       /* $(".base-info").css({
            display:"none",
        });
        $(".detail-info").css({
            display:"none",
        });
        $(".dispute-info").css({
            display:"block",
        });*/

        $(".tab-tail").removeClass("active");
        $(".dispute-info").toggleClass("active");
    },
    disputeToFileList: function (disputeJDom) {
        //打开争议点关联文件列表
        console.log("加载相册");

        var disputeId = disputeJDom.attr("id");

        var dispute = $.disputeData.getDisputeById(disputeId);
        //设置当前选择的数据对象
        $.disputeData.setTCurrentDispute(dispute);
        $.disputeData.setTCurrentDisputeJDom(disputeJDom);

        $.disptAlbum.showDisputeFileList(dispute.file_id, disputeJDom)
        $.disptAlbum.showListMsg("争议点-> "+dispute.issues_simpledescription, dispute.file_id.length);
    },
    fileToFilebox: function () {
        //文件列表显示文件
        console.log("加载文件");
        layer.msg("加载文件");

        /*var curDir = $.coolalbum.directory;*/
        //加载案件卷目录
        var curDir = $.dataTrans.dirsMap.get(0);

        if(curDir.children.length>0){
            $.disptAlbum.showDirList(curDir);
        }/*else{
            $.disptAlbum.showFileList(curDir.files);
        }*/
    },
    getFileInfo: function (fileId) {
        //通过id获取文件信息
        var fileInfo = $.dataTrans.filesMap.get(fileId);

        return fileInfo;
    },
    saveNewDispute: function (disputeJDom) {

        var issues_simpledescription = disputeJDom.find("span:first").text();
        var disputeData = new Object();
        disputeData.issues_simpledescription=issues_simpledescription;
        disputeData.case_id = $.dataTrans.caseInfoId;
        $.disputeData.addDispute(disputeData);
        $.disputeData.getDisputeList($.dataTrans.caseInfoId)

        $.dispute.showDisputeList($.disputeData.getTDisputeList());
    },
    removeDispute: function (disputeJDom) {

        var issues_id = disputeJDom.attr("id");
        $.disputeData.removeDispute(issues_id);
    }
}
$.control = new Control();