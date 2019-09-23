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
	gob.Register(common.LoginAdmin{})
	gob.Register(common.UploadQuestionRecord{})
	gob.Register(common.SingleUserTrainingHistory{})
	gob.Register(common.KnowledgeReview{})
	gob.Register(common.FormulaReview{})
	gob.Register(common.HDifficultReview{})
	gob.Register(common.TestReview{})
	gob.Register(common.Select{})
	gob.Register(common.UserInfo{})
	gob.Register(common.AnswerRanking{})
	gob.Register(common.BasicCommonReview{})
	gob.Register(common.ChangeQuestion{})
	gob.Register(common.Practice{})
	gob.Register(common.ReviewQuestion{})
	gob.Register(common.TrainingSelect{})
	gob.Register(common.TrainingUnSelect{})
	gob.Register(common.UnSelect{})
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
		if user == nil {
			ctx.ResponseWriter.WriteHeader(common.KeyNotLogin)
		}
	}
	FileterAdminLogin := func(ctx *context2.Context) {
		user := ctx.Input.CruSession.Get(common.KeyLoginAdmin)
		if user == nil && !(ctx.Request.RequestURI == "/LS/login" || ctx.Request.RequestURI == "/LS" || ctx.Request.RequestURI == "/LS/admin") {
			ctx.Redirect(302, "/LS")
		}
	}
	beego.InsertFilter("/user/*", beego.BeforeRouter, FileterLogin)
	beego.InsertFilter("/center/*", beego.BeforeRouter, FileterLogin)
	beego.InsertFilter("/LS/*", beego.BeforeRouter, FileterAdminLogin)

	beego.Run()
}
