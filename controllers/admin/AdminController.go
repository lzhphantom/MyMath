package admin

import (
	"crypto/md5"
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lzhphantom/MyMath/common"
	"github.com/lzhphantom/MyMath/models"
	"math/rand"
	"reflect"
	"strconv"
	"strings"
	"time"
)

type AdminController struct {
	beego.Controller
}

// @router /admin [get]
func (c *AdminController) Manager() {
	c.TplName = "admin/manage.html"
}

// 检索基础知识种类
// @router /admin/basicCommon [get]
func (c *AdminController) BasicCommon() {
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

//添加、修改基础知识种类
// @router /admin/basicType/:cop [post]
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
		id, err := o.Insert(&basicCommon)
		if err != nil {
			logs.Debug("新分类名添加失败")
		} else {
			logs.Debug("新分类名添加成功:", id)
		}
	} else {
		id, err := c.GetInt("ti")
		if err != nil {
			logs.Debug("获取ti失败")
		}
		basicCommon.Id = id
		if num, err := o.Update(&basicCommon); err != nil {
			logs.Debug("更新失败")
		} else {
			logs.Debug("更新成功，影响", num)
		}
	}

	c.Redirect("/admin/basicCommon", 302)
}

//删除基础知识种类
// @router /admin/delBasicType [post]
func (c *AdminController) DelBasicCommon() {
	typeId, err := c.GetInt("id")
	if err != nil {
		logs.Debug("id获取失败")
	}
	o := orm.NewOrm()
	if num, err := o.Delete(&models.BasicCommon{Id: typeId}); err != nil {
		logs.Debug("删除失败")
	} else {
		logs.Debug("删除编号为：", num)
	}
	c.Redirect("/admin/basicCommon", 302)
}

//基础知识详情
// @router /admin/basicContent/:id [get]
func (c *AdminController) BasicContent() {
	id := c.Ctx.Input.Param(":id")
	logs.Debug("获取", id, reflect.TypeOf(id))
	o := orm.NewOrm()
	if id == "-1" {
		var basicContents []*models.BasicCommon
		_, err := o.QueryTable("basic_common").All(&basicContents)
		for _, common := range basicContents {
			_, err := o.QueryTable("basic_content").Filter("basic_common_id", (*common).Id).RelatedSel().All(&common.BasicContent)
			if err != nil {
				logs.Debug("BasicContent 获取失败")
			}
			for _, value := range common.BasicContent {
				_, err := o.QueryTable("formula").Filter("basic_content_id", (*value).Id).All(&value.Formula)
				_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", (*value).Id).All(&value.KnowledgeImportant)
				_, err = o.QueryTable("examination_center").Filter("basic_content_id", (*value).Id).All(&value.ExaminationCenter)
				_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", (*value).Id).All(&value.HDifficulty)
				if err != nil {
					logs.Debug("BasicContent 其他信息获取失败")
				}
			}
		}
		if err != nil {
			logs.Debug("基础知识详情获取失败1")
		}
		c.Data["json"] = basicContents
		c.ServeJSON()
	} else {
		Id, err := strconv.Atoi(id)
		if err != nil {
			logs.Debug("id转换int失败")
		}
		basicContent := models.BasicCommon{Id: Id}

		err = o.Read(&basicContent)

		_, err = o.QueryTable("basic_content").Filter("basic_common_id", basicContent.Id).RelatedSel().All(&basicContent.BasicContent)
		if err != nil {
			logs.Debug("BasicContent 获取失败")
		}
		for _, value := range basicContent.BasicContent {
			_, err := o.QueryTable("formula").Filter("basic_content_id", (*value).Id).All(&value.Formula)
			_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", (*value).Id).All(&value.KnowledgeImportant)
			_, err = o.QueryTable("examination_center").Filter("basic_content_id", (*value).Id).All(&value.ExaminationCenter)
			_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", (*value).Id).All(&value.HDifficulty)
			if err != nil {
				logs.Debug("BasicContent 其他信息获取失败")
			}
		}

		if err != nil {
			logs.Debug("基础知识详情获取失败1")
		}
		c.Data["json"] = basicContent
		c.ServeJSON()
	}
}

