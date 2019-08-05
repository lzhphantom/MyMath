package routers

import (
	"github.com/astaxie/beego"
	"github.com/lzhphantom/MyMath/controllers"
	"github.com/lzhphantom/MyMath/controllers/admin"
)

func init() {

	beego.Include(&controllers.MainController{})
	beego.Include(&admin.AdminController{})
}
