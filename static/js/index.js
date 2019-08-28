
$(function () {
    let mathBasic = document.getElementById("math_basic");
    $('#collapseOne').on('show.bs.collapse', function () {
        $("#collapseTwo").collapse('hide');
        $("#collapseThree").collapse('hide');
        $("#collapse4").collapse('hide');
        $.get("/admin/basicCommon",
            function (data, status, xhr) {
                if (xhr.status === 264) {
                    notLogin();
                    setTimeout(()=>{
                        $("#collapseOne").collapse('hide');
                    },0);
                    return;
                }
                let oneUl = $('#collapseOne').children('div').children('ul');
                $(oneUl).empty();
                for (let i = 0; i < data.length; i++) {
                    if ((i + 1) % 2 === 0) {
                        $(oneUl).append(`<li role="presentation"><a href="#jihe" aria-controls="jihe" role="tab"
                                                           data-toggle="tab" data-id="` + data[i].Id + `" role-tab="basic">` + data[i].Name + `<br></a></li>`);
                    } else {
                        $(oneUl).append(`<li role="presentation"><a href="#sjhs" aria-controls="sjhs" role="tab"
                                                           data-toggle="tab" data-id="` + data[i].Id + `" role-tab="basic">` + data[i].Name + `<br></a></li>`);
                    }
                }

                $('a[role-tab="basic"]').on('hide.bs.tab', (e) => {
                    let controls = $(e.target).attr("href");
                    $(controls).empty();
                });

                $('a[role-tab="basic"]').on('shown.bs.tab', function (e) {
                    let id = $(e.target).attr("data-id");
                    if (id === undefined) {
                        return
                    }
                    let controls = $(e.target).attr("href");
                    $.get("/admin/basicContent/" + id, function (data, status) {
                        let $modal = $(controls);
                        $($modal).empty();
                        $($modal).append(`<h1 class="text-center text-muted">基础知识</h1>`);

                        $($modal).append(`<div>
                    <h2>` + data.Name + `</h2>
                </div>`);
                        //概念部分
                        if (data.BasicContent[0] !== undefined) {
                            $($modal).append(`<div>
                    <h3>1.` + data.BasicContent[0].Title + `的概念</h3>
                    <p class="text-muted well">` + data.BasicContent[0].Concept + `</p>
                </div>`);
                            //知识点精讲部分
                            if (data.BasicContent[0].KnowledgeImportant !== undefined) {
                                let content = ``;
                                let letterNumber = 97;

                                for (let i = 0; i < data.BasicContent[0].KnowledgeImportant.length; i++) {
                                    content += `<div>
                        <h4>` + String.fromCharCode(letterNumber++) + `.</h4>
                        <p class="text-muted well">` + data.BasicContent[0].KnowledgeImportant[i].Content + `</p>
                    </div>`;
                                }
                                $($modal).append(`<div>
                    <h3>2.知识点精讲</h3>
                    ` + content + `
                </div>`);
                            }
                            //公式部分
                            if (data.BasicContent[0].Formula !== undefined) {
                                let content = ``;
                                for (let i = 0; i < data.BasicContent[0].Formula.length; i++) {
                                    content += `<p class="text-muted well">` + data.BasicContent[0].Formula[i].Content + `</p>`;
                                }
                                $($modal).append(`<div>
                    <h3>3.相关公式</h3>
                    ` + content + `
                </div>`);
                            }
                            //考点部分
                            if (data.BasicContent[0].ExaminationCenter !== undefined) {
                                let content = ``;
                                for (let i = 0; i < data.BasicContent[0].ExaminationCenter.length; i++) {
                                    content += `<p class="text-muted well">` + data.BasicContent[0].ExaminationCenter[i].Content + `</p>`;
                                }
                                $($modal).append(`<div>
                    <h3 class="text-danger">4.考点</h3>
                    ` + content + `
                </div>`);
                            }
                            //重难点部分
                            if (data.BasicContent[0].HDifficulty !== undefined) {
                                let content = ``;
                                for (let i = 0; i < data.BasicContent[0].HDifficulty.length; i++) {
                                    content += `<p class="text-muted well">` + data.BasicContent[0].HDifficulty[i].Content + `</p>`;
                                }
                                $($modal).append(`<div>
                    <h3 class="text-success">5.重难点</h3>
                    ` + content + `
                </div>`);
                            }
                        } else {
                            $($modal).append(`<div>
                        <h3 class="text-center text-danger">抱歉！暂无内容！</h3>
                    </div>`);
                        }
                    })
                });
            }
        );
    });
    $("#collapseOne").on("hide.bs.collapse", () => {
        $(this).closest("ul").empty();
        $('a[role-tab="basic"]').off("hide.bs.tab shown.bs.tab");
        $("#jihe").empty();
        $("#sjhs").empty();
    });

    $('#collapseTwo').on('show.bs.collapse', () => {
        $("#collapseOne").collapse('hide');
        $("#collapseThree").collapse('hide');
        $("#collapse4").collapse('hide');
        $('a[role-tab="training"]').on('hide.bs.tab', (e) => {
            let controls = $(e.target).attr("href");
            $(controls).empty();
        });
        $('a[role-tab="training"]').on('shown.bs.tab', (e) => {
            let controls = $(e.target).attr("href");
            if (controls === "#Select") {
                getSelect(controls);
            } else if (controls === "#Blank") {
                getUnSelect(controls);
            }
        });
    });
    $("#collapseTwo").on("hide.bs.collapse", () => {
        $('a[role-tab="training"]').off("hide.bs.tab shown.bs.tab");
        $("#Select").empty();
        $("#Blank").empty();
    });

    $("#collapseThree").on("show.bs.collapse", () => {
        $("#collapseOne").collapse('hide');
        $("#collapseTwo").collapse('hide');
        $("#collapse4").collapse('hide');
        $.get("/admin/basicCommon", (data, status, xhr) => {
            if (xhr.status === 264) {
                notLogin();
                setTimeout(()=>{
                    $("#collapseThree").collapse('hide');
                },0);
                return
            }
            let threeUl = $('#collapseThree').find('ul');
            $(threeUl).empty();
            for (let i = 0; i < data.length; i++) {
                $(threeUl).append(`<li role="presentation"><a href="#SpecialPractice" aria-controls="SpecialPractice" role="tab"
                                                           data-toggle="tab" data-id="` + data[i].Id + `" role-tab="sp">` + data[i].Name + `<br></a></li>`);
            }
            // /admin/getQuestionByCommonId/:id
            $('a[role-tab="sp"]').on('hide.bs.tab', (e) => {
                let controls = $(e.target).attr("href");
                $(controls).empty();
            });
            $('a[role-tab="sp"]').on("shown.bs.tab", (e) => {
                let id = $(e.target).attr("data-id");
                let sp = $("#SpecialPractice");
                getSpecialPractice(sp, id);
            })
        });
    });

    $("#collapseThree").on("hide.bs.collapse", () => {
        $('a[role-tab="sp"]').off("hide.bs.tab shown.bs.tab");
        $("#SpecialPractice").empty();
    });

    $("#collapse4").on("show.bs.collapse", () => {
        $("#Upload").removeClass("hidden");
        $("#collapseOne").collapse('hide');
        $("#collapseThree").collapse('hide');
        $("#collapseTwo").collapse('hide');
        $('a[role-tab="upload"]').on("shown.bs.tab", (e) => {
            let target = $(e.target).attr("href");
            $(target).removeClass("hidden");
        });
        $('a[role-tab="upload"]').on("hide.bs.tab", (e) => {
            let target = $(e.target).attr("href");
            $(target).addClass("hidden");
        });
        $("#mulChoiceUpBtn").on("click", () => {
            let allSelect = $("#UploadSelect").find("a[id^=showSelect]");
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
                alert("选择数量不足");
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
                                clearSelect();
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
                                clearBlank();
                            }
                        }
                    );
                } else {
                    alert("无可上传的内容")
                }
            }
        });
    });

    $("#collapse4").on("hide.bs.collapse", () => {
        $("#Upload").addClass("hidden");
        $("#mulChoiceUpBtn").off("click");
        $("#solveUpBtn").off("click");
    })

});

