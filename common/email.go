package common

import (
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/utils"
	"github.com/scorredoira/email"
	"github.com/zhnxin/emailagent"
	"net/mail"
)

func SendEmail(toUser []string, subject string, mailBody string) {

	conf, err := config.NewConfig("ini", "conf/app.conf")
	if err != nil {
		logs.Error("获取配置文件失败")
		return
	}

	emailConfig := `{"username":"` + conf.String("email::username") + `","password":"` + conf.String("email::password") + `","host":"` + conf.String("email::host") + `","port":25}`
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

func SendSSLEmail(toUser []string, subject string, mailBody string) {
	conf, err := config.NewConfig("ini", "conf/app.conf")
	if err != nil {
		logs.Error("获取配置文件失败")
		return
	}
	user := conf.String("email::username")
	pwd := conf.String("email::password")
	host := conf.String("email::host")
	port, err := conf.Int("email::port")
	if err != nil {
		logs.Error("email port 不正")
	}

	m := email.NewHTMLMessage(subject, mailBody)
	m.From = mail.Address{Name: "nic Name", Address: user}
	m.To = toUser

	agent := emailagent.New(user, pwd, host, port, true)
	if err := agent.SendEmail(m); err != nil {
		logs.Debug("发送失败", err)
	} else {
		logs.Debug("发送成功")
	}
}
