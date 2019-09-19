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
	o := orm.NewOrm()
	var userInfo models.UserInfo
	err := o.QueryTable("user_info").Filter("user_id", loginUser.Id).One(&userInfo)
	if err != nil {
		logs.Warning("获取个人信息失败", err)
	} else {
		logs.Info("获取个人信息成功")
	}
	var user models.User
	err = o.QueryTable("user").Filter("id", loginUser.Id).One(&user)
	if err != nil {
		logs.Warning("获取失败", err)
	}
	var sex string
	if userInfo.Sex == 1 {
		sex = "男"
	} else {
		sex = "女"
	}
	info := common.UserInfo{
		user.UserName,
		userInfo.Name,
		sex,
		userInfo.Tel,
		userInfo.Address,
	}
	c.Data["user"] = loginUser
	c.Data["isExist"] = true
	c.Data["info"] = info
	c.TplName = "user/center.html"
}

//获取个人信息
// @router /center/getPersonalInfo [get]
func (c *LoginController) GetPersonalInfo() {
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	o := orm.NewOrm()
	var userInfo models.UserInfo
	err := o.QueryTable("user_info").Filter("user_id", loginUser.Id).One(&userInfo)
	if err != nil {
		logs.Warning("获取个人信息失败", err)
	} else {
		logs.Info("获取个人信息成功")
	}
	var user models.User
	err = o.QueryTable("user").Filter("id", loginUser.Id).One(&user)
	if err != nil {
		logs.Warning("获取失败", err)
	}
	var sex string
	if userInfo.Sex == 1 {
		sex = "男"
	} else {
		sex = "女"
	}
	info := common.UserInfo{
		user.UserName,
		userInfo.Name,
		sex,
		userInfo.Tel,
		userInfo.Address,
	}
	c.Data["json"] = info
	c.ServeJSON()
}

// @router /center/changePersonalInfo [post]
func (c *LoginController) ChangePersonalInfo() {
	userName := c.GetString("UserName")
	tel := c.GetString("Tel")
	province := c.GetString("province")
	city := c.GetString("city")
	street := c.GetString("street")
	o := orm.NewOrm()
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	if loginUser.Name != userName {
		loginUser.Name = userName
		c.SetSession(common.KeyLoginUser, loginUser)
	}
	var userInfo models.UserInfo
	err := o.QueryTable("user_info").Filter("user_id", loginUser.Id).One(&userInfo)
	if err != nil {
		logs.Warning("获取个人信息失败", err)
	}
	userInfo.Name = userName
	userInfo.Tel = tel
	address := province + " " + city + " " + street
	userInfo.Address = address
	num, err := o.Update(&userInfo, "name", "tel", "address")
	if err != nil {
		logs.Warning("个人信息更新失败", err)
	} else {
		logs.Info("更新成功", num)
	}

	c.Redirect("/center", 302)

}

//个人做题记录
// @router /center/trainingHistory/:pageNum [get]
func (c *LoginController) TrainingHistory() {
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	pageNum, err := strconv.Atoi(c.Ctx.Input.Param(":pageNum"))
	if err != nil {
		logs.Warning("pageNum 不是数字")
	}
	o := orm.NewOrm()
	total, err := o.QueryTable("question_answer_record").Filter("user_id", loginUser.Id).Count()
	if err != nil {
		logs.Warning("获取条数失败")
	}
	page := 0
	if total%10 > 0 {
		page = int(total)/10 + 1
	} else {
		page = int(total) / 10
	}
	logs.Info(page, "条")
	var records []models.QuestionAnswerRecord
	num, err := o.QueryTable("question_answer_record").Filter("user_id", loginUser.Id).Limit(10, (pageNum-1)*10).RelatedSel("question").All(&records)
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
	data := struct {
		History   []common.SingleUserTrainingHistory
		TotalPage int
	}{
		History:   SingleUserTrainingHistories,
		TotalPage: page,
	}
	c.Data["json"] = data
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
			o.QueryTable("question_review_record").Filter("question_id", questions[i].Id).RelatedSel("user").All(&reviewRecord)
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

// @router /getQuestion/:id [get]
func (c *LoginController) GetQuestion() {
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

// @router /changeQuestion/:id [post]
func (c *LoginController) ChangeQuestion() {
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
// @router /getBasicReview [get]
func (c *LoginController) GetBasicReview() {
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
// @router /passBasic/:id/:group [get]
func (c *LoginController) PassBasic() {
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
// @router /changeBasic/:id/:group [get]
func (c *LoginController) ChangeBasic() {
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
// @router /updateBasic [post]
func (c *LoginController) UpdateBasic() {
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
