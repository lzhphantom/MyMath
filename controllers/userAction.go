package controllers

import (
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lzhphantom/MyMath/common"
	"github.com/lzhphantom/MyMath/models"
	"strconv"
	"strings"
)

type LoginController struct {
	beego.Controller
}

//用户登录
// @router /login [post]
func (c *LoginController) Login() {

	username := c.GetString("username")
	pwd := c.GetString("password")
	md5pwd := fmt.Sprintf("%x", common.MD5Password(pwd))
	o := orm.NewOrm()
	var user models.User
	err := o.QueryTable("user").Filter("user_name", username).One(&user)
	if err != nil {
		logs.Debug("改用户不存在")
		c.Redirect("/", 302)
		return
	}

	if md5pwd == user.Password {
		logs.Debug("验证通过")
	} else {
		logs.Debug("密码不正确")
		c.Redirect("/", 302)
		return
	}

	var userInfo models.UserInfo
	o.QueryTable("user_info").Filter("user_id", user.Id).One(&userInfo)
	loginUser := common.LoginUser{
		user.Id,
		userInfo.Name,
		int(user.Role),
	}
	c.SetSession(common.KeyLoginUser, loginUser)
	c.Redirect("/", 302)
}

//用户退出
// @router /logout [get]
func (c *LoginController) LoginOut() {
	c.DelSession(common.KeyLoginUser)
	c.Redirect("/", 302)
}

//修改密码
// @router /changePwd [post]
func (c *LoginController) ChangePassword() {
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

//注册用户
// @router /register [post]
func (c *LoginController) Register() {
	loginName := c.GetString("registerName")
	pwd := c.GetString("pwd")
	user := models.User{
		UserName: loginName,
		Password: fmt.Sprintf("%x", common.MD5Password(pwd)),
		Role:     common.KeyRoleStudent,
	}
	o := orm.NewOrm()
	num, err := o.Insert(&user)
	if err != nil {
		logs.Warning("插入失败", err)
	} else {
		logs.Info("成功插入", num, "条")
	}
	c.Redirect("/", 302)
}

//获取需要审核的题目
// @router /getQuestionReview [get]
func (c *LoginController) GetQuestionReview() {
	o := orm.NewOrm()
	questions := make([]models.Question, 0)
	reviewQuestions := make([]common.ReviewQuestion, 0)
	o.QueryTable("question").Filter("review__lt", 3).All(&questions)
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
Loop:
	for i := 0; i < len(questions); i++ {
		var records []models.QuestionReviewRecord
		o.QueryTable("question_review_record").Filter("question_id", questions[i].Id).RelatedSel().All(&records)
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
// @router /passQuestionReview/:id [get]
func (c *LoginController) PassQuestionReview() {
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

//个人中心
// @router /center [get]
func (c *LoginController) Center() {
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	c.Data["user"] = loginUser
	c.Data["isExist"] = true
	c.TplName = "user/center.html"
}

//个人做题记录
// @router /center/trainingHistory [get]
func (c *LoginController) TrainingHistory() {
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	o := orm.NewOrm()
	var records []models.QuestionAnswerRecord
	num, err := o.QueryTable("question_answer_record").Filter("user_id", loginUser.Id).RelatedSel().All(&records)
	if err != nil {
		logs.Warning("获取失败", err)
	} else {
		logs.Info("获取", num)
	}
	SingleUserTrainingHistories := make([]common.SingleUserTrainingHistory, 0)
	for i := 0; i < len(records); i++ {
		var role string
		var choices []string
		if records[i].Question.RoleQuestion == 1 {
			role = "选择题"
			choices = strings.Split(records[i].Question.Choices, "~￥")
			for i := 0; i < len(choices); i++ {
				if len(choices[i]) == 0 {
					choices = append(choices[:i], choices[i+1:]...)
				}
			}
		} else {
			role = "非选择题"
		}
		userTrainingHistory := common.SingleUserTrainingHistory{
			Content:    records[i].Question.Content,
			Role:       role,
			Addition:   choices,
			UserAnswer: records[i].UserAnswer,
			Answer:     records[i].Question.Answer,
			Correct:    records[i].Correction,
		}
		SingleUserTrainingHistories = append(SingleUserTrainingHistories, userTrainingHistory)
	}
	c.Data["json"] = SingleUserTrainingHistories
	c.ServeJSON()
}

//题目上传记录
// @router /center/uploadRecord [get]
func (c *LoginController) UploadRecord() {
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	o := orm.NewOrm()
	var questions []models.Question
	o.QueryTable("question").Filter("user_id", loginUser.Id).All(&questions)
	uploadRecords := make([]common.UploadQuestionRecord, 0)
	for i := 0; i < len(questions); i++ {
		var role string
		var choices []string
		if questions[i].RoleQuestion == 1 {
			role = "选择题"
			choices = strings.Split(questions[i].Choices, "~￥")
			for i := 0; i < len(choices); i++ {
				if len(choices[i]) == 0 {
					choices = append(choices[:i], choices[i+1:]...)
				}
			}
		} else {
			role = "非选择题"
		}
		var review string
		if questions[i].Review == 0 {
			review = "未审核"
		} else if questions[i].Review > 0 && questions[i].Review < 3 {
			review = "审核中"
		} else {
			review = "审核通过"
		}
		reviewers := make([]string, 0)
		if questions[i].Review > 0 {
			var reviewRecord []models.QuestionReviewRecord
			o.QueryTable("question_review_record").Filter("question_id").RelatedSel().All(&reviewRecord)
			for j := 0; j < len(reviewRecord); j++ {
				var userInfo models.UserInfo
				o.QueryTable("user_info").Filter("user_id", reviewRecord[j].User.Id).One(&userInfo)
				reviewers = append(reviewers, userInfo.Name)
			}
		}
		record := common.UploadQuestionRecord{
			Content:    questions[i].Content,
			Addition:   choices,
			Answer:     questions[i].Answer,
			Role:       role,
			CreateTime: questions[i].Created,
			Review:     review,
			Reviewers:  reviewers,
		}
		uploadRecords = append(uploadRecords, record)
	}
	c.Data["json"] = uploadRecords

	c.ServeJSON()
}
