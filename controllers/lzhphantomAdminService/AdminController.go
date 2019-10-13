package lzhphantomAdminService

import (
	"crypto/md5"
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lzhphantom/MyMath/common"
	"github.com/lzhphantom/MyMath/controllers/base"
	"github.com/lzhphantom/MyMath/models"
	"reflect"
	"strconv"
	"strings"
)

type AdminController struct {
	base.UserBaseController
}

// @router /LS/admin [get]
func (c *AdminController) Manager() {
	logs.Info(c.GetSession(common.KeyLoginAdmin) == nil)
	if c.GetSession(common.KeyLoginAdmin) == nil {
		admin := common.LoginAdmin{
			Id:        0,
			LoginName: "admintest",
			Name:      "管理员测试",
		}
		c.SetSession(common.KeyLoginAdmin, admin)
	}

	c.Redirect("/LS/login", 302)
}

// 检索基础知识种类
// @router /LS/basicCommon [get]
func (c *AdminController) BasicCommon() {
	var basicCommons []*models.BasicCommon

	newOrm := orm.NewOrm()
	num, err := newOrm.QueryTable("basic_common").All(&basicCommons)
	if err != nil {
		c.Abort500(err)
	}
	c.JSONOkData(int(num), basicCommons)
}

//添加、修改基础知识种类
// @router /LS/basicType/:cop [post]
func (c *AdminController) AddBasicCommon() {
	cop := c.Ctx.Input.Param(":cop")

	typeName := c.GetString("typeName")
	if typeName == "" {
		logs.Debug("没有获取到新分类名")
	}

	var basicCommon models.BasicCommon
	basicCommon.Name = typeName
	o := orm.NewOrm()
	if cop == "1" { // 1 ：添加新基础知识种类
		if err := o.Begin(); err != nil {
			c.Abort500(err)
		}
		_, err := o.Insert(&basicCommon)
		if err != nil {
			o.Rollback()
			c.Abort500(err)
		}
		if err := o.Commit(); err != nil {
			c.Abort500(err)
		}
	} else {
		id, err := c.GetInt("ti")
		if err != nil {
			c.Abort500(err)
		}
		basicCommon.Id = id
		if err := o.Begin(); err != nil {
			c.Abort500(err)
		}
		if _, err := o.Update(&basicCommon); err != nil {
			o.Rollback()
			c.Abort500(err)
		} else {
			if err := o.Commit(); err != nil {
				c.Abort500(err)
			}
		}
	}

	c.Redirect("/LS/basicCommon", 302)
}

//删除基础知识种类
// @router /LS/delBasicType [post]
func (c *AdminController) DelBasicCommon() {
	typeId, err := c.GetInt("id")
	if err != nil {
		c.Abort500(err)
	}
	o := orm.NewOrm()
	if err := o.Begin(); err != nil {
		c.Abort500(err)
	}
	if _, err := o.Delete(&models.BasicCommon{Id: typeId}); err != nil {
		o.Rollback()
		c.Abort500(err)
	} else {
		if err := o.Commit(); err != nil {
			c.Abort500(err)
		}
	}
	c.Redirect("/LS/basicCommon", 302)
}