function clearSelect() {
    let selectAll = $("#UploadSelect").find("a[id^=showSelect]");
    for (let i = 0; i < selectAll.length; i++) {
        if (typeof ($(selectAll[i]).attr("data-content")) !== "undefined") {
            $(selectAll[i]).removeAttr("data-content")
        }
        $(selectAll[i]).html("暂无内容");
    }
    $("#showAnswerSelect").empty().append(`<option value="-">==暂无答案==</option>`)
}

function clearBlank() {
    let allShow = $("#UploadBlank").find("a[id^=show]");
    for (let i = 0; i < allShow.length; i++) {
        if (typeof ($(allShow[i]).attr("data-content")) !== "undefined") {
            $(allShow[i]).removeAttr("data-content");
        }
        $(allShow[i]).html("暂无内容");
    }
}

var editor;

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
        editor.setData($(obj).html());
    }
    showContentName = "#" + $(obj).attr("id");

    $($(backGroup).children("div")[0]).addClass("hidden");
    $($(backGroup).children("div")[1]).removeClass("hidden");

    editorCheck(showContentName);
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

//提交富文本编辑器内容
function backToLast(backGroup, editorName) {
    const data = regularEditorContent(editor.getData());
    editor.model.document.off("change:data");
    editor.destroy().catch(error => {
        console.log(error);
    });
    editor = null;
    $(showContentName).attr("onclick", "showEditor(this" + ",'" + editorName + "','" + backGroup + "');");
    if(data.length<=0){
        $(showContentName).html("暂无内容")
    }else {
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

//获取非选择题
function getUnSelect(controls) {

    $.get("/admin/getQuestion/-1", (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(()=>{
                $("#collapseTwo").collapse('hide');
            },0);
            return
        }
        $(controls).append(`<h1 class="text-muted text-center">非选择题练习</h1>
                    <div id="progress" class="progress">
                        <div class="progress-bar progress-bar-success" style="width: 35%">
                            <span>35% </span>
                        </div>
                        <div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: 35%">
                            <span>35% </span>
                        </div>
                        <div class="progress-bar progress-bar-danger" style="width: 30%">
                            <span>30% </span>
                        </div>
                    </div>
                    <div id="blankContent">
                        
                    </div>
                    <div id="backGroup" class="row">
                        <div class="col-sm-offset-9">
                            <a class="btn btn-danger btn-lg">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextUnQuestion">下一题</a>
                        </div>
                        <div class="col-sm-offset-9 hidden">
                            <a class="btn btn-primary btn-lg" onclick="backToLast('#backGroup','#blankEditor');">确认</a>
                        </div>
                    </div>`);
        let content = $(controls).find("#blankContent");

        $(content).empty().append(`<h2 class="well">` + data.Content + `</h2>`);
        $(content).append(`<div>
                            <a href="javascript:void(0);" onclick="showEditor(this,'#blankEditor','#backGroup');"
                               id="showEditor">填写你认为正确的答案</a>
                        </div>
                        <div>
                            <textarea name="content" id="blankEditor" class="hidden"></textarea>
                        </div>`);
        $("#nextUnQuestion").on("click", (e) => {
            console.log("123");
            let parent = $(e.target).parent("div").parent("div").parent("div");
            if ($(parent).attr("id") === "Blank") {
                let userAnswer = $(parent).find('#showEditor').attr("data-content");
                if (userAnswer !== undefined && userAnswer.length > 0) {
                    $(parent).empty();
                    getUnSelect(controls)
                } else {
                    alert("请填写你的答案！");
                }
            }
        });
    });

}

//获取选择题
function getSelect(controls) {

    $.get("/admin/getQuestion/1", (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(()=>{
                $("#collapseTwo").collapse('hide');
            },0);
            return
        }
        $(controls).append(`<h1 class="text-muted text-center">选择题练习</h1>
                    <div id="progress" class="progress">
                        <div class="progress-bar progress-bar-success" style="width: 35%">
                            <span>35% </span>
                        </div>
                        <div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: 35%">
                            <span>35% </span>
                        </div>
                        <div class="progress-bar progress-bar-danger" style="width: 30%">
                            <span>30% </span>
                        </div>
                    </div>
                    <div id="selectContent">
                        
                    </div>
                    <div id="backGroup" class="row">
                        <a class="btn btn-danger btn-lg col-sm-offset-9">结束训练</a>
                        <a class="btn btn-success btn-lg" id="nextQuestion">下一题</a>
                    </div>`);
        let content = $(controls).find("#selectContent");
        let choices = ``;
        let letterNumber = 65;
        for (let i = 0; i < data.Choices.length; i++) {
            choices += `<div>
                            <label for="">
                            <input type="radio" name="choice" value="` + data.Choices[i] + `">
                                <span>` + String.fromCharCode(letterNumber++) + `.` + data.Choices[i] + `</span>
                            </label>
                        </div>`
        }
        $(content).empty().append(`<h2 class="well">` + data.Content + `</h2>`);
        $(content).append(choices);
        $(content).find("p").css("display", "inline");
        $("#nextQuestion").on("click", (e) => {
            let parent = $(e.target).parent("div").parent("div");
            if ($(parent).attr("id") === "Select") {
                let userAnswer = $(parent).find('input[name="choice"]:checked').val();
                if (userAnswer !== undefined) {
                    $(parent).empty();
                    getSelect(controls);
                } else {
                    alert("请选择你认为正确的答案！");
                }
            }
        });
    });


}