//添加版块内容
// @router /admin/publishContent/:area [post]
func (c *AdminController) AddPublishContent() {
	area := c.Ctx.Input.Param(":area")
	var err error
	id, err := c.GetInt("typeId")
	if err != nil {
		logs.Debug("添加版块内容->获取id失败")
	}
	content := c.GetString("content")
	o := orm.NewOrm()
	var okId int64

	basicContent := models.BasicContent{}
	basicCommon := models.BasicCommon{
		Id: id,
	}
	err = o.Read(&basicCommon)
	err = o.QueryTable("basic_content").Filter("basic_common_id", id).RelatedSel().One(&basicContent)
	if basicContent.BasicCommon == nil {
		logs.Info("无记录")
		basicContent.Title = basicCommon.Name
		if area == "5" {
			basicContent.Concept = content
		}
		basicContent.BasicCommon = &basicCommon
		okId, err = o.Insert(&basicContent)
		if err != nil {
			logs.Debug("插入失败", err)
		} else {
			logs.Debug("插入成功", okId)
		}
	} else {
		if area == "5" {
			basicContent.Concept = content
			if _, err := o.Update(&basicContent); err == nil {
				logs.Debug("Concept添加成功")
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
		okId, err = o.Insert(&know)
	} else if area == "2" { //相关公式
		formula := models.Formula{
			Content: content,
			BasicContent: &models.BasicContent{
				Id: int(okId),
			},
		}
		okId, err = o.Insert(&formula)
	} else if area == "3" { //考点
		testCenter := models.ExaminationCenter{
			Content: content,
			BasicContent: &models.BasicContent{
				Id: int(okId),
			},
		}
		okId, err = o.Insert(&testCenter)
	} else if area == "4" { //重难点
		hd := models.HDifficulty{
			Content: content,
			BasicContent: &models.BasicContent{
				Id: int(okId),
			},
		}
		okId, err = o.Insert(&hd)
	}
	if err != nil {
		logs.Debug("插入失败", err)
	} else {
		logs.Debug("插入成功", okId)
	}
	c.Redirect("/admin/basicContent/-1", 302)
}

//删除内容
// @router /admin/delBasicContent [post]
func (c *AdminController) DelBasicContent() {
	id, err := c.GetInt("id")
	if err != nil {
		logs.Debug("获取Id失败")
	}
	o := orm.NewOrm()
	delNum, err := o.QueryTable("examination_center").Filter("basic_content_id", id).Delete()
	if err != nil {
		logs.Debug("examination_center表删除数据失败")
	} else {
		logs.Debug("examination_center删除", delNum, "条数据")
	}
	delNum, err = o.QueryTable("formula").Filter("basic_content_id", id).Delete()
	if err != nil {
		logs.Debug("formula表删除数据失败")
	} else {
		logs.Debug("formula删除", delNum, "条数据")
	}
	delNum, err = o.QueryTable("h_difficulty").Filter("basic_content_id", id).Delete()
	if err != nil {
		logs.Debug("h_difficulty表删除数据失败")
	} else {
		logs.Debug("h_difficulty删除", delNum, "条数据")
	}
	delNum, err = o.QueryTable("knowledge_important").Filter("basic_content_id", id).Delete()
	if err != nil {
		logs.Debug("knowledge_important表删除数据失败")
	} else {
		logs.Debug("knowledge_important删除", delNum, "条数据")
	}
	delNum, err = o.QueryTable("basic_content").Filter("id", id).Delete()
	if err != nil {
		logs.Debug("basic_content表删除数据失败")
	} else {
		logs.Debug("basic_content删除", delNum, "条数据")
	}
	c.Redirect("/admin/basicContent/-1", 302)
}

//显示基础知识修改模板
// @router /admin/showChangeContent [post]
func (c *AdminController) ShowChangeContent() {
	id, err := c.GetInt("id")
	if err != nil {
		logs.Debug("获取id失败")
	}
	content := models.BasicContent{}
	o := orm.NewOrm()
	err = o.QueryTable("basic_content").Filter("id", id).RelatedSel().One(&content)
	if err != nil {
		logs.Debug("basic_content=>showChangeContent失败")
	}
	_, err = o.QueryTable("formula").Filter("basic_content_id", id).All(&content.Formula)
	_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", id).All(&content.KnowledgeImportant)
	_, err = o.QueryTable("examination_center").Filter("basic_content_id", id).All(&content.ExaminationCenter)
	_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", id).All(&content.HDifficulty)

	c.Data["json"] = content
	c.ServeJSON()
}

//修改基础知识内容
// @router /admin/changeContent [post]
func (c *AdminController) ChangeContent() {
	id, err := c.GetInt("id")
	if err != nil {
		logs.Debug("修改基础知识内容=>获取id失败")
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
	err = json.Unmarshal([]byte(content2), &content2Map)
	err = json.Unmarshal([]byte(content3), &content3Map)
	err = json.Unmarshal([]byte(content4), &content4Map)
	err = json.Unmarshal([]byte(content5), &content5Map)
	if err != nil {
		logs.Debug("content*转换失败")
	} else {
		logs.Info(content1Map, content2Map, content3Map, content4Map, content5Map)
	}

	o := orm.NewOrm()
	content := models.BasicContent{}
	err = o.QueryTable("basic_content").Filter("id", id).RelatedSel().One(&content)
	if err != nil {
		logs.Debug("basic_content=>showChangeContent失败")
	}
	_, err = o.QueryTable("formula").Filter("basic_content_id", id).All(&content.Formula)
	_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", id).All(&content.KnowledgeImportant)
	_, err = o.QueryTable("examination_center").Filter("basic_content_id", id).All(&content.ExaminationCenter)
	_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", id).All(&content.HDifficulty)

	content.Concept = content5Map["5"].(string)
	o.Update(&content)
	for key, value := range content.KnowledgeImportant {
		(*value).Content = content1Map[strconv.Itoa(key)].(string)
		o.Update(value)
	}
	for key, value := range content.HDifficulty {
		value.Content = content4Map[strconv.Itoa(key)].(string)
		o.Update(value)
	}
	for key, value := range content.Formula {
		value.Content = content2Map[strconv.Itoa(key)].(string)
		o.Update(value)
	}
	for key, value := range content.ExaminationCenter {
		value.Content = content3Map[strconv.Itoa(key)].(string)
		o.Update(value)
	}

	c.Redirect("/admin/basicContent/-1", 302)
}

//上传题
// @router /admin/uploadQuestion [post]
func (c *AdminController) UploadQuestion() {
	newQuestion := models.Question{}

	data := c.GetString("data")
	dataMap := make(map[string]interface{})
	err := json.Unmarshal([]byte(data), &dataMap)
	if err != nil {
		logs.Debug("json解析失败")
	}

	newQuestion.Content = dataMap["content"].(string)
	role, err := c.GetUint8("role")
	if err != nil {
		logs.Debug("未获取题型类型")
	}
	logs.Debug(role)
	newQuestion.RoleQuestion = uint8(role)

	if role == 1 { //如果是选择题，则录入选项
		newQuestion.Choices = dataMap["choices"].(string)
	}

	if answer, ok := dataMap["answer"].(string); ok {
		newQuestion.Answer = answer
	}
	logs.Debug(newQuestion)

	o := orm.NewOrm()
	newQuestion.BasicCommon = &models.BasicCommon{}
	_, err = o.Insert(&newQuestion)
	if err != nil {
		logs.Debug("插入失败：", err)
	}
	c.ServeJSON()

}

//添加用户
// @router /admin/userAdd [post]
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
		logs.Debug("用户表添加失败：", err)
	}

	userInfo := models.UserInfo{
		Name:    name,
		Sex:     byte(sex),
		Tel:     tel,
		Address: province + " " + city + " " + street,
		User:    &user,
	}
	_, err = o.Insert(&userInfo)
	if err != nil {
		logs.Debug("用户信息表添加失败：", err)
	}
	c.Redirect("/admin", 302)
}

//查找用户信息
// @router /admin/searchUser [post]
func (c *AdminController) SearchUser() {
	userGroup, err := c.GetInt("group")
	if err != nil {
		logs.Debug("获取用户分组失败")
	}
	users := make([]models.User, 0)
	o := orm.NewOrm()
	num, err := o.QueryTable("user").Filter("role", byte(userGroup)).All(&users)

	//range 会为每个元素生成一个副本
	for i := 0; i < len(users); i++ {
		t := models.UserInfo{}
		o.QueryTable("user_info").Filter("user_id", users[i].Id).One(&t)
		users[i].UserInfo = &t
	}
	if err != nil {
		logs.Debug("获取user表失败")
	} else {
		logs.Debug("获取了", num, "条")
	}

	c.Data["json"] = users
	c.ServeJSON()
}

//获取训练所需要的题
// @router /admin/getQuestion/:role [get]
func (c *AdminController) GetQuestion() {
	role := c.Ctx.Input.Param(":role")
	o := orm.NewOrm()
	var questions []*models.Question
	rand.Seed(time.Now().UnixNano())
	if role == "-1" {
		num, err := o.Raw("SELECT id,content FROM question WHERE role_question != ?", 1).QueryRows(&questions)
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
			end = start + 13
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
				},
				Answer: questions[i].Answer,
			}
			unSelects = append(unSelects, newUnSelect)
		}
		c.SetSession(common.KeyUnSelects, unSelects)
		c.Redirect("/getTrain/unselect/0", 302)
	} else {
		num, err := o.QueryTable("question").Filter("role_question", role).All(&questions)
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
			end = start + 13
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
				},
				Answer: questions[i].Answer,
			}
			selects = append(selects, newSelect)
		}
		c.SetSession(common.KeySelects, selects)
		c.Redirect("/getTrain/select/0", 302)
	}
}