//基础知识详情
// @router /LS/basicContent/:id [get]
func (c *AdminController) BasicContent() {
	id := c.Ctx.Input.Param(":id")
	logs.Debug("获取", id, reflect.TypeOf(id))
	o := orm.NewOrm()
	if id == "-1" {
		var basicContents []*models.BasicCommon
		_, err := o.QueryTable("basic_common").All(&basicContents)
		if err != nil {
			c.Abort500(err)
		}
		for _, common := range basicContents {
			_, err := o.QueryTable("basic_content").Filter("basic_common_id", (*common).Id).RelatedSel().All(&common.BasicContent)
			if err != nil {
				c.Abort500(err)
			}
			for _, value := range common.BasicContent {
				_, err := o.QueryTable("formula").Filter("basic_content_id", (*value).Id).All(&value.Formula)
				if err != nil {
					c.Abort500(err)
				}
				_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", (*value).Id).All(&value.KnowledgeImportant)
				if err != nil {
					c.Abort500(err)
				}
				_, err = o.QueryTable("examination_center").Filter("basic_content_id", (*value).Id).All(&value.ExaminationCenter)
				if err != nil {
					c.Abort500(err)
				}
				_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", (*value).Id).All(&value.HDifficulty)
				if err != nil {
					c.Abort500(err)
				}
			}
		}
		if err != nil {
			c.Abort500(err)
		}
		c.JSONOkData(len(basicContents), basicContents)
	} else {
		Id, err := strconv.Atoi(id)
		if err != nil {
			c.Abort500(err)
		}
		basicContent := models.BasicCommon{Id: Id}

		err = o.Read(&basicContent)

		_, err = o.QueryTable("basic_content").Filter("basic_common_id", basicContent.Id).RelatedSel().All(&basicContent.BasicContent)
		if err != nil {
			c.Abort500(err)
		}
		for _, value := range basicContent.BasicContent {
			_, err := o.QueryTable("formula").Filter("basic_content_id", (*value).Id).All(&value.Formula)
			if err != nil {
				c.Abort500(err)
			}
			_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", (*value).Id).All(&value.KnowledgeImportant)
			if err != nil {
				c.Abort500(err)
			}
			_, err = o.QueryTable("examination_center").Filter("basic_content_id", (*value).Id).All(&value.ExaminationCenter)
			if err != nil {
				c.Abort500(err)
			}
			_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", (*value).Id).All(&value.HDifficulty)
			if err != nil {
				c.Abort500(err)
			}
		}

		if err != nil {
			c.Abort500(err)
		}
		c.JSONOkData(1, basicContent)
	}
}

//添加版块内容
// @router /LS/publishContent/:area [post]
func (c *AdminController) AddPublishContent() {
	area := c.Ctx.Input.Param(":area")
	var err error
	id, err := c.GetInt("typeId")
	if err != nil {
		c.Abort500(err)
	}
	content := c.GetString("content")
	o := orm.NewOrm()
	var okId int64

	basicContent := models.BasicContent{}
	basicCommon := models.BasicCommon{
		Id: id,
	}
	err = o.Read(&basicCommon)
	if err != nil {
		c.Abort500(err)
	}
	if o.QueryTable("basic_content").Filter("basic_common_id", id).Exist() {
		err = o.QueryTable("basic_content").Filter("basic_common_id", id).RelatedSel().One(&basicContent)
		if err != nil {
			c.Abort500(err)
		}
	}

	if basicContent.BasicCommon == nil {
		logs.Info("无记录")
		basicContent.Title = basicCommon.Name
		if area == "5" {
			basicContent.Concept = content
		}
		basicContent.BasicCommon = &basicCommon
		if err := o.Begin(); err != nil {
			c.Abort500(err)
		}
		okId, err = o.Insert(&basicContent)
		if err != nil {
			o.Rollback()
			c.Abort500(err)
		} else {
			if err := o.Commit(); err != nil {
				c.Abort500(err)
			}
		}
	} else {
		if area == "5" {
			basicContent.Concept = content
			if err := o.Begin(); err != nil {
				c.Abort500(err)
			}
			if _, err := o.Update(&basicContent); err != nil {
				o.Rollback()
				c.Abort500(err)
			} else {
				if err := o.Commit(); err != nil {
					c.Abort500(err)
				}
			}
		}
		okId = int64(basicContent.Id)
	}

	if area == "1" { //知识点
		know := models.KnowledgeImportant{
			Content: content,
			BasicContent: &models.BasicContent{
				Id: int(okId),
			},
		}
		if err := o.Begin(); err != nil {
			c.Abort500(err)
		}
		okId, err = o.Insert(&know)
		if err != nil {
			o.Rollback()
			c.Abort500(err)
		} else {
			if err := o.Commit(); err != nil {
				c.Abort500(err)
			}
		}
	} else if area == "2" { //相关公式
		formula := models.Formula{
			Content: content,
			BasicContent: &models.BasicContent{
				Id: int(okId),
			},
		}
		if err := o.Begin(); err != nil {
			c.Abort500(err)
		}
		okId, err = o.Insert(&formula)
		if err != nil {
			o.Rollback()
			c.Abort500(err)
		} else {
			if err := o.Commit(); err != nil {
				c.Abort500(err)
			}
		}
	} else if area == "3" { //考点
		testCenter := models.ExaminationCenter{
			Content: content,
			BasicContent: &models.BasicContent{
				Id: int(okId),
			},
		}
		if err := o.Begin(); err != nil {
			c.Abort500(err)
		}
		okId, err = o.Insert(&testCenter)
		if err != nil {
			o.Rollback()
			c.Abort500(err)
		} else {
			if err := o.Commit(); err != nil {
				c.Abort500(err)
			}
		}
	} else if area == "4" { //重难点
		hd := models.HDifficulty{
			Content: content,
			BasicContent: &models.BasicContent{
				Id: int(okId),
			},
		}
		if err := o.Begin(); err != nil {
			c.Abort500(err)
		}
		okId, err = o.Insert(&hd)
		if err != nil {
			o.Rollback()
			c.Abort500(err)
		} else {
			if err := o.Commit(); err != nil {
				c.Abort500(err)
			}
		}
	}
	if err != nil {
		c.Abort500(err)
	}
	c.Redirect("/LS/basicContent/-1", 302)
}

