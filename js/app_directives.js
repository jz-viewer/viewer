var myDirectives = angular.module('myDirectives', [])
    //日历控件
    .directive('dateTimePicker', function ($rootScope) {
        return {
            restrict: 'ECA',
            link: function (scope, element, attr) {
                var _conf = {
                    lang: 'zh'
                };
                if (attr.plugintype == 'datetime') {
                    _conf.format = attr.format || 'Y-m-d H:i:s';
                } else if (attr.plugintype == 'date') {
                    _conf.format = attr.format || 'Y-m-d';
                    _conf.timepicker = false;
                } else if (attr.plugintype == 'time') {
                    _conf.format = attr.format || 'H:i:s';
                    _conf.datepicker = false;
                }
                $(element).datetimepicker(_conf);

                // scope.param["laDateEnd"] = $rootScope.getUnixDate(scope.paramCol["laDateEnd"]);
                // scope.param["laDateStart"] = $rootScope.getUnixDate(scope.paramCol["laDateStart"]);
                // 对时间参数的判断 存在paramCol
                if( scope.paramCol) {
                    scope.$watch("paramCol",function(now,old){
                        if(scope.pageName=="warn_query"){
                            var date=$rootScope.getDateStr(new Date(), 'datetime');
                            var nowDay=$rootScope.getUnixDate(date);
                            if($rootScope.getUnixDate(now.laDateStart)<nowDay){
                                now.laDateEnd=now.laDateStart.substring(0,10)+" 23:59:59";
                            }else{
                                now.laDateEnd=date;
                            }
                            if($rootScope.getUnixDate(now.laDateEnd)<nowDay){
                                now.laDateStart=now.laDateEnd.substring(0,10)+" 00:00:00";
                            }else{
                                now.laDateEnd=date;
                            }

                        }
                        scope.getCheckTime(now,old);

                    },true);
                }
                if(scope.taskParam) {
                    scope.$watch("taskParam",function(now,old){
                        scope.getCheckTime(now,old,"img")
                    },true);
                }
                //兼容统计页面
                if( scope.param) {
                    scope.$watch("param",function(now,old){
                        if ( now.laDateEnd && now.laDateStart){
                            scope["laDateEnd"]= now["laDateEnd"].length>10?now["laDateEnd"]:now["laDateEnd"]+" 23:59:59";
                            scope["laDateStart"]= now["laDateStart"].length>10?now["laDateStart"]:now["laDateStart"]+" 23:59:59";
                            scope["laDateEnd"] = $rootScope.getUnixDate(scope["laDateEnd"])+999;
                            scope["laDateStart"] = $rootScope.getUnixDate(scope["laDateStart"]);
                            if (scope.laDateEnd && scope.laDateStart) {
                                if (scope["laDateStart"] > scope["laDateEnd"]) {
                                    // layer.msg("开始时间不能大于结束时间");
                                    // return false;
                                }
                            }
                        }

                    },true);
                }
                scope.getCheckTime=function(now,old,imgQuery){
                    var laDateStart="laDateStart",laDateEnd="laDateEnd";
                    if(imgQuery){
                        laDateStart="startTime";
                        laDateEnd="endTime";
                    }
                    if ( now[laDateEnd] && now[laDateStart]){
                        if(scope.param) {
                            scope.param[laDateEnd] = $rootScope.getUnixDate(now[laDateEnd])+999;
                            scope.param[laDateStart] = $rootScope.getUnixDate(now[laDateStart]);
                            if (scope.param.laDateEnd && scope.param.laDateStart) {
                                if (scope.param[laDateStart] > scope.param[laDateEnd]) {
                                    // layer.msg("开始时间不能大于结束时间");
                                    // return false;
                                }
                            }
                        }
                    }
                }
                var datal=[];
                $("input[name='CarPlateNumber']").click(function(ev){
                    var e=(ev)?ev:window.event;
                    e.stopPropagation();
                    if(document.cookie.split(';')[1]) {
                        datal = JSON.parse(unescape(document.cookie.split(';')[1]).replace("=", ":").trim().split("queryHistory:")[1]).carPlateNumber;
                    }
                    if (!datal || datal.length ==0 ) {
                        return false;
                    }
                    $(".plate-history").remove();
                    var div=document.createElement("div");
                    div.className="plate-history";
                    $(div).css({
                        left: 0,
                        top: "28px",
                        width: ev.target.clientWidth+2,
                        height: datal.length*30,
                        position: "absolute",
                        background: "white",
                        border:"1px solid #ddd",
                        zIndex: 9999,
                        display:"block"
                    });
                    var html="";
                    for(var i in datal) {
                        html += "<div class='plate-his-item' onclick=selectPlate('"+datal[i]+"')>"+datal[i]+
                            "</div>";
                    }
                    $(div).append(html);
                    $(ev.target).after(div);
                });
                selectPlate=function(plate){
                    if(scope.paramCol){
                        scope.paramCol.CarPlateNumber=plate;
                        scope.paramCol.carPlateNumber=plate;
                    }
                    if(scope.param){//轨迹重现
                        if($(".plate-history").siblings("input").attr("ng-model")=="param.CarPlateNumber1"){
                            scope.param.CarPlateNumber1=plate;
                        }
                        if($(".plate-history").siblings("input").attr("ng-model")=="param.CarPlateNumber2"){
                            scope.param.CarPlateNumber2=plate;
                        }
                        if($(".plate-history").siblings("input").attr("ng-model")=="param.CarPlateNumber3"){
                            scope.param.CarPlateNumber3=plate;
                        }
                        //scope.param.CarPlateNumber2=plate;
                        //scope.param.CarPlateNumber3=plate;
                    }
                    if(scope.selRow){//红黑名单
                        scope.selRow.CarPlateNumber=plate;
                        scope.selRow.CarPlateNumber2=plate;
                    }
                    scope.$apply();
                }
                document.onclick=function(){
                    $(".plate-history").css({display:"none"});
                }
            }
        };
    })
    //新表格分页
    .directive('myPager', function () {
        return {
            restrict: 'E',
            templateUrl: ctxPath + 'template/pager.html',
            replace: true,
            link: function (scope, element, attr) {
                scope.pagerArray = [10, 20, 30, 40, 50];
                scope.pageNumCol = 1;
                scope.pagerReloadType = null;
                //设置每页条数
                scope._myPagerSetPagerNum = function (num) {
                    scope.param.pageSize = num;
                    scope.load(1);
                }
                //回调分页，设置当前分页控件的数据总数和页数
                scope._myPagerSetPager = function (param, res) {
                    //param.Rows=param.rows || param.Rows;
                    //计算总共页数
                    // res.total = res.data.length;
                    // console.log(res)
                    param["pages"] = (res.total % param.pageSize == 0) ? parseInt(res.total / param.pageSize) : parseInt((parseInt(res.total / param.pageSize) + 1));
                   
                    param["total"] = res.total;
                    scope.pageNumCol = param.currentPage;
                }
                //分页控件选择上一页下一也，选择当前页数，或者在输入框中直接输入最新的页数
                scope._myPageSetPageIndex = function (num, type) {
                    if (num && !isNaN(num)) {
                        if (num < 1)
                            return false;
                        if (num > scope.param.pages){
                            layer.msg("页数不存在");
                            return false;
                        }
                        if (typeof num === 'string') {
                            scope.param.currentPage = parseInt(num);
                        }
                        else {
                            scope.param.currentPage = num;
                        }
                        scope.load();
                        scope.pagerReloadType = type;

                    }
                }
            }
        };
    })
    .directive('userInfo', function (services, $timeout) {
        return {
            restrict: 'E',
            templateUrl: '',
            replace: true,
            link: function (scope, element, attr) {

                //获取登录信息
                services._userlogic({
                    type: "isLogin"
                }).success(function (res) {
                    scope.userInfo = res.userInfo[0];
                        if(scope.getUserInfo){
                            scope.getUserInfo();
                        }
                });

            }
        };
    })
    //menu conteny 控件
    .directive('menuContent', function (services, $timeout) {
        return {
            restrict: 'E',
            templateUrl: ctxPath + 'template/menu-content.html',
            replace: true,
            link: function (scope, element, attr) {

                scope.getParent = function () {
                    //window.document.location.pathname = "/new_viewer_wx/model/specific_vehicle_query/page.html";
                    var pathName = window.document.location.pathname;
                    var nameArray = pathName.split("/");
                    if(nameArray[4]=="left.html"){
                        nameArray[4]="page.html";
                    }
                    var path = nameArray[2] + "/" + nameArray[3] + "/" + nameArray[4];

                    var param = {}
                    var menuList = {}
                    var selftId="";
                    services._menuList(param).success(function (res) {
                        if (res.code != "0") {
                            layer.msg(res.message);
                        }
                        else {
                            menuList = res.data;
                            var findflag = false;
                            var parentName = ""
                            var selftName = ""
                            $.each(menuList, function (index, node) {
                                findflag = false;
                                if (node.children) {
                                    parentName = node.menu_name;
                                    $.each(node.children, function (index, item) {
                                        if (item.menu_path == path) {
                                            selftName = item.menu_name;
                                            scope.selftId = item.menu_id;
                                            findflag = true;
                                            return false;
                                    }
                                    })
                                }
                                if (node.children&&node.children.length<=0) {
                                    if(path =="model/index/staticNew.html"){
                                        scope.selftId ="104";
                                        findflag = true;
                                        return false;
                                    }else {
                                        if (node.menu_path == path) {
                                            scope.selftId = node.id;
                                            findflag = true;
                                            return false;
                                        }
                                    }
                                }
                                if (findflag == true) {
                                    return false;
                                }
                            })

                            if (findflag == true) {
                                scope.parentMenu = parentName;
                                scope.pageMenu = selftName;

                            }
                        }
                    });
                }

                scope.getParent();

            }
        };
    })

