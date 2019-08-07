package models

import (
	"github.com/astaxie/beego/orm"
	_ "mysql"
	"time"
)

type Admin struct {
	Id      int
	Name    string
	Pwd     string
	Created time.Time `orm:"auto_now_add;type(datetime)"`
	Updated time.Time `orm:"auto_now;type(datetime)"`
}

func init() {
	//设置数据库基本信息
	orm.RegisterDataBase("default", "mysql", "root:root@tcp(127.0.0.1:3306)/mymath?charset=utf8")
	//映射model数据
	orm.RegisterModel(new(Admin), new(BasicCommon), new(BasicContent), new(KnowledgeImportant), new(Formula), new(ExaminationCenter), new(HDifficulty), new(User), new(UserInfo))
	//生成表
	orm.RunSyncdb("default", false, true)

}