//删除内容
// @router /LS/delBasicContent [post]
func (c *AdminController) DelBasicContent() {
	id, err := c.GetInt("id")
	if err != nil {
		c.Abort500(err)
	}
	o := orm.NewOrm()
	if err := o.Begin(); err != nil {
		c.Abort500(err)
	}
	_, err = o.QueryTable("examination_center").Filter("basic_content_id", id).Delete()
	if err != nil {
		o.Rollback()
		c.Abort500(err)
	}
	_, err = o.QueryTable("formula").Filter("basic_content_id", id).Delete()
	if err != nil {
		o.Rollback()
		c.Abort500(err)
	}
	_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", id).Delete()
	if err != nil {
		o.Rollback()
		c.Abort500(err)
	}
	_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", id).Delete()
	if err != nil {
		o.Rollback()
		c.Abort500(err)
	}
	_, err = o.QueryTable("basic_content").Filter("id", id).Delete()
	if err != nil {
		o.Rollback()
		c.Abort500(err)
	}
	if err := o.Commit(); err != nil {
		c.Abort500(err)
	}
	c.Redirect("/LS/basicContent/-1", 302)
}

//显示基础知识修改模板
// @router /LS/showChangeContent [post]
func (c *AdminController) ShowChangeContent() {
	id, err := c.GetInt("id")
	if err != nil {
		c.Abort500(err)
	}
	content := models.BasicContent{}
	o := orm.NewOrm()
	err = o.QueryTable("basic_content").Filter("id", id).RelatedSel().One(&content)
	if err != nil {
		c.Abort500(err)
	}
	_, err = o.QueryTable("formula").Filter("basic_content_id", id).All(&content.Formula)
	if err != nil {
		c.Abort500(err)
	}
	_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", id).All(&content.KnowledgeImportant)
	if err != nil {
		c.Abort500(err)
	}
	_, err = o.QueryTable("examination_center").Filter("basic_content_id", id).All(&content.ExaminationCenter)
	if err != nil {
		c.Abort500(err)
	}
	_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", id).All(&content.HDifficulty)
	if err != nil {
		c.Abort500(err)
	}
	c.JSONOkData(1, content)
}

