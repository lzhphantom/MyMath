package common

import "time"

type UnSelect struct {
	Train      *TrainingUnSelect
	Answer     string
	UserAnswer string //用户答案
	ViewFlag   bool   //是否已答题
	Correct    bool   //是否正确
}

type TrainingUnSelect struct {
	Id       int
	Content  string
	Role     uint8
	QueueNum int
	Total    int
}

type Select struct {
	Train      *TrainingSelect
	Answer     string
	UserAnswer string //用户答案
	ViewFlag   bool   //是否已答题
	Correct    bool   //是否正确
}

type TrainingSelect struct {
	Id       int
	Content  string
	Choices  []string
	Role     uint8
	QueueNum int
	Total    int
}

type Practice struct {
	Select   *Select
	UnSelect *UnSelect
}

type ReviewQuestion struct {
	Id           int
	Content      string
	QuestionType string
	QuestionRole string
	Addition     []string
	Answer       string
	ViewNum      int
	Reviewers    []string
	Creater      string
	CreateTime   time.Time
	UpdateTime   time.Time
}

type AnswerRanking struct {
	Total    int
	Correct  int
	Accuracy float64
	Name     string
}

type ChangeQuestion struct {
	Id       int
	Content  string
	Addition []string
	Answer   string
	Role     int
}

type BasicCommonReview struct {
	Id                int
	Role              string
	Content           string
	Review            int
	TestReviews       []TestReview
	HDifficultReviews []HDifficultReview
	FormulaReviews    []FormulaReview
	KnowledgeReviews  []KnowledgeReview
}

type TestReview struct {
	Id      int
	Content string
	Review  int
}

type HDifficultReview struct {
	Id      int
	Content string
	Review  int
}

type FormulaReview struct {
	Id      int
	Content string
	Review  int
}
type KnowledgeReview struct {
	Id      int
	Content string
	Review  int
}
