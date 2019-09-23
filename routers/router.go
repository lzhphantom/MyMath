package routers

import (
	"github.com/astaxie/beego"
	"github.com/lzhphantom/MyMath/controllers"
	"github.com/lzhphantom/MyMath/controllers/admin"
)

func init() {
	beego.Include(&controllers.MainController{})
	beego.Include(&admin.AdminController{})
	beego.Include(&controllers.LoginController{})
	beego.Include(&admin.AdminLoginCtroller{})
	//错误处理
	beego.ErrorController(&controllers.ErrorController{})
}