//修改基础知识内容
// @router /LS/changeContent [post]
func (c *AdminController) ChangeContent() {
	id, err := c.GetInt("id")
	if err != nil {
		c.Abort500(err)
	}
	logs.Info(id)
	content1 := c.GetString("content1")
	content2 := c.GetString("content2")
	content3 := c.GetString("content3")
	content4 := c.GetString("content4")
	content5 := c.GetString("content5")
	content1Map := make(map[string]interface{})
	content2Map := make(map[string]interface{})
	content3Map := make(map[string]interface{})
	content4Map := make(map[string]interface{})
	content5Map := make(map[string]interface{})
	err = json.Unmarshal([]byte(content1), &content1Map)
	if err != nil {
		c.Abort500(err)
	}
	err = json.Unmarshal([]byte(content2), &content2Map)
	if err != nil {
		c.Abort500(err)
	}
	err = json.Unmarshal([]byte(content3), &content3Map)
	if err != nil {
		c.Abort500(err)
	}
	err = json.Unmarshal([]byte(content4), &content4Map)
	if err != nil {
		c.Abort500(err)
	}
	err = json.Unmarshal([]byte(content5), &content5Map)
	if err != nil {
		c.Abort500(err)
	}

	o := orm.NewOrm()
	content := models.BasicContent{}
	err = o.QueryTable("basic_content").Filter("id", id).RelatedSel().One(&content)
	if err != nil {
		c.Abort500(err)
	}
	_, err = o.QueryTable("formula").Filter("basic_content_id", id).All(&content.Formula)
	if err != nil {
		c.Abort500(err)
	}
	_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", id).All(&content.KnowledgeImportant)
	if err != nil {
		c.Abort500(err)
	}
	_, err = o.QueryTable("examination_center").Filter("basic_content_id", id).All(&content.ExaminationCenter)
	if err != nil {
		c.Abort500(err)
	}
	_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", id).All(&content.HDifficulty)
	if err != nil {
		c.Abort500(err)
	}

	content.Concept = content5Map["5"].(string)
	if err := o.Begin(); err != nil {
		c.Abort500(err)
	}
	if _, err := o.Update(&content); err != nil {
		o.Rollback()
		c.Abort500(err)
	}

	for key, value := range content.KnowledgeImportant {
		(*value).Content = content1Map[strconv.Itoa(key)].(string)
		if _, err := o.Update(value); err != nil {
			o.Rollback()
			c.Abort500(err)
		}
	}
	for key, value := range content.HDifficulty {
		value.Content = content4Map[strconv.Itoa(key)].(string)
		if _, err := o.Update(value); err != nil {
			o.Rollback()
			c.Abort500(err)
		}
	}
	for key, value := range content.Formula {
		value.Content = content2Map[strconv.Itoa(key)].(string)
		if _, err := o.Update(value); err != nil {
			o.Rollback()
			c.Abort500(err)
		}
	}
	for key, value := range content.ExaminationCenter {
		value.Content = content3Map[strconv.Itoa(key)].(string)
		if _, err := o.Update(value); err != nil {
			o.Rollback()
			c.Abort500(err)
		}
	}
	if err := o.Commit(); err != nil {
		c.Abort500(err)
	}

	c.Redirect("/LS/basicContent/-1", 302)
}

//上传题
// @router /LS/uploadQuestion [post]
func (c *AdminController) UploadQuestion() {
	newQuestion := models.Question{}

	data := c.GetString("data")
	dataMap := make(map[string]interface{})
	err := json.Unmarshal([]byte(data), &dataMap)
	if err != nil {
		c.Abort500(err)
	}

	newQuestion.Content = dataMap["content"].(string)
	role, err := c.GetUint8("role")
	if err != nil {
		c.Abort500(err)
	}
	logs.Debug(role)
	newQuestion.RoleQuestion = uint8(role)

	if role == 1 { //如果是选择题，则录入选项
		newQuestion.Choices = dataMap["choices"].(string)
	}

	if answer, ok := dataMap["answer"].(string); ok {
		newQuestion.Answer = answer
	}
	idRole, err := strconv.Atoi(dataMap["role"].(string))
	if err != nil {
		c.Abort500(err)
	}

	loginUser := c.GetSession(common.KeyLoginUser).(common.LoginUser)
	newQuestion.User = &models.User{
		Id: loginUser.Id,
	}
	o := orm.NewOrm()
	newQuestion.BasicCommon = &models.BasicCommon{
		Id: idRole,
	}
	if err := o.Begin(); err != nil {
		c.Abort500(err)
	}
	_, err = o.Insert(&newQuestion)
	if err != nil {
		o.Rollback()
		c.Abort500(err)
	} else {
		if err := o.Commit(); err != nil {
			c.Abort500(err)
		}
	}
	c.JSONOk("上传成功")
}

