package models

import "time"

type User struct {
	Id       int
	UserName string
	Password string
	Role     byte      `orm:"default(1)"`
	Created  time.Time `orm:"auto_now_add;type(datetime)"`
	Updated  time.Time `orm:"auto_now;type(datetime)"`
	UserInfo *UserInfo `orm:"reverse(one)"`
}

type UserInfo struct {
	Id      int
	Name    string
	Sex     byte
	Tel     string    `orm:"size(11);null"`
	Address string    `orm:"null"`
	Created time.Time `orm:"auto_now_add;type(datetime)"`
	Updated time.Time `orm:"auto_now;type(datetime)"`
	User    *User     `orm:"rel(one)"`
}
