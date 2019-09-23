package front

import (
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lzhphantom/MyMath/common"
	"github.com/lzhphantom/MyMath/models"
	"math/rand"
	"strconv"
	"strings"
	"time"
)

type UserController struct {
	beego.Controller
}

//获取训练所需要的题
// @router /user/getQuestion/:role [get]
func (c *UserController) GetQuestion() {
	role := c.Ctx.Input.Param(":role")
	o := orm.NewOrm()
	var questions []*models.Question
	rand.Seed(time.Now().UnixNano())
	if role == "-1" {
		num, err := o.Raw("SELECT id,content,answer,role_question FROM question WHERE role_question != ? and review >= 3", 1).QueryRows(&questions)
		if err != nil {
			logs.Debug("获取题失败：", err)
		} else {
			logs.Info("一共获取了", num, "条")
		}
		unSelects := make([]common.UnSelect, 0)
		var start int
		var end int
		if num > 12 {
			start = rand.Intn(len(questions) - 12)
			end = start + 12
		} else {
			start = 0
			end = len(questions)
		}
		for i := start; i < end; i++ {
			newUnSelect := common.UnSelect{
				Train: &common.TrainingUnSelect{
					Id:      questions[i].Id,
					Content: questions[i].Content,
					Role:    questions[i].RoleQuestion,
					Total:   end - start,
				},
				Answer: questions[i].Answer,
			}
			unSelects = append(unSelects, newUnSelect)
		}
		c.SetSession(common.KeyUnSelects, unSelects)
		c.Redirect("/user/getTrain/unselect/0", 302)
	} else {
		num, err := o.QueryTable("question").Filter("role_question", role).Filter("review__gte", 3).All(&questions)
		if err != nil {
			logs.Debug("获取题失败：", err)
		} else {
			logs.Info("一共获取了", num, "条")
		}
		selects := make([]common.Select, 0)
		var start int
		var end int
		if num > 12 {
			start = rand.Intn(len(questions) - 12)
			end = start + 12
		} else {
			start = 0
			end = len(questions)
		}
		for i := start; i < end; i++ {
			choices := strings.Split(questions[i].Choices, "~￥")
			for i := 0; i < len(choices); i++ {
				if len(choices[i]) == 0 {
					choices = append(choices[:i], choices[i+1:]...)
				}
			}
			newSelect := common.Select{
				Train: &common.TrainingSelect{
					Id:      questions[i].Id,
					Content: questions[i].Content,
					Choices: choices,
					Role:    questions[i].RoleQuestion,
					Total:   end - start,
				},
				Answer: questions[i].Answer,
			}
			selects = append(selects, newSelect)
		}
		c.SetSession(common.KeySelects, selects)
		c.Redirect("/user/getTrain/select/0", 302)
	}
}

//从缓存冲抽取题目
// @router /user/getTrain/:role/:num [get,post]
func (c *UserController) GetTrain() {
	role := c.Ctx.Input.Param(":role")
	answer := c.GetString("answer")
	num, _ := strconv.Atoi(c.Ctx.Input.Param(":num"))
	if role == "select" {
		selects := c.GetSession(common.KeySelects).([]common.Select)
		if num > 0 {
			selects[num-1].ViewFlag = true
			selects[num-1].UserAnswer = answer
			if selects[num-1].Answer == answer {
				selects[num-1].Correct = true
			} else {
				selects[num-1].Correct = false
			}
		}
		data := selects[num].Train
		data.QueueNum = num
		c.Data["json"] = data
	} else if role == "unselect" {
		unSelects := c.GetSession(common.KeyUnSelects).([]common.UnSelect)
		if num > 0 {
			unSelects[num-1].ViewFlag = true
			unSelects[num-1].UserAnswer = answer
			if unSelects[num-1].Answer == answer {
				unSelects[num-1].Correct = true
			} else {
				unSelects[num-1].Correct = false
			}
		}
		data := unSelects[num].Train
		data.QueueNum = num
		c.Data["json"] = data
	} else {
		logs.Warning("不存在这样的选择")
	}
	c.ServeJSON()
}

