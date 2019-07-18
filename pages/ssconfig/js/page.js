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

  var allCourts = {
    courtId: "",
    courtName: "全部法院",
    children: []
  };
  $scope.param = {
    currentPage: 1,
    pageSize: 10,
    caseTypeId:"",
    spcxId:"",
    caseStatus:""
    

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

  $scope.caseTypeArr=[];
  $scope.caseTypeName="";
  $scope.TypeId="";
// 新增敞口中数据绑定
  $scope.addcaseTypeName="";
  $scope.addTypeId="";
  $scope.addspcxName = "";
  $scope.addspcxId="";
  $scope.directoryModelId="";
  $scope.rootdirectoryArr=[];
  $scope.rootDirectoryName="";
  $scope.rootDirectoryId="";
  // $scope.directoryName="23";
  $scope.directoryId="";


  $scope.spcxArr = [];
  $scope.courtObj = [];
  $scope.flagIndex = 0;
  $scope.spcxName = "";
  $scope.ajjdArr=[
    {caseStatus:1,ajjdName:"新移送"},
    {caseStatus:2,ajjdName:"立案登记"},
    {caseStatus:3,ajjdName:"立案审查"},
    {caseStatus:4,ajjdName:"立案审批"},
    {caseStatus:5,ajjdName:"等待分派"},
    {caseStatus:6,ajjdName:"等待确认"},
    {caseStatus:7,ajjdName:"正在审理"},
    {caseStatus:8,ajjdName:"立案待结"},
    {caseStatus:9,ajjdName:"结案报批"},
    {caseStatus:10,ajjdName:"已经结案"},
    {caseStatus:11,ajjdName:"已经归档"}
  ];
  $scope.ML_directoryNameTree=[];
  $scope.ajjdName="";
  $scope.caseStatus;
  
  $scope.search_ajjdName="";
  $scope.search_caseStatus="";
  $scope.roleName = "";
  $scope.roleList = [];
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
          $(".r_header_title_val").text("用户管理");
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
        } else if (index == 2) {
          $scope.flagIndex = 2;
          $(".r_header_title_val").text("角色管理");
          $(".r_header").css({
            height: "70px"
          });
          $(".yh-my-search").hide();
          $(".js-my-search").show();
          $("#yichuli-table").datagrid({
            columns: columnsCourt,
            pagination: false,
            collapsible: true,
            singleSelect: true,
            rownumbers: true,
            striped: true,
            onSelect: function(rowindex, row) {
              $scope.selectRow = row;
            }
          });
          $(".select_c_box_court").hide();
          $scope.load();
        }
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
      $(".spcx").click(function(){
        // if($scope.TypeId==""){
          if(typeof($scope.TypeId)=="string"||$scope.caseTypeName==""){
          layer.msg("请选择案件类型");
          return;
        }
        // var parm={
        //   caseTypeId:$scope.TypeId
        // }
        // $scope.getSpcxList( parm);
      })
      $(".addInput_caseType").click(function(){
        // $scope.addcaseTypeName="";
        // $scope.rootDirectoryName="";
        // $scope.addspcxName="";
        // $scope.rootDirectoryName="";
        // $scope.directoryName="";
        // $scope.ajjdName="";
        $("#treeDemo").hide();
        $scope.getCaseTpyeList();
      });
      $(".addInput_spcx").click(function(){
        $("#treeDemo").hide();
        var parm={
          caseTypeId:$scope.addTypeId
        }
        // var data_input=$(this).attr("data-input");
        // if(data_input=="edit_input"){
        //   // var parm={
        //   //   caseTypeId:$scope.addRow.caseTypeId
        //   // }
        //   parm.caseTypeId=$scope.addRow.caseTypeId;
        // }
        // else{
        //   // parm.caseTypeId=$scope.addTypeId;
        //   var parm={
        //     caseTypeId:$scope.addTypeId
        //   }
        // }
        console.log(parm)
        $scope.getSpcxList( parm);
      });
      
      $(".ajjd_input").click(function(){
        $(".ztree").hide();
    })
      $(".edit_caseType").click(function(){
          $("#edit_treeDemo").hide();
      })
      $(".editInput_spcx").click(function(){
        console.log($scope.editParam);
        $("#edit_treeDemo").hide();
        $scope.getSpcxList($scope.editParam);
      })
      $(".addInput_rootDirectoryName").click(function(){
        $("#treeDemo").hide();

        var input_name=$(this).attr("data-input");
        console.log(input_name);
        console.log($scope.directoryModelId);
        if(input_name=="add_input"){
          if(!$scope.addspcxName||!$scope.directoryModelId){
            layer.msg("请选择审判程序");
            return;
          }else{
            $(".addInput_directoryName").val();
              var parm={
                directoryModelId:$scope.directoryModelId
              };
              $scope.getDirectoryTree( parm);
          }
        }
        else{
          if(!$scope.editParam.spcxName){
            layer.msg("请选择审判程序");
          }else if(!$scope.directoryModelId){
            layer.msg("请重新选择审判程序");

          }else{
            $(".addInput_directoryName").val();
            $("#edit_treeDemo").hide();

              var parm={
                directoryModelId:$scope.directoryModelId
              };
              $scope.getDirectoryTree( parm);
          }
      }
       
      });
      $(".addInput_directoryName").click(function(){
          if($scope.ML_directoryNameTree.length<1||!$scope.rootDirectoryName){
              layer.msg("请选择所属卷"); 
              return;
          }
          // console.log($scope.ML_directoryNameTree);
          var tree_name=$(this).next().attr("id");
          console.log(tree_name);
          if(tree_name=="treeDemo"){
            $("#treeDemo").css("display","block");

          }else{
            $("#edit_treeDemo").css("display","block");

          }
            function zTreeOnClick(event, treeId, treeNode) {
                $("#treeDemo").css("display","block");
                console.log(treeNode);
                if(treeNode.children.length<1){
                  $scope.directoryName="";
                  $scope.ajjdName="";
                  $scope.directoryName=treeNode.name;
                  $(".addInput_directoryName").val(treeNode.name);
                  $scope.directoryId=treeNode.id;
                  if(tree_name=="treeDemo"){
                    $("#treeDemo").css("display","none");
        
                  }else{
                    $("#edit_treeDemo").css("display","none");
        
                  }
                 


                  $scope.editParam.directoryId=treeNode.id;
                  $scope.editParam.directoryName=treeNode.name;
              
                }else{
                  
              }

            };
            var setting = {
              view: {
                  showLine: false
              },
              data: {
                simpleData: {
                  enable: true,
                  idKey: "id",
                  pIdKey: "pId",
                  rootPId: 1
                }
              },
              callback: {
                onClick: zTreeOnClick
              }
            };
            for (var key in $scope.ML_directoryNameTree) {
                var children=$scope.ML_directoryNameTree[key].children;
                for(var i in children){
                    children[i].name=children[i].directoryName;
                    children[i].id=children[i].directoryId;
                    children[i].pid=children[i].parentId;
                    children[i].children= children[i].children;
                }
            }
            var treeNodes = new Array();  
            $.each($scope.ML_directoryNameTree,function(i,item){
              treeNodes.push(new Node(item.directoryId,item.parentId,item.directoryName,item.children));
                });
            function Node(id,pid,name,children){
              this.id=id;
              this.pId=pid;
              this.name=name;
              this.children=children;
              this.isParent=true;
              this.open=true
                              
            }
            $(document).ready(function(){   
                // zTree1 = $("#treeDemo").zTree(setting, treeNodes);   
                if(tree_name=="treeDemo"){
                      $.fn.zTree.init($("#treeDemo"), setting, treeNodes);
                }else if(tree_name=="edit_treeDemo"){
                      $.fn.zTree.init($("#edit_treeDemo"), setting, treeNodes);
                }
                $(".ztree>li>span").css("display","none");
                $("li>ul>li>span").css("display","none");
                // $(".ztree>li").css({
                //   "height":"20px",
                // });
                
            });
      });
    // })
  });
  $scope.search = function() {
    console.log( $scope.param);
    $scope.load();
  };
  $scope.load = function(parm) {
    // console.log(parm)
        if ($scope.flagIndex == 0) {
          console.log( $scope.param);
          services._getMLGZJson($scope.param).success(function(res) {
          console.log(res);
          //匹配案件阶段转换
          var tabel_arr=res.data;
          for(var key in tabel_arr){
              for(var i in $scope.ajjdArr){
                if(tabel_arr[key].caseStatus==$scope.ajjdArr[i].caseStatus){
                 tabel_arr[key].ajjdName=$scope.ajjdArr[i].ajjdName;
              }
            }
           
          }
        if (res.code == 0) {
          $("#yichuli-table").datagrid({
            data: res.data
          });
          
          if ($scope._myPagerSetPager) {
            $scope._myPagerSetPager($scope.param, res);
          }
        } else {
          $scope.allData = {};
          $("#yichuli-table").datagrid({
            data: []
          });
          layer.msg("没有相关目录规则");
        }
      });
    } else if ($scope.flagIndex == 2) {
        layer.msg("没有案件");
    }
  };
  $scope.CaseTypeClic=function(item){
    $scope.caseTypeName = item.caseTypeName;
    $scope.param.caseTypeId = item.caseTypeId;
    $scope.TypeId=item.caseTypeId;
    console.log(item);
    // 选择完案件类型后直接获取审判程序列表
    var parm={
      caseTypeId:$scope.TypeId
    }
    $scope.getSpcxList( parm);
    $scope.spcxName="";
  }
  $scope.addCaseTypeClic=function(item){
        $scope.rootDirectoryName="";
        $scope.addspcxName="";
        $scope.rootDirectoryName="";
        $scope.directoryName="";
        $scope.ajjdName="";
    $scope.addcaseTypeName = item.caseTypeName;
    $scope.addTypeId=item.caseTypeId;
    $scope.directoryModelId="";
    $scope.rootdirectoryArr=[];
    $scope.ML_directoryNameTree=[];
    // $("#treeDemo").empty();
  }
  $scope.editCaseTypeClic=function(item){
    // console.log(item);
    // $scope.addcaseTypeName = item.caseTypeName;
    // $scope.addTypeId=item.caseTypeId;
    // $scope.addRow={};
    // $scope.addRow.caseTypeName=item.caseTypeName;
    // $scope.selectRow.caseTypeId=item.caseTypeId;
    // $scope.selectRow.caseTypeName=item.caseTypeName;
    $scope.editParam={};
    $scope.editParam.id=$scope.selectRow.id;
    $scope.editParam.caseTypeId=item.caseTypeId;
    $scope.editParam.caseTypeName=item.caseTypeName;
    $scope.directoryModelId="";
    $scope.rootdirectoryArr=[];

    $scope.ML_directoryNameTree=[];

  }
  $scope.spcxClic = function(item) {
    $scope.spcxName = item.spcxName;
    // $scope.param.courtRoomId = item.courtRoomId;
    $scope.param.spcxId=item.spcxId;
  };
  $scope.addSpcxClic = function(item) {
    // console.log(item);
    $scope.addspcxName="";
    $scope.rootDirectoryName="";
    $scope.directoryName="";
    $scope.ajjdName="";
    $scope.addspcxName = item.spcxName;
    $scope.addspcxId = item.spcxId;
    $scope.directoryModelId=item.directoryModelId
    // $scope.param.courtRoomId = item.courtRoomId;
    // $scope.param.addspcxId=item.spcxId;
  };
  $scope.editSpcxClic=function(item){
    // console.log(item);
    // $scope.addRow.spcxName=item.spcxName;//
    // $scope.addspcxName = item.spcxName;
    // $scope.addspcxId = item.spcxId;
    $scope.directoryModelId=item.directoryModelId;
    // $scope.addRow.rootDirectoryName="";
    // $scope.addRow.directoryName="";
    // $(".addInput_directoryName").val('');
    $scope.editParam.spcxId=item.spcxId;
    $scope.editParam.spcxName=item.spcxName;
    $scope.editParam.rootDirectoryName="";
    $scope.editParam.directoryName="";
  }
  $scope.addrootDirectoryNameClic=function(item){
    console.log(item);
    $(".addInput_directoryName").val('');
    $scope.rootDirectoryName="";
    $scope.directoryName="";
    $scope.ajjdName="";
    $scope.rootDirectoryName=item.directoryName;
    $scope.rootDirectoryId=item.directoryId;
    $scope.ML_directoryNameTree=item.children;
    //编辑页面绑定的所属卷名称
    $scope.addRow.rootDirectoryName=item.directoryName;

    $scope.editParam.rootDirectoryId=item.directoryId;
    $scope.editParam.rootDirectoryName=item.directoryName;

  }
  //编辑中目录
  $scope.editRootDirectoryNameClic=function(item){
     console.log(item);
     $scope.addRow.rootDirectoryName=item.directoryName;
  }
  $scope.clearCaseTypeName=function(){
    $scope.caseTypeName = "";
    $scope.param.caseTypeId="";
    $scope.spcxArr=[];
    $scope.spcxName="";

  }
  $scope.clearRoomName = function() {
    $scope.spcxName = "";
    $scope.param.spcxId = "";
  };
  $scope.clearAjjdName = function() {
    $scope.search_ajjdName = "";
    $scope.param.caseStatus ="";
  };
  $scope.search_ajjdClic=function(item){
    // console.log(item);
      $scope.search_ajjdName = item.ajjdName;
      $scope.search_caseStatus = item.caseStatus;
      $scope.param.caseStatus=item.caseStatus;
  }
  $scope.ajjdClic = function(item) {
    $scope.ajjdName = item.ajjdName;
    $scope.param.caseStatus =item.caseStatus;
    $scope.caseStatus = item.caseStatus;
    // console.log($scope.param);
  };
  $scope.editAjjdClic=function(item){
    console.log(item);
    $scope.addRow.ajjdName=item.ajjdName;
    $scope.editParam.ajjdName=item.ajjdName;
    $scope.editParam.caseStatus=item.caseStatus;
  }
 
