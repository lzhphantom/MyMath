package admin

import (
	"MyMath/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"reflect"
	"strconv"
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
		beego.Debug("基础知识种类获取失败！")
	} else {
		beego.Debug("基础知识种类共获取:", num, "个")
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
		beego.Debug("没有获取到新分类名")
	}

	var basicCommon models.BasicCommon
	basicCommon.Name = typeName
	o := orm.NewOrm()
	if cop == "1" { // 1 ：添加新基础知识种类
		id, err := o.Insert(&basicCommon)
		if err != nil {
			beego.Debug("新分类名添加失败")
		} else {
			beego.Debug("新分类名添加成功:", id)
		}
	} else {
		id, err := c.GetInt("ti")
		if err != nil {
			beego.Debug("获取ti失败")
		}
		basicCommon.Id = id
		if num, err := o.Update(&basicCommon); err != nil {
			beego.Debug("更新失败")
		} else {
			beego.Debug("更新成功，影响", num)
		}
	}

	c.Redirect("/admin/basicCommon", 302)
}

//删除基础知识种类
// @router /admin/delBasicType [post]
func (c *AdminController) DelBasicCommon() {
	typeId, err := c.GetInt("id")
	if err != nil {
		beego.Debug("id获取失败")
	}
	o := orm.NewOrm()
	if num, err := o.Delete(&models.BasicCommon{Id: typeId}); err != nil {
		beego.Debug("删除失败")
	} else {
		beego.Debug("删除编号为：", num)
	}
	c.Redirect("/admin/basicCommon", 302)
}

//基础知识详情
// @router /admin/basicContent/:id [get]
func (c *AdminController) BasicContent() {
	id := c.Ctx.Input.Param(":id")
	beego.Debug("获取", id, reflect.TypeOf(id))
	o := orm.NewOrm()
	if id == "-1" {
		var basicContents []*models.BasicCommon
		_, err := o.QueryTable("basic_common").All(&basicContents)
		for _, common := range basicContents {
			_, err := o.QueryTable("basic_content").Filter("basic_common_id", (*common).Id).RelatedSel().All(&common.BasicContent)
			if err != nil {
				beego.Debug("BasicContent 获取失败")
			}
			for _, value := range common.BasicContent {
				_, err := o.QueryTable("formula").Filter("basic_content_id", (*value).Id).All(&value.Formula)
				_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", (*value).Id).All(&value.KnowledgeImportant)
				_, err = o.QueryTable("examination_center").Filter("basic_content_id", (*value).Id).All(&value.ExaminationCenter)
				_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", (*value).Id).All(&value.HDifficulty)
				if err != nil {
					beego.Debug("BasicContent 其他信息获取失败")
				}
			}
		}
		if err != nil {
			beego.Debug("基础知识详情获取失败1")
		}
		c.Data["json"] = basicContents
		c.ServeJSON()
	} else {
		Id, err := strconv.Atoi(id)
		if err != nil {
			beego.Debug("id转换int失败")
		}
		basicContent := models.BasicCommon{Id: Id}

		err = o.Read(&basicContent)

		_, err = o.QueryTable("basic_content").Filter("basic_common_id", basicContent.Id).RelatedSel().All(&basicContent.BasicContent)
		if err != nil {
			beego.Debug("BasicContent 获取失败")
		}
		for _, value := range basicContent.BasicContent {
			_, err := o.QueryTable("formula").Filter("basic_content_id", (*value).Id).All(&value.Formula)
			_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", (*value).Id).All(&value.KnowledgeImportant)
			_, err = o.QueryTable("examination_center").Filter("basic_content_id", (*value).Id).All(&value.ExaminationCenter)
			_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", (*value).Id).All(&value.HDifficulty)
			if err != nil {
				beego.Debug("BasicContent 其他信息获取失败")
			}
		}

		if err != nil {
			beego.Debug("基础知识详情获取失败1")
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
		beego.Debug("添加版块内容->获取id失败")
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
		beego.Info("无记录")
		basicContent.Title = basicCommon.Name
		if area == "5" {
			basicContent.Concept = content
		}
		basicContent.BasicCommon = &basicCommon
		okId, err = o.Insert(&basicContent)
		if err != nil {
			beego.Debug("插入失败", err)
		} else {
			beego.Debug("插入成功", okId)
		}
	} else {
		if area == "5" {
			basicContent.Concept = content
			if _, err := o.Update(&basicContent); err == nil {
				beego.Debug("Concept添加成功")
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
		beego.Debug("插入失败", err)
	} else {
		beego.Debug("插入成功", okId)
	}
	c.Redirect("/admin/basicContent/-1", 302)
}

//删除内容
// @router /admin/delBasicContent [post]
func (c *AdminController) DelBasicContent() {
	id, err := c.GetInt("id")
	if err != nil {
		beego.Debug("获取Id失败")
	}
	o := orm.NewOrm()
	delNum, err := o.QueryTable("examination_center").Filter("basic_content_id", id).Delete()
	if err != nil {
		beego.Debug("examination_center表删除数据失败")
	} else {
		beego.Debug("examination_center删除", delNum, "条数据")
	}
	delNum, err = o.QueryTable("formula").Filter("basic_content_id", id).Delete()
	if err != nil {
		beego.Debug("formula表删除数据失败")
	} else {
		beego.Debug("formula删除", delNum, "条数据")
	}
	delNum, err = o.QueryTable("h_difficulty").Filter("basic_content_id", id).Delete()
	if err != nil {
		beego.Debug("h_difficulty表删除数据失败")
	} else {
		beego.Debug("h_difficulty删除", delNum, "条数据")
	}
	delNum, err = o.QueryTable("knowledge_important").Filter("basic_content_id", id).Delete()
	if err != nil {
		beego.Debug("knowledge_important表删除数据失败")
	} else {
		beego.Debug("knowledge_important删除", delNum, "条数据")
	}
	delNum, err = o.QueryTable("basic_content").Filter("id", id).Delete()
	if err != nil {
		beego.Debug("basic_content表删除数据失败")
	} else {
		beego.Debug("basic_content删除", delNum, "条数据")
	}
	c.Redirect("/admin/basicContent/-1", 302)
}

//显示基础知识修改模板
// @router /admin/showChangeContent [post]
func (c *AdminController) ShowChangeContent() {
	id, err := c.GetInt("id")
	if err != nil {
		beego.Debug("获取id失败")
	}
	content := models.BasicContent{}
	o := orm.NewOrm()
	err = o.QueryTable("basic_content").Filter("id", id).RelatedSel().One(&content)
	if err != nil {
		beego.Debug("basic_content=>showChangeContent失败")
	}
	_, err = o.QueryTable("formula").Filter("basic_content_id", id).All(&content.Formula)
	_, err = o.QueryTable("knowledge_important").Filter("basic_content_id", id).All(&content.KnowledgeImportant)
	_, err = o.QueryTable("examination_center").Filter("basic_content_id", id).All(&content.ExaminationCenter)
	_, err = o.QueryTable("h_difficulty").Filter("basic_content_id", id).All(&content.HDifficulty)

	c.Data["json"] = content
	c.ServeJSON()
}
