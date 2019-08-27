function changeCheck() {
    console.log("sumbit");
    let oldPwd = $("#oldPwd").val();
    let newPwd = $("#newPwd").val();
    let newPwd2 = $("#newPwd2").val();
    if (oldPwd.length <= 0) {
        alert("请输入旧密码");
        return false;
    } else if (newPwd.length <= 0) {
        alert("请输入新密码");
        return false;
    } else if (newPwd2.length <= 0) {
        alert("请确认密码");
        return false;
    }

    if (oldPwd === newPwd) {
        alert("新旧密码相同！");
        return false;
    }
    if (newPwd !== newPwd2) {
        alert("新密码两次不相同！");
        return false;
    }
    return true;
}
