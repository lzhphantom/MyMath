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

func (c *ErrorController) Error501() {
	c.Data["content"] = "w(ﾟДﾟ)w!!!，你的请求我无法完成呐，不要玩我啦！"
	c.Data["errorTittle"] = "501"
	c.TplName = "error.html"
}

func (c *ErrorController) Error503() {
	c.Data["content"] = "w(ﾟДﾟ)w!!!，服务器目前无法使用，我被玩坏了。"
	c.Data["errorTittle"] = "503"
	c.TplName = "error.html"
}

func (c *ErrorController) Error504() {
	c.Data["content"] = "w(ﾟДﾟ)w!!!，对不起我已经最大努力了，没有在规定时间完成任务。"
	c.Data["errorTittle"] = "504"
	c.TplName = "error.html"
}

func (c *ErrorController) Error505() {
	c.Data["content"] = "w(ﾟДﾟ)w!!!，你的暗号不对，走开别碰我。"
	c.Data["errorTittle"] = "505"
	c.TplName = "error.html"
}

func (c *ErrorController) ErrorDb() {
	c.Data["content"] = "w(ﾟДﾟ)w!!!，快救救我，我也不知道哪错了"
	c.Data["errorTittle"] = "系统错误"
	c.TplName = "error.html"
}
