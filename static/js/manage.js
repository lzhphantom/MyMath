var editor;
var showContentName;

$(function () {
    let chooseType = document.getElementById("chooseType");
    let chooseContent = document.getElementById("chooseContent");
    let choose = document.getElementById("choose");
    let basicType = document.getElementById("basic-type");
    let basicContent = document.getElementById("basic-content");
    //显示基础知识大纲版块
    $(chooseType).on("click", function () {
        $.get("/admin/basicCommon", function (data, status) {
            basicCommon(data, basicType)
        });

        choose.className = "hidden";
        basicType.className = "";
    });
    //显示基础知识内容版块
    $(chooseContent).on("click", function () {
        $.get("/admin/basicContent/-1", function (data, status) {
            chooseContentShow(basicContent, data);
        });
        choose.className = "hidden";
        basicContent.className = "";
    });

    $("#blankType").on("click", function () {
        $("#chooseUp").addClass("hidden");
        $("#blankUp").removeClass("hidden");
    });

    $("#mulChoiceType").on("click", function () {
        $("#chooseUp").addClass("hidden");
        $("#mulChoiceUp").removeClass("hidden");
    });
    $("#solveType").on("click", function () {
        $("#chooseUp").addClass("hidden");
        $("#solveUp").removeClass("hidden");
    });


    //基础知识大纲添加
    let basicTypeAdd = document.getElementById("basicTypeAdd");
    $(basicTypeAdd).on("click", function () {
        let newType = $(document.getElementById("newBasicType")).val();
        let cop = $('input[name="cop"]').val();
        let Data = {
            typeName: newType,
        };
        if (cop === "2") {
            Data["ti"] = $('input[name="ti"]').val();
        }
        $.post(
            "/admin/basicType/" + cop,
            Data,
            function (data, status) {
                basicCommon(data, document.getElementById("basic-type"));
            });
        $(document.getElementById("newBasicType")).val('');
        $("#btnClose").click();
        $('#basicAdd').modal('hide');
    });
    //修改添加模板
    $('#basicAdd').on('hide.bs.modal', function (e) {
        $("#myModalLabel").text('添加基础知识大纲');
        $("#basicTypeAdd").text('添加');
        $('input[name="cop"]').val('1');
        $("#newBasicType").val('');
        $('input[name="ti"]').remove();
    });
    //基础知识内容添加版块，添加种类搜索
    $("#basicContentAdd").on("show.bs.modal", function () {
        $.get("/admin/basicCommon", function (data, status) {
            let $typeSelect = "#typeSelect";
            $($typeSelect).empty().append(`<option value="0">==请选择==</option>`);
            let content = ``;
            for (let i = 0; i < data.length; i++) {
                content += `<option value="` + data[i].Id + `">` + data[i].Name + `</option>`
            }
            $($typeSelect).append(content);
        })
    });
    $("#basicContentAdd").on("hide.bs.modal", function (e) {
        if (typeof (editor) !== "undefined" && editor != null) {
            alert("正在编辑中...");
            e.preventDefault();
            return;
        }
    });
    $("#basicContentChange").on('hide.bs.modal',(e)=>{
        if (typeof (editor) !== "undefined" && editor != null) {
            alert("正在编辑中...");
            e.preventDefault();
            return;
        }
    });
    //基础知识内容添加
    $("#contentAdd").on("click", function () {
        let typeSelect = $("#typeSelect").val();
        if (typeSelect === "0") {
            alert("请选择类型")
            return
        }
        let contentSelect = $("#contentSelect").val();
        if (contentSelect === "0") {
            alert("请选择版块")
            return
        }
        if ($("#showBasicPublishContent").attr("data-content") === undefined) {
            alert("请填充内容")
            return
        }
        let basicPublishContent = $("#showBasicPublishContent").attr("data-content");
        if (basicPublishContent.length === 0) {
            alert("请填充内容")
            return
        }

        $.post(
            "/admin/publishContent/" + contentSelect,
            {
                typeId: typeSelect,
                content: basicPublishContent,
            },
            function (data, status, xhr) {
                if (xhr.status === 200) {
                    chooseContentShow(document.getElementById("basic-content"), data);
                }
            });
    });

    //修改基础知识内容
    $("#contentChange").on("click", function (e) {
        if (typeof (editor) !== "undefined" && editor != null) {
            alert("正在编辑中...");
            e.preventDefault();
            return;
        }
        let modalBody = $("#basicContentChange").find(".modal-body");
        let id = $(modalBody).find("#typeSelectChange").data("id");
        let content1 = {};
        let content2 = {};
        let content3 = {};
        let content4 = {};
        let content5 = {};
        let textAreas = $(modalBody).find("a[id^=basicPublishContent]");
        for (let i = 0; i < textAreas.length; i++) {
            let key = $(textAreas[i]).attr("id").substr($(textAreas[i]).attr("id").length - 1, 1)
            if (/^basicPublishContent1.*$/.test($(textAreas[i]).attr("id"))) {
                content1[key] = $(textAreas[i]).attr("data-content");
            } else if (/^basicPublishContent2.*$/.test($(textAreas[i]).attr("id"))) {
                content2[key] = $(textAreas[i]).attr("data-content");
            } else if (/^basicPublishContent3.*$/.test($(textAreas[i]).attr("id"))) {
                content3[key] = $(textAreas[i]).attr("data-content");
            } else if (/^basicPublishContent4.*$/.test($(textAreas[i]).attr("id"))) {
                content4[key] = $(textAreas[i]).attr("data-content");
            } else if (/^basicPublishContent5.*$/.test($(textAreas[i]).attr("id"))) {
                content5[key] = $(textAreas[i]).attr("data-content");
            }
        }
        $.post(
            "/admin/changeContent",
            {
                id: id,
                content1: JSON.stringify(content1),
                content2: JSON.stringify(content2),
                content3: JSON.stringify(content3),
                content4: JSON.stringify(content4),
                content5: JSON.stringify(content5),
            },
            function (data, status) {
                chooseContentShow(document.getElementById("basic-content"), data);
                $("#basicContentChange").modal('hide');
            },
            "json"
        );
    });

    $("#blankUpBtn").on("click", () => {
        let blank = $("#showBlank");
        if (typeof ($(blank).attr("data-content")) === "undefined") {
            alert("无可上传的内容");
        } else {
            let content = $(blank).attr("data-content");
            if (content.length > 0) {
                let db = {
                    content: content,
                }
                let ans = $("#showAnswerBlank");
                if (typeof ($(ans).attr("data-content")) !== "undefined") {
                    db.answer = $(ans).attr("data-content");
                }
                $.post(
                    "/admin/uploadQuestion",
                    {
                        data: JSON.stringify(db),
                        role: 2,
                    },
                    (data, status) => {
                        if (status === "success") {
                            backToUp("#showBlank")
                        }
                    }
                );
            } else {
                alert("无可上传的内容")
            }
        }
    });
    $("#solveUpBtn").on("click", () => {
        let blank = $("#showSolve");
        if (typeof ($(blank).attr("data-content")) === "undefined") {
            alert("无可上传的内容");
        } else {
            let content = $(blank).attr("data-content");
            let db = {
                content: content,
            };
            let ans = $("#showAnswerSolve");
            if (typeof ($(ans).attr("data-content")) !== "undefined") {
                db.answer = $(ans).attr("data-content");
            }
            if (content.length > 0) {
                $.post(
                    "/admin/uploadQuestion",
                    {
                        data: JSON.stringify(db),
                        role: 3,
                    },
                    (data, status) => {
                        if (status === "success") {
                            backToUp("#showSolve")
                        }
                    }
                );
            } else {
                alert("无可上传的内容")
            }
        }
    });

    $("#mulChoiceUpBtn").on("click", () => {
        let allSelect = $("#mulChoiceUp").find("a[id^=showSelect]");
        let select;
        let choice = "";
        let choiceNum = 0;
        for (let i = 0; i < allSelect.length; i++) {
            if ($(allSelect[i]).attr("id") === "showSelectContent") {
                select = $(allSelect[i]);
            } else {
                if (typeof ($(allSelect[i]).attr("data-content")) !== "undefined") {
                    choice += $(allSelect[i]).attr("data-content") + "~￥";
                    choiceNum++;
                }
            }
        }
        if (typeof ($(select).attr("data-content")) === "undefined") {
            alert("无可上传的内容");
        } else if (choice.length <= 0) {
            alert("请填写选择选项");
        } else if (choiceNum <= 3) {
            alert("选择数量不足")
        } else {
            let content = $(select).attr("data-content");
            let ans = $("#showAnswerSelect").val();
            if (content.length > 0) {
                $.post(
                    "/admin/uploadQuestion",
                    {
                        data: JSON.stringify({
                            content: content,
                            choices: choice,
                            answer: ans,
                        }),
                        role: 1,
                    },
                    (data, status) => {
                        if (status === "success") {
                            backToUp("#showSelectContent")
                        }
                    }
                );
            } else {
                alert("无可上传的内容")
            }
        }
    });

})
;

