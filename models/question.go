package models

import "time"

type Question struct {
	Id           int
	Content      string    `orm:"text;unique"`
	Choices      string    `orm:"text;null"`
	Answer       string    `orm:"text;null"`
	RoleQuestion uint8     `description:"1选择题,2填空题,3解答题"`
	Created      time.Time `orm:"auto_now_add;type(datetime)"`
	Updated      time.Time `orm:"auto_now;type(datetime)"`
}
