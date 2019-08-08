var editor;

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
        editorCheck();
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
    $('#basicAdd').on('hidden.bs.modal', function (e) {
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
    //基础知识内容添加
    $("#contentAdd").on("click", function () {
        let typeSelect = $("#typeSelect").val();
        let contentSelect = $("#contentSelect").val();
        let basicPublishContent = $("#basicPublishContent").val();
        $.post(
            "/admin/publishContent/" + contentSelect,
            {
                typeId: typeSelect,
                content: basicPublishContent,
            },
            function (data, status) {
                chooseContentShow(document.getElementById("basic-content"), data);
            });
    });

    //修改基础知识内容
    $("#contentChange").on("click", function () {
        let modalBody = $("#basicContentChange").find(".modal-body");
        let id = $(modalBody).find("#typeSelect").data("id");
        let content1 = {};
        let content2 = {};
        let content3 = {};
        let content4 = {};
        let content5 = {};
        let textAreas = $(modalBody).find("textarea[id^=basicPublishContent]");
        for (let i = 0; i < textAreas.length; i++) {
            let key = $(textAreas[i]).attr("id").substr($(textAreas[i]).attr("id").length - 1, 1)
            if (/^basicPublishContent1.*$/.test($(textAreas[i]).attr("id"))) {
                content1[key] = $(textAreas[i]).val();
            } else if (/^basicPublishContent2.*$/.test($(textAreas[i]).attr("id"))) {
                content2[key] = $(textAreas[i]).val();
            } else if (/^basicPublishContent3.*$/.test($(textAreas[i]).attr("id"))) {
                content3[key] = $(textAreas[i]).val();
            } else if (/^basicPublishContent4.*$/.test($(textAreas[i]).attr("id"))) {
                content4[key] = $(textAreas[i]).val();
            } else if (/^basicPublishContent5.*$/.test($(textAreas[i]).attr("id"))) {
                content5[key] = $(textAreas[i]).val();
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


});

//准备生成富文本编辑器
function editorCheck() {
    let knowFlag = false;
    var editorCheck = setInterval(() => {
        if (editor !== undefined && editor !== null && !knowFlag) {
            editor.model.document.on("change:data", () => {
                $("#showBlank").html(editor.getData());
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, "showBlank"]);
            });
            knowFlag = true
        }
        if (knowFlag) {
            clearInterval(editorCheck);
        }
    }, 1000);
}

//返回上传界面
function backToUp() {
    $("#chooseUp").removeClass("hidden");
    $("#blankUp").addClass("hidden");
    $("#mulChoiceUp").addClass("hidden");
    $("#solveUp").addClass("hidden");
    if(typeof($("#showBlank").attr("data-content"))!=="undefined"){
        $("#showBlank").removeAttr("data-content");
    }
    $("#showBlank").html("暂无内容");

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
                knowledgeContent += `<span>` + content[j].KnowledgeImportant[know].Content + `</span><br>`;
            }
            for (let know = 0; know < content[j].Formula.length; know++) {
                formulaContent += `<span>` + content[j].Formula[know].Content + `</span><br>`;
            }
            for (let know = 0; know < content[j].ExaminationCenter.length; know++) {
                testContent += `<span>` + content[j].ExaminationCenter[know].Content + `</span><br>`;
            }
            for (let know = 0; know < content[j].HDifficulty.length; know++) {
                hdContent += `<span>` + content[j].HDifficulty[know].Content + `</span><br>`;
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
                                <a class="btn btn-success" data-toggle="modal" data-target="#basicContentChange" data-value="` + content[j].Id + `" id="basicCC-btn">修改</a>
                            </td>
                        </tr>`);
            $('a[data-toggle="modal"]').on('click', function (e) {
                let id = $(e.target).attr("data-value");
                let changeModal = $("#basicContentChange");
                showChangeBasicContent(id, changeModal);
            });
        }
    }
}

//提交富文本编辑器内容
function backToLast() {
    const data = editor.getData();
    editor.destroy().catch(error => {
        console.log(error);
    });
    editor = null;
    $("#showBlank").attr("onclick", "showEditor(this);");
    $("#showBlank").attr("data-content", data);
    $($("#backGroup").children("div")[0]).removeClass("hidden");
    $($("#backGroup").children("div")[1]).addClass("hidden");

    editorCheck();
}

//显示富文本编辑器
async function showEditor(obj) {
    $(obj).removeAttr("onclick");
    await ClassicEditor.create(document.querySelector('#editor'), {
        toolbar: ["Heading", "|", "ImageUpload", "BlockQuote", "Bold", "Italic"],
        language: 'zh-cn'
    }).then(newEditor => {
        editor = newEditor;

    }).catch(error => {
        console.error(error);
    });
    if (typeof ($(obj).attr("data-content")) !== "undefined") {
        editor.setData($(obj).attr("data-content"));
    } else {
        editor.setData($(obj).html());
    }

    $($("#backGroup").children("div")[0]).addClass("hidden");
    $($("#backGroup").children("div")[1]).removeClass("hidden");
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
            $(changeModal).find("#typeSelect").val(data.Title).attr("disabled", true).attr("data-id", id);
            $(changeModal).find("option[value='5']").attr("selected", true);
            $(changeModal).find("#publishArea").empty();
            $(changeModal).find("#publishArea").append(`<textarea name="" id="basicPublishContent5" cols="30" rows="10" class="form-control">` + data.Concept + `</textarea>`);
            for (let i = 0; i < data.KnowledgeImportant.length; i++) {
                $(changeModal).find("#publishArea").append(`<textarea name="" id="basicPublishContent1_` + i + `" cols="30" rows="10" class="form-control hidden">` + data.KnowledgeImportant[i].Content + `</textarea>`);
            }
            for (let i = 0; i < data.Formula.length; i++) {
                $(changeModal).find("#publishArea").append(`<textarea name="" id="basicPublishContent2_` + i + `" cols="30" rows="10" class="form-control hidden">` + data.Formula[i].Content + `</textarea>`);
            }
            for (let i = 0; i < data.ExaminationCenter.length; i++) {
                $(changeModal).find("#publishArea").append(`<textarea name="" id="basicPublishContent3_` + i + `" cols="30" rows="10" class="form-control hidden">` + data.ExaminationCenter[i].Content + `</textarea>`);
            }
            for (let i = 0; i < data.HDifficulty.length; i++) {
                $(changeModal).find("#publishArea").append(`<textarea name="" id="basicPublishContent4_` + i + `" cols="30" rows="10" class="form-control hidden">` + data.HDifficulty[i].Content + `</textarea>`);
            }
            $(changeModal).find("#contentSelect").on("change", function () {
                let showId = $(this).children('option:selected').val();
                let areaChildren = $(changeModal).find("#publishArea").children();
                let checkFist = /^$/;
                if (showId === "1") {
                    checkFist = /^basicPublishContent1.*$/;
                } else if (showId === "2") {
                    checkFist = /^basicPublishContent2.*$/;
                } else if (showId === "3") {
                    checkFist = /^basicPublishContent3.*$/;
                } else if (showId === "4") {
                    checkFist = /^basicPublishContent4.*$/;
                } else if (showId === "5") {
                    checkFist = /^basicPublishContent5.*$/;
                }

                for (let i = 0; i < areaChildren.length; i++) {
                    if (checkFist.test($(areaChildren[i]).attr('id'))) {
                        $(areaChildren[i]).removeAttr("class", "hidden");
                    } else {
                        $(areaChildren[i]).addClass("hidden");
                    }

                }
            })
        },
        "json",
    );

}