//提交并检测训练
// @router /user/commitTraining/:role [post]
func (c *UserController) CommitTraining() {
	role := c.Ctx.Input.Param(":role")
	answer := c.GetString("answer")
	o := orm.NewOrm()
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)

	if role == "select" {
		selects, ok := c.GetSession(common.KeySelects).([]common.Select)
		showSelects := make([]common.Select, 0)
		if ok {
			countCorrect := 0
			countView := 0
			for i := 0; i < len(selects); i++ {
				if selects[i].ViewFlag {
					if selects[i].Correct {
						countCorrect++
					}
					countView++
					showSelects = append(showSelects, selects[i])
					answerRecord := models.QuestionAnswerRecord{
						Correction: selects[i].Correct,
						UserAnswer: selects[i].UserAnswer,
						User: &models.User{
							Id: loginUser.Id,
						},
						Question: &models.Question{
							Id: selects[i].Train.Id,
						},
					}
					num, err := o.Insert(&answerRecord)
					if err != nil {
						logs.Warning("插入失败", err)
					} else {
						logs.Info("插入成功", num)
					}
				} else {
					if len(answer) > 0 {
						selects[i].UserAnswer = answer
						selects[i].ViewFlag = true
						if selects[i].Answer == answer {
							selects[i].Correct = true
							countCorrect++
						} else {
							selects[i].Correct = false
						}
						countView++
					}
					showSelects = append(showSelects, selects[i])
					answerRecord := models.QuestionAnswerRecord{
						Correction: selects[i].Correct,
						UserAnswer: answer,
						User: &models.User{
							Id: loginUser.Id,
						},
						Question: &models.Question{
							Id: selects[i].Train.Id,
						},
					}
					num, err := o.Insert(&answerRecord)
					if err != nil {
						logs.Warning("插入失败", err)
					} else {
						logs.Info("插入成功", num)
					}
					break
				}
			}
			data := struct {
				View    int
				Correct int
				Selects *[]common.Select
			}{
				countView,
				countCorrect,
				&showSelects,
			}
			c.DelSession(common.KeySelects)
			c.Data["json"] = data
		}
	} else if role == "unselect" {
		unSelects, ok := c.GetSession(common.KeyUnSelects).([]common.UnSelect)
		showUnSelect := make([]common.UnSelect, 0)
		if ok {
			countCorrect := 0
			countView := 0
			for i := 0; i < len(unSelects); i++ {
				if unSelects[i].ViewFlag {
					if unSelects[i].Correct {
						countCorrect++
					}
					countView++
					showUnSelect = append(showUnSelect, unSelects[i])
					answerRecord := models.QuestionAnswerRecord{
						Correction: unSelects[i].Correct,
						UserAnswer: unSelects[i].UserAnswer,
						User: &models.User{
							Id: loginUser.Id,
						},
						Question: &models.Question{
							Id: unSelects[i].Train.Id,
						},
					}
					num, err := o.Insert(&answerRecord)
					if err != nil {
						logs.Warning("插入失败", err)
					} else {
						logs.Info("插入成功", num)
					}
				} else {
					if len(answer) > 0 {
						unSelects[i].UserAnswer = answer
						unSelects[i].ViewFlag = true
						if unSelects[i].Answer == answer {
							unSelects[i].Correct = true
							countCorrect++
						} else {
							unSelects[i].Correct = false
						}
						countView++
					}
					showUnSelect = append(showUnSelect, unSelects[i])
					answerRecord := models.QuestionAnswerRecord{
						Correction: unSelects[i].Correct,
						UserAnswer: answer,
						User: &models.User{
							Id: loginUser.Id,
						},
						Question: &models.Question{
							Id: unSelects[i].Train.Id,
						},
					}
					num, err := o.Insert(&answerRecord)
					if err != nil {
						logs.Warning("插入失败", err)
					} else {
						logs.Info("插入成功", num)
					}
					break
				}
			}
			data := struct {
				View      int
				Correct   int
				UnSelects *[]common.UnSelect
			}{
				countView,
				countCorrect,
				&showUnSelect,
			}
			c.DelSession(common.KeyUnSelects)
			c.Data["json"] = data
		}
	} else {
		logs.Info("role 参数不正常")
	}
	c.ServeJSON()
}

