package controllers

import "github.com/astaxie/beego"

type ErrorController struct {
	beego.Controller
}

func (c *ErrorController) Error404() {
	c.Data["content"] = "w(ﾟДﾟ)w!!!，网页未找到"
	c.Data["errorTittle"] = "404"
	c.TplName = "error.html"
}

func (c *ErrorController) Error500() {
	c.Data["content"] = "w(ﾟДﾟ)w!!!，服务器出错啦"
	c.Data["errorTittle"] = "500"
	c.TplName = "error.html"
}

func (c *ErrorController) ErrorDb() {
	c.Data["content"] = "w(ﾟДﾟ)w!!!，快救救我，我也不知道哪错了"
	c.Data["errorTittle"] = "Other Error"
	c.TplName = "error.html"
}
