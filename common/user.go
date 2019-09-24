package common

import "time"

type LoginUser struct {
	Id   int
	Name string
	Role int
}

type UserInfo struct {
	LoginName string
	UserName  string
	Sex       string
	Tel       string
	Address   string
}

type SingleUserTrainingHistory struct {
	Content    string
	Role       string
	Addition   []string
	UserAnswer string
	Answer     string
	Correct    bool
	TotalPage  int
}

type UploadQuestionRecord struct {
	Content    string
	Addition   []string
	Answer     string
	Role       string
	CreateTime time.Time
	Review     string
	Reviewers  []string
}

type TrainingAnalysis struct {
	Name    string
	Num     int
	Percent float64
}