//随机获取少许特定范围的题
// @router /user/getQuestionByCommonId/:id [get]
func (c *UserController) GetQuestionByCommonId() {
	role := c.Ctx.Input.Param(":id")
	o := orm.NewOrm()
	var questions []*models.Question
	rand.Seed(time.Now().UnixNano())
	num, err := o.QueryTable("question").Filter("basic_common_id", role).All(&questions)
	if err != nil {
		logs.Debug("获取题失败：", err)
	} else {
		logs.Info("一共获取了", num, "条")
	}
	var start int
	var end int
	if num > 12 {
		start = rand.Intn(len(questions) - 12)
		end = start + 12
	} else {
		start = 0
		end = len(questions)
	}
	practices := make([]common.Practice, 0)
	for i := start; i < end; i++ {
		question := questions[i]
		if question.RoleQuestion == 1 {
			choices := strings.Split(question.Choices, "~￥")
			for i := 0; i < len(choices); i++ {
				if len(choices[i]) == 0 {
					choices = append(choices[:i], choices[i+1:]...)
				}
			}
			practiceSelect := common.Select{
				Train: &common.TrainingSelect{
					Id:      question.Id,
					Content: question.Content,
					Choices: choices,
					Role:    question.RoleQuestion,
					Total:   end - start,
				},
				Answer: question.Answer,
			}
			practice := common.Practice{
				Select: &practiceSelect,
			}
			practices = append(practices, practice)
		} else {
			practiceUnSelect := common.UnSelect{
				Train: &common.TrainingUnSelect{
					Id:      question.Id,
					Content: question.Content,
					Role:    question.RoleQuestion,
					Total:   end - start,
				},
				Answer: question.Answer,
			}
			practice := common.Practice{
				UnSelect: &practiceUnSelect,
			}
			practices = append(practices, practice)
		}
	}
	c.SetSession(common.KeyPractices, practices)
	c.Redirect("/user/getPractice/0", 302)
}

//冲缓存中抽取专项训练题目
// @router /user/getPractice/:num [post,get]
func (c *UserController) GetPractice() {
	num, _ := strconv.Atoi(c.Ctx.Input.Param(":num"))
	practices, ok := c.GetSession(common.KeyPractices).([]common.Practice)
	if num > 0 {
		answer := c.GetString("answer")
		if practices[num-1].Select != nil {
			practices[num-1].Select.ViewFlag = true
			practices[num-1].Select.UserAnswer = answer
			if practices[num-1].Select.Answer == answer {
				practices[num-1].Select.Correct = true
			} else {
				practices[num-1].Select.Correct = false
			}
		} else if practices[num-1].UnSelect != nil {
			practices[num-1].UnSelect.ViewFlag = true
			practices[num-1].UnSelect.UserAnswer = answer
			if practices[num-1].UnSelect.Answer == answer {
				practices[num-1].UnSelect.Correct = true
			} else {
				practices[num-1].UnSelect.Correct = false
			}
		}
	}
	practice := practices[num]
	if ok {
		if practice.Select != nil {
			data := practice.Select
			data.Train.QueueNum = num
			c.Data["json"] = data.Train
		} else if practice.UnSelect != nil {
			data := practice.UnSelect
			data.Train.QueueNum = num
			c.Data["json"] = data.Train
		}
	}
	c.ServeJSON()
}

