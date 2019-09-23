package routers

import (
	"github.com/astaxie/beego"
	"github.com/lzhphantom/MyMath/controllers"
	"github.com/lzhphantom/MyMath/controllers/front"
	"github.com/lzhphantom/MyMath/controllers/lzhphantomAdminService"
)

func init() {
	beego.Include(&controllers.MainController{})
	beego.Include(&lzhphantomAdminService.AdminController{})
	beego.Include(&controllers.LoginController{})
	beego.Include(&lzhphantomAdminService.AdminLoginCtroller{})
	beego.Include(&front.UserController{})
	//错误处理
	beego.ErrorController(&controllers.ErrorController{})
}
