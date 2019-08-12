package models

import "time"

type User struct {
	Id       int
	UserName string    //登录用户名
	Password string    //密码
	Role     byte      `orm:"default(1)"` //角色
	Created  time.Time `orm:"auto_now_add;type(datetime)"`
	Updated  time.Time `orm:"auto_now;type(datetime)"`
	UserInfo *UserInfo `orm:"reverse(one)"`
}

type UserInfo struct {
	Id      int
	Name    string    //姓名
	Sex     byte      //性别
	Tel     string    `orm:"size(11);null"` //电话
	Address string    `orm:"null"`          //地址
	Created time.Time `orm:"auto_now_add;type(datetime)"`
	Updated time.Time `orm:"auto_now;type(datetime)"`
	User    *User     `orm:"rel(one)"`
}