//提交并检测专项训练
// @router /user/commitPractice [get,post]
func (c *UserController) CommitPractice() {
	answer := c.GetString("answer")
	practices, ok := c.GetSession(common.KeyPractices).([]common.Practice)
	showPractices := make([]common.Practice, 0)
	o := orm.NewOrm()
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	if ok {
		countView := 0
		countCorrect := 0
		for i := 0; i < len(practices); i++ {
			if practices[i].Select != nil {
				if practices[i].Select.ViewFlag {
					countView++
					if practices[i].Select.Correct {
						countCorrect++
					}
					showPractices = append(showPractices, practices[i])
					answerRecord := models.QuestionAnswerRecord{
						Correction: practices[i].Select.Correct,
						UserAnswer: practices[i].Select.UserAnswer,
						User: &models.User{
							Id: loginUser.Id,
						},
						Question: &models.Question{
							Id: practices[i].Select.Train.Id,
						},
					}
					num, err := o.Insert(&answerRecord)
					if err != nil {
						logs.Warning("插入失败", err)
					} else {
						logs.Info("插入成功", num)
					}
				} else {
					if len(answer) > 0 {
						practices[i].Select.UserAnswer = answer
						practices[i].Select.ViewFlag = true
						if practices[i].Select.Answer == answer {
							countCorrect++
							practices[i].Select.Correct = true
						} else {
							practices[i].Select.Correct = false
						}
						countView++
					}
					showPractices = append(showPractices, practices[i])
					answerRecord := models.QuestionAnswerRecord{
						Correction: practices[i].Select.Correct,
						UserAnswer: answer,
						User: &models.User{
							Id: loginUser.Id,
						},
						Question: &models.Question{
							Id: practices[i].Select.Train.Id,
						},
					}
					num, err := o.Insert(&answerRecord)
					if err != nil {
						logs.Warning("插入失败", err)
					} else {
						logs.Info("插入成功", num)
					}
					break
				}
			} else if practices[i].UnSelect != nil {
				if practices[i].UnSelect.ViewFlag {
					countView++
					if practices[i].UnSelect.Correct {
						countCorrect++
					}
					showPractices = append(showPractices, practices[i])
					answerRecord := models.QuestionAnswerRecord{
						Correction: practices[i].UnSelect.Correct,
						UserAnswer: practices[i].UnSelect.UserAnswer,
						User: &models.User{
							Id: loginUser.Id,
						},
						Question: &models.Question{
							Id: practices[i].UnSelect.Train.Id,
						},
					}
					num, err := o.Insert(&answerRecord)
					if err != nil {
						logs.Warning("插入失败", err)
					} else {
						logs.Info("插入成功", num)
					}
				} else {
					if len(answer) > 0 {
						practices[i].UnSelect.UserAnswer = answer
						practices[i].UnSelect.ViewFlag = true
						if practices[i].UnSelect.Answer == answer {
							countCorrect++
							practices[i].UnSelect.Correct = true
						} else {
							practices[i].UnSelect.Correct = false
						}
						countView++
					}
					showPractices = append(showPractices, practices[i])
					answerRecord := models.QuestionAnswerRecord{
						Correction: practices[i].UnSelect.Correct,
						UserAnswer: answer,
						User: &models.User{
							Id: loginUser.Id,
						},
						Question: &models.Question{
							Id: practices[i].UnSelect.Train.Id,
						},
					}
					num, err := o.Insert(&answerRecord)
					if err != nil {
						logs.Warning("插入失败", err)
					} else {
						logs.Info("插入成功", num)
					}
					break
				}
			}
		}
		data := struct {
			View      int
			Correct   int
			Practices *[]common.Practice
		}{
			countView,
			countCorrect,
			&showPractices,
		}
		c.Data["json"] = data
		c.DelSession(common.KeyPractices)
	}
	c.ServeJSON()
}

//修改密码
// @router /user/changePwd [post]
func (c *UserController) ChangePassword() {
	user := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	oldPwd := c.GetString("oldPwd")

	o := orm.NewOrm()
	var u models.User
	o.QueryTable("user").Filter("id", user.Id).One(&u)
	oldMD5Pwd := fmt.Sprintf("%x", common.MD5Password(oldPwd))
	if u.Password == oldMD5Pwd {
		newpwd := c.GetString("newPwd")
		newMD5Pwd := fmt.Sprintf("%x", common.MD5Password(newpwd))
		u.Password = newMD5Pwd
		if num, err := o.Update(&u); err != nil {
			logs.Warning("更新失败")
		} else {
			logs.Info("更了", num, "条")
		}
	} else {
		logs.Debug("密码不正确")
	}
	c.Redirect("/", 302)
}

