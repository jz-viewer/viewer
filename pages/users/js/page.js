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
    roleIds: "",
    courtId: "",
    courtRoomId: "",
    inputName: ""
  };
  $scope.editRow={};
  $scope.roomsArr = [];
  $scope.courtObj = [];
  $scope.add_courtObj = [];
  $scope.flagIndex = 0;
  $scope.roomName = "";
  $scope.roleName = "";
  $scope.roleList = [];
  $scope.psw = "";
  $(function() {
    //删除数组元素方法
    Array.prototype.remove = function(val) { 
      var index = this.indexOf(val); 
      if (index > -1) { 
        this.splice(index, 1); 
      } 
    };
    $(".left_box_menu li").click(function() {
      var index = $(this).index();
      $(".left_box_menu li").removeClass("active");
      $(".left_box_menu li").eq(index).addClass("active");
      if (index == 0) {
        $(".r_content").show();
        $(".r_header").show();
        $(".r_zzjg").hide();
        $("#myPager").show();
        $(".select_c_box_court").show();
        $(".r_header").css({
          height: "160px"
        });
        $(".r_header_title_val").text("用户管理");
        $scope.flagIndex = 0;
        $(".yh-my-search").show();
        $(".js-my-search").hide();
        $(".r_zzjg").hide();
        $("#yichuli-table").datagrid({
          columns: columnsCourts,
          pagination: false,
          collapsible: true,
          singleSelect: true,
          rownumbers: true,
          striped: true,
          height: "97%",
          width: "100%",
          // isScroll: true,
          onSelect: function(rowindex, row) {
            $scope.selectRow = row;
          }
        });
        $scope.param.courtId="";
        $scope.param.courtRoomId="";
        $scope.param.roleIds="";
        $scope.roomName="";
        $scope.roleName="";
        $scope.courts_text="";
        $scope.load();
      } else if (index == 2) {
        $(".r_zzjg").hide();
        $("#myPager").show();
        $(".r_content").show();
        $(".r_header").show();
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
          height: "97%",
          width: "100%",
          // isScroll: true,
          onSelect: function(rowindex, row) {
            $scope.selectRow = row;
          }
        });
        $(".select_c_box_court").hide();
        $scope.load();
      }
      else if (index == 1) {
        $(".r_zzjg").show();
        $scope.flagIndex = 1;
        $(".r_header_title_val").text("组织架构");
        $(".r_zzjg").show();
        $(".r_content").hide();
        $(".r_header").hide();
        $("#myPager").hide();
        $scope.getAllcourtJson_zzjg();
      }
    });
    $("#yichuli-table").datagrid({
      columns: columnsCourts,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      // isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
    $scope.geCourtParam();
    // $scope.getCourtList(); //页面初始化时获取所有法院信息数据
    // $scope.getRoomList(); //页面初始化时获取所有庭室信息数据
    // $scope.getAllRole(); //角色信息
    // $scope.load();
    $(".add_court").click(function(){
        // console.log($scope.add_courtObj);
        // console.log($scope.selectRow);
        var court_tree=$scope.add_courtObj;
        var input_name=$(this).attr("data-input");
        if(input_name=="edit_input"){
            var userId=$scope.selectRow.userId;
            var userName=$scope.selectRow.userName;
            $scope.addRow={};
            $scope.addRow.userId=userId;
            $scope.addRow.userName=userName;
            $scope.addRow.userFullName=$scope.selectRow.userFullName;
            $scope.addRow.roleIds=$scope.selectRow.roleIds;
            $scope.addRow.roleNames=$scope.selectRow.roleNames;
        }else{
          $scope.addRow={};
        }
        $scope.addRow.courtRoomName="";
        $(".add_tingshi").val("")
        var tree_name=$(this).next().attr("id");
        // $(this).find("input").next().css("display","block");
        $(this).next().css("display","block");
        function zTreeOnClick(event, treeId, treeNode) {
              if(treeNode.pid){
                    if(tree_name=="treeDemo"){
                        $("#treeDemo").prev().val(treeNode.name);
                        $scope.addRow.courtName=treeNode.name;
                        // $scope.addRowcourtId=treeNode.pid;
                        $scope.addRow.courtId=treeNode.id;
                        $scope.courtParam.courtId=treeNode.id;
                        $("#treeDemo").hide();
                    }else if(tree_name=="edit_treeDemo"){
                        $("#edit_treeDemo").prev().val(treeNode.name);
                        // $scope.addRow.courtId=treeNode.pid;
                        $scope.addRow.courtId=treeNode.id;
                        $scope.addRow.courtName=treeNode.name;
                        // $scope.addRow.courtName=treeNode.courtName;
                        $scope.courtParam.courtId=treeNode.id;
                        $("#edit_treeDemo").css("display","none");
                        // console.log( $scope.addRow);
                    }else if(tree_name=="treeDemo_search"){
                       $("#treeDemo_search").prev().val(treeNode.name);
                        $scope.param.courtId=treeNode.pid;
                        $scope.search_parm={
                          courtId:treeNode.courtId,
                          courtName:treeNode.courtName
                        }
                        $("#treeDemo_search").css("display","none");
                        }
                        $(".ztree").css("display","none");
                    }else{
                      if(tree_name=="treeDemo"){
                        $("#treeDemo").prev().val(treeNode.name);
                        $scope.addRow.courtName=treeNode.name;
                        $scope.addRow.courtId=treeNode.courtId;
                        $("#treeDemo").hide();
                      }else if(tree_name=="edit_treeDemo"){
                      $("#edit_treeDemo").prev().val(treeNode.name);
                          $scope.addRow.courtId=treeNode.courtId;
                          $scope.addRow.courtName=treeNode.courtName;
                          console.log( $scope.addRow);
                          $("#edit_treeDemo").css("display","none");
                      }else if(tree_name=="treeDemo_search"){
                      $("#treeDemo_search").prev().val(treeNode.name);
                          $scope.param.courtId=treeNode.courtId;
                          $scope.search_parm={
                              courtId:treeNode.courtId,
                              courtName:treeNode.courtName
                          }
                      $("#treeDemo_search").css("display","none");
                      }
                      $(".ztree").css("display","none");
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
                      pIdKey: "pid",
                      rootPId: 1
                    }
                  },
                  callback: {
                    onClick: zTreeOnClick
                  }
                };
                var treeNodes = new Array(); 
                // for(var i in court_tree){
                  // for(var i=0;i<court_tree.length;i++){
                    var child={
                      id:court_tree.courtId,
                      pid:court_tree.parentId,
                      name:court_tree.courtName,
                      children:court_tree.children,
                      userNum:court_tree.userNum
                    }
                    treeNodes.push(child);
                  // }
                  search_treeChild(treeNodes);
                  function search_treeChild(treeChild){
                    // for(var key in treeChild){
                    if(treeChild){
                      for(var key=0;key<treeChild.length;key++){
                        if(treeChild[key].children.length>0){
                          var children= treeChild[key].children;
                          if(children.length>0){
                            for(var i in children){
                                children[i].name=children[i].courtName;
                                children[i].id=children[i].courtId;
                                children[i].pId=children[i].parentId;
                                children[i].userNum=children[i].userNum;
                                children[i].children= children[i].children;
                                var next_child=children[i].children;
                                search_treeChild(next_child);
                            }
                          }else{
                            treeChild[key].name=treeChild[key].courtName;
                            treeChild[key].id=treeChild[key].courtId;
                            treeChild[key].pId=treeChild[key].parentId;
                            treeChild[key].children= treeChild[key].children;
                          }
                        }else{
                          treeChild[key].name=treeChild[key].courtName;
                          treeChild[key].id=treeChild[key].courtId;
                          treeChild[key].pId=treeChild[key].parentId;
                          treeChild[key].children= treeChild[key].children;

                        }

                      }
                    }
                  }
                  

                function Node(id,pid,name,children){
                  this.id=id;
                  this.pid=pid;
                  this.name=name;
                  this.children=children;
                  this.isParent=true;
                  this.open=true
                };
                $(document).ready(function(){   
                  if(tree_name=="treeDemo"){
                        $.fn.zTree.init($("#treeDemo"), setting, treeNodes);
                  }else if(tree_name=="edit_treeDemo"){
                        $.fn.zTree.init($("#edit_treeDemo"), setting, treeNodes);
                  }
                  else if(tree_name=="treeDemo_search"){
                    $.fn.zTree.init($("#treeDemo_search"), setting, treeNodes);
                  }
              });
              
    });
    
    $(".search_tingshi").click(function(){
        console.log($scope.param);
        if(!$scope.courts_text){
              layer.msg("请先选择相关法院!");
        }
        // services._getAllRoomListByCourtId($scope.param).success(function(res) {
        //     if (res.code == 0) {
        //       $scope.roomsArr=res.data;
        //     } else {
        //       //layer.msg("请先选择相关法院!");
        //     }
        // })
    })
     $(".add_tingshi").click(function(){
       if(!$scope.addRow.courtName){
            layer.msg("请选择相关法院!");
            return ;
       }
          // console.log($scope.courtParam);
          services._getAllRoomListByCourtId($scope.courtParam).success(function(res) {
            if (res.code == 0) {
              $scope.courtroomList=res.data
            } else {
              $scope.courtroomList=[];
              layer.msg("未获取到相关庭室信息!");
            }
          })
    });
    $(".add_role").click(function(){
          // console.log($scope.addRow);
          // services._getAllRoleListByCourtId().success(function(res) {
          //     if (res.code == 0) {
          //           $scope.add_roleList=res.data;
          //     } else {
          //       $scope.allData = {};
          //       $("#yichuli-table").datagrid({
          //         data: []
          //       });
          //       layer.msg("没有相关角色信息");
          //   }
          // });
        $(".role_qxClass").off();
        services._getAllRoleListByCourtId().success(function(res) {
          if (res.code == 0) {
              $scope.add_roleList=res.data;
              // $scope.role_qxList=res.data;
              // if($scope.addRow.menuNames.length>0){
              //     if(!$.isArray($scope.addRow.menuNames)){
              //       $scope.addRow.menuNames=$scope.addRow.menuNames.split("、");
              //     }
              //     function Input(){
              //         var input=$(".role_checkIput");
              //         for(var i=0;i<input.length;i++){
              //           var val=$(input[i]).val();
              //           for(var key in $scope.addRow.menuNames){
              //             if(val==$scope.addRow.menuNames[key]){
              //                 $(input[i]).attr("checked","checked");
              //               }
              //           }
              //       }
              //     }
              //     setTimeout(Input,200);
              // }
          } else {
              $scope.allData = {};
              $("#yichuli-table").datagrid({
              data: []
              });
            layer.msg("没有相关角色信息");
          }
        });
    });
    $(".role_qxClass").click(function(e){
      e.stopPropagation(); 
    });
    
    $(".edit_role").click(function(){
          if($scope.addRow.roleNames.length>0){
            if(!$.isArray($scope.addRow.roleNames)){
              $scope.addRow.roleNames=$scope.addRow.roleNames.split("、");
            }
            console.log($scope.addRow.roleNames);
            function Input(){
                var input=$(".role_checkIput");
                for(var i=0;i<input.length;i++){
                  var val=$(input[i]).val();
                  for(var key in $scope.addRow.roleNames){
                    if(val==$scope.addRow.roleNames[key]){
                        $(input[i]).attr("checked","checked");
                        // $(input[i]).prop('checked','true');
                      }
                  }
              }
            }
            setTimeout(Input,200);
        }
    })
    //角色管理：
        //角色权限
    $(".js_qx").click(function(){
        $(".role_qxClass").off();
        services._roleQX().success(function(res) {
          console.log(res);
          if (res.code == 0) {
              $scope.role_qxList=res.data;
              if($scope.addRow.menuNames.length>0){
                  if(!$.isArray($scope.addRow.menuNames)){
                    $scope.addRow.menuNames=$scope.addRow.menuNames.split("、");
                  }
                  function Input(){
                      var input=$(".role_checkIput");
                      for(var i=0;i<input.length;i++){
                        var val=$(input[i]).val();
                        for(var key in $scope.addRow.menuNames){
                          if(val==$scope.addRow.menuNames[key]){
                              $(input[i]).attr("checked","checked");
                            }
                        }
                    }
                  }
                  setTimeout(Input,200);
              }
          } else {
              $scope.allData = {};
              $("#yichuli-table").datagrid({
              data: []
              });
            layer.msg("没有相关角色信息");
          }
        });
    });

    $(".js_qxEdit").click(function(){
        services._roleQX().success(function(res) {
          // console.log(res);
            if (res.code == 0) {
                $scope.role_qxList=res.data;
                if($scope.addRow.menuNames.length>0){
                    if(!$.isArray($scope.addRow.menuNames)){
                      $scope.addRow.menuNames=$scope.addRow.menuNames.split("、");
                    }
                    console.log($scope.addRow.menuNames);
                    function Input(){
                        var input=$(".role_checkIput");
                        for(var i=0;i<input.length;i++){
                          var val=$(input[i]).val();
                          for(var key in $scope.addRow.menuNames){
                            if(val==$scope.addRow.menuNames[key]){
                                $(input[i]).attr("checked","checked");
                                // $(input[i]).prop('checked','true');
                                console.log($(input[i]));
                              }
                          }
                      }
                    }
                    setTimeout(Input,200);
                }
            } else {
                $scope.allData = {};
                $("#yichuli-table").datagrid({
                data: []
                });
              layer.msg("没有相关角色信息");
            }
        });
    })
});
  //新增里面的角色数据绑定:单选
  $scope._addRoleId=function(item){
    $scope.addRow.roleNames=item.roleName
    $scope.addRow.roleIds=item.roleId;
  }
    //新增里面的角色数据绑定:多选
  $scope._selCourtRole_Add=function(item){
          $(".DIV_roleAdd").addClass("open");
          console.log(item);
          if(!$scope.addRow.roleNames){
            $scope.addRow.roleNames=item.roleName
            $scope.addRow.roleIds=item.roleId;
          }
          else{
            $scope.addRow.roleIds=$scope.addRow.roleIds.toString();
            var roleNames=$scope.addRow.roleNames.split(",");
            var roleIds=$scope.addRow.roleIds.split(",");
            if(roleNames.indexOf(item.roleName)<0){
                $scope.addRow.roleNames+=","+item.roleName
                $scope.addRow.roleIds+=","+item.roleId;
                roleNames=$scope.addRow.roleNames.split(",");
                roleIds=$scope.addRow.roleIds.split(",");
            }
            else{
                $scope.addRow.roleNames="";
                $scope.addRow.roleIds="";
                roleNames.remove(item.roleName);
                var string_roleId=item.roleId.toString();
                roleIds.remove(string_roleId);
                $scope.addRow.roleNames+=roleNames.join(",");
                $scope.addRow.roleIds+=roleIds.join(",");
            }
          }
  }
  //编辑里面的角色数据绑定:多选

  $scope._selCourtRole_edit=function(item){
      $("#UserEdit_div").addClass("open");
      // $scope.addRow.roleIds=$scope.addRow.roleIds[0];
      var string_roleId=item.roleId.toString();
      if(!$.isArray($scope.addRow.roleIds)){
        if($scope.addRow.roleIds.length>0){
         
          $scope.addRow.roleIds=$scope.addRow.roleIds.split(",");
        }else{
          $scope.addRow.roleIds=[];
        }
      }
      if(!$.isArray($scope.addRow.roleNames)){
        if($scope.addRow.roleNames.length>0){
          $scope.addRow.roleNames=$scope.addRow.roleNames.split(",");
        }else{
          $scope.addRow.roleNames=[];
        }
      }
    if($scope.addRow.roleNames.indexOf(item.roleName)<0){
        $scope.addRow.roleIds.push(item.roleId);
        $scope.addRow.roleNames.push(item.roleName);
    }else{
        $scope.addRow.roleNames.remove(item.roleName);
        $scope.addRow.roleIds.remove(string_roleId);
    }

    if($scope.addRow.roleNames.length>0){
      $scope.addRow.roleNames=$scope.addRow.roleNames.join(",");
      $scope.addRow.roleIds=$scope.addRow.roleIds.join(",");
    }
   

    // $scope.addRow.roleNames+=roleNames.join(",");
    // $scope.addRow.roleIds+=roleIds.join(",");

  }
  // $scope._searchRoleId=function(item){
  //   console.log(item);
  //   console.log($scope.search_parm);
  //   //$scope.addRow.roleNames=item.roleName
  //   //$scope.addRow.roleIds=item.roleId;
  // }
  $scope._searchRoleId=function(item){
   
  
}
  //search_tingshi庭室
  $scope._SearchCourtRoom=function(item){
      console.log(item);
      $scope.search_courtRoomName=item.courtRoomName;
      $scope.search_parm.courtRoomId=item.courtRoomId;
      $scope.search_parm.courtRoomName=item.courtRoomName;
      console.log($scope.search_parm);

      // $scope.addRow.courtRoomName=item.courtRoomName;
      // $scope.addRow.courtRoomId=item.courtRoomId;
  }
  //新增庭室选择数据绑定
  $scope._selCourtRoom=function(item){
    // console.log(item);
      $scope.addRow.courtRoomName=item.courtRoomName;
      $scope.addRow.courtRoomId=item.courtRoomId;
  }