jQuery.fn.extend({
    coord: function (e) {
        if (this.length == 0) {
            return param = {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            }
        }
        else {
            var param = {};
            var obj = this.get(0);
            var param = {
                height: parseInt(obj.clientHeight),
                width: parseInt(obj.clientWidth),
                top: 0,
                left: 0
            };
            do {
                param.top += obj.offsetTop || 0;
                param.left += obj.offsetLeft || 0;
                obj = obj.offsetParent
            }
            while (obj);
            return param
        }
    }
});


/*设置卡口分组状态*/
var setScopeExpandStatus = function (data) {
    $.each(data, function (index, value) {
        if (data.length == 1) {
            value['state'] = "open"
        }
        else {
            value['state'] = "closed";
        }

        if (value.children) {
            setSubScopeExpandStatus(value.children)
        }
    })
};


var setSubScopeExpandStatus = function (data) {
    $.each(data, function (index, value) {
        if (value.NodeType == '1')  // 1 表示分组
        {
            if (value.children && value.children.length > 0)
                value['state'] = "closed";
            else
                value['state'] = "open"
        }
        if (value.children) {
            setSubScopeExpandStatus(value.children)
        }
    })
};


/*设置卡口分组状态*/
var setTaskExpandStatus = function (data) {
    $.each(data, function (index, value) {
        if (data.length == 1) {
            value['state'] = "open"
        }
        else {
            value['state'] = "closed";
        }

        if (value.children) {
            setSubTaskExpandStatus(value.children)
        }
    })
};