//获取需要审核的题目
// @router /user/getQuestionReview [get]
func (c *UserController) GetQuestionReview() {
	o := orm.NewOrm()
	questions := make([]models.Question, 0)
	reviewQuestions := make([]common.ReviewQuestion, 0)
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	o.QueryTable("question").Filter("review__lt", 3).Exclude("user_id", loginUser.Id).All(&questions)
Loop:
	for i := 0; i < len(questions); i++ {
		var records []models.QuestionReviewRecord
		num, err := o.QueryTable("question_review_record").Filter("question_id", questions[i].Id).All(&records)
		if err != nil {
			logs.Warning("获取失败", err)
		} else {
			logs.Info("获取成功", num, "条")
		}

		var reviewers []string
		if len(records) > 0 {
			for j := 0; j < len(records); j++ {
				if records[j].User.Id == loginUser.Id {
					continue Loop
				}
				var userInfo models.UserInfo
				o.QueryTable("user_info").Filter("user_id", records[j].User.Id).One(&userInfo)
				reviewers = append(reviewers, userInfo.Name)
			}
		}

		var questionType string
		var choices []string
		if questions[i].RoleQuestion == 1 {
			choices = strings.Split(questions[i].Choices, "~￥")
			for i := 0; i < len(choices); i++ {
				if len(choices[i]) == 0 {
					choices = append(choices[:i], choices[i+1:]...)
				}
			}
			questionType = "选择题"
		} else {
			questionType = "非选择题"
		}

		reviewQuestion := common.ReviewQuestion{
			Id:           questions[i].Id,
			Content:      questions[i].Content,
			QuestionType: questionType,
			Addition:     choices,
			Answer:       questions[i].Answer,
			ViewNum:      questions[i].Review,
			Reviewers:    reviewers,
		}
		reviewQuestions = append(reviewQuestions, reviewQuestion)
	}
	c.Data["json"] = reviewQuestions
	c.ServeJSON()
}

//题目审核通过
// @router /user/passQuestionReview/:id [get]
func (c *UserController) PassQuestionReview() {
	id, err := strconv.Atoi(c.Ctx.Input.Param(":id"))
	if err != nil {
		logs.Warning("id 不正确", err)
	}
	user := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	newRecord := models.QuestionReviewRecord{
		User: &models.User{
			Id: user.Id,
		},
		Question: &models.Question{
			Id: id,
		},
	}
	o := orm.NewOrm()
	var question models.Question
	o.QueryTable("question").Filter("id", id).One(&question)
	question.Review = question.Review + 1
	num, err := o.Update(&question, "review")
	if err != nil {
		logs.Warning("更新失败", err)
	} else {
		logs.Info("更了", num, "条")
	}
	num, err = o.Insert(&newRecord)
	if err != nil {
		logs.Info("插入失败", err)
	} else {
		logs.Info("成功插入", num)
	}
	c.ServeJSON()
}

//获取单个题目->审核
// @router /user/getSingleReviewQuestion/:id [get]
func (c *UserController) GetSingleReviewQuestion() {
	id, err := strconv.Atoi(c.Ctx.Input.Param(":id"))
	if err != nil {
		logs.Warning(":id参数不为数字", err)
	}
	o := orm.NewOrm()
	question := models.Question{
		Id: id,
	}
	err = o.Read(&question)

	if err != nil {
		logs.Warning("读取失败", err)
	}

	if question.RoleQuestion == 1 {
		choices := strings.Split(question.Choices, "~￥")
		for i := 0; i < len(choices); i++ {
			if len(choices[i]) == 0 {
				choices = append(choices[:i], choices[i+1:]...)
			}
		}
		viewQuestion := common.ChangeQuestion{
			Id:       question.Id,
			Content:  question.Content,
			Addition: choices,
			Answer:   question.Answer,
			Role:     int(question.RoleQuestion),
		}
		c.Data["json"] = viewQuestion
	} else {
		viewQuestion := common.ChangeQuestion{
			Id:      question.Id,
			Content: question.Content,
			Answer:  question.Answer,
			Role:    int(question.RoleQuestion),
		}
		c.Data["json"] = viewQuestion
	}
	c.ServeJSON()

}

