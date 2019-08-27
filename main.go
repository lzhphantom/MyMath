package main

import (
	"github.com/astaxie/beego"
	_ "github.com/astaxie/beego/session/redis"
	_ "github.com/lzhphantom/MyMath/models"
	_ "github.com/lzhphantom/MyMath/routers"
)

func main() {
	beego.Run()
}