//添加用户
// @router /LS/userAdd [post]
func (c *AdminController) UserAdd() {
	userName := c.GetString("userName")
	pwd := c.GetString("password")
	name := c.GetString("name")
	sex, _ := c.GetInt("sex")
	tel := c.GetString("tel")
	province := c.GetString("province")
	city := c.GetString("city")
	street := c.GetString("street")
	userGroup, _ := c.GetInt("userGroup")

	//密码加密
	pwdData := []byte(pwd)
	has := md5.Sum(pwdData)
	md5pwd := fmt.Sprintf("%x", has)

	user := models.User{
		UserName: userName,
		Password: md5pwd,
		Role:     byte(userGroup),
	}
	o := orm.NewOrm()
	_, err := o.Insert(&user)
	if err != nil {
		c.Abort500(err)
	}

	userInfo := models.UserInfo{
		Name:    name,
		Sex:     byte(sex),
		Tel:     tel,
		Address: province + " " + city + " " + street,
		User:    &user,
	}
	if err := o.Begin(); err != nil {
		c.Abort500(err)
	}
	_, err = o.Insert(&userInfo)
	if err != nil {
		o.Rollback()
		c.Abort500(err)
	}
	if err := o.Commit(); err != nil {
		c.Abort500(err)
	}
	c.Redirect("/LS", 302)
}

//查找用户信息
// @router /LS/searchUser [post]
func (c *AdminController) SearchUser() {
	userGroup, err := c.GetInt("group")
	if err != nil {
		c.Abort500(err)
	}
	users := make([]models.User, 0)
	o := orm.NewOrm()
	num, err := o.QueryTable("user").Filter("role", byte(userGroup)).All(&users)
	if err != nil {
		c.Abort500(err)
	}

	//range 会为每个元素生成一个副本
	for i := 0; i < len(users); i++ {
		t := models.UserInfo{}
		o.QueryTable("user_info").Filter("user_id", users[i].Id).One(&t)
		users[i].UserInfo = &t
	}
	if err != nil {
		c.Abort500(err)
	}
	c.JSONOkData(int(num), users)
}

// @router /LS/ranking [get]
func (c *AdminController) Ranking() {
	o := orm.NewOrm()
	var answerRankings []common.AnswerRanking
	qb, _ := orm.NewQueryBuilder("mysql")
	qb.Select("count(1) as total, count(if(correction = '1', 1, null)) as correct, count(if(correction='1',1,null))/count(1)as accuracy,user_info.name").From("question_answer_record").LeftJoin("user_info").On("question_answer_record.user_id=user_info.user_id").GroupBy("name").OrderBy("accuracy").Asc()
	sql := qb.String()
	//num, err := o.Raw("select count(1) as total, count(if(correction = '1', 1, null)) as correct, count(if(correction='1',1,null))/count(1)as accuracy,user_info.name from question_answer_record left join user_info on question_answer_record.user_id=user_info.user_id group by name order by accuracy asc;").QueryRows(&answerRankings)
	num, err := o.Raw(sql).QueryRows(&answerRankings)
	if err != nil {
		c.Abort500(err)
	}
	c.JSONOkData(int(num), answerRankings)

}