var setSubTaskExpandStatus = function (data) {
    $.each(data, function (index, value) {
        if (value.TaskType == '1')  // 1表示分组
        {
            if (value.children && value.children.length > 0)
                value['state'] = "closed"
            else
                value['state'] = "open"
        }
        if (value.children) {
            setSubTaskExpandStatus(value.children)
        }
    })
}


//array 转化为字典,加快查找
function arrayToDict(textString, textdict) {
    textArray = textString.split(",")
    $.each(textArray, function (index, value) {
        textdict[value] = true;
    })
}

//递归访问tree
function visitScopeTree(tree, textDict, nameString) {
    $.each(tree, function (i, node) {
        if (textDict[node.NodeID]) {
            node.checked = true;
            nameString.push(node.NodeName)
        }
        if (node.children) {
            visitScopeTree(node.children, textDict, nameString)
        }
    })
}

//递归访问tree
function setScopeTreeCheck(tree, idString, nameString) {
    textDict = {};
    arrayToDict(idString, textDict);
    visitScopeTree(tree, textDict, nameString);
}

/*设置卡口分组状态*/
var isGroup = function (value) {
    return value.NodeType == '0';
}

var initTreeExpandStatusCheck = function (data, check) {
    $.each(data, function (index, value) {
        if (data.length == 1) {
            value['state'] = "open"
        }
        else {
            value['state'] = "closed";
        }

        if (value.children) {
            setTreeSubExpandStatus(value.children, check)
        }
    })
};


var setTreeSubExpandStatus = function (data, check) {
    $.each(data, function (index, value) {
        if (check(value))  // 1 表示分组
        {
            if (value.children && value.children.length > 0)
                value['state'] = "closed";
            else
                value['state'] = "open"
        }
        if (value.children) {
            setTreeSubExpandStatus(value.children, check)
        }
    })
};

var changeTreeIconCheck = function (data, check) {
    $.each(data, function (index, value) {

        // '0 ' 表示根节点，‘1’ 表示跟分组
        if (check(value)) {
            value['iconCls'] = 'tree-folder';
        }
        if (value.children) {
            changeTreeIconCheck(value.children, check)
        }
    })
};

var setFolderStatusCheck = function (data, check, idName, openFloderArray) {
    $.each(data, function (index, value) {
        if (check(value)) {
            if (openFloderArray[value.idName]) {
                if (value.children && value.children.length > 0)
                    value['state'] = 'closed'
                else
                    value['state'] = 'open'

            }
            else {
                value['state'] = 'open'
            }
        }
        if (value.children) {
            setFolderStatusCheck(value.children, check, idName, openFloderArray)
        }

    })
};

