package controllers

import (
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lzhphantom/MyMath/common"
	"github.com/lzhphantom/MyMath/models"
)

type LoginController struct {
	beego.Controller
}

// @router /login [post]
func (c *LoginController) Login() {

	username := c.GetString("username")
	pwd := c.GetString("password")
	md5pwd := fmt.Sprintf("%x", common.MD5Password(pwd))
	o := orm.NewOrm()
	var user models.User
	err := o.QueryTable("user").Filter("user_name", username).One(&user)
	if err != nil {
		logs.Debug("改用户不存在")
	}

	if md5pwd == user.Password {
		logs.Debug("验证通过")
	} else {
		logs.Debug("密码不正确")
	}

	var userInfo models.UserInfo
	o.QueryTable("user_info").Filter("user_id", user.Id).One(&userInfo)

	loginUser := common.LoginUser{
		user.Id,
		userInfo.Name,
		user.Role,
	}
	c.SetSession(common.KeyLoginUser, loginUser)
	c.Redirect("/", 302)
}

// @router /logout [get]
func (c *LoginController) LoginOut() {
	c.DelSession(common.KeyLoginUser)
	c.Redirect("/", 302)
}

// @router /changePwd [post]
func (c *LoginController) ChangePassword() {
	user := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	oldPwd := c.GetString("oldPwd")

	o := orm.NewOrm()
	var u models.User
	o.QueryTable("user").Filter("id", user.Id).One(&u)
	oldMD5Pwd := fmt.Sprintf("%x", common.MD5Password(oldPwd))
	if u.Password == oldMD5Pwd {
		newpwd := c.GetString("newPwd")
		newMD5Pwd := fmt.Sprintf("%x", common.MD5Password(newpwd))
		u.Password = newMD5Pwd
		if num, err := o.Update(&u); err != nil {
			logs.Warning("更新失败")
		} else {
			logs.Info("更了", num, "条")
		}
	} else {
		logs.Debug("密码不正确")
	}
	c.Redirect("/", 302)
}

// @router /register [post]
func (c *LoginController) Register() {
	loginName := c.GetString("registerName")
	pwd := c.GetString("pwd")
	user := models.User{
		UserName: loginName,
		Password: fmt.Sprintf("%x", common.MD5Password(pwd)),
		Role:     common.KeyRoleStudent,
	}
	o := orm.NewOrm()
	num, err := o.Insert(&user)
	if err != nil {
		logs.Warning("插入失败", err)
	} else {
		logs.Info("成功插入", num, "条")
	}
	c.Redirect("/", 302)
}