//审核修改题目
// @router /user/changeQuestion/:id [post]
func (c *UserController) ChangeQuestion() {
	id, err := strconv.Atoi(c.Ctx.Input.Param(":id"))
	if err != nil {
		logs.Warning(":id 非数字", err)
	}
	role, err := strconv.Atoi(c.GetString("role"))
	if err != nil {
		logs.Warning("role 非数字", err)
	}
	content := c.GetString("content")
	answer := c.GetString("ans")

	o := orm.NewOrm()
	question := models.Question{
		Id: id,
	}
	err = o.Read(&question)
	if err != nil {
		logs.Warning("该条数据不存在")
	}
	question.Content = content
	question.Answer = answer
	if role == 1 {
		question.Choices = c.GetString("choices")
	}

	num, err := o.Update(&question, "content", "choices", "answer")
	if err != nil {
		logs.Warning("题目更新失败", err)
	} else {
		logs.Info("更新成功", num)
	}
	c.ServeJSON()

}

//获取需要审核的基础知识
// @router /user/getBasicReview [get]
func (c *UserController) GetBasicReview() {
	o := orm.NewOrm()
	var basicContets []models.BasicContent
	_, err := o.QueryTable("basic_content").RelatedSel().All(&basicContets)
	if err != nil {
		logs.Warning("获取basicCommon失败")
	}
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	basicReviews := make([]common.BasicCommonReview, 0)
	for i := 0; i < len(basicContets); i++ {
		isBasic := o.QueryTable("basic_review_record").Filter("group", "B").Filter("link_id", basicContets[i].Id).Filter("user_id", loginUser.Id).Exist()
		basicReview := common.BasicCommonReview{
			Id:      basicContets[i].Id,
			Role:    basicContets[i].Title,
			Content: basicContets[i].Concept,
			Review:  basicContets[i].Review,
		}
		if isBasic {
			basicReview = common.BasicCommonReview{}
		}

		var knowledges []*models.KnowledgeImportant
		_, err := o.QueryTable("knowledge_important").Filter("basic_content_id", basicContets[i].Id).Filter("review__lte", 3).All(&knowledges)
		if err != nil {
			logs.Warning("知识点获取失败")
		}
		knowReviews := make([]common.KnowledgeReview, 0)
		for k := 0; k < len(knowledges); k++ {
			isKnow := o.QueryTable("basic_review_record").Filter("group", "K").Filter("link_id", knowledges[k].Id).Filter("user_id", loginUser.Id).Exist()
			if isKnow {
				continue
			}
			knowReview := common.KnowledgeReview{
				Id:      knowledges[k].Id,
				Content: knowledges[k].Content,
				Review:  knowledges[k].Review,
			}
			knowReviews = append(knowReviews, knowReview)
		}
		basicReview.KnowledgeReviews = knowReviews

		var formulas []*models.Formula
		_, err = o.QueryTable("formula").Filter("basic_content_id", basicContets[i].Id).Filter("review__lte", 3).All(&formulas)
		if err != nil {
			logs.Warning("获取公式失败")
		}
		formulaReviews := make([]common.FormulaReview, 0)
		for k := 0; k < len(formulas); k++ {
			isFormula := o.QueryTable("basic_review_record").Filter("group", "F").Filter("link_id", formulas[k].Id).Filter("user_id", loginUser.Id).Exist()
			if isFormula {
				continue
			}
			formulaReview := common.FormulaReview{
				Id:      formulas[k].Id,
				Content: formulas[k].Content,
				Review:  formulas[k].Review,
			}
			formulaReviews = append(formulaReviews, formulaReview)
		}
		basicReview.FormulaReviews = formulaReviews

		var hds []*models.HDifficulty
		_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", basicContets[i].Id).Filter("review__lte", 3).All(&hds)
		if err != nil {
			logs.Warning("重难点获取失败")
		}
		hdReviews := make([]common.HDifficultReview, 0)
		for k := 0; k < len(hds); k++ {
			isHD := o.QueryTable("basic_review_record").Filter("group", "H").Filter("link_id", hds[k].Id).Filter("user_id", loginUser.Id).Exist()
			if isHD {
				continue
			}
			hdReview := common.HDifficultReview{
				Id:      hds[k].Id,
				Content: hds[k].Content,
				Review:  hds[k].Review,
			}
			hdReviews = append(hdReviews, hdReview)
		}
		basicReview.HDifficultReviews = hdReviews

		var tests []*models.ExaminationCenter
		_, err = o.QueryTable("examination_center").Filter("basic_content_id", basicContets[i].Id).Filter("review__lte", 3).All(&tests)
		if err != nil {
			logs.Warning("考点获取失败")
		}
		testReviews := make([]common.TestReview, 0)
		for k := 0; k < len(tests); k++ {
			isTest := o.QueryTable("basic_review_record").Filter("group", "E").Filter("link_id", tests[k].Id).Filter("user_id", loginUser.Id).Exist()
			if isTest {
				continue
			}
			testReview := common.TestReview{
				Id:      tests[k].Id,
				Content: tests[k].Content,
				Review:  tests[k].Review,
			}
			testReviews = append(testReviews, testReview)
		}
		basicReview.TestReviews = testReviews
		if basicReview.Id == 0 &&
			len(basicReview.FormulaReviews) == 0 &&
			len(basicReview.HDifficultReviews) == 0 &&
			len(basicReview.KnowledgeReviews) == 0 &&
			len(basicReview.TestReviews) == 0 {
			continue
		}
		basicReviews = append(basicReviews, basicReview)
	}
	c.Data["json"] = basicReviews
	c.ServeJSON()
}