//准备生成富文本编辑器
function editorCheck(show) {
    let knowFlag = false;
    var editorCheck = setInterval(() => {
        if (editor !== undefined && editor !== null && !knowFlag) {
            editor.model.document.on("change:data", () => {
                let data = editor.getData();
                let content = regularEditorContent(data);
                if (content.length > 0) {
                    $(show).html(content);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, show.substring(1)]);
                } else {
                    $(show).html(data);
                }
            });
            knowFlag = true
        }
        if (knowFlag) {
            clearInterval(editorCheck);
        }
    }, 100);
}

//返回上传界面
function backToUp(obj) {
    $("#chooseUp").removeClass("hidden");
    $("#blankUp").addClass("hidden");
    $("#mulChoiceUp").addClass("hidden");
    $("#solveUp").addClass("hidden");
    let isSelect = $(obj).closest("#mulChoiceUp");
    if (isSelect.length > 0) {
        let selectAll = $(isSelect[0]).find("a[id^=showSelect]");
        for (let i = 0; i < selectAll.length; i++) {
            if (typeof ($(selectAll[i]).attr("data-content")) !== "undefined") {
                $(selectAll[i]).removeAttr("data-content")
            }
            $(selectAll[i]).html("暂无内容");
        }
        $("#showAnswerSelect").empty().append(`<option value="-">==暂无答案==</option>`)
    } else {
        let allShow = $(obj).closest("form").find("a[id^=show]");
        for (let i = 0; i < allShow.length; i++) {
            if (typeof ($(allShow[i]).attr("data-content")) !== "undefined") {
                $(allShow[i]).removeAttr("data-content");
            }
            $(allShow[i]).html("暂无内容");
        }

    }


}

