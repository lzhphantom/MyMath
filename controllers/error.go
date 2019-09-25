package controllers

import (
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/lzhphantom/MyMath/controllers/base"
	"github.com/lzhphantom/MyMath/syserrors"
)

type ErrorController struct {
	beego.Controller
}

func (c *ErrorController) Error404() {

	c.TplName = "error.html"
	if c.IsAjax() {
		c.jsonerror(syserrors.Error404{})
	} else {
		c.Data["content"] = "w(ﾟДﾟ)w!!!，网页未找到"
		c.Data["errorTittle"] = "404"
	}
}

func (c *ErrorController) jsonerror(err syserrors.Error) {
	c.Ctx.Output.Status = 200
	c.Data["json"] = &base.ResultJsonValue{
		Code: err.Code(),
		Msg:  err.Error(),
	}
	c.ServeJSON()
}

func (c *ErrorController) Error500() {

	c.TplName = "error.html"
	var derr error
	err, ok := c.Data["error"].(error)
	if ok {
		derr = err
	} else {
		derr = syserrors.UnknowError{}
	}
	var dserr syserrors.Error
	if serr, ok := derr.(syserrors.Error); ok {
		dserr = serr
	} else {
		dserr = syserrors.NewError(err.Error(), err)
	}

	if err := dserr.ReasonError(); err != nil {
		logs.Error(dserr.Error(), err)
	}

	if c.IsAjax() {
		c.jsonerror(dserr)
	} else {
		c.Data["content"] = "w(ﾟДﾟ)w!!!，服务器出错啦<br>" + fmt.Sprintf("错误：%s", dserr.Error())
		c.Data["errorTittle"] = "500"
	}
}
