package common

type UnSelect struct {
	Train  *TrainingUnSelect
	Answer string
}

type TrainingUnSelect struct {
	Id       int
	Content  string
	Role     uint8
	QueueNum int
}

type Select struct {
	Train  *TrainingSelect
	Answer string
}

type TrainingSelect struct {
	Id       int
	Content  string
	Choices  []string
	Role     uint8
	QueueNum int
}

type Practice struct {
	Select   *Select
	UnSelect *UnSelect
}
