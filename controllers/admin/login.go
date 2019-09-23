package admin

import (
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lzhphantom/MyMath/common"
	"github.com/lzhphantom/MyMath/models"
)

type AdminLoginCtroller struct {
	beego.Controller
}

// @router /LSLogin [get]
func (c *AdminLoginCtroller) ShowLoginPage() {
	c.TplName = "admin/admin-login.html"
}

// @router /LSLogin/Login [post]
func (c *AdminLoginCtroller) Login() {
	userName := c.GetString("Name")
	password := c.GetString("Password")
	pwd := fmt.Sprintf("%x", common.MD5Password(password))
	o := orm.NewOrm()
	user := models.Admin{
		Name: userName,
		Pwd:  pwd,
	}
	err := o.Read(&user, "Name", "Pwd")
	if err != nil {
		logs.Warning("改用户不存在", userName, password, err)
		c.Redirect("/LSLogin", 302)
		return
	}
	c.TplName = "admin/manage.html"
}
