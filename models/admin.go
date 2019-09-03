package models

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
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
	conf, err := config.NewConfig("ini", "conf/app.conf")
	if err != nil {
		beego.Debug("获取配置文件失败")
	}
	section, err := conf.GetSection("mysql")
	if err != nil {
		beego.Debug("获取配置文件内容失败")
	}
	connectIp := section["connect_ip"]
	port := section["port"]
	username := section["username"]
	password := section["password"]
	dbName := section["db_name"]
	dataSource := username + ":" + password + "@tcp(" + connectIp + ":" + port + ")/" + dbName + "?charset=utf8&loc=Local"
	//设置数据库基本信息
	err = orm.RegisterDataBase("default", "mysql", dataSource)
	if err != nil {
		beego.Debug("注册数据库失败")
	}
	//映射model数据
	orm.RegisterModel(new(Admin), new(BasicCommon), new(BasicContent), new(KnowledgeImportant), new(Formula), new(ExaminationCenter), new(HDifficulty), new(User), new(UserInfo), new(Question), new(QuestionReviewRecord), new(BasicReviewRecord))
	//生成表
	orm.RunSyncdb("default", false, true)

}
