var Dispute = function () {
    var self = this;
}

Dispute.prototype = {
    //各类操作事件
    init: function (parentDom, setting) {
        var self = this;
        var disputePanel = $("<div class='displutePanel'></div>");
        disputePanel.append("<div class='displute-title'><span class='dispute-div-title'>争议焦点列表</span><span class='new-dispute-btn add-btn' style='margin-left: 10px;'></span></div>");
        disputePanel.append("<div class='displute-body'></div>");
        self.disputePanel = disputePanel;

        parentDom.append(disputePanel);

        self.onToAdd = setting.onToAdd;
        self.onLinkClick = setting.onLinkClick;
        self.onToCorrelate = setting.onToCorrelate;
        self.onRemove = setting.onRemove;
        self.onEditSave = setting.onEditSave;
        self.onNewSave = setting.onNewSave;

        self.scale = 1;

        self.bind();
    },
    bind: function () {
        var self = this;

        self.disputePanel.delegate(".new-dispute-btn", "click", function () {
            /*self.onDisputeToAdd();*/

            var $disputeTEdit = $("<div class='dispute-window'>\n" +
                "        <div class='' >\n" +
                "            <div class='dispute-open-title' style=''><span>争议焦点</span></div>" +
                "            <div class='open-dipcontent item'>" +
                "            <div class='simple-label'><span>争议点&nbsp;&nbsp;</span><span class='warn-msg' style='color:#a99f9f '>【最多25字符】</span><span class='input-msg'></span>" +
                "            </div>" +
                "            <div class='simple-input'><input style='width: 470px;' maxlength='25'  value=''>" +
                "            </div>" +
                "            <div class='detail-label'>争议点描述" +
                "            </div>" +
                "            <div class='detail-input'><textarea style='width: 470px;height:280px;' value=''></textarea>" +
                "            </div>" +
                "            </div>" +
                "            <div class='' style='bottom: 0px;right: 0px;'>" +
                "                <button class='open-btn open-t-close' style=''>关闭</button>" +
                "                <button class='open-btn open-t-save' style=''>保存</button>" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>");

            var $shlter = $("<div style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;" +
                "z-index: 20;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>");
            $("body").append($disputeTEdit);
            $("body").append($shlter);

            $disputeTEdit.find(".open-t-close").bind("click", function () {
                $disputeTEdit.remove();
                $shlter.remove();
            });
            $disputeTEdit.find(".open-t-save").bind("click", function () {
                var disputeData = new Object();
                disputeData.issues_simpledescription=$disputeTEdit.find(".simple-input input").val();
                disputeData.issues_detaileddescription=$disputeTEdit.find(".detail-input textarea").val();
                disputeData.case_id = $.dataTrans.caseInfoId;
                $.disputeData.addDispute(disputeData, function () {
                    $disputeTEdit.remove();
                    $shlter.remove();

                    $.disputeData.getDisputeList($.dataTrans.caseInfoId);

                    self.showDisputeList($.disputeData.getTDisputeList());

                    /*self.showFileDisputeWindow();*/
                });
            });
        });
        self.disputePanel.delegate(".dispute-a", "click", function (e) {
            if($(this).find("span").hasClass("new-dispute-t")){
                return;
            }
            if($(this).find("span").hasClass("edit-dispute-t")){
                return;
            }
            $(".dispute-div.active").removeClass("active");

            var dispute = $(this).parent("div");
            dispute.addClass("active");

            self.onDisputeLinkClick(dispute);


            var issues_id=dispute.attr("id");
            var issues = $.disputeData.getDisputeById(issues_id);
            var issues_simpledescription = issues.issues_simpledescription;
            var issues_detaileddescription = issues.issues_detaileddescription;

            $.disptAlbum.showDisputeMsg(issues_id, issues_simpledescription, issues_detaileddescription);

            /*self.clearDisputeContent();
            self.showDisputeContent(dispute, "测试数据");*/
        });
        self.disputePanel.delegate(".correlate-btn", "click", function () {
            var disputeJDom = $(this).parent("div");

            var disputeId = disputeJDom.attr("id");
            $.disputeData.setTCurrentDispute($.disputeData.getDisputeById(disputeId));
            $.disputeData.setTCurrentDisputeJDom(disputeJDom);

            self.onDisputeToCorrelate();
        });
        self.disputePanel.delegate(".rm-dispute-btn", "click", function () {
            var dispute = $(this).parent("div");

            self.onDisputeToRemove(dispute, function () {
                $.disputeData.getDisputeList($.dataTrans.caseInfoId);
                /*self.showFileDisputeWindow();*/
            });
        });
        self.disputePanel.delegate(".content-edit-save", "click", function () {
            var dispute = $(this).parent("div");

            self.onDisputeToEdit(dispute);
        });
        self.disputePanel.delegate(".save-new-btn", "click", function () {
            var dispute = $(this).parent("div");

            self.onDisputeNewToSave(dispute);
        });

        self.disputePanel.delegate(".to-edit-btn", "click", function () {
            var dispute = $(this).parent("div");

            var issues_id=dispute.attr("id");
            var issues = $.disputeData.getDisputeById(issues_id);

            var $disputeTEdit = $("<div class='dispute-window'>\n" +
                "        <div class='' >\n" +
                "            <div class='dispute-open-title' style=''><span>争议焦点</span></div>" +
                "            <div class='open-dipcontent item'>" +
                "            <div class='simple-label'>争议点" +
                "            </div>" +
                "            <div class='simple-input'><input style='width: 470px;' value='"+issues.issues_simpledescription+"'>" +
                "            </div>" +
                "            <div class='detail-label'>争议点描述" +
                "            </div>" +
                "            <div class='detail-input'><textarea style='width: 470px;height:280px;' value='"+issues.issues_detaileddescription+"'>"+issues.issues_detaileddescription+"</textarea>" +
                "            </div>" +
                "            </div>" +
                "            <div class='' style='bottom: 0px;right: 0px;'>" +
                "                <button class='open-btn open-t-close' style=''>关闭</button>" +
                "                <button class='open-btn open-t-save' style=''>保存</button>" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>");

            var $shlter = $("<div style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;" +
                "z-index: 20;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>");
            $("body").append($disputeTEdit);
            $("body").append($shlter);

            $disputeTEdit.find(".open-t-close").bind("click", function () {
                $disputeTEdit.remove();
                $shlter.remove();
            });
            $disputeTEdit.find(".open-t-save").bind("click", function () {
                var disputeData = new Object();
                disputeData.issues_id=dispute.attr("id");
                disputeData.issues_simpledescription=$disputeTEdit.find(".simple-input input").val();
                disputeData.issues_detaileddescription=$disputeTEdit.find(".detail-input textarea").val();
                $.disputeData.updateDispute(disputeData, function () {
                    $disputeTEdit.remove();
                    $shlter.remove();
                    $.disputeData.getDisputeList($.dataTrans.caseInfoId);

                    self.showDisputeList($.disputeData.getTDisputeList());
                });
            });

        });

        self.disputePanel.delegate(".to-save-btn", "click", function () {
            var dispute = $(this).parent("div");

            var editspan = dispute.find(".dispute-a span:first");
            editspan.attr("contenteditable", false);
            editspan.removeClass("edit-dispute-t")

            var disputeData = new Object();
            disputeData.issues_id=dispute.attr("id");
            disputeData.issues_simpledescription=editspan.text();
            $.disputeData.updateDispute(disputeData)

            var $item = $(this);
            $item.removeClass("to-edit-btn");
            $item.addClass("to-save-btn");
            $item.text("修改");
        });

    },
    showDisputeContent: function (parentDom, content) {
        parentDom.append("<div class='dispute-content'><span class='dispute-title'>"+content+"</span><span class='content-edit-save save-btn'></span></div>");
    },
    clearDisputeContent: function () {
        $(".dispute-content").remove();
    },
    onDisputeLinkClick: function (disputeJDom) {
        var self = this;

        console.log("onDisputeLinkClick");

        var disputeId = disputeJDom.attr("id");
        $.disputeData.setTCurrentDispute($.disputeData.getDisputeById(disputeId));
        $.disputeData.setTCurrentDisputeJDom(disputeJDom);

        /*disputeJDom.siblings(".active").removeClass("active");
        disputeJDom.addClass("active");*/

        if(typeof self.onLinkClick === "function"){
            self.onLinkClick(disputeJDom);
        }
    },
    onDisputeToAdd: function () {
        var self = this;

        console.log("onDisputeToAdd");
        if(typeof self.onToAdd === "function"){
            self.onToAdd();
        }

        var disputeUl = self.disputePanel.find("ul");
        disputeUl.append("<div><a class='dispute-a'><span class='new-dispute-t' contenteditable='true'>请输入新的</span></a><span class='save-new-btn save-btn' ></span><span class='rm-dispute-btn remove-btn'></span></div>");
    },
    onDisputeToEdit: function (disputeJDom) {
        var self = this;

        console.log("onDisputeToEdit");
        var disputeId = disputeJDom.attr("id");
        $.disputeData.setTCurrentDispute($.disputeData.getDisputeById(disputeId));
        $.disputeData.setTCurrentDisputeJDom(disputeJDom);

        if(typeof self.onEditSave === "function"){
            self.onEditSave();
        }
    },
    onDisputeNewToSave: function (disputeJDom) {
        var self = this;

        console.log("onDisputeNewToSave");

        if(typeof self.onNewSave === "function"){
            self.onNewSave(disputeJDom);
        }
    },
    onDisputeToCorrelate: function () {
        var self = this;

        console.log("onDisputeToCorrelate");

        if(typeof self.onToCorrelate === "function"){
            self.onToCorrelate();
        }
    },
    onDisputeToRemove: function (dispute, otherCompFunction) {
        var self = this;

        console.log("onDisputeToRemove");
        if(typeof self.onRemove === "function"){
            self.onRemove(dispute);
        }
        if(typeof otherCompFunction === "function"){
            otherCompFunction();
        }
    },
    //元素组件
    showDisputeList: function (disPuteList, otherCompFunction) {
        $(".displute-body").empty();

        var disputeUl = $("<div style='border: solid 1px #333333;overflow: auto;height: 840px;'></div>");
        disPuteList.forEach(function (item) {
            disputeUl.append("<div class='dispute-div' id='"+item.issues_id+"'>" +
                "<div class='dispute-a'>"+item.issues_simpledescription+"</div>" +
                /*"<input class='dispute-t-input' type='text' placeholder='请输入争议点' value='"+item.issues_simpledescription+"'>"+*/
                /*"<span class='to-edit-btn edit-btn' title='修改争议点信息'></span>" +
                "<span class='correlate-btn link-btn' title='关联当前文件与争议点'></span>" +
                "<span class='rm-dispute-btn remove-btn' title='删除争议点'></span>" +*/
                "</div>");
        })
        $(".displute-body").append(disputeUl);

        if(typeof otherCompFunction === "function"){
            otherCompFunction();
        }
    },
    showFileDisputeWindow: function () {

        /*var curJObj = $.fileExt.curJObj;
        if(typeof curJObj == "undefined" || curJObj == null || curJObj == ""){
            return;
        }*/

        var disputeList = $.disputeData.getTDisputeList();
        $(".open-dipcontent").find(".dispute").remove();
        $(".open-dipcontent").find(".dispute-detail-input").remove();
        disputeList.forEach(function (item) {
            console.log(JSON.stringify(item));
            var $disputeDiv = $("<div id='"+item.issues_id+"' class='dispute'><span class='dispute-label'>"+item.issues_simpledescription+"</span>" +
                "<input class='dispute-input' type='text' placeholder='请输入争议点' value='"+item.issues_simpledescription+"'>"+
                "<span class='dispute-to-eidt edit-btn' title='修改争议点信息'></span>" +
                "<span class='dispute-to-save save-btn' title='保存争议点'></span>" +
                "<span class='dispute-to-link link-btn' title='关联当前文件与争议点'></span>" +
                "<span class='dispute-to-unlink unlink-btn'title='取消当前文件与争议点的关联'></span>" +
                "<span class='dispute-to-remove remove-btn' title='删除争议点'></span>" +
                "<span class='dispute-goto goto-btn'></span>" +
                "</div>");
            $(".open-dipcontent").append($disputeDiv);
            var desc="";
            if(item.issues_detaileddescription&&item.issues_detaileddescription!=null){
                desc=item.issues_detaileddescription;
            }
            $(".open-dipcontent").append("<div class='dispute-detail-input'><textarea placeholder='请输入争议点描述'>"+desc+"</textarea></div>");

            var curJObj = $.fileExt.curJObj;
            var fileId = curJObj.fileId;
            if(item.file_id&&item.file_id.indexOf(fileId)>=0){
                $disputeDiv.addClass("correlated");
            }
        });
    }
}
$.dispute = new Dispute();