//审核通过基础知识
// @router /user/passBasic/:id/:group [get]
func (c *UserController) PassBasic() {
	id, err := strconv.Atoi(c.Ctx.Input.Param(":id"))
	if err != nil {
		logs.Warning("id 不为数字")
	}
	group := c.Ctx.Input.Param(":group")
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	o := orm.NewOrm()
	if group == "F" {
		formula := models.Formula{
			Id: id,
		}
		err = o.Read(&formula)
		if err != nil {
			logs.Warning("不存在")
		}
		formula.Review += 1
		_, err = o.Update(&formula, "review")
		if err != nil {
			logs.Warning("更新失败")
		}

	} else if group == "E" {
		test := models.ExaminationCenter{
			Id: id,
		}
		err = o.Read(&test)
		if err != nil {
			logs.Warning("不存在")
		}
		test.Review += 1
		_, err = o.Update(&test, "review")
		if err != nil {
			logs.Warning("更新失败")
		}
	} else if group == "H" {
		hd := models.HDifficulty{
			Id: id,
		}
		err = o.Read(&hd)
		if err != nil {
			logs.Warning("不存在")
		}
		hd.Review += 1
		_, err = o.Update(&hd, "review")
		if err != nil {
			logs.Warning("更新失败")
		}
	} else if group == "K" {
		know := models.KnowledgeImportant{
			Id: id,
		}
		err = o.Read(&know)
		if err != nil {
			logs.Warning("不存在")
		}
		know.Review += 1
		_, err = o.Update(&know, "review")
		if err != nil {
			logs.Warning("更新失败")
		}
	} else if group == "B" {
		basic := models.BasicContent{
			Id: id,
		}
		err = o.Read(&basic)
		if err != nil {
			logs.Warning("不存在")
		}
		basic.Review += 1
		_, err = o.Update(&basic, "review")
		if err != nil {
			logs.Warning("更新失败")
		}
	} else {
		logs.Warning("group 不在分组内")
	}

	record := models.BasicReviewRecord{
		Group:  group,
		LinkId: id,
		User: &models.User{
			Id: loginUser.Id,
		},
	}
	_, err = o.Insert(&record)
	if err != nil {
		logs.Warning("插入记录失败", err)
	}

	c.ServeJSON()
}

