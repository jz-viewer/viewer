myControllers.controller("appController", function(
  $rootScope,
  $scope,
  services,
  $sce
) {
  if (sessionStorage.rootUserInfo) {
    var rootUserInfostr = sessionStorage.rootUserInfo;
    rootUserInfo = JSON.parse(rootUserInfostr);
    rootMenuArr = rootUserInfo.roleMenus;
    var minNum;
    for (var i = 0; i < rootMenuArr.length; i++) {
      for (var j = i; j < rootMenuArr.length; j++) {
        if (rootMenuArr[i] > rootMenuArr[j]) {
          minNum = rootMenuArr[j];
          rootMenuArr[j] = rootMenuArr[i];
          rootMenuArr[i] = minNum;
        }
      }
    }
  } else {
    layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
    services._userlogic({ type: "logout" }).success(function(res) {
      if (window.top != window.self) {
        top.location.href = $rootScope.ctxPath + "login.html";
      }
    });
  }
  // 判断用户是否登录
  $scope.searchConfigName="";
  $scope.userId="";
  var allCourts = {
    courtId: "",
    courtName: "全部法院",
    children: []
  };
  $scope.IsRrpairList=[
    {val:0,title:"能修改"},
    {val:1,title:"不能修改"}
  ]
  $scope.param = {
    currentPage: 1,
    pageSize: 10,
    propertyName:"",
  };
  $scope.editParam={
    caseTypeId:"",
    caseTypeName:"",
    spcxId:"",
    spcxName:"",
    directoryId:"",
    directoryName:"",
    rootDirectoryId:"",
    rootDirectoryName:"",
    caseStatus:"",
    ajjdName:""
  };

 
// 新增敞口中数据绑定
  $scope.flagIndex = 0;
  $(function() {
      $(".left_box_menu li").click(function() {
        var index = $(this).index();
        $(".left_box_menu li").removeClass("active");
        $(".left_box_menu li")
          .eq(index)
          .addClass("active");
        if (index == 0) {
          $(".select_c_box_court").show();
          $(".r_header").css({
            height: "160px"
          });
          $(".r_header_title_val").text("配置管理");
          $scope.flagIndex = 1;
          $(".yh-my-search").show();
          $(".js-my-search").hide();
          $("#yichuli-table").datagrid({
            columns: columnsCourts,
            pagination: false,
            collapsible: true,
            singleSelect: true,
            rownumbers: true,
            striped: true,
            onSelect: function(rowindex, row) {
              $scope.selectRow = row;
              // console.log($scope.selectRow);
            }
          });
          $scope.load();
        } 
        // else if (index == 2) {
        //   $scope.flagIndex = 2;
        //   $(".r_header_title_val").text("角色管理");
        //   $(".r_header").css({
        //     height: "70px"
        //   });
        //   $(".yh-my-search").hide();
        //   $(".js-my-search").show();
        //   $("#yichuli-table").datagrid({
        //     columns: columnsCourt,
        //     pagination: false,
        //     collapsible: true,
        //     singleSelect: true,
        //     rownumbers: true,
        //     striped: true,
        //     onSelect: function(rowindex, row) {
        //       $scope.selectRow = row;
        //     }
        //   });
        //   $(".select_c_box_court").hide();
        //   $scope.load();
        // }
      });
      $("#yichuli-table").datagrid({
        columns: columnsCourts,
        pagination: false,
        collapsible: true,
        singleSelect: true,
        rownumbers: true,
        striped: true,
        onSelect: function(rowindex, row) {
          $scope.selectRow = row;
        }
      });
      $scope.getCourtParam();
    // $scope.load();
    // })
  });
  // 配置管理搜索
  $scope.search = function() {
    $scope.param.propertyName=$scope.searchConfigName;
    var parm={
      currentPage: 1,
      pageSize: 10,
      propertyName:$scope.searchConfigName
    }
    $scope.load(parm);
  };
  $scope.load = function(parm) {
    console.log(parm)
        if ($scope.flagIndex == 0) {
          // 时间格式转换
          function add0(m){return m<10?'0'+m:m }
          function format(timestamp)
          {
            //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
            var time = new Date(timestamp);
            var year = time.getFullYear();
            var month = time.getMonth()+1;
            var date = time.getDate();
            var hours = time.getHours();
            var minutes = time.getMinutes();
            var seconds = time.getSeconds();
            return year+'-'+add0(month)+'-'+add0(date)+' '+add0(hours)+':'+add0(minutes)+':'+add0(seconds);
          }
        services._getConfigTableJson($scope.param).success(function(res) {
          console.log(res);
        if (res.code == 0) {
          var ConfigTableJson=res.data;
          for(var i in ConfigTableJson){
              var createTime=ConfigTableJson[i].createTime;
              var new_time=format(createTime);
              ConfigTableJson[i].ch_time=new_time;
              console.log(ConfigTableJson[i].updateFlag);
              if(ConfigTableJson[i].updateFlag==0){
                ConfigTableJson[i].updateFlagName="能修改"
              }else{
                ConfigTableJson[i].updateFlagName="不能修改"

              }
          }
          $("#yichuli-table").datagrid({
            // data: res.data
            data: ConfigTableJson

          });
          
          if ($scope._myPagerSetPager) {
            $scope._myPagerSetPager($scope.param, res);
          }
        } else {
          $scope.allData = {};
          $("#yichuli-table").datagrid({
            data: []
          });
          layer.msg("没有相关配置管理信息 ");
        }
      });
    } else if ($scope.flagIndex == 2) {
        layer.msg("没有案件");
    }
  };
  //新增：选择是否能修改
  $scope._selUpdateFlag=function(item){
    console.log(item);
      $scope.addRow.updateFlag=item.val;
      $scope.addRow.updateFlagName=item.title;
      console.log($scope.addRow);
  }
  //编辑：选择是否能修改
  $scope._selUpdateFlag_edit=function(item){
    $scope.editParam.updateFlag=item.val;
    $scope.editParam.updateFlagName=item.title;
}
  
 
//页面加载自调
  $scope.getCourtParam = function() {
    services._isUserlogic().success(function(res) {
      console.log(res);
      //获取登录信息
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        $scope.courtParam = {
          courtId: $rootScope.userInfo.courtId
        };
        $scope.userId= $rootScope.userInfo.userId;
        // $scope.courtParam = {
        //   courtId: 101
        // };
        // $scope.getAllConfigTable();//获取所有配置列表信息
        $scope.load($scope.param);
      } else {
        layer.msg("会话已过期请重新登录");
        window.location.href = "./login.html";
      }
    });
  };
  
 
//系统维护：获取配置管理列表getAllConfigTable
$scope.getAllConfigTable = function() {
  services._getConfigTableJson($scope.courtParam).success(function(res) {
    if (res.code == 0) {
      $scope.caseTypeArr=res.data;
    } else {
      layer.msg("未获取到相关配置管理信息!");
    }
  });
};
//配置管理 ：新增，修改，删除
  $scope.addNewConfig = function() {
    // 判断用户是否登录
    if (!$scope.isUserLogic()) {
      layer.msg("会话已过期请重新登录");
      //return;
    }
    $scope.userAccountReadOnly = false;
    $scope.addRow = {
      //初始化表格
      propertyName:null,//配置参数名称
      propertyValue:null,//配置参数值
      propertyDesc: null, //配置参数描述
      updateFlag: null, //配置参数是否能修改 0--能修改，1--不能修改
      createUserId:null,//当前用户id
    };
    $scope.layerfunTree = layer.open({
      type: 1,
      title: "添加配置信息",
      area: ["400px", "450px"],
      skin: "layui-layer-rim",
      content: $("#scopeForm"),
      scrollbar: false
    });
  };
  $scope.saveNewFlag=function(){
      $scope.addRow.createUserId=$scope.userId;
      // var data=JSON.stringify($scope.addRow);
      // console.log($scope.addRow);
      var val=$(".IsRrpair_val").val();
      if($scope.addRow.propertyName==null){
        layer.msg("配置名称不能为空!");
      }else if(!$scope.addRow.updateFlagName){
        layer.msg("配置修改不能为空!");
  
      }
      else if(!$scope.addRow.propertyDesc){
        layer.msg("配置描述不能为空!");
      }
      else if(!$scope.addRow.propertyValue){
        layer.msg("配置值不能为空!");
  
      }else{
            services._FlagAddSave($scope.addRow).success(function(res) {
              console.log(res);
              if (res.code == 0) {
                layer.closeAll();
                $scope.load();
                layer.msg("添加成功!");

              }else if(res.code == 2104){
                layer.msg("配置名称已存在!");
              } else {
                layer.msg("添加失败!");
              }
            });
    }

  }
  
  $scope.editConfig  = function() {
    if ($scope.selectRow == null || $scope.selectRow == undefined) {
      layer.msg("请先选中您要修改的对象");
      return;
    } else {
      // 判断用户是否登录
      if (!$scope.isUserLogic()) {
        layer.msg("会话已过期请重新登录");
        return;
      }
      $scope.layerfunTree = layer.open({
        type: 1,
        title: "编辑配置信息",
        area: ["400px", "450px"],
        skin: "layui-layer-rim",
        content: $("#editForm"),
        scrollbar: false
      });
      console.log($scope.selectRow);
      $scope.editParam={
        propertyId:null,
        propertyName:null,//配置参数名称
        propertyValue:null,//配置参数值
        propertyDesc: null, //配置参数描述
        updateFlag: null, //配置参数是否能修改 0--能修改，1--不能修改
        updateFlagName:null,
        createUserId:null,//当前用户id
      };
      if($scope.selectRow.updateFlagName=="不能修改"){
          $scope.selectRow.updateFlag=1;
      }else{
          $scope.selectRow.updateFlag=0;
      }
      for(var key in $scope.selectRow){
        for(var i in $scope.editParam){
          if(i==key){
            $scope.editParam[i]=$scope.selectRow[key]
          }
        }
      }
      $scope.addRow = $scope.selectRow; //
      // console.log($scope.editParam);
    }
  };
  $scope.saveEditFlag=function(){
    // var data=JSON.stringify($scope.addRow);
    // console.log($scope.editParam);
    if(!$scope.editParam.propertyName){
      layer.msg("配置名称不能为空!");
    }
    // else if(!$scope.editParam.updateFlag){
    //   layer.msg("配置修改不能为空!");

    // }
    else if(!$scope.editParam.propertyDesc){
      layer.msg("配置描述不能为空!");
    }
    else if(!$scope.editParam.propertyValue){
      layer.msg("配置值不能为空!");

    }else{
        services._FlagEditSave($scope.editParam).success(function(res) {
          console.log(res)
          if (res.code == 0) {
            layer.closeAll();
            $scope.load();
            layer.msg("修改成功!");

          } else if(res.code == 2104){
            layer.msg("配置名称已存在!");
          }else{
            layer.msg("配置参数不能修改!");
          }
        });
  }

}
  //保存数据
  
  $scope.cancelsaveUser = function() {
    // layer.close($scope.layerfunTree);
      // $scope.layerfunTree - null;
      layer.closeAll();
  };
  //编辑数据
  ////删除用户
  $scope.removeUser = function() {
    if ($scope.selectRow == null || $scope.selectRow == undefined) {
      layer.msg("请先选中您要删除的对象");
    } else {
      $scope.userAccountReadOnly = false;
      $scope.layerfunTreedel = layer.open({
        type: 1,
        title: "删除配置信息",
        area: ["430px", "170px"],
        skin: "layui-layer-rim",
        content: $("#delForm"),
        scrollbar: false
      });
      // console.log($scope.selectRow);
      // var id={
      //   "id":$scope.selectRow.id
      // }
      // // var data=JSON.stringify(id)

      // services._removeJson(id).success(function(res) {
      //   console.log(res);
      //    if (res.code == "0") {
      //     // 加载数据
      //     // alert("成功")
      //     // layer.closeAll();
      //     $scope.load();
      //     layer.msg("删除成功!");
      //   } else {
      //     layer.msg("删除失败!");
      //   }
      //   // layer.closeAll();
       
      // });
      
      // var id=$scope.selectRow.user_id;
      // if(id==1)
      // {
      //     layer.msg("无法删除此用户,请联系管理员!")
      //     return;
      // }
      // var json={
      //     user_id:id.toString()//将输入的值转换成字符串
      // };
      // services._userDelete(json).success(function (res) {
      //     if(res.code=="0") {//后台返回的值
      //         $scope.load()

      //         layer.msg("删除成功!");
      //     }
      //     else
      //     {
      //         layer.msg("删除失败,请联系管理员!");
      //     }
      // });
    }
  };
  $scope._userdel=function(){
    console.log($scope.selectRow);
    var id={
      propertyId:$scope.selectRow.propertyId
    }
    var data=JSON.stringify(id)
    services._FlagDelSave(id).success(function(res) {
      console.log(res);
       if (res.code == "0") {
        // 加载数据
        // alert("成功")
        layer.closeAll();
        $scope.load();
        layer.msg("删除成功!");
      } else {
        layer.msg("删除失败!");
      }
      // layer.closeAll();
     
    });
  }
  $scope.canceldeluser = function() {
    layer.close($scope.layerfunTreedel);
    $scope.layerfunTreedel = null;
  };

  //确认删除用户数据
  $scope.querenRemoveUser = function() {
    var id = $scope.selectRow.user_id;
    if (id == 1) {
      layer.msg("无法删除此用户,请联系管理员!");
      return;
    }
    var json = {
      user_id: id.toString() //将输入的值转换成字符串
    };
    services._userDelete(json).success(function(res) {
      if (res.code == "0") {
        //后台返回的值
        layer.close($scope.layerfunTreedel);
        $scope.selectRow = null;
        $scope.load();

        layer.msg("删除成功!");
      } else {
        layer.msg("删除失败,请联系管理员!");
      }
    });
  };
});