//角色管理：
      // 角色权限新增
      $scope._selCourtRole_qx=function(item){
        // Array.prototype.remove = function(val) { 
        //       var index = this.indexOf(val); 
        //       if (index > -1) { 
        //         this.splice(index, 1); 
        //       } 
        //   };
          $("#DIV_roleQxAdd").addClass("open");
          // if(!$.isArray($scope.addRow.menuNames)){
          //   $scope.addRow.menuNames=$scope.addRow.menuNames.split("、");
          // }
          // $scope.addRow.menuNames=item.menuName;
         
            if($scope.addRow.menuNames.length>0){
                $scope.addRow.menuNames=$scope.addRow.menuNames.split("、");
            }else{
              $scope.addRow.menuNames=[];
            }
            if($scope.addRow.menuNames.indexOf(item.menuName)<0){
                console.log($scope.addRow.menuNames.indexOf(item.menuName));
                $scope.addRow.menuIds.push(item.menuId);
                $scope.addRow.menuNames.push(item.menuName);
                
            }else{
                $scope.addRow.menuNames.remove(item.menuName);
                $scope.addRow.menuIds.remove(item.menuId);
              
            }
            if($scope.addRow.menuNames.length>0){
              $scope.addRow.menuNames=$scope.addRow.menuNames.join("、");
            }
        //  var input=$(".role_checkIput");
        //  for(var i=0;i<input.length;i++){
        //     var val=$(input[i]).val();
        //     var check=$(input[i]).attr("checked");
        //     if(val==item.menuName){
        //       if(!check){
        //         $(input[i]).attr("checked","checked");
        //         // $(input[i]).prop('checked','true');
        //         $scope.addRow.menuIds.push(item.menuId)
        //         $scope.addRow.menuNames.push(item.menuName);
        //         console.log($(input[i]))
        //       }else{
        //         $(input[i]).removeAttr('checked');
        //         $scope.addRow.menuNames.remove(val);
        //         $scope.addRow.menuIds.remove(item.menuId);
        //       }
        //     }
        //  }
        //   if($scope.addRow.menuNames.length>0){
        //     $scope.addRow.menuNames=$scope.addRow.menuNames.join("、");
        //   }
          
          // $scope.menuName=item.menuName;
      }
      // 角色权限编辑
      $scope._EditSelCourtRole_qx=function(item){
          // 角色权限编辑
          // Array.prototype.remove = function(val) { 
          //   var index = this.indexOf(val); 
          //   if (index > -1) { 
          //     this.splice(index, 1); 
          //   } 
          // };
          $("#DIV_roleEdit").addClass("open");
          if(!$.isArray($scope.addRow.menuNames)){
              // $scope.addRow.menuNames=$scope.addRow.menuNames.split("、");
              if($scope.addRow.menuNames.length>0){
                $scope.addRow.menuNames=$scope.addRow.menuNames.split("、");
              }else{
                $scope.addRow.menuNames=[];
              }
          }
         
          if($scope.addRow.menuNames.indexOf(item.menuName)<0){
              $scope.addRow.menuIds.push(item.menuId);
              $scope.addRow.menuNames.push(item.menuName);
          }else{
              $scope.addRow.menuNames.remove(item.menuName);
              $scope.addRow.menuIds.remove(item.menuId);
          }
          if($scope.addRow.menuNames.length>0){
            $scope.addRow.menuNames=$scope.addRow.menuNames.join("、");
          }
      }
  $scope.search = function() {
       $scope.param.currentPage = 1;
       $scope.param.pageSize = 10;
       console.log($scope.param);
       $scope.load($scope.param);
  };
  $scope.load = function(parm) {
    // console.log(parm)
    if ($scope.flagIndex == 0) {
     
      services._getAllUsersListByCourtId($scope.param).success(function(res) {
        if (res.code == 0) {
          console.log(res);
          var data=res.data;
          
          for(var i=0;i<data.length;i++){
              console.log(data[i].roleNames);
              if(data[i].roleNames=="null" ){
                data[i].roleNames="";
                data[i].roleIds="";
        
              }
          }
          console.log(data);
          $("#yichuli-table").datagrid({
            data: res.data
          });
          if ($scope._myPagerSetPager) {
            $scope._myPagerSetPager($scope.param, res);
          }
          // if(res.data.length<1){
          //   if ($scope._myPagerSetPager) {
          //     $scope.param.currentPage = "";
          //     $scope._myPagerSetPager($scope.param, res);
          //   }
          // }
        } else {
          $scope.allData = {};
          $("#yichuli-table").datagrid({
            data: []
          });
          layer.msg("没有相关用户信息");
          if ($scope._myPagerSetPager) {
            // $scope.param.currentPage = "";
            $scope._myPagerSetPager($scope.param, res);
            $scope.param.pages = 0;
          }
        }
      });
    } else if ($scope.flagIndex == 2) {
      $scope.addRow={};
      services._getAllRoleListByCourtId().success(function(res) {
        console.log(res);
        var allRoleList=res.data;
        for(var key in allRoleList){
          if(allRoleList[key].menuNames){
            allRoleList[key].menuNames=allRoleList[key].menuNames.join("、");
          }
        }
        if (res.code == 0) {
          $scope.roleList = res.data;
          $("#yichuli-table").datagrid({
            // data: res.data
            data:allRoleList
          });
          if ($scope._myPagerSetPager) {
            $scope._myPagerSetPager($scope.param, res);
          }
        } else {
          $scope.allData = {};
          $("#yichuli-table").datagrid({
            data: []
          });
          layer.msg("没有相关角色信息");
          if ($scope._myPagerSetPager) {
            $scope._myPagerSetPager($scope.param, res);
            $scope.param.pages = 0;
          }
        }
      });
    }
  };
  $scope.courtClic = function(item) {
    // console.log(item);
    $scope.param.courtId="";
    $scope.courts_text = item.courtName;
    $scope.param.courtId = item.courtId;
    // console.log($scope.param);
    $scope.roomName="";
    //根据法院id获取庭室
      services._getAllRoomListByCourtId($scope.param).success(function(res) {
        if (res.code == 0) {
          // $scope.courtroomList=res.data;
          $scope.roomsArr=res.data;
        } else {
          layer.msg("当前法院没有获取相关庭室!");
          $scope.roomsArr=[];
        }
    })
  };
  $scope.roomClic = function(item) {
    // console.log(item);
    $scope.roomName = item.courtRoomName;
    $scope.param.courtRoomId = item.courtRoomId;
    // console.log($scope.param);
  };
  
  $scope.clearCourtName = function() {
    $scope.param = {
      currentPage: 1,
      pageSize: 10,
      roleIds: "",
      courtId: "",
      courtRoomId: "",
      // inputName: ""
    };
    $scope.roomName = "";
    $scope.roleName="";
    $scope.courts_text="";
    $scope.roomsArr=[];

    
  };
  $scope.clearRoomName = function() {
    $scope.roomName = "";
    $scope.param.roleIds = "";
    $scope.param.courtRoomId = "";

  };
  $scope.clearRoleName = function() {
    $scope.roleName = "";
    $scope.param.roleIds = "";
  };

  $scope.roleClic = function(item) {
    $scope.roleName = item.roleName;
    $scope.param.roleIds = item.roleId;
  };
  $scope.getAllRole = function() {
    services._getAllRoleListByCourtId().success(function(res) {
      if (res.code == 0) {
        $scope.roleList = res.data;
      } else {
        $scope.allData = {};
        $("#yichuli-table").datagrid({
          data: []
        });
        layer.msg("没有相关角色信息");
      }
    });
  };
  //函数自调
  $scope.geCourtParam = function() {
    services._isUserlogic().success(function(res) {
      console.log(res);
      //获取登录信息
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        $scope.createUserId=res.data.userId;
        $scope.courtParam = {
          courtId: $rootScope.userInfo.courtId
        };
        
        // $scope.courtParam = {
        //   courtId: 101
        // };
        $scope.getCourtList(); //页面初始化时获取所有法院信息数据
        // $scope.getRoomList(); //页面初始化时获取所有庭室信息数据
        $scope.getAllRole(); //角色信息
        // $scope.getAllCourtList();//获取全部法院
        $scope.load();
      } else {
        layer.msg("会话已过期请重新登录");
        window.location.href = "./login.html";
      }
    });
  };
  $scope.getAllcourtJson_zzjg=function(){
      services._getAllCourtListJson($scope.courtParam).success(function(res) {
      console.log(res);
      if (res.code == 0) {
              $(".r_zzjg_ul").show();
              var court_tree=res.data;
              function zTreeOnClick(event, treeId, treeNode) {
                $scope.zzjg_courtroomUserList=[];
                var parm={};
                if(treeNode.courtId){
                  parm.courtId=treeNode.courtId
                }else{
                  parm.courtId=treeNode.id
                }
                
                $scope.zzjg_getTingshiByCourtId(parm);
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
                var treeNodes = new Array(); 
                // for(var i in court_tree){
                  // for(var i=0;i<court_tree.length;i++){
                    var child={
                      id:court_tree.courtId,
                      pId:court_tree.parentId,
                      name:court_tree.courtName+"("+court_tree.userNum+")",
                      children:court_tree.children,
                      userNum:court_tree.userNum
                    }
                    treeNodes.push(child);
                  // }
                  // 
                  search_treeChild(treeNodes);
                  function search_treeChild(treeChild){
                    // for(var key in treeChild){
                      if(treeChild){
                        for(var key=0;key<treeChild.length;key++){
                          if(treeChild[key].children.length>0){
                            var children= treeChild[key].children;
                            if(children.length>0){
                              // for(var i in children){
                                for(var i=0;i<children.length;i++){
                                  children[i].name=children[i].courtName+"("+children[i].userNum+")";
                                  children[i].id=children[i].courtId;
                                  children[i].pId=children[i].parentId;
                                  children[i].userNum=children[i].userNum;
                                  children[i].children= children[i].children;
                                  var next_child=children[i].children;
                                  if(next_child.length>0){
                                    search_treeChild(next_child);
                                  }
                                  
                              }
                            }else{
                              // console.log(treeChild[key]);
                              treeChild[key].name=treeChild[key].courtName+"("+treeChild[key].userNum+")";
                              treeChild[key].id=treeChild[key].courtId;
                              treeChild[key].pId=treeChild[key].parentId;
                              treeChild[key].children= treeChild[key].children;
                              // treeChild[key][i].userNum=treeChild[key].userNum;
                            }
                          }else{
                            treeChild[key].name=treeChild[key].courtName+"("+treeChild[key].userNum+")";
                            treeChild[key].id=treeChild[key].courtId;
                            treeChild[key].pId=treeChild[key].parentId;
                            treeChild[key].children= treeChild[key].children;

                          }
                        }
                      }
                  }
                 
                function Node(id,pid,name,children){
                  this.id=id;
                  this.pId=pid;
                  this.name=name;
                  this.children=children;
                  this.isParent=true;
                  this.open=true
                };
                $(document).ready(function(){   
                    $.fn.zTree.init($("#zzjg_tree"),setting,treeNodes);
              })
      }
    });
  }
//组织架构根据法院ID获取不同庭室列表
  $scope.zzjg_getTingshiByCourtId=function(parm){
      services._getAllRoomListByCourtId(parm).success(function(res) {
          if (res.code == 0) {
            var court_tree=res.data;
            function zTreeOnClick(event, treeId, treeNode) {
                  // $scope.zzjg_courtroomUserList=[];
                  var parm={
                    courtId:treeNode.id,
                    courtRoomId:treeNode.pid,
                  };
                  $scope.zzjg_getUserByCourtRoomId(parm);
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
                // var treeNodes = new Array(); 
                // var child={
                //   id:court_tree.courtId,
                //   pId:court_tree.courtRoomId,
                //   name:court_tree.courtRoomName+"("+court_tree.userNum+")",
                //   // children:court_tree.children,
                //   userNum:court_tree.userNum
                // }
                // treeNodes.push(child);
                // search_treeChild(treeNodes);
                var treeNodes = new Array();  
                $.each(court_tree,function(i,item){
                  treeNodes.push(new Node(item.courtId,item.courtRoomId,item.courtRoomName+"("+item.userNum+")"));
                });
                function Node(id,pid,name){
                  this.id=id;
                  this.pid=pid;
                  this.name=name;
                  this.isParent=true;
                  this.open=true
                }
              $(document).ready(function(){   
                  $.fn.zTree.init($("#zzjg_tree_right"),setting,treeNodes);
                 
            })
    }
      })
  }
  //根据法院、庭室查用户
  $scope.zzjg_getUserByCourtRoomId=function(parm){
      services._getAllCbrList(parm).success(function(res) {
          if(res.code==0){
            $scope.zzjg_courtroomUserList=res.data;
          }
      })

  }
  // 全部所有法院
  // $scope.getAllCourtList = function() {
  //     services._getAllCourtList().success(function(res) {
  //     console.log(res);
  //     if (res.code == 0) {
  //       $scope.allCourt=res.data;
      
  //     } else {
  //       layer.msg("未获取到相关法院信息!");
  //     }
  //   });
  // };
  //获取法院信息
  
  $scope.getCourtList = function() {
      services._getAllCourtListJson($scope.courtParam).success(function(res) {
      // setTimeout(function(){
        // console.log(res);
      // },1000)
      if (res.code == 0) {
        // if ($scope.courtParam.courtId == 100) {
        //   var court_objFirst = [];
        //   $scope.courtObj = res.data.children;
        //   court_objFirst = res.data;
        //   court_objFirst.children = [];
        //   $scope.courtObj.unshift(court_objFirst);
        //   $scope.add_courtObj.push(res.data);
        // } else {
        //   $scope.courtObj.push(res.data);
        //   // $scope.courtObj.unshift(allCourts);
        //   $scope.add_courtObj.push(res.data);
        // }
        // $scope.treeContent($scope.courtObj);
        // $scope.allCourt_res=res.data;
        // $scope.add_courtObj.push(res.data);
        $scope.add_courtObj=res.data
        var user_courtAll=[]
        user_courtAll.push(res.data);
        $scope.allCourt=search_treeChild(user_courtAll);
        //递归法院树
        function search_treeChild(treeChild,court_header){
          for(var i in treeChild){
            var court_arr=[];
            var court_obj={};
            court_obj.courtId=treeChild[i].courtId;
            court_obj.courtName=treeChild[i].courtName;
            court_arr.push(court_obj);
            if(treeChild[i].children){
              var children= treeChild[i].children;
              if(children.length>0){
                for(var i in children){
                  var child_court_obj={}
                  child_court_obj.courtId=children[i].courtId;
                  child_court_obj.courtName=children[i].courtName;
                  court_arr.push(child_court_obj);
                  if(children[i].children){
                    var next_child=children[i].children;
                    for(var key in next_child){
                      var child_court_obj={}
                      child_court_obj.courtId=next_child[key].courtId;
                      child_court_obj.courtName=next_child[key].courtName;
                      court_arr.push(child_court_obj);
                    }
                  }
                }
              }else{
              }
            }
            return court_arr;
          }
        }

        // function search_treeChild(treeChild){
        //   for(var i in treeChild){
        //     var court_arr=[];

        //     var court_obj={};
        //     court_obj.courtId=treeChild[i].courtId;
        //     court_obj.courtName=treeChild[i].courtName;
        //     court_arr.push(court_obj);
        //     console.log(court_arr);
        //     // if(treeChild[i].children){
        //       var children= treeChild[i].children;
        //       // second_child(children,court_arr)
        //     //  function second_child(children,court_arr){
        //       if(children.length>0){
        //         for(var i in children){
        //           var child_court_obj={}
        //           child_court_obj.courtId=children[i].courtId;
        //           child_court_obj.courtName=children[i].courtName;
        //           court_arr.push(child_court_obj);
        //           var third_child=children[i].children;
        //           // if(third_child&&third_child.length>0){
        //           //   console.log(third_child);
        //           //   search_treeChild(third_child)
        //           // }
                  
        //           if(children[i].children){
        //             var next_child=children[i].children;
        //             for(var key in next_child){
        //               var child_court_obj={}
        //               child_court_obj.courtId=next_child[key].courtId;
        //               child_court_obj.courtName=next_child[key].courtName;
        //               court_arr.push(child_court_obj);
        //             }
                    
        //           }
        //           // var next_child=children[i].children;
        //           // console.log(next_child);
        //           // if(next_child.length>0){
        //           //   for(var key in next_child){
        //           //     var child_court_obj={}
        //           //     child_court_obj.courtId=next_child[key].courtId;
        //           //     child_court_obj.courtName=next_child[key].courtName;
        //           //     court_arr.push(child_court_obj);
        //           //   }
        //           // }
        //         }
        //       }else{
        //         // return;
        //         // console.log(treeChild);
        //         // for(var i in children){
        //         //   var child_court_obj={}
        //         //   child_court_obj.courtId=children[i].courtId;
        //         //   child_court_obj.courtName=children[i].courtName;
        //         //   court_arr.push(child_court_obj);
        //         // }
        //         // console.log(treeChild[i]);
        //         // for(var i in treeChild){
        //         //     var child_court_obj={}
        //         //     child_court_obj.courtId=treeChild[i].courtId;
        //         //     child_court_obj.courtName=treeChild[i].courtName;
                      
        //         //     court_arr.push(child_court_obj);
        //         //     console.log(court_arr);
        //         // }
                
        //         // var child_court_obj={}
        //         // treeChild[key].name=treeChild[key].courtName;
        //         // treeChild[key].id=treeChild[key].courtId;
        //         // treeChild[key].children= treeChild[key].children;
        //         // court_arr.push(child_court_obj);
        //       }
        //     // }
        //     // }
        //     console.log(court_arr);
        //     return court_arr;
        //   }
        // }

      } else {
        layer.msg("未获取到相关法院信息!");
      }
    });
  };
  // $scope.getCourtList()
  //获取庭室信息
  $scope.getRoomList = function() {
    services._getAllRoomListByCourtId($scope.courtParam).success(function(res) {
      if (res.code == 0) {
        var room_objFirst = {
          courtRoomName: "全部庭室",
          userNum: "",
          courtRoomId: "",
          courtId: "",
          courtRoomCode: ""
        };
        $scope.roomsArr = res.data;
        // $scope.roomsArr.unshift(room_objFirst);
      } else {
        layer.msg("未获取到相关庭室信息!");
      }
    });
  };
  //tree展示
  $scope.treeContent = function(court_obj) {
    var treeStr = "";
    // console.log(court_obj);
    for (var index = 0; index < court_obj.length; index++) {
      var element = court_obj[index];
      var treeChildStr = "";
      for (var i = 0; i < element.children.length; i++) {
        var child = element.children[i];
        treeChildStr +=
          '<span class="nowrap c_nowrap" id="' +
          child.courtId +
          '" title="' +
          child.courtName +
          '" style="width:85%;">'+
          // '<input name="' +
          // child.courtId +
          // '" type="checkbox"class="tree_node_child_checkbox">' +
          child.courtName +
          "</span><br>";
      }
      treeStr +=
        ' <div class="tree_node top_tree_node rela">' +
        ' <div class="div_inline top_div_inline abso"><input type="button" style="display:none" value="-" class="tree_node_toggle_button"></div>' +
        ' <div class="div_inline bot_div_inline tree_node_parent">' +
        '     <input type="checkbox" style="display:none" name="' +
        element.courtId +
        '" class="tree_node_parent_checkbox"><span id="' +
        element.courtId +
        '" class="nowrap p_nowrap" title="' +
        element.courtName +
        '" style="width:85%;">' +
        element.courtName +
        "</span>" +
        '     <div class="tree_node_child">' +
        treeChildStr +
        "     </div>" +
        " </div>" +
        "</div>";
    }

    $(".tree_content").html(treeStr);
    // 为所有的父节点添加点击事件
    $(".court-fa-close").click(function() {
      $("#fayuan_input").val("");
      $(".court-fa-caret").show();
      $(".court-fa-close").hide();
    });
    $(".tree_node_parent_checkbox").click(function() {
      // 获取父节点是否选中
      // $(".tree_node input").prop("checked", false);
      var isChange = $(this).prop("checked");
      // $(".my-dropdown").removeClass("open");
      $(".court-fa-caret").hide();
      $(".court-fa-close").show();
      if (isChange) {
        var courtName = $(this)
          .siblings("span")
          .text();
        $scope.param.courtId = $(this)[0].name;
        $("#fayuan_input").val(courtName);
      } else {
        $scope.param.courtId = "";
      }
    });
    // 为所有的子节点添加点击事件
    $(".tree_node_child_checkbox").click(function(e) {
      var isChange = $(this).prop("checked");
      // $(".my-dropdown").removeClass("open");
      $scope.param.courtId = $(this)[0].name;
      if (isChange) {
        var courtName = $(this).parent()[0].title;
        $scope.param.courtId = $(this)[0].name;
        $("#fayuan_input").val(courtName);
        // console.log($scope.param.courtId);
      } else {
        $scope.param.courtId = "";
      }
      $(".court-fa-caret").hide();
      $(".court-fa-close").show();
      e.stopPropagation();
    });
    $(".court_span").click(function(){
      // $(".user_header").show();
    })
    $("#fayuan_input").click(function(){
      $(".user_header").show();
    })
    // 给各个法院点击事件
    $(".tree_node_child span").click(function(e) {
      // $(".tree_node input").prop("checked", false);
      var isChange = $(this).find("input").prop("checked");
      // $(".my-dropdown").removeClass("open");
     if(!isChange){
      $scope.param.courtId = $(this)[0].id;
      $("#fayuan_input").val($(this).text());
      $(this).siblings().children().removeAttr('checked');
      // $(input[i]).prop('checked','true');
      $(this).children().attr("checked","checked");
      $(".user_header").hide();
     }else{
      $scope.param.courtId = "";
      $("#fayuan_input").val("");
      $(this).children().attr("checked","checked");
     }
      $(".court-fa-caret").hide();
      $(".court-fa-close").show();
      e.stopPropagation();
      // e.stopPropagation();
      if (
        $(this).find("input").prop("checked") == false
      ) {
        $(this).find("input").prop("checked", true);
      } else {
        $(this).find("input")
          .prop("checked", false);
      }

    });
    $(".bot_div_inline>.nowrap").click(function(e) {
      // $(".tree_node input").prop("checked", false);
      // alert("12")
      $(".user_header").hide();
      var isChange = $(
        $(this)
          .parent()
          .children()[0]
      ).prop("checked");
      if(!isChange){
        $scope.param.courtId = $(this)[0].id;
        $("#fayuan_input").val($(this).text());
        // console.log($scope.param.courtId);
      }else{
        $scope.param.courtId = $(this)[0].id;
        $("#fayuan_input").val($(this).text())
        // $scope.param.courtId = "";
        // console.log($scope.param.courtId);
        // $("#fayuan_input").val("");
      }
      // $(".my-dropdown").removeClass("open");
      $scope.param.courtId = $(this)[0].id;
      $(".court-fa-caret").hide();
      $(".court-fa-close").show();
      e.stopPropagation();
      // e.stopPropagation();

      if (
        $(this)
          .siblings("input")
          .prop("checked") == false
      ) {
        $(this)
          .siblings("input")
          .prop("checked", true);
      } else {
        $(this)
          .siblings("input")
          .prop("checked", false);
      }
    });
    $(".my_drop").click(function(e) {
      e.stopPropagation();
    });

    // 为所有的切换按钮添加点击事件
    $(".tree_node_toggle_button").click(function() {
      // 获取需要隐藏或显示的节点
      var $toggle_node = $(this)
        .parent()
        .next()
        .find(".tree_node_child");
      $toggle_node.toggle(); // 切换隐藏或显示
      // 切换按钮的显示
      if ($toggle_node.is(":visible")) {
        $(this).val("-");
      } else {
        $(this).val("+");
      }
    });

    // tree end
  };

  $scope.addNewUser = function() {
    // 判断用户是否登录
    if (!$scope.isUserLogic()) {
      layer.msg("会话已过期请重新登录");
      //return;
    }
    $scope.userAccountReadOnly = false;
  

    $scope.addRow = {
      //初始化表格
      // court_id: null, //法院id
      // court_name: null, //法院名称
      // court_code: null, //外部法院代码
      // court_short_name: null, //法院简称
      // court_room_id: null, //庭室
      // court_room_id_text: null,
      // court_room_name: null,
      // parent_id: null //上级法院id
      courtId: null, //法院id
      court_name: null, //法院名称
      courtName:null,
      court_code: null, //外部法院代码
      court_short_name: null, //法院简称
      courtRoomId: "", //庭室
      // court_room_id_text: null,
      courtRoomName: null,
      // court_room_name: null,
      userName:null,
      userFullName:null,
      roleIds:null,
      parent_id: null ,//上级法院id
      court_id_text:""
    };
    $scope.courtroomList=[];
    $scope.roleList=[];

    $scope.layerfunTree = layer.open({
      type: 1,
      title: "添加用户信息",
      area: ["550px", "280px"],
      skin: "layui-layer-rim",
      content: $("#scopeForm"),
      scrollbar: false
    });
    // console.log($scope.addRow);
    $("#treeDemo").hide();
  };
//角色管理新增初始化：
  $scope.jsaddNewUser = function() {
    // 判断用户是否登录
    $scope.addRow={};
    $scope.addRow.menuIds=[];
    $scope.addRow.menuNames=[];
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
  //角色新增保存：
  $scope.saveRole=function(){
      $scope.addRow.createUserId=$scope.createUserId;
      // console.log($scope.addRow);
      
      if ($scope.addRow.roleName == "" || $scope.addRow.roleName == null) {
        layer.msg("角色名称不能为空");
        return;
      }
      if ($scope.addRow.menuIds == "" ||$scope.addRow.menuIds == null) {
        layer.msg("角色权限不能为空");
        return;
      }
      if ($scope.addRow.roleDesc == "" || $scope.addRow.roleDesc == null) {
        layer.msg("角色描述不能为空");
        return;
      }
      if (/[@\/'\\"#$%&\^*]/.test($scope.addRow.userName)) {
        //特殊字符
        layer.msg("用户名有特殊字符");
        return;
      }
      if ($scope.addRow.rolePermissionDesc == "" || $scope.addRow.rolePermissionDesc == null) {
        layer.msg("权限描述不能为空");
        return;
      }
      // var data=JSON.stringify($scope.addRow);
      services._roleAdd( $scope.addRow).success(function(res) {
        console.log(res);
        if (res.code == "2507") {
          layer.msg("角色名称被占用！");
          return;
        } else if (res.code == "0") {
          // 加载数据
          layer.closeAll();
          $scope.load();
          $scope.addRow = {
            user_name: null, //用户名称
            role_id: null, //角色id
            user_email: null, //用户email
            courtId: null, //法院id
            court_name: null
          };
          layer.msg("新建成功!");
        } else {
          layer.msg("新建失败!");
        }
      });
  }
  //角色编辑保存
  $scope.saveEditRole=function(){
    $scope.addRow.lastUpdateUserId=$scope.createUserId;
      // console.log($scope.addRow);
      if ($scope.addRow.roleName == "" || $scope.addRow.roleName == null) {
        layer.msg("角色名称不能为空");
        return;
      }
      if ($scope.addRow.menuIds == "" ||$scope.addRow.menuIds == null) {
        layer.msg("角色权限不能为空");
        return;
      }
      if ($scope.addRow.roleDesc == "" || $scope.addRow.roleDesc == null) {
        layer.msg("角色描述不能为空");
        return;
      }
      if (/[@\/'\\"#$%&\^*]/.test($scope.addRow.userName)) {
        //特殊字符
        layer.msg("用户名有特殊字符");
        return;
      }
      if ($scope.addRow.rolePermissionDesc == "" || $scope.addRow.rolePermissionDesc == null) {
        layer.msg("权限描述不能为空");
        return;
      }
      // var data=JSON.stringify($scope.addRow);
      services. _roleEditSave( $scope.addRow).success(function(res) {
        console.log(res);
        if (res.code == "2507") {
          layer.msg("角色名称被占用！");
          return;
        } else if (res.code == "0") {
          // 加载数据
          layer.closeAll();
          $scope.load();
          $scope.addRow = {
            user_name: null, //用户名称
            role_id: null, //角色id
            user_email: null, //用户email
            courtId: null, //法院id
            court_name: null
          };
          layer.msg("修改成功!");
        } else {
          layer.msg("修改失败!");
        }
      });
  }
  //角色编辑加载：
  $scope.jseditUser = function() {
    $scope.addRow={};
    $scope.addRow.menuIds=[];
    $scope.addRow.menuNames=[];
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
    // console.log($scope.addRow);
  };
//用户编辑加载：
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
        title: "编辑用户信息",
        area: ["550px", "270px"],
        skin: "layui-layer-rim",
        content: $("#editForm"),
        scrollbar: false
      });
      $scope.addRow = $scope.selectRow; //
      console.log($scope.addRow);
      
      $(".psw").val("")
    }
  };
  $scope._editCourtName=function(){
      // var userId=$scope.addRow.userId;
      // var userName=$scope.addRow.userName;
      // $scope.addRow ={};
      // $scope.addRow.userId=userId;
      // $scope.addRow.userName=userName;
  }
  //用户新增保存数据
  $scope.saveUser = function() {
    if ($scope.addRow.courtRoomName == "" || $scope.addRow.courtRoomName == null) {
      layer.msg("庭室不能为空");
      return;
    }
    if ($scope.addRow.userName == "" || $scope.addRow.userName == null) {
      layer.msg("用户名不能为空");
      return;
    }
    if (/[@\/'\\"#$%&\^*]/.test($scope.addRow.userName)) {
      //特殊字符
      layer.msg("用户名有特殊字符");
      return;
    }
    
    if ($scope.addRow.userFullName == "" || $scope.addRow.userFullName == null) {
      layer.msg("姓名不能为空");
      return;
    }
    if (/[@\/'\\"#$%&\^*]/.test($scope.addRow.userFullName)) {
      //特殊字符
      layer.msg("姓名有特殊字符");
      return;
    }
    if ($scope.addRow.roleIds == "" || $scope.addRow.roleIds == null) {
      layer.msg("角色不能为空");
      return;
    }
    var data={
      courtId:$scope.addRow.courtId,
      courtRoomId:$scope.addRow.courtRoomId,
      userName:$scope.addRow.userName,
      userFullName:$scope.addRow.userFullName,
      roleIds:$scope.addRow.roleIds
    };
    console.log(data);
    var data1=JSON.stringify(data);
    services._userAdd(data1).success(function(res) {
      if (res.code == "2005") {
        layer.msg("用户名被占用！");
        return;
      } else if (res.code == "0") {
        // 加载数据
        layer.closeAll();
        $scope.load();
        $scope.addRow = {
          user_name: null, //用户名称
          role_id: null, //角色id
          user_email: null, //用户email
          courtId: null, //法院id
          court_name: null
        };
        layer.msg("保存成功!");
      } else {
        layer.msg("保存失败!");
      }
    });
  };
  $scope.cancelsaveUser = function() {
    // layer.close($scope.layerfunTree);
    layer.closeAll();
    $scope.layerfunTree - null;
  };

  //用户编辑数据保存
  $scope.usertEdit = function() {
    // console.log($scope.addRow);
    if ($scope.addRow.courtRoomName == "" || $scope.addRow.courtRoomName == null) {
      layer.msg("庭室不能为空");
      return;
    }
    if ($scope.addRow.userName == "" || $scope.addRow.userName == null) {
      layer.msg("用户名不能为空");
      return;
    }
    if ($scope.addRow.userFullName == "" || $scope.addRow.userFullName == null) {
      layer.msg("姓名不能为空");
      return;
    }
    if ($scope.addRow.roleIds == "" || $scope.addRow.roleIds == null) {
      layer.msg("角色不能为空");
      return;
    }
    if (/[@\/'\\"#$%&\^*]/.test($scope.addRow.userName)) {
      //特殊字符
      layer.msg("用户名有特殊字符");
      return;
    }
    if (/[@\/'\\"#$%&\^*]/.test($scope.addRow.userFullName)) {
      //特殊字符
      layer.msg("姓名有特殊字符");
      return;
    }
    $scope.addRow.userPassword=$(".psw").val();
    services._userEdit($scope.addRow).success(function(res) {
      if (res.code == "2005") {
        layer.msg("用户名被占用！");
      }
      if (res.code == "0") {
        // 加载数据
        layer.closeAll();
        $scope.selectRow = null;
        $scope.load();
        $scope.addRow = {
          user_name: null, //用户名称
          user_full_name: null, //用户全名
          role_id: null, //角色id
          user_email: null, //用户email
          courtId: null, //法院id
          court_room_id: null //庭室
        };
        layer.msg("编辑成功!");
      } else {
        layer.msg("编辑失败!");
      }
    });
  };
  ////删除
  $scope.removeUser = function() {
    if ($scope.selectRow == null || $scope.selectRow == undefined) {
      layer.msg("请先选中您要删除的对象");
    } else {
      $scope.userAccountReadOnly = false;
      $scope.layerfunTreedel = layer.open({
        type: 1,
        title: "删除信息",
        area: ["430px", "170px"],
        skin: "layui-layer-rim",
        content: $("#delForm"),
        scrollbar: false
      });
      // var id=$scope.selectRow.userId;
      /*var id=$scope.selectRow.user_id;
      if(id==1)
      {
          layer.msg("无法删除此用户,请联系管理员!")
          return;
      }
      var json={
          user_id:id.toString()//将输入的值转换成字符串
      };
      services._userDelete(json).success(function (res) {
          if(res.code=="0") {//后台返回的值
              $scope.load()
              layer.msg("删除成功!");
          }
          else
          {
              layer.msg("删除失败,请联系管理员!");
          }
      });*/
    }
  };
  $scope.canceldeluser = function() {
    layer.close($scope.layerfunTreedel);
    $scope.layerfunTreedel = null;
  };

  //确认删除用户数据
  $scope.querenRemoveUser = function() {
    // var id = $scope.selectRow.user_id;
    var id=$scope.selectRow.userId;
    var role_id=$scope.selectRow.roleId;

    if(id){
        if (id == 1) {
          layer.msg("无法删除此用户,请联系管理员!");
          return;
        }
        var json = {
          userId: id 
          // userId: id.toString() //将输入的值转换成字符串
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
    }else if(role_id){
      var json = {
          roleId:role_id 
      };
      services._roleRemove(json).success(function(res) {
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
    }
  };
});
