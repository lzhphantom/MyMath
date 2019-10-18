function checkRegister(f) {
    let username = f.registerName.value;
    let pwd = f.pwd.value;
    let email = f.email.value;
    let tel = f.phone.value;
    let name = f.name.value;
    let sex = f.sex.value;

    console.log(username, pwd, email, name, tel, sex);
    return false
}