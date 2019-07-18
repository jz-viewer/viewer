var myApp = angular
  .module("myApp", ["ui.router", "ngSanitize", "myServices"])
  .run([
    "$rootScope",
    "$state",
    "$stateParams",
    "services",
    function($rootScope, $state, $stateParams, services, $log, $sce, $window) {
      $rootScope.services = services;
      $rootScope.version = "?v=" + new Date().getTime();
      $rootScope.publicMenuArray = null;
      $rootScope.roleMenus = [];
      $rootScope.userInfo = null;
      $rootScope.pageView = null;
      var url = window.location.href;
      url = url.substr(url.indexOf("//") + 2);
      url = url.substr(url.indexOf("/") + 1);
      url = url.substr(0, url.indexOf("/"));
      var urlLoaction = "http://" + window.location.host + "/" + url + "/";
      $rootScope.ctxPath = window.ctxPath = urlLoaction;
      $rootScope.testPath = "http://" + window.location.host + "/";
    }
  ]);
var showtime;
// function setIframeHeight(iframe) {
//   if (iframe) {
//   var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
//   if (iframeWin.document.body) {
//   iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
//   }
//   }
//   };

//   window.onload = function () {
//   setIframeHeight(document.getElementsByClassName('J_iframe')[0]);
//   };
myApp.controller("appController", function(
  $rootScope,
  $scope,
  services,
  $window,
  $location
) {
  services._isUserlogic().success(function(res) {
    if (res.code == "0") {
      $rootScope.userInfo = res.data;
      //将用户信息存储在sessionStorage中
      var rootUserInfo = res.data;
      var rootUserInfoStr = JSON.stringify(rootUserInfo); //转换json
      sessionStorage.rootUserInfo = rootUserInfoStr;
      //$scope.goMenu();
    } else {
      window.location.href = "./login.html";
    }
  });

  //    $scope.loadMenu = function () {
  //     var param={};
  //     if(!$rootScope.userInfo){
  //         services._isUserlogic().success(function (res) {
  //             if (res.code == 0) {
  //                 $rootScope.userInfo = res.data;
  //                 param.role_id = $rootScope.userInfo["role_id"];
  //                 services._menuListByRole(param).success(function (roleRes) {
  //                     if (roleRes.code == 0) {
  //                         angular.forEach(roleRes.data, function (item) {
  //                             $scope.roleMenus.push(item);
  //                         })
  //                         $scope.goMenu();
  //                     }
  //                 })
  //             }
  //         })
  //     }else{
  //         param.role_id = $rootScope.userInfo["role_id"];
  //         services._menuListByRole(param).success(function (roleRes) {
  //             if (roleRes.code == 0){
  //                 angular.forEach(roleRes.data, function (item) {
  //                     $scope.roleMenus.push(item);
  //                 })
  //                 $scope.goMenu();
  //             }
  //         })
  //     }

  // }
  var param = {};
  services._menuList(param).success(function(res) {
    if (res.code != "0") {
      layer.msg(res.message);
    } else {
      $rootScope.publicMenuArray = res.data;
    }
  });
  // $scope.goMenu=function(){
  //     var param = {};
  //     services._menuList(param).success(function (res) {
  //         if (res.code != "0") {
  //             layer.msg(res.message)
  //         }
  //         else {
  //             //$scope.loadMenu();
  //             res = res.data;
  //             var menu = new Array();
  //             angular.forEach(res, function (item) {
  //                 if ($.inArray(item.menu_id, $scope.roleMenus) != -1){
  //                     var tmpParent = angular.copy(item);
  //                     tmpParent.children = [];
  //                     angular.forEach(item.children, function (child) {
  //                         if ($.inArray(child.menu_id, $scope.roleMenus) != -1){
  //                             tmpParent.children.push(child);
  //                         }
  //                     })
  //                     menu.push(tmpParent);
  //                 }

  //             });
  //             $rootScope.publicMenuArray = menu;
  //             $rootScope.upMenu();
  //         }
  //     });
  // }
  // $rootScope.upMenu = function (href) {
  //   //解析地址
  //   var hash = window.location.hash.replace("#/", "");
  //   hash = href ? href : hash;
  //   var arr = hash.split("?");
  //   hash = arr[0];
  //   angular.forEach($rootScope.publicMenuArray, function (menu, i) {
  //       if (hash == menu.menu_path) {
  //           $rootScope.pageView = menu;
  //       }
  //       angular.forEach(menu.children, function (item, ii) {
  //           if (hash == item.menu_path) {
  //               item.ParentMenuName = menu.menu_name;
  //               $rootScope.pageView = item;
  //           }

  //       })
  //   });
  //   if (!hash || hash == "" || !$rootScope.pageView) {
  //       if ($rootScope.publicMenuArray[0].children && $rootScope.publicMenuArray[0].children.length > 0) {
  //           $rootScope.pageView = $rootScope.publicMenuArray[0].children[0]
  //       }
  //       else {
  //           // $rootScope.pageView = $rootScope.publicMenuArray[0];
  //       }
  //   }

  // if ($rootScope.pageView) {
  //     var menuID=$rootScope.pageView.menu_id;
  //     // 添加选项卡对应的iframe
  //     $rootScope.loading = layer.load(1, {
  //         shade: [0.5, '#000'] //0.1透明度的白色背景
  //     });

  //     var src = "";
  //     if (arr.length >= 2) {
  //         src = $rootScope.pageView.menu_path + "?" + arr[1];
  //     }
  //     else {
  //         src = $rootScope.pageView.menu_path
  //     }
  //     $(".J_iframe").remove();
  //     // var style = 'calc(100% - 60px)';
  //     var style = 'calc(100% - 60px)';
  //     var iframe = $('<iframe class="J_iframe" scrolling="auto" style="width:100%;height:' + style + ';background-color: black;" src="' + src + '" frameborder="0"></iframe>').appendTo("body");
  //     iframe[0].onload = function () {
  //         layer.close($rootScope.loading);
  //     };
  //     document.title = $rootScope.pageView.menu_name;

  //   }
  // };
  $rootScope.logout = function() {
    layer.confirm(
      "您确定要退出吗？",
      {
        btn: ["确定", "取消"] //按钮
      },
      function() {
        services
          ._userlogic({
            type: "logout"
          })
          .success(function(res) {
            window.location.href = $rootScope.ctxPath + "login.html";
          });
      }
    );
  };
  $scope.updatePassword = function() {
    $scope.layerfunTree = layer.open({
      type: 1,
      title: "修改密码",
      area: ["360px", "260px"],
      skin: "layui-layer-rim",
      content: $("#main_repassword_div")
    });
  };
  $scope._submitForm = function() {
    // 提交修改密码
    var register = new Date().getTime();
    var mainP_val = $("#main_password").val();
    var r_password = $("#r_password");
    var regtx = /^(\w){6,20}$/;
    var param = {
      user_id: $rootScope.userInfo.user_id,
      user_password: mainP_val
    };
    if (mainP_val == "") {
      layer.msg("密码不得为空");
      return false;
    }
    if (mainP_val != r_password.val()) {
      layer.msg("两次输入的密码不一致");
      return false;
    }
    if (mainP_val.length < 6 || mainP_val.length > 20) {
      layer.msg("密码不得小于6位多于20位");
      return false;
    }
    if (!regtx.test(mainP_val)) {
      layer.msg("密码只能由数字、字母或者下划线组成");
      return false;
    }
    if (mainP_val.split(" ").length != 1) {
      layer.msg("密码格式错误");
      return false;
    }

    services._updatePassword(param).success(function(result) {
      if (result.code == 0) {
        layer.msg("修改密码成功!");
        layer.close($scope.layerfunTree);
        // 提交密码后清空输入框
        $("#updateLoginPWD").form("clear");
      } else {
        layer.msg("修改密码失败!");
      }
    });
  };

  $(function() {
    services._isUserlogic().success(function(res) {
      if (res.code == "0") {
        $rootScope.userInfo = res.data;
        //$scope.goMenu();
      } else {
        window.location.href = "./login.html";
      }
    });
    // $scope.loadMenu();

    $(".menu_box li").click(function() {
      var index = $(this).index();
      var src;
      $(".menu_box li").removeClass("active");
      $(".menu_box li")
        .eq(index)
        .addClass("active");
      $(".J_iframe").remove();
      if (index == 0) {
        src = "pages/fyshj/page.html";
        $(
          '<iframe class="J_iframe"  frameborder="0" align="left" style="width:100%;height:1745px" scrolling="no"  src="' +
            src +
            '" frameborder="0"></iframe>'
        ).appendTo("body");
      } else if (index == 1) {
        src = "pages/zhlchx/page.html";
        $(
          '<iframe class="J_iframe" frameborder="0" align="left" style="width:100%;min-height:870px" scrolling="no"  src="' +
            src +
            '" frameborder="0"></iframe>'
        ).appendTo("body");
      } else if (index == 2) {
        src = "pages/tjbb/page.html";
        $(
          '<iframe class="J_iframe" frameborder="0" align="left" style="width:100%;height:100%" scrolling="no"  src="' +
            src +
            '" frameborder="0"></iframe>'
        ).appendTo("body");
      } else if (index == 3) {
        src = "pages/users/page.html";
        $(
          '<iframe class="J_iframe" frameborder="0" align="left" style="width:100%;height:100%" scrolling="no"  src="' +
            src +
            '" frameborder="0"></iframe>'
        ).appendTo("body");
      } else if (index == 4) {
        src = "pages/ssconfig/page.html";
        $(
          '<iframe class="J_iframe" frameborder="0" align="left" style="width:100%;height:100%" scrolling="no"  src="' +
            src +
            '" frameborder="0"></iframe>'
        ).appendTo("body");
      } else if (index == 5) {
        src = "pages/xtRepair/page.html";
        $(
          '<iframe class="J_iframe" frameborder="0" align="left" style="width:100%;height:100%" scrolling="no"  src="' +
            src +
            '" frameborder="0"></iframe>'
        ).appendTo("body");
      }
      else if (index == 5) {
        src = "pages/xtRepair/page.html";
        $(
          '<iframe class="J_iframe" frameborder="0" align="left" style="width:100%;height:100%" scrolling="no"  src="' +
            src +
            '" frameborder="0"></iframe>'
        ).appendTo("body");
      }
    });

    /*实时显示时间*/

    showtime = function() {
      var today, hour, second, minute, year, month, date;

      var strDate;

      today = new Date();

      var n_day = today.getDay();

      switch (n_day) {
        case 0:
          {
            strDate = "星期日";
          }
          break;

        case 1:
          {
            strDate = "星期一";
          }
          break;

        case 2:
          {
            strDate = "星期二";
          }
          break;

        case 3:
          {
            strDate = "星期三";
          }
          break;

        case 4:
          {
            strDate = "星期四";
          }
          break;

        case 5:
          {
            strDate = "星期五";
          }
          break;

        case 6:
          {
            strDate = "星期六";
          }
          break;

        case 7:
          {
            strDate = "星期日";
          }
          break;
      }

      year = today.getFullYear();
      month = today.getMonth() + 1;
      date = today.getDate();
      hour = today.getHours();
      minute = today.getMinutes();
      second = today.getSeconds();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }

      if (date >= 0 && date <= 9) {
        date = "0" + date;
      }

      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }

      if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
      }

      if (second >= 0 && second <= 9) {
        second = "0" + second;
      }
      document.getElementById("current-time").innerHTML =
        "<div class='fl' style='font-size:32px;margin-right:8px;'>" +
        hour +
        " : " +
        minute +
        // ":" +
        // second+
        "</div>" +
        "<div class='fl' style='margin-top:12px;'>" +
        '<p style="height:18px;line-height:18px;margin:0">' +
        strDate +
        "</p>" +
        '<p style="height:18px;line-height:18px;margin:0">' +
        year +
        "/" +
        month +
        "/" +
        date +
        "</p></div>"; //显示时间
      setTimeout("showtime();", 100000); //设定函数自动执行时间为 1000 ms(1 s)
    };
    showtime();
  });
});
