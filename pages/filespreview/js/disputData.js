/**
 * 后台数据交互-争议点
 */
var DisputeData = function(){

    var self = this;

}

DisputeData.prototype = {
    init: function () {
        var self = this;

    },

    setTDisputeList: function (disputeList) {
        var self = this;

        self.disputeList = disputeList;
    },
    getTDisputeList: function () {
        var self = this;

        return self.disputeList;
    },
    setTCurrentDispute: function (dispute) {
        //设置当前显示的争议点数据对象
        var self = this;

        self.curDispute = dispute;
    },
    setTCurrentDisputeJDom: function (disputeJDom) {
        //设置当前显示的争议点内部对象
        var self = this;

        self.disputeJDom = disputeJDom;
    },
    getTCurrentDispute: function () {
        //获取当前显示的争议点数据对象
        var self = this;
        return self.curDispute;
    },
    getTCurrentDisputeJdom: function () {
        //获取当前显示的争议点内部对象
        var self = this;

        return self.disputeJDom;
    },
    setDisputeMap: function (disputeList) {
        var self = this;
        self.disputeMap = new Map();
        disputeList.forEach(function (item) {
            var disputeId = item.issues_id;
            self.disputeMap.set(""+disputeId, item);

            if(item.file_id){
                item.file_id.forEach(function (file_id) {
                    self.setFileToDisputeMap(file_id, disputeId);
                });
            }

        });
    },
    getDisputeById: function (disputeId) {
        var self = this;

        return self.disputeMap.get(disputeId);
    },
    getDisputeList: function (case_id, callback) {
        var self = this;

        var url = $.dataTrans.serverIp+"/court/issuesServer/SelectIssuesByCaseid?case_id="+$.dataTrans.urlParam.caseId;
        $.ajax(
            {
                url:url,
                type: 'GET',
                contentType: 'application/json;charset=utf-8',
                async:false,
                success: function (obj) {
                    if(obj.code=="0"){
                        console.log("获取争议点数据成功");
                        self.setDisputeMap(obj.data);
                        self.setTDisputeList(obj.data)
                        if(typeof callback === "function"){
                            callback();
                        }
                    }else {
                        console.log("获取争议点数据失败，错误码为"+obj.code);
                    }
                }
            }
        );
    },
    setFileToDisputeMap: function(fileId, issues_id){
        var fileInfo = $.dataTrans.filesMap.get(fileId);
        if(fileInfo){
            if(fileInfo.issueses){
                if(fileInfo.issueses.indexOf(issues_id)<0){
                    fileInfo.issueses.push(issues_id);
                }
            }else {
                fileInfo.issueses = new Array();
                fileInfo.issueses.push(issues_id);

            }
        }
    },
    addDispute: function (dispute, callback) {
        var url = "/court/issuesServer/addIssues";
        $.ajax(
            {
                url: url,
                type: 'POST',
                data: JSON.stringify(dispute),
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        console.log("新增争议点信息成功");
                        if(typeof callback === "function"){
                            callback();
                        }
                    }else {
                        console.log("新增争议点信息失败");
                    }
                }
            }
        );
    },
    removeDispute: function (issues_id, callback) {
        var url = "/court/issuesServer/delIssues?issues_id="+issues_id;
        $.ajax(
            {
                url:url,
                type: 'GET',
                contentType: 'application/json;charset=utf-8',
                async:false,
                success: function (obj) {
                    if(obj.code=="0"){
                        console.log("删除争议点信息成功");
                        if(typeof callback === "function"){
                            callback();
                        }
                    }else {
                        console.log("删除争议点信息失败，错误码为"+obj.code);
                    }
                }
            }
        );
    },
    updateDispute: function (dispute, callback) {

        console.log("更新争议点信息成功");
        var url = "/court/issuesServer/updateIssues";
        $.ajax(
            {
                url: url,
                type: 'POST',
                data: JSON.stringify(dispute),
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        console.log("新增争议点信息成功");
                        if(typeof callback === "function"){
                            callback();
                        }
                    }else {
                        console.log("新增争议点信息失败");
                    }
                }
            }
        );
    },
    relateDisputeToFile: function (issuesTofile, callback) {
        var self = this;
        var url = "/court/issuesServer/issuesTofile";
        $.ajax(
            {
                url: url,
                type: 'POST',
                data: JSON.stringify(issuesTofile),
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        console.log("关联成功");
                        if(typeof callback === "function"){
                            callback();
                        }
                    }else {
                        console.log("关联失败");
                    }
                }
            }
        );
        if(typeof callback === "function"){
            callback();
        }
    },
    cancelRelateToFile: function (issuesTofile, callback) {
        var url = "/court/issuesServer/delIssuesTofile";
        $.ajax(
            {
                url: url,
                type: 'POST',
                data: JSON.stringify(issuesTofile),
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        console.log("取消关联成功");
                        if(typeof callback === "function"){
                            callback();
                        }
                    }else {
                        console.log("取消关联失败");
                    }
                }
            }
        );
        /*var url = "court/issuesServer/delIssuesTofile?file_id="+file_id+"&issues_id="+issues_id;
        $.ajax(
            {
                url:url,
                type: 'GET',
                contentType: 'application/json;charset=utf-8',
                success: function (obj) {
                    if(obj.code=="0"){
                        console.log("取消关联成功");
                    }else {
                        console.log("取消关联失败，错误码为"+obj.code);
                    }
                }
            }
        );*/
    }
}
$.disputeData = new DisputeData();