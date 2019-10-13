package models

import "time"

//题目
type Question struct {
	Id           int
	Content      string                  `orm:"text;unique"`
	Choices      string                  `orm:"text;null"`
	Answer       string                  `orm:"text;null"`
	RoleQuestion uint8                   `description:"1选择题,2填空题,3解答题"`
	Created      time.Time               `orm:"auto_now_add;type(datetime)"`
	Updated      time.Time               `orm:"auto_now;type(datetime)"`
	Deleted      time.Time               `orm:"null"`
	Review       int                     `description:"大于等于3，审核完毕"`
	BasicCommon  *BasicCommon            `orm:"rel(fk)"`
	ReviewRecord []*QuestionReviewRecord `orm:"reverse(many)"`
	AnswerRecord []*QuestionAnswerRecord `orm:"reverse(many)"`
	User         *User                   `orm:"rel(fk)"`
}

//审核记录
type QuestionReviewRecord struct {
	Id       int
	Created  time.Time `orm:"auto_now_add;type(datetime)"`
	Updated  time.Time `orm:"auto_now;type(datetime)"`
	User     *User     `orm:"rel(fk)"`
	Question *Question `orm:"rel(fk)"`
}

type QuestionAnswerRecord struct {
	Id         int
	UserAnswer string
	Correction bool
	Created    time.Time `orm:"auto_now_add;type(datetime)"`
	Updated    time.Time `orm:"auto_now;type(datetime)"`
	User       *User     `orm:"rel(fk)"`
	Question   *Question `orm:"rel(fk)"`
}
