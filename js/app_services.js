angular
  .module("myServices", [])
  .factory("services", function($http, $rootScope) {
    /**
     * 服务端请求模板
     * @param url 服务端请求url
     * @param param 请求参数
     * @param ajaxType post\get,默认是post
     * @param needFormPostCfg 是否需要表单提交参数
     * @returns {*}
     */
    $rootScope.serverAction = function(url, param, ajaxType, needFormPostCfg) {
      var type = ajaxType;
      if (type == null || type == "") {
        type = "GET";
      }
      if (!param) {
        param = {};
      }
      if (type == "GET") {
        return $http({
          method: "GET",
          url: url + "?" + $.param(param)
        }).error(function(data, state) {
          layer.msg("系统错误:" + url.replace("?", "") + state);
        });
      } else {
        var _postCfg = {};
        if (needFormPostCfg) {
          _postCfg = {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            transformRequest: function(d) {
              return $.param(d);
            }
          };
        }
        return $http.post(url, param, _postCfg).error(function(data, state) {
          layer.msg("系统错误:" + url.replace("?", "") + state);
        });
      }
    };
    var serviceAPI = {
      //用户登录
      _userlogic (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/user/userLogin",
          param,
          "POST"
        );
      },
      //判断用户是否登录
      _isUserlogic (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/user/isLogin",
          param,
          "POST"
        );
      },
      //修改密码
      _updatePassword (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../court/user/updatePassword",
          param,
          "POST"
        );
      },
      //获取权限列表
      _getAllMenus (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "json/queryAllMenuName.json",
          param,
          "GET"
        );
      },
      //获取所有地区列表
      _getAllAreaList (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/tableName/queryAllArea",
          param,
          "GET"
        );
      },
      //获取所有法院的列表
      _getAllCourtList (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/court/queryCourtNames",
          param,
          "GET"
        );
      },
      //下载excle
      _exportCaseList (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck//export/exportCaseList",
          param,
          "GET"
        );
      },
      //获取所有法院树列表json
      _getAllCourtListJson (param) {
        // console.log(param);
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/court/queryByCourtId",
          param,
          "GET"
        );
      },
      //获取所有法院树列表json

      // _getAllCourtListJsonCourtId: function(param) {
      //   console.log(param);
      //   return $rootScope.serverAction(
      //     $rootScope.ctxPath + "../caseCheck/court/queryByCourtId",
      //     param,
      //     "GET"
      //   );
      // },
      //获取所有庭室列表
      _getAllRoomListByCourtId (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/courtRoom/queryByCourtId",
          param,
          "GET"
        );
      },
      //获取庭室的所有承办人列表
      _getAllCbrList (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/user/queryByCourtRoom",
          param,
          "GET"
        );
      },
      //阅卷
      _examineDossier (param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/caseInfo/examineDossier",
          param,
          "POST"
        );
      },
      //获取统计信息
      _getAllIndexDatas: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/caseStatistics/queryCaseCount2",
          param,
          "GET"
        );
      },
      //电子卷宗制作与质检总体趋势查询接口
      _getCaseCountTrend: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath +
            "../caseCheck/caseStatistics/queryCaseCountTrend",
          param,
          "GET"
        );
      },
      //获取案件列表
      _getCaseInfoList: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/caseInfo/queryCaseInfoByParam",
          param,
          "GET"
        );
      },
      //获取不合格案件列表
      _getFailCaseInfoList: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/caseInfo/queryFailCaseInfo",
          param,
          "GET"
        );
      },
      //获取问题分布统计
      _getIssueStatistic: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath +
            "../caseCheck/caseStatistics/queryIssueStatistic",
          param,
          "GET"
        );
      },
      //卷宗核实确认
      _getCheckCaseResult: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/caseInfo/updateCheckCaseResult",
          param,
          "GET"
        );
      },
      //卷宗批注内容
      _getDealCaseMessage: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/caseInfo/updateDealCaseMessage",
          param,
          "POST"
        );
      },
      //获取统计信息(饼图)
      _getPieDatas: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath +
            "../caseCheck/caseStatistics/queryCaseCountGroupByCaseType",
          param,
          "GET"
        );
      },
      //获取统计信息(法官视角承办人柱状图)
      _getFgCbrDatas: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/caseStatistics/querySubCaseCount",
          param,
          "GET"
        );
      },
      //获取所有用户列表
      _getAllUsersListByCourtId: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/user/queryUser",param,"GET");
      },
      //获取所有角色列表
      _getAllRoleListByCourtId: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/role/listAllRole",
          param,
          "GET"
        );
      },

      //获取所有菜单信息
      _menuList: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "json/menuInfo.json",
          param,
          "GET"
        );
      },
     
      //模拟获取统计报表数据
      // _getUserJson: function (param) {
      //     return $rootScope.serverAction($rootScope.ctxPath + 'json/userJson.json', param,"GET");
      // },
      //用户管理新增
      _userAdd: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/user/addUser",
          param,
          "POST"
        );
      },
      //用户管理编辑
      _userEdit: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/user/updateUser",
          param,
          "POST"
        );
      },
      //用户管理删除
      _userDelete: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/user/removeUser",
          param,
          "GET"
        );
      },
      //角色权限
      _roleQX: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/menu/queryAllMenus",
          param,
          "POST"
        );
      },
      //角色新增
      _roleAdd: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/role/addRole",
          param,
          "POST"
        );
      },
      //角色删除
      _roleRemove: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/role/removeRole",
          param,
          "GET"
        );
      },
      //角色编辑保存
      _roleEditSave: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/role/updateRole",
          param,
          "POST"
        );
      },
      
      //配置管理新增保存
      _FlagAddSave: function(param) {
        console.log(param)
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/property/addProperty",
          param,
          "POST"
        );
      },
      //配置管理修改保存
      _FlagEditSave: function(param) {
        console.log(param)
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/property/updateProperty",
          param,
          "POST"
        );
      },
     
      //配置管理删除
      _FlagDelSave: function(param) {
        console.log(param)
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/property/removeProperty",
          param,
          "GET"
        );
      },
      //模拟获取案件类型数据
      _getCaseTypeJson: function(param) {
        // http://127.0.0.1:8080/caseCheck/caseType/queryAllCaseType
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/caseType/queryAllCaseType",
          param,
          "POST"
        );
        // return $rootScope.serverAction($rootScope.ctxPath + 'json/CaseType.json', param,"GET");
      },
       //模拟获取案件类型数据
       _getConfigTableJson: function(param) {
        // http://127.0.0.1:8080/caseCheck/caseType/queryAllCaseType
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/property/queryByParam",
          param,
          "GET"
        );
        // return $rootScope.serverAction($rootScope.ctxPath + 'json/CaseType.json', param,"GET");
      },
      //模拟获取审判程序表数据
      _getSPcxJson: function(param) {
        //http://127.0.0.1:8080/caseCheck/caseType/queryByCaseTypeId?caseTypeId=1
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/caseType/queryByCaseTypeId",
          param,
          "GET"
        );
      },
      //模拟获取目录规则列表数据
      _getMLGZJson: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/rule/queryCaseCheckInfo",
          param,
          "GET"
        );
      },
      //模拟获取目录规则新增保存
      _MLGZ_addSaveJson: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/rule/addCaseCheckInfo",
          param,
          "POST"
        );
      },
      //模拟获取目录列表树形结构_getDirectoryTreeJson
      _getDirectoryTreeJson: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/directory/queryDirectoryTree",
          param,
          "GET"
        );
      },
      //模拟获取目录规则   编辑保存
      _MLGZ_editSaveJson: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/rule/updateCaseCheckInfo",
          param,
          "POST"
        );
      },

      //模拟删除
      _removeJson: function(param) {
        return $rootScope.serverAction(
          $rootScope.ctxPath + "../caseCheck/rule/removeCaseCheckInfo",
          param,
          "GET"
        );
      }
    };
    $rootScope.$watch("serviceAPI", function(n, o) {
      serviceAPI = $.extend(serviceAPI, n);
    });
    return serviceAPI;
  });
