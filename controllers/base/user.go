package base

import "github.com/astaxie/beego"

type UserBaseController struct {
	beego.Controller
}

func (c *UserBaseController) Abort500(err error) {
	c.Data["error"] = err
	c.Abort("500")
}

type ResultJsonValue struct {
	Code   int         `json:"code"`
	Msg    string      `json:"msg"`
	Action string      `json:",omitempty"`
	Count  int         `json:"count,omitempty"`
	Data   interface{} `json:"data,omitempty"`
}

type H map[string]interface{}

func (c *UserBaseController) JSONOkData(count int, data interface{}) {
	c.Data["json"] = &ResultJsonValue{
		Code:  0,
		Count: count,
		Msg:   "成功!",
		Data:  data,
	}
	c.ServeJSON()
}

func (c *UserBaseController) JSONOk(msg string, actions ...string) {
	var action string
	if len(actions) > 0 {
		action = actions[0]
	}

	c.Data["json"] = &ResultJsonValue{
		Code:   0,
		Msg:    msg,
		Action: action,
	}
	c.ServeJSON()
}

func (c *UserBaseController) JSONOkH(msg string, maps H) {
	if maps == nil {
		maps = H{}
	}
	maps["code"] = 0
	maps["msg"] = msg
	c.Data["json"] = maps
	c.ServeJSON()
}
