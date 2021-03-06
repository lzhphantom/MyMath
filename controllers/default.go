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

	To := []string{"math@lzhphantom.xyz"}
	Subject := "lzhphantom-Math 测试邮件"
	//HTML := "抱歉打扰到你，这只是一封测试邮件"
	key := "KLTkjLDFDEUN2O9q"
	code, _ := common.AESEncrypt([]byte(key), "luozhh")

	HTML := `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>用户认证</title>
<style>
.verify{
	display: inline-block;
    margin: 0 auto;
    width: 100px;
    height: 40px;
    background-color: #1e8e45;
    border-radius: 2px;
    color: #fff;
    text-decoration: none !important;
    font-size: 16px;
    font-weight: 900;
    line-height: 40px;
    transition-duration: 0.2s;
    transition-property: background-color;
    transition-timing-function: ease;
    text-align: center;
    padding: 1px;
}
.text-center{
  text-align:center;
}
</style>	
</head>
<body>
<table>
    <tbody>
    <tr>
        <td>认证邮件</td>
    </tr>
    <tr>
        <td>
            罗志辉,
            <br>
            <br>
            你好,恭喜您加入了lzhphantom-Math！想学习基础知识吗？ 看看我们的学习中心指南。

        </td>
    </tr>
    </tbody>
</table>
<table>
    <tbody>
    <tr>
        <td>
            <br>
            <div class="text-center"><a href="http://127.0.0.1:8080/verify?code=` + code + `" class="verify">认证</a></div>
            <br>
        </td>
    </tr>
    </tbody>
</table>
<table>
    <tbody>
    <tr>
        <td>
            认证员1,
            <br>
            lzhphantom-Math 认证小组
            <br>
        </td>
    </tr>
    </tbody>
</table>
</body>
</html>`
	//common.SendEmail(To, Subject, HTML)
	common.SendSSLEmail(To, Subject, HTML)
	c.ServeJSON()
}