//返回基础知识选择界面
function backToBasic() {
    document.getElementById("choose").className = "";
    document.getElementById("basic-type").className = "hidden";
    document.getElementById("basic-content").className = "hidden";
}

//基础知识内容刷新--通用
function chooseContentShow(basicContent, data) {
    let tbody = basicContent.getElementsByTagName("tbody");
    $(tbody).empty();
    for (let i = 0; i < data.length; i++) {
        let content = data[i].BasicContent;
        for (let j = 0; j < content.length; j++) {
            let delContent = "delBasicContent(" + content[j].Id + ")";
            let knowledgeContent = ``;
            let formulaContent = ``;
            let testContent = ``;
            let hdContent = ``;
            //知识点精讲部分
            for (let know = 0; know < content[j].KnowledgeImportant.length; know++) {
                knowledgeContent += `` + content[j].KnowledgeImportant[know].Content;
            }
            for (let know = 0; know < content[j].Formula.length; know++) {
                formulaContent += `` + content[j].Formula[know].Content;
            }
            for (let know = 0; know < content[j].ExaminationCenter.length; know++) {
                testContent += `` + content[j].ExaminationCenter[know].Content;
            }
            for (let know = 0; know < content[j].HDifficulty.length; know++) {
                hdContent += `` + content[j].HDifficulty[know].Content;
            }
            $(tbody).append(` <tr>
                            <td>` + content[j].Id + `</td>
                            <td>` + data[i].Name + `</td>
                            <td>` + content[j].Title + `</td>
                            <td>` + content[j].Concept + `</td>
                            <td>` + knowledgeContent + `</td>
                            <td>` + formulaContent + `</td>
                            <td>` + testContent + `</td>
                            <td>` + hdContent + `</td>
                            <td>
                                <a href="#" class="btn btn-danger" onclick="` + delContent + `">删除</a>
                                
                            </td>
                            <td>
                                <a class="btn btn-success" data-toggle="modal" data-target="#basicContentChange" data-value="` + content[j].Id + `" id="basicCC-btn">修改</a>
                            </td>
                        </tr>`);

        }
    }
    $('a[data-toggle="modal"]').on('click', function (e) {
        let id = $(e.target).attr("data-value");
        let changeModal = $("#basicContentChange");
        showChangeBasicContent(id, changeModal);
    });
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "basic-content"]);
}

