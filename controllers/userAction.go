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
// @router /center/uploadRecord/:pageNum [get]
func (c *LoginController) UploadRecord() {
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	pageNum, err := strconv.Atoi(c.Ctx.Input.Param(":pageNum"))
	if err != nil {
		logs.Warning("pageNum 不为数字")
	}
	o := orm.NewOrm()
	total, err := o.QueryTable("question").Filter("user_id", loginUser.Id).Count()
	if err != nil {
		logs.Warning("获取条数失败")
	}
	pages := 0
	if total%5 > 0 {
		pages = int(total)/5 + 1
	} else {
		pages = int(total) / 5
	}
	var questions []models.Question
	o.QueryTable("question").Filter("user_id", loginUser.Id).Limit(5, (pageNum-1)*5).All(&questions)
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
	data := struct {
		Record    []common.UploadQuestionRecord
		TotalPage int
	}{
		Record:    uploadRecords,
		TotalPage: pages,
	}
	c.Data["json"] = data

	c.ServeJSON()
}

//个人题目比
// @router /center/trainingAnalysis [get]
func (c *LoginController) Analysis() {
	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	o := orm.NewOrm()
	var analysis []common.TrainingAnalysis
	_, err := o.Raw("select b.name,count(basic_common_id) as num from question_answer_record r left join  question q on r.question_id=q.id left join basic_common b on b.id=q.basic_common_id where r.user_id = ? group by basic_common_id;", loginUser.Id).QueryRows(&analysis)
	if err != nil {
		logs.Warning("获取个人题目比失败", err)
	}
	logs.Debug(analysis)
	total := 0
	for _, val := range analysis {
		total += val.Num
	}
	for i := 0; i < len(analysis); i++ {
		analysis[i].Percent = float64(analysis[i].Num) / float64(total) * 100
	}
	c.Data["json"] = analysis
	c.ServeJSON()
}
