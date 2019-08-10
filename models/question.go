package models

import "time"

type Question struct {
	Id           int
	Content      string    `orm:"text"`
	Choices      string    `orm:"text;null"`
	Answer       string    `orm:"text;null"`
	RoleQuestion uint8     `orm:description:"1:选择题,2:填空题,3:解答题"`
	Created      time.Time `orm:"auto_now_add;type(datetime)"`
	Updated      time.Time `orm:"auto_now;type(datetime)"`
}