//从缓存冲抽取题目
// @router /getTrain/:role/:num [get]
func (c *AdminController) GetTrain() {
	role := c.Ctx.Input.Param(":role")
	num, _ := strconv.Atoi(c.Ctx.Input.Param(":num"))
	if role == "select" {
		selects := c.GetSession(common.KeySelects).([]common.Select)
		data := selects[num].Train
		data.QueueNum = num
		c.Data["json"] = data
	} else if role == "unselect" {
		unSelects := c.GetSession(common.KeyUnSelects).([]common.UnSelect)
		data := unSelects[num].Train
		data.QueueNum = num
		c.Data["json"] = data
	} else {
		logs.Warning("不存在这样的选择")
	}
	c.ServeJSON()
}

//随机获取一道特定范围的题
// @router /admin/getQuestionByCommonId/:id [get]
func (c *AdminController) GetQuestionByCommonId() {
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
		end = start + 13
	} else {
		start = 0
		end = len(questions)
	}
	practices := make([]interface{}, 0)
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
				},
				Answer: question.Answer,
			}
			practices = append(practices, practiceSelect)
		} else {
			practiceUnSelect := common.UnSelect{
				Train: &common.TrainingUnSelect{
					Id:      question.Id,
					Content: question.Content,
					Role:    question.RoleQuestion,
				},
				Answer: question.Answer,
			}
			practices = append(practices, practiceUnSelect)
		}
	}
	c.SetSession(common.KeyPractices, practices)
	c.Redirect("/getPractice/0", 302)
}

// @router /getPractice/:num [get]
func (c *AdminController) GetPractice() {
	num, _ := strconv.Atoi(c.Ctx.Input.Param(":num"))
	test := c.GetSession(common.KeyPractices)
	logs.Info("practice", test)
	practices := test.([]interface{})
	practice, ok := practices[num].(common.Select)
	if ok {
		practice.Train.QueueNum = num
		c.Data["json"] = practice.Train
	} else {
		practice, ok := practices[num].(common.UnSelect)
		if ok {
			practice.Train.QueueNum = num
			c.Data["json"] = practice.Train
		}
	}
	c.ServeJSON()
}
