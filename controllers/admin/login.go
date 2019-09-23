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
	isExistUser := c.GetSession(common.KeyLoginAdmin)
	if isExistUser == nil {
		c.TplName = "admin/admin-login.html"
	} else {
		c.Redirect("/LSLogin/login", 302)
	}

}

// @router /LSLogin/login [post,get]
func (c *AdminLoginCtroller) Login() {
	isExistUser := c.GetSession(common.KeyLoginAdmin)
	if isExistUser == nil {
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
		loginAdmin := common.LoginAdmin{
			Id:        user.Id,
			LoginName: user.Name,
		}
		c.SetSession(common.KeyLoginAdmin, loginAdmin)
	}
	c.TplName = "admin/manage.html"
}

// @router /LSLogin/logOut [get]
func (c *AdminLoginCtroller) LogOut() {
	c.DelSession(common.KeyLoginAdmin)
	c.Redirect("/LSLogin", 302)
}