//页面加载自调
  $scope.getCourtParam = function() {
    services._isUserlogic().success(function(res) {
      // console.log(res);
      //获取登录信息
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        // $scope.courtParam = {
        //   courtId: $rootScope.userInfo.courtId
        // };
        $scope.courtParam = {
          courtId: 101
        };
        // $scope.getSpcxList(); //页面初始化时获取审判程序
        $scope.getCaseTpyeList();//案件分类信息
        // $scope.getAllRole(); //角色信息
        $scope.load();
      } else {
        layer.msg("会话已过期请重新登录");
        window.location.href = "./login.html";
      }
    });
  };
  $scope.getSpcxList = function(caseTypeId) {
    console.log(caseTypeId);
    services._getSPcxJson(caseTypeId).success(function(res) {
      console.log(res);
      if (res.code == 0) {
        var room_objFirst = {
          courtRoomName: "全部庭室",
          userNum: "",
          courtRoomId: "",
          courtId: "",
          courtRoomCode: ""
        };
        $scope.spcxArr = res.data;
        // $scope.spcxArr.unshift(room_objFirst);
      } else {
        layer.msg("请先选择案件类型!");
      }
    });
  };
  $scope.getDirectoryTree=function(DirectoryModelId){
    services._getDirectoryTreeJson(DirectoryModelId).success(function(res) {
      console.log(res);
      $scope.rootdirectoryArr=[];
      if (res.code == 0) {
          for(var key in res.data){
            // console.log(res.data[key]);
            if(res.data[key].parentId==0){
              $scope.rootdirectoryArr.push(res.data[key]);
            }
          }
          console.log($scope.rootdirectoryArr);
      } else {
        layer.msg("请先选择审判程序");
      }
    });
  }
