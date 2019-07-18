var myApp = angular.module('myApp', [
    'ui.router',
    'ngSanitize',
    'myServices']).run([
    '$rootScope',
    '$state',
    '$stateParams',
    'services',
    function ($rootScope, $state, $stateParams, services, $log, $sce, $window) {
        $rootScope.services = services;
        $rootScope.version = "?v=" + (new Date()).getTime();
        $rootScope.publicMenuArray = null;
        $rootScope.roleMenus = [];
        $rootScope.userInfo = null;
        $rootScope.pageView = null;
        var url = window.location.href;
        url = url.substr(url.indexOf("//") + 2);
        url = url.substr(url.indexOf('/') + 1);
        url = url.substr(0, url.indexOf('/'));
        var urlLoaction = "http://" + window.location.host + '/' + url + "/";
        $rootScope.ctxPath = window.ctxPath = urlLoaction;
        $rootScope.testPath= "http://" + window.location.host + '/' ;
    }
]);
myApp.controller('appController', function ($rootScope, $scope, services, $window,$location) {
    $(function () {
        $scope.systemName = "润普电子卷宗质量检查系统";
        document.title = "登陆";
    })
    $scope.param={
        userName: "",
        userPassword:""
    }
    checkDown=function () {
        if ($scope.param.userName == "" && $scope.param.userPassword == "") {
            layer.msg('请输入用户名和密码');
            $('#pname').focus();
        }
        else if ($scope.param.userName == "" && $scope.param.userPassword != "") {
            layer.msg('请输入用户名');
            $('#pname').focus();
        }
        else if ($scope.param.userName != "" && $scope.param.userPassword == "") {
            layer.msg('请输入密码');
            $('#pwd').focus();
        }else{
            services._userlogic($scope.param).success(function (res) {
                if (res.code == "0") {
                    window.location.href = "index.html";
                } else if (res.code =='2') {
                    layer.msg(res.message);
                } else {
                    layer.msg('用户名或密码错误');
                    $('#pname').focus();
                }
            });
        }

    }
})
var checkDown;
$(function () {
    $("input:password").bind("copy cut paste", function (e) {
        return false;
    });
    $('.loginbox').css({
        'position': 'absolute',
        'left': ($(window).width() - 692) / 2
    });
    $(window).resize(function () {
        $('.loginbox').css({
            'position': 'absolute',
            'left': ($(window).width() - 692) / 2
        });
    });
});