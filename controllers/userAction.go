package controllers

import (
	"crypto/md5"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/lzhphantom/MyMath/models"
)

type LoginController struct {
	beego.Controller
}

// @router /login [post]
func (c *MainController) Login() {

	username := c.GetString("username")
	pwd := c.GetString("password")
	pwdData := []byte(pwd)
	has := md5.Sum(pwdData)
	md5pwd := fmt.Sprintf("%x", has)
	o := orm.NewOrm()
	var user models.User
	err := o.QueryTable("user").Filter("user_name", username).One(&user)
	if err != nil {
		beego.Debug("改用户不存在")
	}

	if md5pwd == user.Password {
		beego.Debug("验证通过")
	} else {
		beego.Debug("密码不正确")
	}

	var userInfo models.UserInfo
	o.QueryTable("user_info").Filter("user_id", user.Id).One(&userInfo)

	c.Data["user"] = userInfo
	c.Data["isExist"] = true
	c.TplName = "index.html"
	//c.Redirect("/", 302)
}