//提交富文本编辑器内容
function backToLast(backGroup, editorName) {
    const data = regularEditorContent(editor.getData());
    editor.model.document.off("change:data");
    editor.destroy().catch(error => {
        console.log(error);
    });
    editor = null;
    $(showContentName).attr("onclick", "showEditor(this" + ",'" + editorName + "','" + backGroup + "');");
    if (data.length <= 0) {
        $(showContentName).html("暂无内容")
    } else {
        $(showContentName).attr("data-content", data);
    }
    //选择题答案添加
    if (showContentName === "#showSelectA" || showContentName === "#showSelectB"
        || showContentName === "#showSelectC" || showContentName === "#showSelectD") {
        let selectA = $("#showSelectA");
        let selectB = $("#showSelectB");
        let selectC = $("#showSelectC");
        let selectD = $("#showSelectD");
        $("#showAnswerSelect").empty();
        if (typeof ($(selectA).attr("data-content")) !== "undefined") {
            let content = $(selectA).attr("data-content");
            if (content.length > 0) {
                $("#showAnswerSelect").append(`<option value="` + content + `">A</option>`)
            }
        }
        if (typeof ($(selectB).attr("data-content")) !== "undefined") {
            let content = $(selectB).attr("data-content");
            if (content.length > 0) {
                $("#showAnswerSelect").append(`<option value="` + content + `">B</option>`)
            }
        }
        if (typeof ($(selectC).attr("data-content")) !== "undefined") {
            let content = $(selectC).attr("data-content");
            if (content.length > 0) {
                $("#showAnswerSelect").append(`<option value="` + content + `">C</option>`)
            }
        }
        if (typeof ($(selectD).attr("data-content")) !== "undefined") {
            let content = $(selectD).attr("data-content");
            if (content.length > 0) {
                $("#showAnswerSelect").append(`<option value="` + content + `">D</option>`)
            }

        }

    }
    $($(backGroup).children("div")[0]).removeClass("hidden");
    $($(backGroup).children("div")[1]).addClass("hidden");
}

//显示富文本编辑器
async function showEditor(obj, editorName, backGroup) {
    if (typeof (editor) !== "undefined" && editor != null) {
        alert("正在编辑中...");
        return
    }
    $(obj).removeAttr("onclick");
    await ClassicEditor.create(document.querySelector(editorName)).then(newEditor => {
        editor = newEditor;
    }).catch(error => {
        console.error(error);
    });
    if (typeof ($(obj).attr("data-content")) !== "undefined") {
        let content = $(obj).attr("data-content");
        editor.setData(unregularEditorContent(content));
    } else {
        editor.setData("");
    }
    showContentName = "#" + $(obj).attr("id");

    $($(backGroup).children("div")[0]).addClass("hidden");
    $($(backGroup).children("div")[1]).removeClass("hidden");

    editorCheck(showContentName);
}

