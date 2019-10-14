package controllers

import (
	"github.com/astaxie/beego"
	"github.com/lzhphantom/MyMath/common"
)

type MainController struct {
	beego.Controller
}

// @router / [get]
func (c *MainController) Get() {
	user := c.GetSession(common.KeyLoginUser)
	if user != nil {
		c.Data["user"] = user
		c.Data["isExist"] = true
	}
	c.TplName = "index.html"
}

// @router /test [get]
func (c *MainController) TestEditor() {
	c.TplName = "eqneditorTest.html"
}

// @router /err/:status [get]
func (c *MainController) ErrorTest() {
	status := c.Ctx.Input.Param(":status")
	c.Abort(status)
}

// @router /sendEmail [get]
func (c *MainController) SendEmail() {

	To := []string{"987090402@qq.com", "math@lzhphantom.xyz"}
	Subject := "lzhphantom-Math 测试邮件"
	HTML := "抱歉打扰到你，这只是一封测试邮件"
	common.SendEmail(To, Subject, HTML)

	c.ServeJSON()
}
