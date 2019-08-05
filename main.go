package main

import (
	_ "MyMath/models"
	_ "MyMath/routers"
	"github.com/astaxie/beego"
)

func main() {
	beego.Run()
}
