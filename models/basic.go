package models

// 基础知识分类
type BasicCommon struct {
	Id           int
	Name         string
	BasicContent []*BasicContent `orm:"reverse(many)"`
}

// 基础知识内容
type BasicContent struct {
	Id                 int
	Title              string                //标题
	Concept            string                `orm:"null"` //基础知识概念
	BasicCommon        *BasicCommon          `orm:"rel(fk)"`
	KnowledgeImportant []*KnowledgeImportant `orm:"reverse(many)"`
	Formula            []*Formula            `orm:"reverse(many)"`
	ExaminationCenter  []*ExaminationCenter  `orm:"reverse(many)"`
	HDifficulty        []*HDifficulty        `orm:"reverse(many)"`
}

//知识点精讲
type KnowledgeImportant struct {
	Id           int
	Content      string
	BasicContent *BasicContent `orm:"rel(fk)"`
}

//相关公式
type Formula struct {
	Id           int
	Content      string
	BasicContent *BasicContent `orm:"rel(fk)"`
}

//考点
type ExaminationCenter struct {
	Id           int
	Content      string
	BasicContent *BasicContent `orm:"rel(fk)"`
}

//重难点
type HDifficulty struct {
	Id           int
	Content      string
	BasicContent *BasicContent `orm:"rel(fk)"`
}
