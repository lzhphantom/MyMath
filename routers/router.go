package routers

import (
	"MyMath/controllers"
	"MyMath/controllers/admin"
	"github.com/astaxie/beego"
)

func init() {

	beego.Include(&controllers.MainController{})
	beego.Include(&admin.AdminController{})
}