//专项练习获取题
function getSpecialPractice(sp, id) {
    $(sp).empty().append(`<h1 class="text-center text-muted">专项练习</h1>
                        <div id="progress" class="progress">
                        <div class="progress-bar progress-bar-success" style="width: 35%">
                        <span>35% </span>
                        </div>
                        <div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: 35%">
                        <span>35% </span>
                        </div>
                        <div class="progress-bar progress-bar-danger" style="width: 30%">
                        <span>30% </span>
                        </div>
                        </div>
                        <div id="SpecialPracticeContent">

                        </div>
                        <div id="backGroup" class="row">
                        </div>`);
    let content = $(sp).find("#SpecialPracticeContent");
    let backGroup = $(sp).find("#backGroup");
    let role = -1;
    $.get("/admin/getQuestionByCommonId/" + id, (data) => {
        if (data.Content === undefined) {
            $(content).empty().append(`<h2 class="text-center text-danger"> 暂无题库</h2>`);
            return
        }
        if (data.Role === 1) {
            let choices = ``;
            let letterNumber = 65;
            for (let i = 0; i < data.Choices.length; i++) {
                choices += `<div>
                            <label for="">
                            <input type="radio" name="choice" value="` + data.Choices[i] + `">
                                <span>` + String.fromCharCode(letterNumber++) + `.` + data.Choices[i] + `</span>
                            </label>
                        </div>`
            }
            $(content).empty().append(`<h2 class="text-muted well">` + data.Content + `</h2>`);
            $(content).append(choices);
            $(content).find("p").css("display", "inline");
            $(backGroup).empty().append(`<a class="btn btn-danger btn-lg col-sm-offset-9">结束训练</a>
                        <a class="btn btn-success btn-lg" id="nextSPQuestion">下一题</a>`)
            $("#nextSPQuestion").on("click", (e) => {
                let parent = $(e.target).parent("div").parent("div");
                let userAnswer = $(parent).find('input[name="choice"]:checked').val();
                if (userAnswer !== undefined) {
                    $(parent).empty();
                    getSpecialPractice(sp, id);
                } else {
                    alert("请选择你认为正确的答案！");
                }

            });
        } else {
            $(content).empty().append(`<h2 class="text-muted well">` + data.Content + `</h2>`);
            $(content).append(`<div>
                            <a href="javascript:void(0);" onclick="showEditor(this,'#SPEditor','#backGroup');"
                               id="showSPEditor">填写你认为正确的答案</a>
                        </div>
                        <div>
                            <textarea name="content" id="SPEditor" class="hidden"></textarea>
                        </div>`)
            $(backGroup).empty().append(`<div class="col-sm-offset-9">
                            <a class="btn btn-danger btn-lg">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextSPQuestion">下一题</a>
                        </div>
                        <div class="col-sm-offset-9 hidden">
                            <a class="btn btn-primary btn-lg" onclick="backToLast('#backGroup','#SPEditor');">确认</a>
                        </div>`);
            $("#nextSPQuestion").on("click", (e) => {

                let parent = $(e.target).parent("div").parent("div").parent("div");
                let userAnswer = $(parent).find('#showSPEditor').attr("data-content");
                if (userAnswer !== undefined && userAnswer.length > 0) {
                    $(parent).empty();
                    getSpecialPractice(sp, id)
                } else {
                    alert("请填写你的答案！");
                }
            });
        }
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "SpecialPracticeContent"]);
    });


}

function UNACTION() {
    alert("该功能正在修建中...");
}