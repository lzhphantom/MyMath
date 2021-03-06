package models

import "time"

type User struct {
	Id                   int
	UserName             string `orm:"unique"`                                                 //登录用户名
	Password             string                                                                //密码
	Role                 byte                    `orm:"default(1)" description:"1学生,2教师,0管理员"` //角色
	Verify               byte                    `orm:"null;" description:"1:验证成功"`
	Created              time.Time               `orm:"auto_now_add;type(datetime)"`
	Updated              time.Time               `orm:"auto_now;type(datetime)"`
	UserInfo             *UserInfo               `orm:"reverse(one)"`
	QuestionReviewRecord []*QuestionReviewRecord `orm:"reverse(many)"`
	BasicReviewRecord    []*BasicReviewRecord    `orm:"reverse(many)"`
	QuestionAnswerRecord []*QuestionAnswerRecord `orm:"reverse(many)"`
	Question             []*Question             `orm:"reverse(many)"`
}

type UserInfo struct {
	Id      int
	Name    string                         //姓名
	Sex     byte                           //性别
	Tel     string `orm:"size(11);unique"` //电话
	Email   string
	Address string    `orm:"null"` //地址
	Created time.Time `orm:"auto_now_add;type(datetime)"`
	Updated time.Time `orm:"auto_now;type(datetime)"`
	User    *User     `orm:"rel(one)"`
}