var getFolderCheck = function (check, idName) {
    var data = $("#datagrid").treegrid("getData")
    var openFloderArray = {};
    getFolderStatusCheck(data, check, idName, openFloderArray);
    return openFloderArray;
};


var getFolderStatusCheck = function (data, check, idName, openFloderArray) {
    $.each(data, function (index, value) {
        if (check(value)) {
            if (value['state'] == 'open') {
                openFloderArray[value.idName] = 1;
            }
        }
        if (value.children) {
            getFolderStatusCheck(value.children, check, idName, openFloderArray);
        }
    })
};
//阿拉伯数字转化为汉字
function Arabia_to_Chinese(n)
{
    var Num=n.toString();
    for(i=Num.length-1;i>=0;i--)
    {
        Num = Num.replace(",","")//替换tomoney()中的","
        Num = Num.replace(" ","")//替换tomoney()中的空格
    }
    Num = Num.replace("￥","")//替换掉可能出现的￥字符
    if(isNaN(Num))
    { //验证输入的字符是否为数字
        alert("请检查小写金额是否正确");
        return;
    }
    //---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
    part = String(Num).split(".");
    newchar = "";
    //小数点前进行转化
    for(i=part[0].length-1;i>=0;i--)
    {
        if(part[0].length > 10)
        {
            alert("位数过大，无法计算");
            return "";
        }//若数量超过拾亿单位，提示
        tmpnewchar = ""
        perchar = part[0].charAt(i);
        switch(perchar)
        {
            case "0": tmpnewchar="零" + tmpnewchar ;break;
            case "1": tmpnewchar="一" + tmpnewchar ;break;
            case "2": tmpnewchar="二" + tmpnewchar ;break;
            case "3": tmpnewchar="三" + tmpnewchar ;break;
            case "4": tmpnewchar="四" + tmpnewchar ;break;
            case "5": tmpnewchar="五" + tmpnewchar ;break;
            case "6": tmpnewchar="六" + tmpnewchar ;break;
            case "7": tmpnewchar="七" + tmpnewchar ;break;
            case "8": tmpnewchar="八" + tmpnewchar ;break;
            case "9": tmpnewchar="九" + tmpnewchar ;break;
        }
        switch(part[0].length-i-1)
        {
            case 0: tmpnewchar = tmpnewchar;break;// +"元" ;break;
            case 1: if(perchar!=0)tmpnewchar= tmpnewchar +"十" ;break;
            case 2: if(perchar!=0)tmpnewchar= tmpnewchar +"百" ;break;
            case 3: if(perchar!=0)tmpnewchar= tmpnewchar +"千" ;break;
            case 4: tmpnewchar= tmpnewchar +"万" ;break;
            case 5: if(perchar!=0)tmpnewchar= tmpnewchar +"十" ;break;
            case 6: if(perchar!=0)tmpnewchar= tmpnewchar +"百" ;break;
            case 7: if(perchar!=0)tmpnewchar= tmpnewchar +"千" ;break;
            case 8: tmpnewchar= tmpnewchar +"亿" ;break;
            case 9: tmpnewchar= tmpnewchar +"十" ;break;
        }
        if(newchar!="零") {
            newchar = tmpnewchar + newchar;
        }
        else
        {
            newchar = tmpnewchar;
        }
    }//for
    //小数点之后进行转化
    if(Num.indexOf(".")!=-1)
    {
        if(part[1].length > 2)
        {
            alert("小数点之后只能保留两位,系统将自动截段");
            part[1] = part[1].substr(0,2)
        }
        for(i=0;i<part[1].length;i++)
        {//for2
            tmpnewchar = ""
            perchar = part[1].charAt(i)
            switch(perchar)
            {
                case "0": tmpnewchar="零" + tmpnewchar ;break;
                case "1": tmpnewchar="一" + tmpnewchar ;break;
                case "2": tmpnewchar="二" + tmpnewchar ;break;
                case "3": tmpnewchar="三" + tmpnewchar ;break;
                case "4": tmpnewchar="四" + tmpnewchar ;break;
                case "5": tmpnewchar="五" + tmpnewchar ;break;
                case "6": tmpnewchar="六" + tmpnewchar ;break;
                case "7": tmpnewchar="七" + tmpnewchar ;break;
                case "8": tmpnewchar="八" + tmpnewchar ;break;
                case "9": tmpnewchar="九" + tmpnewchar ;break;
            }
            if(i==0)tmpnewchar =tmpnewchar ;//+ "角";
            if(i==1)tmpnewchar = tmpnewchar ;//+ "分";
            newchar = newchar + tmpnewchar;
        }//for2
    }
    //替换所有无用汉字
    while(newchar.search("零零") != -1)
        newchar = newchar.replace("零零", "零");
    newchar = newchar.replace("亿零万", "亿");
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    return newchar;
}


