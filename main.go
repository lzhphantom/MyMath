package main

import (
	"github.com/astaxie/beego"
	_ "github.com/astaxie/beego/session/redis"
	_ "github.com/lzhphantom/MyMath/models"
	_ "github.com/lzhphantom/MyMath/routers"
)

func main() {
	beego.SetLogger("file", `{"filename":"tmp/lzhphantom-math.log"}`)
	beego.SetLevel(beego.LevelDebug)
	beego.SetLogFuncCall(true)
	beego.Run()
}