//需要修改基础知识
// @router /user/changeBasic/:id/:group [get]
func (c *UserController) ChangeBasic() {
	id, err := strconv.Atoi(c.Ctx.Input.Param(":id"))
	if err != nil {
		logs.Warning(":id 不为数字")
	}
	group := c.Ctx.Input.Param(":group")
	o := orm.NewOrm()
	if group == "B" {
		var basic models.BasicContent
		err = o.QueryTable("basic_content").Filter("id", id).One(&basic)
		if err != nil {
			logs.Warning("获取失败", err)
		}
		c.Data["json"] = basic.Concept
	} else if group == "H" {
		var hd models.HDifficulty
		err = o.QueryTable("h_difficulty").Filter("id", id).One(&hd)
		if err != nil {
			logs.Warning("获取失败", err)
		}
		c.Data["json"] = hd.Content

	} else if group == "E" {
		var test models.ExaminationCenter
		err = o.QueryTable("examination_center").Filter("id", id).One(&test)
		if err != nil {
			logs.Warning("获取失败", err)
		}
		c.Data["json"] = test.Content
	} else if group == "F" {
		var formula models.Formula
		err = o.QueryTable("formula").Filter("id", id).One(&formula)
		if err != nil {
			logs.Warning("获取失败", err)
		}
		c.Data["json"] = formula.Content
	} else if group == "K" {
		var know models.KnowledgeImportant
		err = o.QueryTable("knowledge_important").Filter("id", id).One(&know)
		if err != nil {
			logs.Warning("获取失败", err)
		}
		c.Data["json"] = know.Content
	} else {
		logs.Warning("group 不在分组内")
	}
	c.ServeJSON()
}

//更新基础知识
// @router /user/updateBasic [post]
func (c *UserController) UpdateBasic() {
	id, err := c.GetInt("id")
	if err != nil {
		logs.Warning("id 不为数字")
	}
	content := c.GetString("content")
	group := c.GetString("group")
	o := orm.NewOrm()
	if group == "B" {
		var basic models.BasicContent
		err = o.QueryTable("basic_content").Filter("id", id).One(&basic)
		basic.Concept = content
		_, err = o.Update(&basic, "concept")
		if err != nil {
			logs.Warning("更新失败")
		}
	} else if group == "F" {
		var formula models.Formula
		err = o.QueryTable("formula").Filter("id", id).One(&formula)
		formula.Content = content
		_, err = o.Update(&formula, "content")
		if err != nil {
			logs.Warning("更新失败")
		}
	} else if group == "H" {
		var hd models.HDifficulty
		err = o.QueryTable("h_difficulty").Filter("id", id).One(&hd)
		hd.Content = content
		_, err = o.Update(&hd, "content")
		if err != nil {
			logs.Warning("更新失败")
		}
	} else if group == "K" {
		var know models.KnowledgeImportant
		err = o.QueryTable("knowledge_important").Filter("id", id).One(&know)
		know.Content = content
		_, err = o.Update(&know, "content")
		if err != nil {
			logs.Warning("更新失败")
		}
	} else if group == "E" {
		var test models.ExaminationCenter
		err = o.QueryTable("examination_center").Filter("id", id).One(&test)
		test.Content = content
		_, err = o.Update(&test, "content")
		if err != nil {
			logs.Warning("更新失败")
		}
	} else {
		logs.Warning("group 不在分组内")
	}
	c.ServeJSON()
}

// 检索基础知识种类
// @router /user/basicCommon [get]
func (c *UserController) BasicCommon() {
	var basicCommons []*models.BasicCommon

	newOrm := orm.NewOrm()
	num, err := newOrm.QueryTable("basic_common").All(&basicCommons)
	if err != nil {
		logs.Debug("基础知识种类获取失败！")
	} else {
		logs.Debug("基础知识种类共获取:", num, "个")
	}
	c.Data["json"] = basicCommons
	c.ServeJSON()
}
