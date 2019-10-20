function checkRegister(f) {
    let errorMessage = "";
    let username = f.registerName.value;
    if (username.length > 0) {
        let reg = /^[\w]{1}[\w]{5,19}/;
        if (!reg.test(username)) {
            errorMessage += "用户名必须以字母开头6~20位\n";
        }
    } else {
        errorMessage += "用户名不能为空\n";
    }
    let pwd = f.pwd.value;
    if (pwd.length > 0) {
        let reg = /^(?=.*[a-zA-Z])(?=.*\d)[^]{8,20}$/;
        if (!reg.test(pwd)) {
            errorMessage += "密码必须由英文、数字组合8~20位\n";
        }
    } else {
        errorMessage += "密码不能为空\n";
    }
    let email = f.email.value;
    if (email.length > 0) {
        let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
        if (!reg.test(email)) {
            errorMessage += "邮箱不符合\n";
        }
    } else {
        errorMessage += "邮箱不能为空\n";
    }
    let tel = f.phone.value;
    if (tel.length === 0) {
        errorMessage += "手机号不能为空\n"
    } else if (tel.length !== 11) {
        errorMessage += "手机号码位数不正确"
    } else {
        let reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!reg.test(tel)) {
            errorMessage += "手机号码不符合\n";
        }
    }
    let name = f.name.value;
    if (name.length > 0) {
        if (!(/\p{Unified_Ideograph}/ug.test(name))) {
            errorMessage += "姓名必须为中文\n";
        }
    } else {
        errorMessage += "姓名不能为空\n";
    }
    let sex = f.sex.value;
    if (sex.length === 0) {
        errorMessage += "请选择性别\n";
    }

    if (errorMessage.length === 0) {
        return true
    }
    warningAlert(errorMessage);

    return false
}