package main

import (
	"encoding/gob"
	"github.com/astaxie/beego"
	context2 "github.com/astaxie/beego/context"
	"github.com/astaxie/beego/logs"
	_ "github.com/astaxie/beego/session/redis"
	"github.com/lzhphantom/MyMath/common"
	_ "github.com/lzhphantom/MyMath/models"
	_ "github.com/lzhphantom/MyMath/routers"
)

func init() {
	gob.Register(common.LoginUser{})
}

func main() {
	//log配置
	logs.SetLogger(logs.AdapterConsole, `{"level":1,"color":true}`)
	logs.SetLogger(logs.AdapterMultiFile, `{"filename":"tmp/lzhphantom-math.log","level":6,"maxlines":10000,"maxsize":10240,"daily":true,"maxdays":10,"color":true,"separate":["emergency", "alert", "critical", "error", "warning", "notice", "info"]}`)
	logs.EnableFuncCallDepth(true)
	logs.Async(1e3)

	FileterLogin := func(ctx *context2.Context) {
		user := ctx.Input.CruSession.Get(common.KeyLoginUser)
		logs.Info(ctx.Request.RequestURI)
		if user == nil && !(ctx.Request.RequestURI == "/login" || ctx.Request.RequestURI == "/" || ctx.Request.RequestURI == "/register") {
			ctx.ResponseWriter.WriteHeader(common.KeyNotLogin)
		}
	}
	beego.InsertFilter("/*", beego.BeforeRouter, FileterLogin)

	beego.Run()
}
