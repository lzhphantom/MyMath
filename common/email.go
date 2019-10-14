package common

import (
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/utils"
)

func SendEmail(toUser []string, subject string, mailBody string) {

	conf, err := config.NewConfig("ini", "conf/app.conf")
	if err != nil {
		logs.Error("获取配置文件失败")
		return
	}

	emailConfig := `{"username":"` + conf.String("email::username") + `","password":"` + conf.String("email::password") + `","host":"` + conf.String("email::host") + `","port":` + conf.String("email::port") + `}`
	logs.Info(emailConfig)
	temail := utils.NewEMail(emailConfig)
	temail.To = toUser
	temail.From = conf.String("email::username")
	temail.Subject = subject
	temail.HTML = mailBody
	err = temail.Send()
	if err != nil {
		logs.Error("发送邮件失败", err)
	} else {
		logs.Info("发送成功")
	}
}
