var myApp = angular.module('myApp', [
    'ui.router',
    'myControllers',
    'myDirectives',
    'ngSanitize',
    'myServices'])
    .run([
    '$rootScope',
    '$state',
    '$stateParams',
    'services',
    function ($rootScope, $state, $stateParams, services, $log, $sce, $window) {
        $rootScope.services = services;

        var url = window.location.href;
        url = url.substr(url.indexOf("//") + 2);
        url = url.substr(url.indexOf('/') + 1);
        url = url.substr(0, url.indexOf('/'));
        var urlLoaction = "http://" + window.location.host + '/'+ url + "/";
        $rootScope.testPath= "http://" + window.location.host + '/' ;
        $rootScope.ctxPath = window.ctxPath = urlLoaction;

        //目录结构缓存
        $rootScope.menuRes=null;
        //登录数据缓存
        $rootScope.userInfo=null;
        $(function () {

            window.onresize = function () {
                $rootScope.$apply(function () {
                    $rootScope.pageClientHeight = document.documentElement.clientHeight;
                    //if($(".list-item").length>0) {
                    //    for (var i = 0; i < $(".list-item").length; i++) {
                    //        if ($(".list-item").eq(i).hasClass("active_list_item")) {
                    //            $scope._viewListClick(i,0)
                    //        }
                    //    }
                    //}
                });
            };
            //获取登录信息
/*            services._userlogic({
                type: "isLogin"
            }).success(function (res) {
                if (res.errorCode != 0) {
                    if (parent.angular) {
                        parent.window.location.href = $rootScope.ctxPath + "./login.html";
                    }
                    else {
                        window.location.href = "./login.html";
                    }
                }
                else{
                    $rootScope.userInfo = res.userInfo[0];
                    if($rootScope.getUserInfo){
                        $rootScope.getUserInfo();
                    }
                }
            });*/
        });
       // 检验是否登录
        $rootScope.isUserLogic = function () {
/*            var isLogin = false;
               $.ajax({
                   type:"post",
                   url:$rootScope.ctxPath + '../business/menulogic.php',
                   data:{type: "isLogin"},
                   async:false,
                   success:function (res) {
                        if (res.errorCode==0 ){
                            isLogin = true;
                        }
                   }
               });
               return isLogin;*/
                return true;
        };
        //验证当前卡口是否为离线卡口
        $rootScope.checkOffLine=function (item) {
            if(item.nodeStatus==1)
            {
                return true;
            }
            else if(item.nodeStatus==0)
            {
                return false;
            }
        }
        //记录查询的号码
        $rootScope.savePlate = function (plate) {
            services.historycache({
                saveTime: 86400000,
                saveNum: 5,
                carPlateNumber:plate
            }).success(function (res) {
            });
        }
        //禁用默认事件冒泡
        $rootScope.stopEvent = function ($event, type) {
            if(type != 'radio') {
                $event.stopPropagation();
            }
        };

        //格式转字符
        $rootScope.getUnixDate = function (dateStr) {
            var regEx = new RegExp("\\-", "gi");
            return Math.round(Date.parse(dateStr.replace(regEx, "/")));
        };
        //字符转格式  如：1478845984999 转成 2016-11-08
        $rootScope.getLocalDate = function (unixdate, datetime) {
            if (null == unixdate || "" == unixdate) {
                return "";
            }
            var t = new Date(parseInt(unixdate));
            return $rootScope.getDateStr(t, datetime);
        };
        //字符转格式
        $rootScope.getLocalDateDiff = function (unixdataStart,unixdateEnd) {
            if(null==unixdataStart || ""==unixdataStart||null==unixdateEnd || ""==unixdateEnd ) {return "";}
            var date3=unixdateEnd-unixdataStart;  //时间差的毫秒数
            //计算出相差天数
            var days=Math.floor(date3/(24*3600*1000))
            if (days < 10) {
                days = "0" + days.toString();
            }
            //计算出小时数
            var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000))
            if (hours < 10) {
                hours = "0" + hours.toString();
            }
            //计算相差分钟数
            var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
            var minutes=Math.floor(leave2/(60*1000))
            if (minutes < 10) {
                minutes = "0" + minutes.toString();
            }
            //计算相差秒数
            var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
            var seconds=Math.round(leave3/1000)
            if (seconds < 10) {
                seconds = "0" + seconds.toString();
            }
            return days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒";
        };
        //简易分页设置
        $rootScope._setPager_sm = function(param, res){
            param["pages"] = (res.totalNum % param.Rows == 0) ? parseInt(res.totalNum / param.Rows) : parseInt((parseInt(res.totalNum / param.Rows) + 1));
            param["totalNum"] = res.totalNum;
            param.pageNumCol = param.pageNum;
        };

        $rootScope.getDateStr = function (t, datetime) {
            var tm = t.getMonth() + 1;
            if (tm < 10) {
                tm = "0" + tm.toString();
            }
            var day = t.getDate();
            if (day < 10) {
                day = "0" + day.toString();
            }
            var t_hour = t.getHours();
            if (t_hour < 10) {
                t_hour = "0" + t_hour.toString();
            }
            var t_Minutes = t.getMinutes();
            if (t_Minutes < 10) {
                t_Minutes = "0" + t_Minutes.toString();
            }
            var t_Seconds = t.getSeconds();
            if (t_Seconds < 10) {
                t_Seconds = "0" + t_Seconds.toString();
            }
            if(datetime)
                return t.getFullYear() + "-" + tm + "-" + day +" "+t_hour+":"+t_Minutes+":"+t_Seconds;
            else
                return t.getFullYear() + "-" + tm + "-" + day;
        };
        var warnDetailDrag = {"startX": 0, "startY": 0, "isDrag": false}; //上下轮番时 坐标轴
        $rootScope._addScaleToImage = function (divId, imageId, isTurnPage, isRelSize, callbackFunction) {
            var bigImageDivObject = $('#' + divId);
            var bigImageObject = $('#' + imageId);
            $(bigImageDivObject).mousewheel(function (event, delta) {
                var offsetx = typeof(event.offsetX) == "undefined" ? event.layerX : event.offsetX;  // mousewheel offsetX is not same as other event's offsetX
                var offsety = typeof(event.offsetY) == "undefined" ? event.layerY : event.offsetY;
                var divWidth = $(bigImageDivObject).width();
                var divHeight = $(bigImageDivObject).height();
                var imageWidth = $(bigImageObject).width();
                var imageHeight = $(bigImageObject).height();
                if (!isTurnPage || ( offsetx > divWidth / 10 && offsetx < divWidth * 9 / 10)) {
                    var scale = 1;
                    if (delta > 0)
                        scale = 1.1;
                    else
                        scale = 1 / 1.1;
                    if (isRelSize) {
                        if(imageWidth * scale > bigImageDivObject.width() && imageHeight * scale > bigImageDivObject.height()) {
                            $(bigImageObject).css({
                                "width": imageWidth * scale + 'px',
                                "height": imageHeight * scale + "px"
                            });
                        }
                    }
                }
                event.preventDefault();
            });

            $(bigImageDivObject).mousedown(function (e) {
                var offsetx = (typeof(e.offsetX) == "undefined" ? e.originalEvent.layerX : e.offsetX) - $(this).scrollLeft();
                var offsety = (typeof(e.offsetY) == "undefined" ? e.originalEvent.layerY : e.offsetY) - $(this).scrollTop();
                var divWidth = $(bigImageDivObject).width();
                var divHeight = $(bigImageDivObject).height();
                if (!isTurnPage || ( offsetx > divWidth / 10 && offsetx < divWidth * 9 / 10)) {
                    $(this).css({"cursor": "pointer"});
                    warnDetailDrag['isDrag'] = true;
                    warnDetailDrag['startX'] = e.pageX;
                    warnDetailDrag['startY'] = e.pageY;
                } else {
                    if (offsetx <= divWidth / 10) {
                        callbackFunction(-1);
                    }
                    else {
                        callbackFunction(1);
                    }
                }
                return false;
            });
            $(bigImageDivObject).mouseup(function (e) {
                var offsetx = (typeof(e.offsetX) == "undefined" ? e.originalEvent.layerX : e.offsetX) - $(this).scrollLeft();
                var offsety = (typeof(e.offsetY) == "undefined" ? e.originalEvent.layerY : e.offsetY) - $(this).scrollTop();
                var divWidth = $(bigImageDivObject).width();
                var divHeight = $(bigImageDivObject).height();
                if (!isTurnPage || ( offsetx > divWidth / 10 && offsetx < divWidth * 9 / 10)) {
                    warnDetailDrag['isDrag'] = false;
                    $(this).css({"cursor": "default"});
                }
                return false;
            });
            $(bigImageDivObject).mouseleave(function (e) {
                warnDetailDrag['isDrag'] = false;
                $(this).css({"cursor": "default"});
                return false;
            });
            $(bigImageDivObject).mousemove(function (e) {
                var offsetx = (typeof(e.offsetX) == "undefined" ? e.originalEvent.layerX : e.offsetX) - $(this).scrollLeft();
                var offsety = (typeof(e.offsetY) == "undefined" ? e.originalEvent.layerY : e.offsetY) - $(this).scrollTop();
                var divWidth = $(bigImageDivObject).width();
                var divHeight = $(bigImageDivObject).height();
                if (!isTurnPage || ( offsetx > divWidth / 10 && offsetx < divWidth * 9 / 10)) {
                    if (warnDetailDrag['isDrag']) {
                        var deltaX = e.pageX - warnDetailDrag['startX'];
                        var deltaY = e.pageY - warnDetailDrag['startY'];
                        $(this).css({"cursor": "pointer"});
                        if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                            //console.log(deltaX + "  " + deltaY +" " + $('#bigImageDiv').scrollTop() );
                            $(bigImageDivObject).scrollTop($(bigImageDivObject).scrollTop() - deltaY);
                            $(bigImageDivObject).scrollLeft($(bigImageDivObject).scrollLeft() - deltaX);
                            warnDetailDrag['startX'] = e.pageX;
                            warnDetailDrag['startY'] = e.pageY;
                        }
                    } else {
                        $(this).css({"cursor": "default"});
                    }
                } else {
                    if (offsetx <= divWidth / 10) {
                        warnDetailDrag['isDrag'] = false;
                        $(this).css({"cursor": "url(" + ctxPath + "img/arr_left.cur),auto"});
                    } else if (offsetx >= divWidth * 9 / 10) {
                        warnDetailDrag['isDrag'] = false;
                        $(this).css({"cursor": "url(" + ctxPath + "img/arr_right.cur),auto"});
                    } else {
                        if (warnDetailDrag['isDrag']) {
                            $(this).css({"cursor": "pointer"});
                        }
                        else {
                            $(this).css({"cursor": "default"});
                        }
                    }
                }
            });
        }
        //div拖动公共方法
        $rootScope.moveDiv = function (id) {
            $(id).find(".title-head").mousedown(
                function (event) {
                    var isMove = true;
                    var abs_x = event.pageX - $(id).offset().left;
                    var abs_y = event.pageY - $(id).offset().top;
                    var div_width = $(id).width();
                    $(document).mousemove(function (event) {
                            if (isMove) {
                                if (event.pageX - abs_x + div_width >= document.body.offsetWidth || event.pageX - abs_x <= 0) {

                                }
                                else {
                                    var obj = $(id);
                                    obj.css({'left': event.pageX - abs_x, 'top': event.pageY - abs_y});
                                }

                            }
                        }
                    ).mouseup(
                        function () {
                            isMove = false;
                        }
                    );
                }
            );
        }
    }
]);