//获取需要审核的题目
// @router /LS/getQuestionReview/:pageNum [get]
func (c *AdminController) GetQuestionReview() {
	pageNum, err := strconv.Atoi(c.Ctx.Input.Param(":pageNum"))
	if err != nil {
		c.Abort500(err)
	}
	o := orm.NewOrm()
	questions := make([]models.Question, 0)
	reviewQuestions := make([]common.ReviewQuestion, 0)
	total, err := o.QueryTable("question").Filter("review", 0).Count()
	if err != nil {
		c.Abort500(err)
	}
	var pages int
	if total%7 > 0 {
		pages = int(total)/7 + 1
	} else {
		pages = int(total) / 7
	}
	_, err = o.QueryTable("question").Filter("review", 0).Limit(7, (pageNum-1)*5).All(&questions)
	if err != nil {
		c.Abort500(err)
	}
	res := make(orm.Params)
	_, err = o.Raw("select id,name from basic_common").RowsToMap(&res, "id", "name")
	if err != nil {
		c.Abort500(err)
	}
	author := make(orm.Params)
	_, err = o.Raw("select user.id,user_info.name from user left join user_info on user.id=user_info.user_id").RowsToMap(&author, "id", "name")
	if err != nil {
		c.Abort500(err)
	}
	for i := 0; i < len(questions); i++ {
		var records []models.QuestionReviewRecord
		num, err := o.QueryTable("question_review_record").Filter("question_id", questions[i].Id).All(&records)
		if err != nil {
			c.Abort500(err)
		} else {
			logs.Info("获取成功", num, "条")
		}

		var reviewers []string
		if len(records) > 0 {
			for j := 0; j < len(records); j++ {
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

		var creater string

		if questions[i].User.Id == 0 {
			creater = "管理员"
		} else {
			creater = author[strconv.Itoa(questions[i].User.Id)].(string)
		}

		reviewQuestion := common.ReviewQuestion{
			Id:           questions[i].Id,
			Content:      questions[i].Content,
			QuestionType: questionType,
			QuestionRole: res[strconv.Itoa(questions[i].BasicCommon.Id)].(string),
			Addition:     choices,
			Answer:       questions[i].Answer,
			ViewNum:      questions[i].Review,
			Reviewers:    reviewers,
			Creater:      creater,
			CreateTime:   questions[i].Created,
			UpdateTime:   questions[i].Updated,
		}
		reviewQuestions = append(reviewQuestions, reviewQuestion)
	}
	c.JSONOkData(pages, reviewQuestions)
}

//题目审核通过
// @router /LS/passQuestionReview/:id [get]
func (c *AdminController) PassQuestionReview() {
	id, err := strconv.Atoi(c.Ctx.Input.Param(":id"))
	if err != nil {
		c.Abort500(err)
	}
	newRecord := models.QuestionReviewRecord{
		User: &models.User{
			Id: 0,
		},
		Question: &models.Question{
			Id: id,
		},
	}
	o := orm.NewOrm()
	var question models.Question
	o.QueryTable("question").Filter("id", id).One(&question)
	question.Review = question.Review + 1
	if err := o.Begin(); err != nil {
		c.Abort500(err)
	}
	num, err := o.Update(&question, "review")
	if err != nil {
		o.Rollback()
		c.Abort500(err)
	} else {
		if err := o.Commit(); err != nil {
			c.Abort500(err)
		}
		logs.Info("更了", num, "条")
	}
	if err := o.Begin(); err != nil {
		c.Abort500(err)
	}
	num, err = o.Insert(&newRecord)
	if err != nil {
		o.Rollback()
		c.Abort500(err)
	} else {
		if err := o.Commit(); err != nil {
			c.Abort500(err)
		}
		logs.Info("成功插入", num)
	}
	c.JSONOk("审核通过")
}

//重置用户密码
// @router /LS/resetPassword/:id [get]
func (c *AdminController) ResetPassword() {
	id, err := strconv.Atoi(c.Ctx.Input.Param(":id"))
	if err != nil {
		c.Abort500(err)
	}
	user := models.User{
		Id: id,
	}
	o := orm.NewOrm()
	err = o.Read(&user)
	if err != nil {
		c.Abort500(err)
	}
	logs.Debug(user)
	user.Password = fmt.Sprintf("%x",common.MD5Password(user.UserName))
	err = o.Begin()
	if err != nil {
		c.Abort500(err)
	}
	_, err = o.Update(&user, "password")
	if err != nil {
		o.Rollback()
	} else {
		if err := o.Commit(); err != nil {
			c.Abort500(err)
		}
	}
	c.JSONOk("重置成功")
}
