package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/utils"
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
	//测试 发邮件功能 让math@lzhphantom.xyz邮件 给987090402@qq.com邮箱发送邮件
	/*QQ邮箱：SMTP服务器地址：smtp.qq.com（端口：587）
	雅虎邮箱: SMTP服务器地址：smtp.yahoo.com（端口：587）
	163邮箱：SMTP服务器地址：smtp.163.com（端口：25）
	126邮箱: SMTP服务器地址：smtp.126.com（端口：25）
	新浪邮箱: SMTP服务器地址：smtp.sina.com（端口：25）*/

	config := `{"username":"lzhphantom@163.com","password":"math123","host":"smtp.163.com","port":25}`
	temail := utils.NewEMail(config)
	temail.To = []string{"987090402@qq.com"}
	temail.From = "lzhphantom@163.com"
	temail.Subject = "lzhphantom-Math 测试邮件"
	temail.HTML = "抱歉打扰到你，这只是一封测试邮件"
	err := temail.Send()
	if err != nil {
		logs.Error("发送邮件失败", err)
	} else {
		logs.Info("发送成功")
	}
	c.ServeJSON()
}
