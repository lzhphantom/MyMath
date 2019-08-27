package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

// @router / [get]
func (c *MainController) Get() {
	user := c.GetSession("loginUser")
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