//基础知识大纲刷新--通用
function basicCommon(data, bt) {

    let tbody = bt.getElementsByTagName("tbody");
    $(tbody).empty();
    for (let i = 0; i < data.length; i++) {
        let delContent = "delBasicType(" + data[i].Id + ")";
        let changeContent = "showChangeBasicType(" + data[i].Id + ",'" + data[i].Name + "')";
        $(tbody).append(` <tr>
                            <td>` + data[i].Id + `</td>
                            <td>` + data[i].Name + `</td>
                            <td>
                                <a href="javascript:void(0);" class="btn btn-danger" onclick="` + delContent + `">删除</a>
                                <a href="javascript:void(0);" class="btn btn-success" onclick="` + changeContent + `">修改</a>
                            </td>
                        </tr>`);
    }
}

/**
 *基础知识大纲修改模板
 */
function showChangeBasicType(id, name) {
    $("#myModalLabel").text('修改基础知识大纲');
    $("#basicTypeAdd").text('修改');
    $('input[name="cop"]').val('2');
    $("#newBasicType").val(name);
    $($("#basicAdd").children("div").children("div").children("div")[1]).append(`<input type="hidden" value="` + id + `" name="ti">`);
    $("#basicAddBtn").click();
}

/**
 *基础知识大纲删除
 */
function delBasicType(id) {
    $.post(
        "/admin/delBasicType",
        {id: id},
        function (data, status) {
            basicCommon(data, document.getElementById("basic-type"));
        }
    )
}

//基础知识内容删除
function delBasicContent(id) {
    $.post(
        "/admin/delBasicContent",
        {id: id},
        function (data, status) {
            chooseContentShow(document.getElementById("basic-content"), data);
        }
    );
}

var changeData;

