function notLogin() {
    var msg=confirm("请登录在进行其他操作！");
    if (msg){
        $("#login").modal("show");
    }
}