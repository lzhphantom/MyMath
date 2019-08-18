$(function () {
    let mathBasic = document.getElementById("math_basic");
    $('#collapseOne').on('show.bs.collapse', function () {
        $.get("/admin/basicCommon", function (data, status) {
            let oneUl = $('#collapseOne').children('div').children('ul');
            $(oneUl).empty();
            for (let i = 0; i < data.length; i++) {
                if ((i + 1) % 2 === 0) {
                    $(oneUl).append(`<li role="presentation"><a href="#jihe" aria-controls="jihe" role="tab"
                                                           data-toggle="tab" data-id="` + data[i].Id + `">` + data[i].Name + `<br></a></li>`);
                } else {
                    $(oneUl).append(`<li role="presentation"><a href="#sjhs" aria-controls="sjhs" role="tab"
                                                           data-toggle="tab" data-id="` + data[i].Id + `">` + data[i].Name + `<br></a></li>`);
                }
            }

            $('a[data-toggle="tab"]').on('hide.bs.tab', (e) => {
                let controls = $(e.target).attr("href");
                $(controls).empty();
            });

            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                let id = $(e.target).attr("data-id");
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
        });
    });

    $('#collapseTwo').on('show.bs.collapse', () => {
        $('a[data-toggle="tab"]').on('hide.bs.tab', (e) => {
            let controls = $(e.target).attr("href");
            $(controls).empty();
        });
        $('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
            let controls = $(e.target).attr("href");
            if (controls === "#Select") {
                getSelect(controls);
            } else if (controls === "#Blank") {
                getUnSelect(controls);
            }
        });
    });

    $("#collapseThree").on("show.bs.collapse", () => {
        $.get("/admin/basicCommon", (data) => {
            let threeUl = $('#collapseThree').find('ul');
            $(threeUl).empty();
            for (let i = 0; i < data.length; i++) {
                $(threeUl).append(`<li role="presentation"><a href="#SpecialPractice" aria-controls="SpecialPractice" role="tab"
                                                           data-toggle="tab" data-id="` + data[i].Id + `">` + data[i].Name + `<br></a></li>`);
            }
            // /admin/getQuestionByCommonId/:id
            $('a[data-toggle="tab"]').on('hide.bs.tab', (e) => {
                let controls = $(e.target).attr("href");
                $(controls).empty();
            });
            $('a[data-toggle="tab"]').on("shown.bs.tab", (e) => {
                let id = $(e.target).attr("data-id");
                $.get("/admin/getQuestionByCommonId/" + id, (data) => {
                    console.log(data);
                    let sp = $("#SpecialPractice");
                    $(sp).empty().append(`<h1>专项练习</h1>
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
                    if (data.RoleQuestion === 1) {
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
                        $(content).empty().append(`<h2 class="text-muted well">` + data.Content + `</h2>`)
                        $()
                    } else {

                    }

                })
            })
        });
    });

});

var editor;

async function showEditor(obj, editorName, backGroup) {
    if (typeof (editor) !== "undefined" && editor != null) {
        alert("正在编辑中...");
        return
    }
    $(obj).removeAttr("onclick");
    await ClassicEditor.create(document.querySelector(editorName), {
        toolbar: ["Heading", "|", "ImageUpload", "BlockQuote", "Bold", "Italic"],
        language: 'zh-cn'
    }).then(newEditor => {
        editor = newEditor;
    }).catch(error => {
        console.error(error);
    });
    if (typeof ($(obj).attr("data-content")) !== "undefined") {
        editor.setData($(obj).attr("data-content"));
    }
    showContentName = "#" + $(obj).attr("id");

    $($(backGroup).children("div")[0]).addClass("hidden");
    $($(backGroup).children("div")[1]).removeClass("hidden");

    editorCheck(showContentName);
}

//准备生成富文本编辑器
function editorCheck(show) {
    let knowFlag = false;
    var editorCheck = setInterval(() => {
        if (editor !== undefined && editor !== null && !knowFlag) {
            editor.model.document.on("change:data", () => {
                $(show).html(editor.getData());
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, show.substring(1)]);
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
    const data = editor.getData();
    editor.model.document.off("change:data");
    editor.destroy().catch(error => {
        console.log(error);
    });
    editor = null;
    $(showContentName).attr("onclick", "showEditor(this" + ",'" + editorName + "','" + backGroup + "');");
    $(showContentName).attr("data-content", data);

    $($(backGroup).children("div")[0]).removeClass("hidden");
    $($(backGroup).children("div")[1]).addClass("hidden");
}

//获取非选择题
function getUnSelect(controls) {
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
    $.get("/admin/getQuestion/-1", (data) => {
        console.log(data);
        $(content).empty().append(`<h2 class="well">` + data.Content + `</h2>`);
        $(content).append(`<div>
                            <a href="javascript:void(0);" onclick="showEditor(this,'#blankEditor','#backGroup');"
                               id="showEditor">填写你认为正确的答案</a>
                        </div>
                        <div>
                            <textarea name="content" id="blankEditor" class="hidden"></textarea>
                        </div>`)
    });
    $("#nextUnQuestion").on("click", (e) => {
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
}

//获取选择题
function getSelect(controls) {
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
    $.get("/admin/getQuestion/1", (data) => {
        console.log(data);
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
    });

    $("#nextQuestion").on("click", (e) => {
        let parent = $(e.target).parent("div").parent("div");
        if ($(parent).attr("id") === "Select") {
            let userAnswer = $(parent).find('input[name="choice"]:checked').val();
            if (userAnswer !== undefined) {
                $(parent).empty();
                getSelect("#Select");
            } else {
                alert("请选择你认为正确的答案！");
            }
        }
    });
}