var myControllers = angular.module("myControllers", []);

/**
 * 1）扩展jquery easyui tree的节点检索方法。使用方法如下：
 * $("#treeId").tree("search", searchText);
 * 其中，treeId为easyui tree的根UL元素的ID，searchText为检索的文本。
 * 如果searchText为空或""，将恢复展示所有节点为正常状态
 */
(function ($) {
    if ($.fn.tree && $.fn.tree.methods)
        $.extend($.fn.tree.methods, {
            allNodes: function (jqTree) {
                var tree = this;
                var nodeList = getAllNodes(jqTree, tree);

                /**
                 * 获取easyui tree的所有node节点
                 */
                function getAllNodes(jqTree, tree) {
                    var allNodeList = null;//jqTree.data("allNodeList");
                    if (!allNodeList) {
                        var roots = tree.getRoots(jqTree);
                        allNodeList = getChildNodeList(jqTree, tree, roots);
                        jqTree.data("allNodeList", allNodeList);
                    }
                    return allNodeList;
                }

                /**
                 * 定义获取easyui tree的子节点的递归算法
                 */
                function getChildNodeList(jqTree, tree, nodes) {
                    var childNodeList = [];
                    if (nodes && nodes.length > 0) {
                        var node = null;
                        for (var i = 0; i < nodes.length; i++) {
                            node = nodes[i];
                            childNodeList.push(node);
                            if (!tree.isLeaf(jqTree, node.target)) {
                                var children = tree.getChildren(jqTree, node.target);
                                childNodeList = childNodeList.concat(getChildNodeList(jqTree, tree, children));
                            }
                        }
                    }
                    return childNodeList;
                }

                return nodeList;
            },
            /**
             * 扩展easyui tree的搜索方法
             * @param tree easyui tree的根DOM节点(UL节点)的jQuery对象
             * @param searchText 检索的文本
             * @param this-context easyui tree的tree对象
             */
            search: function (jqTree, searchText) {
                //easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法
                var tree = this;

                //获取所有的树节点
                var nodeList = getAllNodes(jqTree, tree);

                //如果没有搜索条件，则展示所有树节点
                searchText = $.trim(searchText);
                if (searchText == "") {
                    for (var i = 0; i < nodeList.length; i++) {
                        $(".tree-node-targeted", nodeList[i].target).removeClass("tree-node-targeted");
                        $(nodeList[i].target).show();
                    }
                    //展开已选择的节点（如果之前选择了）
                    var selectedNode = tree.getSelected(jqTree);
                    if (selectedNode) {
                        tree.expandTo(jqTree, selectedNode.target);
                    }
                    return;
                }

                //搜索匹配的节点并高亮显示
                var matchedNodeList = [];
                if (nodeList && nodeList.length > 0) {
                    var node = null;
                    for (var i = 0; i < nodeList.length; i++) {
                        node = nodeList[i];
                        if (isMatch(searchText, node.text)) {
                            matchedNodeList.push(node);
                        }
                        if (node.attributes && node.attributes.SearchIndex) {
                            if (isSpell(searchText, node.attributes.SearchIndex)) {
                                matchedNodeList.push(node);
                            }
                        }
                    }

                    //隐藏所有节点
                    for (var i = 0; i < nodeList.length; i++) {
                        $(".tree-node-targeted", nodeList[i].target).removeClass("tree-node-targeted");
                        $(nodeList[i].target).hide();
                    }

                    //折叠所有节点
                    tree.collapseAll(jqTree);

                    //展示所有匹配的节点以及父节点
                    for (var i = 0; i < matchedNodeList.length; i++) {
                        showMatchedNode(jqTree, tree, matchedNodeList[i]);
                    }
                }
            },

            /**
             * 展示节点的子节点（子节点有可能在搜索的过程中被隐藏了）
             * @param node easyui tree节点
             */
            showChildren: function (jqTree, node) {
                //easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法
                var tree = this;

                //展示子节点
                if (!tree.isLeaf(jqTree, node.target)) {
                    var children = tree.getChildren(jqTree, node.target);
                    if (children && children.length > 0) {
                        for (var i = 0; i < children.length; i++) {
                            if ($(children[i].target).is(":hidden")) {
                                $(children[i].target).show();
                            }
                        }
                    }
                }
            },

            /**
             * 将滚动条滚动到指定的节点位置，使该节点可见（如果有滚动条才滚动，没有滚动条就不滚动）
             * @param param =
             *    treeContainer: easyui tree的容器（即存在滚动条的树容器）。如果为null，则取easyui tree的根UL节点的父节点。
             *    targetNode:  将要滚动到的easyui tree节点。如果targetNode为空，则默认滚动到当前已选中的节点，如果没有选中的节点，则不滚动
             *
             */
            scrollTo: function (jqTree, param) {
                //easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法
                var tree = this;

                //如果node为空，则获取当前选中的node
                var targetNode = param && param.targetNode ? param.targetNode : tree.getSelected(jqTree);

                if (targetNode != null) {
                    //判断节点是否在可视区域
                    var root = tree.getRoot(jqTree);
                    var $targetNode = $(targetNode.target);
                    var container = param && param.treeContainer ? param.treeContainer : jqTree.parent();
                    var containerH = container.height();
                    var nodeOffsetHeight = $targetNode.offset().top - container.offset().top;
                    if (nodeOffsetHeight > (containerH - 30)) {
                        var scrollHeight = container.scrollTop() + nodeOffsetHeight - containerH + 30;
                        container.scrollTop(scrollHeight);
                    }
                }
            },

            childrenNodes: function (jqTree, nodes) {
                var tree = this;
                return getChildNodeList(jqTree, tree, nodes);
            }
        });


    /**
     * 展示搜索匹配的节点
     */
    function showMatchedNode(jqTree, tree, node) {
        //展示所有父节点
        $(node.target).show();
        $(".tree-title", node.target).addClass("tree-node-targeted");
        var pNode = node;
        while ((pNode = tree.getParent(jqTree, pNode.target))) {
            $(pNode.target).show();
        }
        //展开到该节点
        tree.expandTo(jqTree, node.target);
        //如果是非叶子节点，需折叠该节点的所有子节点
        if (!tree.isLeaf(jqTree, node.target)) {
            tree.collapse(jqTree, node.target);
        }
    }

    /**
     * 判断searchText是否与targetText匹配
     * @param searchText 检索的文本
     * @param targetText 目标文本
     * @return true-检索的文本与目标文本匹配；否则为false.
     */
    function isMatch(searchText, targetText) {
        return $.trim(targetText) != "" && targetText.indexOf(searchText) != -1;
    }

    /**
     * 判断searchText是否与SearchIndex（简拼）匹配
     * @param searchText 检索的文本
     * @param SearchIndex 简拼文本
     * @return true-检索的文本与目标文本匹配；否则为false.
     */
    function isSpell(searchText, SearchIndex) {
        return $.trim(SearchIndex) != "" && SearchIndex.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1;
    }

    /**
     * 获取easyui tree的所有node节点
     */
    function getAllNodes(jqTree, tree) {
        var allNodeList = jqTree.data("allNodeList");
        if (!allNodeList) {
            var roots = tree.getRoots(jqTree);
            allNodeList = getChildNodeList(jqTree, tree, roots);
            jqTree.data("allNodeList", allNodeList);
        }
        return allNodeList;
    }

    /**
     * 定义获取easyui tree的子节点的递归算法
     */
    function getChildNodeList(jqTree, tree, nodes) {
        var childNodeList = [];
        if (nodes && nodes.length > 0) {
            var node = null;
            for (var i = 0; i < nodes.length; i++) {
                node = nodes[i];
                childNodeList.push(node);
                if (!tree.isLeaf(jqTree, node.target)) {
                    var children = tree.getChildren(jqTree, node.target);
                    childNodeList = childNodeList.concat(getChildNodeList(jqTree, tree, children));
                }
            }
        }
        return childNodeList;
    }


    //粘贴事件公共方法
    $.fn.pasteEvents = function( delay ) {
        if (delay == undefined) delay = 20;
        return $(this).each(function() {
            var $el = $(this);
            $el.on("paste", function() {
                $el.trigger("prepaste");
                setTimeout(function() { $el.trigger("postpaste"); }, delay);
            });
        });
    };
    //卡口粘贴搜索
    setTimeout(function(){
        $("#bayonet-search").on("postpaste", function() {
            $("#bayonet-search").trigger("keyup");
        }).pasteEvents();
    },1000)
})(jQuery);
//选择号码
var selectPlate=null;