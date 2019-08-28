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
