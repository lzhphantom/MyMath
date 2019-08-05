package models

import (
	"github.com/astaxie/beego/orm"
	_ "mysql"
)

type Admin struct {
	Id   int
	Name string
	Pwd  string
}

func init() {
	//设置数据库基本信息
	orm.RegisterDataBase("default", "mysql", "root:root@tcp(127.0.0.1:3306)/mymath?charset=utf8")
	//映射model数据
	orm.RegisterModel(new(Admin), new(BasicCommon), new(BasicContent), new(KnowledgeImportant), new(Formula), new(ExaminationCenter), new(HDifficulty))
	//生成表
	orm.RunSyncdb("default", false, true)

}
