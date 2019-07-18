if (navigator.userAgent.indexOf("MSIE") >= 0) {
  if (window.ActiveXObject) {
    var reg = /10\.0/;
    var str = navigator.userAgent;
    //reg.test(str);
    if (reg.test(str)) {
    } else {
      $("body").append(
          "<div style='position: absolute;width: 100%;height: 100%;top:0;z-index: 10;background-image:url(./img/bg.png)'>"
        ).append(
          "<div style='position: absolute;width: 500px;height: 100px;font-size: 14px;text-align: center; top: 35%;z-index: 11;left: 37%;font-family: Microsoft YaHei;'><div  style='float: left' ><img src='./img/warn-error.png'/></div><div style='padding-top: 20px;color:white'>为了系统良好运作,建议使用谷歌浏览器登录<a href='./Chrome_Setup.exe' style='display: block;width: 120px;height: 35px;text-decoration: none;line-height: 35px;color: white;margin-left: 260px;margin-top: 20px;background: #2db105;border-radius: 5px;'>下载地址</a></div></div>"
        );
    }
  }
}
//