//基础知识内容修改模板
function showChangeBasicContent(id, changeModal) {

    $.post(
        "/admin/showChangeContent",
        {id: id},
        function (data, status) {
            $(changeModal).find("#typeSelectChange").val(data.Title).attr("disabled", true).attr("data-id", id);
            $(changeModal).find("option[value='5']").attr("selected", true);
            $(changeModal).find("#publishArea").empty();
            $(changeModal).find("#publishArea").append(`<div id="basicPublishContent5"><a href="javascript:void(0);" onclick="showEditor(this,'#basicPublishContentEditor','#backBasicPublishGroup');" id="basicPublishContent5_5" data-content="` + data.Concept + `">展开...</a></div>`);
            $(changeModal).find("#publishArea").append(`<div id="basicPublishContent1" class="hidden"></div>`);
            for (let i = 0; i < data.KnowledgeImportant.length; i++) {
                $(changeModal).find("#basicPublishContent1").append(`<a href="javascript:void(0);" onclick="showEditor(this,'#basicPublishContentEditor','#backBasicPublishGroup');" id="basicPublishContent1_` + i + `" data-content="` + data.KnowledgeImportant[i].Content + `">展开...</a>`);
            }
            $(changeModal).find("#publishArea").append(`<div id="basicPublishContent2" class="hidden"></div>`);
            for (let i = 0; i < data.Formula.length; i++) {
                $(changeModal).find("#basicPublishContent2").append(`<a href="javascript:void(0);" onclick="showEditor(this,'#basicPublishContentEditor','#backBasicPublishGroup');" id="basicPublishContent2_` + i + `" data-content="`+data.Formula[i].Content+`">展开...</a>`);
            }
            $(changeModal).find("#publishArea").append(`<div id="basicPublishContent3" class="hidden"></div>`);
            for (let i = 0; i < data.ExaminationCenter.length; i++) {
                $(changeModal).find("#basicPublishContent3").append(`<a href="javascript:void(0);" onclick="showEditor(this,'#basicPublishContentEditor','#backBasicPublishGroup');" id="basicPublishContent3_` + i + `" data-content="` + data.ExaminationCenter[i].Content + `">展开...</a>`);
            }
            $(changeModal).find("#publishArea").append(`<div id="basicPublishContent4" class="hidden"></div>`);
            for (let i = 0; i < data.HDifficulty.length; i++) {
                $(changeModal).find("#basicPublishContent4").append(`<a href="javascript:void(0);" onclick="showEditor(this,'#basicPublishContentEditor','#backBasicPublishGroup');" id="basicPublishContent4_` + i + `" data-content="` + data.HDifficulty[i].Content + `">展开...</a>`);
            }
            $(changeModal).find("#publishArea").append(`<div>
                                                                            <textarea name="content" id="basicPublishContentEditor" class="hidden"></textarea>
                                                                        </div>
                                                                        <div class="row" id="backBasicPublishGroup">
                                                                            <div class="col-md-3 col-md-offset-9">
                                                                            </div>
                                                                            <div class="col-md-3 col-md-offset-9 hidden">
                                                                                <a class="btn btn-primary btn-lg" onclick="backToLast('#backBasicPublishGroup','#basicPublishContentEditor');">确认</a>
                                                                            </div>
                                                                        </div>`);
            $(changeModal).find("#contentSelect").on("change", function () {
                if (typeof (editor) !== "undefined" && editor != null) {
                    alert("正在编辑中...");
                    return
                }
                let showId = $(this).children('option:selected').val();
                if(showId==="1"){
                    $("#basicPublishContent1").removeClass("hidden");
                    $("#basicPublishContent2").addClass("hidden");
                    $("#basicPublishContent3").addClass("hidden");
                    $("#basicPublishContent4").addClass("hidden");
                    $("#basicPublishContent5").addClass("hidden");
                }else if(showId==="2"){
                    $("#basicPublishContent1").addClass("hidden");
                    $("#basicPublishContent2").removeClass("hidden");
                    $("#basicPublishContent3").addClass("hidden");
                    $("#basicPublishContent4").addClass("hidden");
                    $("#basicPublishContent5").addClass("hidden");
                }else if(showId==="3"){
                    $("#basicPublishContent1").addClass("hidden");
                    $("#basicPublishContent2").addClass("hidden");
                    $("#basicPublishContent3").removeClass("hidden");
                    $("#basicPublishContent4").addClass("hidden");
                    $("#basicPublishContent5").addClass("hidden");
                }else if(showId==="4"){
                    $("#basicPublishContent1").addClass("hidden");
                    $("#basicPublishContent2").addClass("hidden");
                    $("#basicPublishContent3").addClass("hidden");
                    $("#basicPublishContent4").removeClass("hidden");
                    $("#basicPublishContent5").addClass("hidden");
                }else if(showId==="5"){
                    $("#basicPublishContent1").addClass("hidden");
                    $("#basicPublishContent2").addClass("hidden");
                    $("#basicPublishContent3").addClass("hidden");
                    $("#basicPublishContent4").addClass("hidden");
                    $("#basicPublishContent5").removeClass("hidden");
                }
            })
        },
        "json",
    );

}

function regularEditorContent(data) {
    let arr = data.split(/<p>|<\/p>/);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
            arr.splice(i, 1);
            i--;
        }
    }
    let content = ``;
    for (let i = 0; i < arr.length; i++) {
        content += `<p>\\(` + arr[i] + `\\)</p>`;
    }
    return content
}

function unregularEditorContent(data) {
    let arr = data.split(/\\\(|\\\)/);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
            arr.splice(i, 1);
            i--;
        }
    }
    let content = "";
    for (let i = 0; i < arr.length; i++) {
        content += arr[i];
    }
    return content
}