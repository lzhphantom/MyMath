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

	To := []string{"987090402@qq.com"}
	Subject := "lzhphantom-Math 测试邮件"
	//HTML := "抱歉打扰到你，这只是一封测试邮件"
	key := "KLTkjLDFDEUN2O9q"
	code, _ := common.AESEncrypt([]byte(key), "luozhh")

	HTML := `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>用户认证</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<h1 class="text-center text-muted">用户认证成功</h1>
<div class="container">
    <a href="http://127.0.0.1:8080/verify?code=` + code + `">认证</a>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js"></script>
</body>
</html>`
	common.SendEmail(To, Subject, HTML)

	c.ServeJSON()
}