//系统设置：
$scope.getCaseTpyeList = function() {
  services._getCaseTypeJson($scope.courtParam).success(function(res) {
    console.log(res);
    if (res.code == 0) {
      $scope.caseTypeArr=res.data;
    } else {
      layer.msg("未获取到相关案件类型信息!");
    }
  });
};
//新增，修改，删除
  $scope.addNewUser = function() {
    // 判断用户是否登录
    if (!$scope.isUserLogic()) {
      layer.msg("会话已过期请重新登录");
      //return;
    }
    
    $scope.addcaseTypeName="";
    $scope.addTypeId="";
    $scope.addspcxName = "";
    $scope.addspcxId="";
    $scope.directoryModelId="";
    $scope.rootdirectoryArr=[];
    $scope.rootDirectoryName="";
    $scope.directoryName="";
    $scope.directoryId="";
    $scope.ajjdName="";
    $(".ztree").hide();
    $scope.userAccountReadOnly = false;
    $scope.addRow = {
      //初始化表格
      caseTypeId:null,//案件类型id
      caseTypeName: null, //案件类型名称
      spcxId: null, //审判程序id
      spcxName: null, //审判程序名称
      directoryId: null, //最后一级目录id
      directoryName: null, //最后一级目录名称
      rootDirectoryId: null,//根目录（一级目录）id
      rootDirectoryName: null,//根目录（一级目录）名称
      caseStatus: null //案件状态
    };
   
    
    $scope.layerfunTree = layer.open({
      type: 1,
      title: "添加新规则",
      area: ["550px", "280px"],
      skin: "layui-layer-rim",
      content: $("#scopeForm"),
      scrollbar: false
    });

  };

  $scope.jsaddNewUser = function() {
    // 判断用户是否登录
    if (!$scope.isUserLogic()) {
      layer.msg("会话已过期请重新登录");
      //return;
    }
    $scope.userAccountReadOnly = false;
    $scope.addJsRow = {
      //初始化表格
      court_id: null, //法院id
      court_name: null, //法院名称
      court_code: null, //外部法院代码
      court_short_name: null, //法院简称
      court_room_id: null, //庭室
      court_room_id_text: null,
      court_room_name: null,
      parent_id: null //上级法院id
    };
    $scope.layerfunTree = layer.open({
      type: 1,
      title: "添加角色信息",
      area: ["400px", "450px"],
      skin: "layui-layer-rim",
      content: $("#scopeJsForm"),
      scrollbar: false
    });
  };
  $scope.jseditUser = function() {
    if ($scope.selectRow == null || $scope.selectRow == undefined) {
      layer.msg("请先选中您要修改的对象");
      return;
    } else {
      // 判断用户是否登录
      if (!$scope.isUserLogic()) {
        layer.msg("会话已过期请重新登录");
        return;
      }
    }
    $scope.layerfunTree = layer.open({
      type: 1,
      title: "编辑角色信息",
      area: ["400px", "450px"],
      skin: "layui-layer-rim",
      content: $("#editJsForm"),
      scrollbar: false
    });
    $scope.addRow = $scope.selectRow; //
  };

  $scope.editUser = function() {
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
        title: "编辑新规则",
        area: ["550px", "270px"],
        skin: "layui-layer-rim",
        content: $("#editForm"),
        scrollbar: false
      });
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
      console.log($scope.selectRow);
      $scope.editParam.id=$scope.selectRow.id;//编辑该条案件id
      for(var key in $scope.selectRow){
        for(var i in $scope.editParam){
          if(i==key){
            $scope.editParam[i]=$scope.selectRow[key]
          }
        }
      }
      $scope.addRow = $scope.selectRow; //
      console.log($scope.editParam);
    }
  };
  //保存数据
  $scope.saveAdd = function() {
    if(!$scope.addcaseTypeName){
      layer.msg("案件类型不能为空!");
    }else if(!$scope.addspcxName){
      layer.msg("审判程序不能为空!");

    }
    else if(!$scope.rootDirectoryName){
      layer.msg("所属卷不能为空!");
    }
    else if(!$scope.directoryName){
      layer.msg("目录不能为空!");

    }
    else if(!$scope.caseStatus){
      layer.msg("案件阶段不能为空!");

    }else{
      var AddRow = {
        caseTypeId:$scope.addTypeId,//案件类型id
        caseTypeName:$scope.addcaseTypeName, //案件类型名称
        spcxId:$scope.addspcxId , //审判程序id
        spcxName:$scope.addspcxName , //审判程序名称
        directoryId:$scope.directoryId , //最后一级目录id
        directoryName: $scope.directoryName, //最后一级目录名称
        rootDirectoryId: $scope.rootDirectoryId,//根目录（一级目录）id
        rootDirectoryName:$scope.rootDirectoryName,//根目录（一级目录）名称
        caseStatus: $scope.caseStatus //案件状态
      };
      // console.log(AddRow);
      var data=JSON.stringify(AddRow);
      services._MLGZ_addSaveJson(data).success(function(res) {
        // console.log(res);
        if (res.code == "0") {
          layer.closeAll();
          $scope.param = {
            currentPage: 1,
            pageSize: 10,
            caseTypeId:"",
            spcxId:"",
            caseStatus:""
          };
          $scope.load($scope.param);
          $scope.caseTypeName="";
          $scope.spcxName="";
          $scope.search_ajjdName="";
          layer.msg("新增成功!");
        } else {
          layer.msg("新增失败!");
        }
      });
    }
    
  };
  $scope.cancelsaveUser = function() {
      // layer.close($scope.layerfunTree);
      // $scope.layerfunTree - null;
      layer.closeAll();
  };

  //编辑数据
  $scope.saveEdit = function() {
    // console.log($scope.editParam);
    var data=$scope.editParam;
    // var data=JSON.stringify($scope.editParam);
    if(!$scope.editParam.caseTypeName){
      layer.msg("案件类型不能为空!");
    }else if(!$scope.editParam.spcxName){
      layer.msg("审判程序不能为空!");

    }
    else if(!$scope.editParam.rootDirectoryName){
      layer.msg("所属卷不能为空!");
    }
    else if(!$scope.editParam.directoryName){
      layer.msg("目录不能为空!");

    }
    else if(!$scope.editParam.caseStatus){
      layer.msg("案件阶段不能为空!");

    }else{
      services._MLGZ_editSaveJson(data).success(function(res) {
        // console.log(res);
        if (res.code == "0") {
          // 加载数据
          layer.closeAll();
          $scope.load();
          layer.msg("修改成功!");
        } else {
          layer.msg("修改失败!");
        }
        layer.closeAll();
      
      });
    }
    // $scope.load();
  };
  ////删除用户
  $scope.removeUser = function() {
    if ($scope.selectRow == null || $scope.selectRow == undefined) {
      layer.msg("请先选中您要删除的对象");
    } else {
      $scope.userAccountReadOnly = false;
      $scope.layerfunTreedel = layer.open({
        type: 1,
        title: "删除目录信息",
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
    // console.log($scope.selectRow);
    var id={
      "id":$scope.selectRow.id
    }
    // var data=JSON.stringify(id)
    services._removeJson(id).success(function(res) {
      // console.log(res);
       if (res.code == "0") {
        // layer.msg("删除成功!");
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
