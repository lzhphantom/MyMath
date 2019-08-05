package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"] = append(beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"],
		beego.ControllerComments{
			Method:           "Manager",
			Router:           `/admin`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"] = append(beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"],
		beego.ControllerComments{
			Method:           "BasicCommon",
			Router:           `/admin/basicCommon`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"] = append(beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"],
		beego.ControllerComments{
			Method:           "BasicContent",
			Router:           `/admin/basicContent/:id`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"] = append(beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"],
		beego.ControllerComments{
			Method:           "AddBasicCommon",
			Router:           `/admin/basicType/:cop`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"] = append(beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"],
		beego.ControllerComments{
			Method:           "DelBasicContent",
			Router:           `/admin/delBasicContent`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"] = append(beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"],
		beego.ControllerComments{
			Method:           "DelBasicCommon",
			Router:           `/admin/delBasicType`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"] = append(beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"],
		beego.ControllerComments{
			Method:           "AddPublishContent",
			Router:           `/admin/publishContent/:area`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"] = append(beego.GlobalControllerRouter["github.com/lzhphantom/MyMath/controllers/admin:AdminController"],
		beego.ControllerComments{
			Method:           "ShowChangeContent",
			Router:           `/admin/showChangeContent`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

}
