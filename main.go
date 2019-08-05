package main

import (
	"github.com/astaxie/beego"
	_ "github.com/lzhphantom/MyMath/models"
	_ "github.com/lzhphantom/MyMath/routers"
)

func main() {
	beego.Run()
}
