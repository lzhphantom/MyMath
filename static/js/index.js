$(function () {
    let mathBasic = document.getElementById("math_basic");
    $('#collapseOne').on('show.bs.collapse', function () {
        $("#collapseTwo").collapse('hide');
        $("#collapseThree").collapse('hide');
        $("#collapse4").collapse('hide');
        $("#collapse5").collapse('hide');
        $.get("/admin/basicCommon",
            function (data, status, xhr) {
                if (xhr.status === 264) {
                    notLogin();
                    setTimeout(() => {
                        $("#collapseOne").collapse('hide');
                    }, 0);
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
                    ` + data.BasicContent[0].Concept + `
                </div>`);
                            //知识点精讲部分
                            if (data.BasicContent[0].KnowledgeImportant !== undefined) {
                                let content = ``;
                                let letterNumber = 97;

                                for (let i = 0; i < data.BasicContent[0].KnowledgeImportant.length; i++) {
                                    content += `<div>
                        <h4>` + String.fromCharCode(letterNumber++) + `.</h4>
                        ` + data.BasicContent[0].KnowledgeImportant[i].Content + `
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
                                    content += `` + data.BasicContent[0].Formula[i].Content;
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
                                    content += `` + data.BasicContent[0].ExaminationCenter[i].Content;
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
                                    content += `` + data.BasicContent[0].HDifficulty[i].Content;
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
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, controls.substring(1)]);
                        $(controls).find("p").addClass("text-muted well");
                    });
                });
            });
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
        $("#collapse5").collapse('hide');
        $('a[role-tab="training"]').on('hide.bs.tab', (e) => {
            let controls = $(e.target).attr("href");
            $(controls).empty();
        });
        $('a[role-tab="training"]').on('shown.bs.tab', (e) => {
            let controls = $(e.target).attr("href");
            if (controls === "#Select") {
                getSelectFirst(controls);
            } else if (controls === "#Blank") {
                getUnSelectFirst(controls);
            }
        });
    });
    $("#collapseTwo").on("hide.bs.collapse", () => {
        $('a[role-tab="training"]').off("hide.bs.tab shown.bs.tab");
        $('a[role-tab="training"]').parent("li").removeClass("active");
        $("#Select").empty();
        $("#Blank").empty();
    });

    $("#collapseThree").on("show.bs.collapse", () => {
        $("#collapseOne").collapse('hide');
        $("#collapseTwo").collapse('hide');
        $("#collapse4").collapse('hide');
        $("#collapse5").collapse('hide');
        $.get("/admin/basicCommon", (data, status, xhr) => {
            if (xhr.status === 264) {
                notLogin();
                setTimeout(() => {
                    $("#collapseThree").collapse('hide');
                }, 0);
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
                getSpecialPracticeFirst(sp, id);
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
        $("#collapse5").collapse('hide');
        $('a[role-tab="upload"]').on("show.bs.tab", (e) => {
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
        // $('a[role-tab="upload"]').parent("li").removeClass("active");
        $("#mulChoiceUpBtn").off("click");
        $("#solveUpBtn").off("click");
    });
    $("#collapse5").on('show.bs.collapse', () => {
        $("#Review").removeClass("hidden");
        $("#collapseOne").collapse('hide');
        $("#collapseThree").collapse('hide');
        $("#collapseTwo").collapse('hide');
        $("#collapse4").collapse('hide');
        $('a[role-tab="review"]').on("show.bs.tab", (e) => {
            let target = $(e.target).attr("href");
            $(target).removeClass("hidden");
            if (target === "#QuestionReview") {
                getQuestionReview(target)
            } else if (target === "#KnowledgeReview") {

            }
        });
        $('a[role-tab="review"]').on("hide.bs.tab", (e) => {
            let target = $(e.target).attr("href");
            $(target).empty();
        });
    });
    $("#collapse5").on('hide.bs.collapse', () => {
        $('a[role-tab="review"]').off("hide.bs.tab shown.bs.tab");
        $('a[role-tab="review"]').parent("li").removeClass("active");
        $("#QuestionReview").empty();
        $("#KnowledgeReview").empty();
    });

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
        editor.setData("");
    }
    showContentName = "#" + $(obj).attr("id");

    $($(backGroup).children("div")[0]).addClass("hidden");
    $($(backGroup).children("div")[1]).removeClass("hidden");

    editorCheck(showContentName);
}

function unregularEditorContent(data) {
    let arr = data.split(/\\\(|\\\)|\\\\/);
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
        let newString = "";
        let long = arr[i].length;
        if (long > 30) {
            newArr = arr[i].split(/,|，/);
            console.log(newArr);
            for (let j = 0; j < newArr.length; j++) {
                if (newArr !== "" && j !== newArr.length - 1) {
                    newString += newArr[j] + ",\\\\";
                } else {
                    newString += newArr[j];
                }
            }
        } else {
            newString = arr[i];
        }
        content += `<p>\\(` + newString + `\\)</p>`;
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
    if (data.length <= 0) {
        $(showContentName).html("暂无内容");
        $(showContentName).attr("data-content", "");
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

    if (showContentName === "#showSelectChangeA" || showContentName === "#showSelectChangeB"
        || showContentName === "#showSelectChangeC" || showContentName === "#showSelectChangeD") {
        let selectA = $("#showSelectChangeA");
        let selectB = $("#showSelectChangeB");
        let selectC = $("#showSelectChangeC");
        let selectD = $("#showSelectChangeD");
        $("#showAnswerChangeSelect").empty();
        if (typeof ($(selectA).attr("data-content")) !== "undefined") {
            let content = $(selectA).attr("data-content");
            if (content.length > 0) {
                $("#showAnswerChangeSelect").append(`<option value="` + content + `">A</option>`)
            }
        }
        if (typeof ($(selectB).attr("data-content")) !== "undefined") {
            let content = $(selectB).attr("data-content");
            if (content.length > 0) {
                $("#showAnswerChangeSelect").append(`<option value="` + content + `">B</option>`)
            }
        }
        if (typeof ($(selectC).attr("data-content")) !== "undefined") {
            let content = $(selectC).attr("data-content");
            if (content.length > 0) {
                $("#showAnswerChangeSelect").append(`<option value="` + content + `">C</option>`)
            }
        }
        if (typeof ($(selectD).attr("data-content")) !== "undefined") {
            let content = $(selectD).attr("data-content");
            if (content.length > 0) {
                $("#showAnswerChangeSelect").append(`<option value="` + content + `">D</option>`)
            }

        }

    }

    $($(backGroup).children("div")[0]).removeClass("hidden");
    $($(backGroup).children("div")[1]).addClass("hidden");
}

//获取非选择题
function getUnSelectFirst(controls) {
    $.get("/admin/getQuestion/-1", (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(() => {
                $("#collapseTwo").collapse('hide');
            }, 0);
            return
        }
        let percent = number_format((data.QueueNum + 1) / data.Total * 100, 2, ".", ",");
        let button1 = ``;
        if ((data.QueueNum + 1) === data.Total) {
            button1 = `<a class="btn btn-success btn-lg" onclick="commitUnSelect('` + controls + `');">提交检测</a>`
        } else {
            button1 = `<a class="btn btn-danger btn-lg" onclick="commitUnSelect('` + controls + `');">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextUnQuestion">下一题</a>`
        }
        $(controls).append(`<h1 class="text-muted text-center">非选择题练习</h1>
                    <div id="progress" class="progress">
                        <div class="progress-bar progress-bar-success progress-bar-striped active" style="width: ` + percent + `%">
                            <span>` + percent + `% </span>
                        </div>
                    </div>
                    <div id="blankContent">
                        
                    </div>
                    <div id="backGroup" class="row">
                        <div class="col-sm-offset-9">
                            ` + button1 + `
                        </div>
                        <div class="col-sm-offset-9 hidden">
                            <a class="btn btn-primary btn-lg" onclick="backToLast('#backGroup','#blankEditor');">确认</a>
                        </div>
                    </div>`);
        let content = $(controls).find("#blankContent");

        $(content).empty().append(`<h2 class="well">` + data.Content + `</h2>`);
        $(content).append(`<div>
                            <a href="javascript:void(0);" onclick="showEditor(this,'#blankEditor','#backGroup');"
                               id="showEditor">填写你最简正确的答案</a>
                        </div>
                        <div>
                            <textarea name="content" id="blankEditor" class="hidden"></textarea>
                        </div>`);
        $("#nextUnQuestion").on("click", (e) => {
            let parent = $(e.target).parent("div").parent("div").parent("div");
            if ($(parent).attr("id") === "Blank") {
                let userAnswer = $(parent).find('#showEditor').attr("data-content");
                if (userAnswer !== undefined && userAnswer.length > 0) {
                    $(parent).empty();
                    let QueueNum = data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getUnSelect(controls, QueueNum, commitData)
                } else {
                    alert("请填写你的答案！");
                }
            }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "blankContent"]);
    });
}

function getUnSelect(controls, num, commitData) {
    $.post("/getTrain/unselect/" + num, commitData, (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(() => {
                $("#collapseTwo").collapse('hide');
            }, 0);
            return
        }
        let percent = number_format((data.QueueNum + 1) / data.Total * 100, 2, ".", ",");
        let button1 = ``;
        if ((data.QueueNum + 1) === data.Total) {
            button1 = `<a class="btn btn-success btn-lg" onclick="commitUnSelect('` + controls + `');">提交检测</a>`
        } else {
            button1 = `<a class="btn btn-danger btn-lg" onclick="commitUnSelect('` + controls + `');">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextUnQuestion">下一题</a>`
        }
        $(controls).append(`<h1 class="text-muted text-center">非选择题练习</h1>
                    <div id="progress" class="progress">
                        <div class="progress-bar progress-bar-success progress-bar-striped active" style="width: ` + percent + `%">
                            <span>` + percent + `% </span>
                        </div>
                    </div>
                    <div id="blankContent">
                        
                    </div>
                    <div id="backGroup" class="row">
                        <div class="col-sm-offset-9">
                            ` + button1 + `
                        </div>
                        <div class="col-sm-offset-9 hidden">
                            <a class="btn btn-primary btn-lg" onclick="backToLast('#backGroup','#blankEditor');">确认</a>
                        </div>
                    </div>`);
        let content = $(controls).find("#blankContent");

        $(content).empty().append(`<h2 class="well">` + data.Content + `</h2>`);
        $(content).append(`<div>
                            <a href="javascript:void(0);" onclick="showEditor(this,'#blankEditor','#backGroup');"
                               id="showEditor">填写你最简正确的答案</a>
                        </div>
                        <div>
                            <textarea name="content" id="blankEditor" class="hidden"></textarea>
                        </div>`);
        $("#nextUnQuestion").on("click", (e) => {
            let parent = $(e.target).parent("div").parent("div").parent("div");
            if ($(parent).attr("id") === "Blank") {
                let userAnswer = $(parent).find('#showEditor').attr("data-content");
                if (userAnswer !== undefined && userAnswer.length > 0) {
                    $(parent).empty();
                    let QueueNum = data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getUnSelect(controls, QueueNum, commitData)
                } else {
                    alert("请填写你的答案！");
                }
            }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "blankContent"]);
    });
}

function commitUnSelect(controls) {
    let userAnswer = $(controls).find("#showEditor").attr("data-content");
    if (userAnswer !== undefined && userAnswer.length > 0) {
        $(controls).empty();
    } else {
        alert("请填写你的答案！");
        return
    }
    $.post("/commitTraining/unselect",
        {answer: userAnswer},
        (data) => {
            let tbody = ``;
            for (let i = 0; i < data.UnSelects.length; i++) {
                let textClass = ``;
                if (data.UnSelects[i].Correct) {
                    textClass = `class="text-success"`;
                } else {
                    textClass = `class="text-danger"`;
                }
                tbody += `<tr>
                                <td>` + (i + 1) + `</td>
                                <td>` + data.UnSelects[i].Train.Content + `</td>
                                <td ` + textClass + `>` + data.UnSelects[i].UserAnswer + `</td>
                                <td>` + data.UnSelects[i].Answer + `</td>
                            </tr>`;
            }
            $(controls).append(`<div>
                        <h1 class="text-center text-muted">训练成果</h1>
                        <h2 class="text-center text-muted">当前总计：` + data.View + `</h2>
                        <h2 class="text-center text-success">正确数目：` + data.Correct + `</h2>   
                        <h2 class="text-center text-primary">正确率：` + number_format((data.Correct / data.View * 100), 2, ".", ",") + `%</h2>          
                        </div>
                        <div>
                        <a class="btn btn-primary" role="button" data-for="detail" data-toggle="collapse" href="#TrainingDetail" aria-expanded="false" aria-controls="TrainingDetail">
                          详情查看 <span class="caret"></span>
                        </a>
                        <div class="collapse" id="TrainingDetail">
                          <div class="well">
                            <table class="table table-hover">
                                <thead>
                                <tr>
                                    <td>No.</td>
                                    <td>题目</td>
                                    <td>你的答案</td>
                                    <td>参考答案</td>
                                </tr>
                                </thead>
                                <tbody>
                                ` + tbody + `
                                </tbody>
                            </table>
                          </div>
                        </div>
                        </div>`);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "TrainingDetail"]);
            $('#TrainingDetail').on('show.bs.collapse', () => {
                $('a[data-for="detail"]').addClass("dropup");
            });
            $('#TrainingDetail').on('hide.bs.collapse', () => {
                $('a[data-for="detail"]').removeClass("dropup");
            });
        });
}

//获取选择题
function getSelectFirst(controls) {

    $.get("/admin/getQuestion/1", (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(() => {
                $("#collapseTwo").collapse('hide');
            }, 0);
            return
        }
        let percent = number_format((data.QueueNum + 1) / data.Total * 100, 2, ".", ",");
        let button1 = ``;
        if ((data.QueueNum + 1) === data.Total) {
            button1 = `<a class="btn btn-success btn-lg col-sm-offset-9" onclick="commitSelect('` + controls + `')">提交检测</a>`
        } else {
            button1 = `<a class="btn btn-danger btn-lg col-sm-offset-9" onclick="commitSelect('` + controls + `')">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextQuestion">下一题</a>`
        }
        $(controls).append(`<h1 class="text-muted text-center">选择题练习</h1>
                    <div id="progress" class="progress">
                        <div class="progress-bar progress-bar-success progress-bar-striped active" style="width: ` + percent + `%">
                            <span>` + percent + `% </span>
                        </div>
                    </div>
                    <div id="selectContent">
                        
                    </div>
                    <div id="backGroup" class="row">
                        ` + button1 + `
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
                    let QueueNum = data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSelect(controls, QueueNum, commitData);
                } else {
                    alert("请选择你认为正确的答案！");
                }
            }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "selectContent"]);
    });
}

function getSelect(controls, num, commitData) {
    $.post("/getTrain/select/" + num, commitData, (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(() => {
                $("#collapseTwo").collapse('hide');
            }, 0);
            return
        }
        let percent = number_format((data.QueueNum + 1) / data.Total * 100, 2, ".", ",");
        let button1 = ``;
        if ((data.QueueNum + 1) === data.Total) {
            button1 = `<a class="btn btn-success btn-lg col-sm-offset-9" onclick="commitSelect('` + controls + `')">提交检测</a>`
        } else {
            button1 = `<a class="btn btn-danger btn-lg col-sm-offset-9" onclick="commitSelect('` + controls + `')">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextQuestion">下一题</a>`
        }
        $(controls).append(`<h1 class="text-muted text-center">选择题练习</h1>
                    <div id="progress" class="progress">
                        <div class="progress-bar progress-bar-success  progress-bar-striped active" style="width: ` + percent + `%">
                            <span>` + percent + `% </span>
                        </div>
                    </div>
                    <div id="selectContent">
                        
                    </div>
                    <div id="backGroup" class="row">
                        ` + button1 + `
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
                    let QueueNum = data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSelect(controls, QueueNum, commitData);
                } else {
                    alert("请选择你认为正确的答案！");
                }
            }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "selectContent"]);
    });
}

function commitSelect(controls) {
    let userAnswer = $(controls).find('input[name="choice"]:checked').val();
    if (userAnswer !== undefined) {
        $(controls).empty();
    } else {
        alert("请选择你认为正确的答案！");
        return
    }
    $.post("/commitTraining/select",
        {answer: userAnswer},
        (data) => {
            let tbody = ``;
            for (let i = 0; i < data.Selects.length; i++) {
                let textClass = ``;
                if (data.Selects[i].Correct) {
                    textClass = `class="text-success"`;
                } else {
                    textClass = `class="text-danger"`;
                }
                tbody += `<tr>
                                <td>` + (i + 1) + `</td>
                                <td>` + data.Selects[i].Train.Content + `</td>
                                <td ` + textClass + `>` + data.Selects[i].UserAnswer + `</td>
                                <td>` + data.Selects[i].Answer + `</td>
                            </tr>`;
            }
            $(controls).append(`<div>
                        <h1 class="text-center text-muted">训练成果</h1>
                        <h2 class="text-center text-muted">当前总计：` + data.View + `</h2>
                        <h2 class="text-center text-success">正确数目：` + data.Correct + `</h2>   
                        <h2 class="text-center text-primary">正确率：` + number_format((data.Correct / data.View * 100), 2, ".", ",") + `%</h2>
                        <div>
                        <a class="btn btn-primary" role="button" data-for="detail" data-toggle="collapse" href="#TrainingDetail" aria-expanded="false" aria-controls="TrainingDetail">
                          详情查看 <span class="caret"></span>
                        </a>
                        <div class="collapse" id="TrainingDetail">
                          <div class="well">
                            <table class="table table-hover">
                                <thead>
                                <tr>
                                    <td>No.</td>
                                    <td>题目</td>
                                    <td>你的答案</td>
                                    <td>参考答案</td>
                                </tr>
                                </thead>
                                <tbody>
                                ` + tbody + `
                                </tbody>
                            </table>
                          </div>
                        </div>
</div>          
                        </div>`);
            $("#TrainingDetail").on('show.bs.collapse', () => {
                $('a[data-for="detail"]').addClass("dropup");
            });
            $("#TrainingDetail").on('hide.bs.collapse', () => {
                $('a[data-for="detail"]').removeClass("dropup");
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "TrainingDetail"]);
        })
}

//专项练习获取题
function getSpecialPracticeFirst(sp, id) {
    $.get("/admin/getQuestionByCommonId/" + id, (data) => {
        let percent = number_format((data.QueueNum + 1) / data.Total * 100, 2, ".", ",");
        $(sp).empty().append(`<h1 class="text-center text-muted">专项练习</h1>
                        <div id="progress" class="progress">
                        <div class="progress-bar progress-bar-success progress-bar-striped active" style="width: ` + percent + `%">
                        <span>` + percent + `% </span>
                        </div>
                        </div>
                        <div id="SpecialPracticeContent">

                        </div>
                        <div id="backGroup" class="row">
                        </div>`);
        let content = $(sp).find("#SpecialPracticeContent");
        let backGroup = $(sp).find("#backGroup");
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
            let button1 = ``;
            if ((data.QueueNum + 1) === data.Total) {
                button1 = `<a class="btn btn-success btn-lg col-sm-offset-9" onclick="commitPractice('#` + $(sp).attr('id') + `',` + data.Role + `)">提交检测</a>`
            } else {
                button1 = `<a class="btn btn-danger btn-lg col-sm-offset-9" onclick="commitPractice('#` + $(sp).attr('id') + `',` + data.Role + `)">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextSPQuestion">下一题</a>`
            }
            $(backGroup).empty().append(button1);
            $("#nextSPQuestion").on("click", (e) => {
                let parent = $(e.target).parent("div").parent("div");
                let userAnswer = $(parent).find('input[name="choice"]:checked').val();
                if (userAnswer !== undefined) {
                    $(parent).empty();
                    let QueueNum = data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSpecialPractice(sp, QueueNum, commitData);
                } else {
                    alert("请选择你认为正确的答案！");
                }

            });
        } else {
            $(content).empty().append(`<h2 class="text-muted well">` + data.Content + `</h2>`);
            $(content).append(`<div>
                            <a href="javascript:void(0);" onclick="showEditor(this,'#SPEditor','#backGroup');"
                               id="showSPEditor">填写你最简正确的答案</a>
                        </div>
                        <div>
                            <textarea name="content" id="SPEditor" class="hidden"></textarea>
                        </div>`);
            let button1 = ``;
            if ((data.QueueNum + 1) === data.Total) {
                button1 = `<a class="btn btn-success btn-lg" onclick="commitPractice('#` + $(sp).attr('id') + `',` + data.Role + `)">提交检测</a>`
            } else {
                button1 = `<a class="btn btn-danger btn-lg" onclick="commitPractice('#` + $(sp).attr('id') + `',` + data.Role + `)">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextSPQuestion">下一题</a>`
            }
            $(backGroup).empty().append(`<div class="col-sm-offset-9">
                            ` + button1 + `
                        </div>
                        <div class="col-sm-offset-9 hidden">
                            <a class="btn btn-primary btn-lg" onclick="backToLast('#backGroup','#SPEditor');">确认</a>
                        </div>`);
            $("#nextSPQuestion").on("click", (e) => {

                let parent = $(e.target).parent("div").parent("div").parent("div");
                let userAnswer = $(parent).find('#showSPEditor').attr("data-content");
                if (userAnswer !== undefined && userAnswer.length > 0) {
                    $(parent).empty();
                    let QueueNum = data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer}
                    getSpecialPractice(sp, QueueNum, commitData);
                } else {
                    alert("请填写你的答案！");
                }
            });
        }
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "SpecialPracticeContent"]);
    });
}

function getSpecialPractice(sp, num, commitData) {
    $.post("/getPractice/" + num, commitData, (data) => {
        let percent = number_format((data.QueueNum + 1) / data.Total * 100, 2, ".", ",");
        $(sp).empty().append(`<h1 class="text-center text-muted">专项练习</h1>
                        <div id="progress" class="progress">
                        <div class="progress-bar progress-bar-success progress-bar-striped active" style="width: ` + percent + `%">
                        <span>` + percent + `% </span>
                        </div>
                        </div>
                        <div id="SpecialPracticeContent">

                        </div>
                        <div id="backGroup" class="row">
                        </div>`);
        let content = $(sp).find("#SpecialPracticeContent");
        let backGroup = $(sp).find("#backGroup");
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
            let button1 = ``;
            if ((data.QueueNum + 1) === data.Total) {
                button1 = `<a class="btn btn-success btn-lg col-sm-offset-9" onclick="commitPractice('#` + $(sp).attr('id') + `',` + data.Role + `)">提交检测</a>`
            } else {
                button1 = `<a class="btn btn-danger btn-lg col-sm-offset-9" onclick="commitPractice('#` + $(sp).attr('id') + `',` + data.Role + `)">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextSPQuestion">下一题</a>`
            }
            $(backGroup).empty().append(button1);
            $("#nextSPQuestion").on("click", (e) => {
                let parent = $(e.target).parent("div").parent("div");
                let userAnswer = $(parent).find('input[name="choice"]:checked').val();
                if (userAnswer !== undefined) {
                    $(parent).empty();
                    let QueueNum = data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSpecialPractice(sp, QueueNum, commitData);
                } else {
                    alert("请选择你认为正确的答案！");
                }

            });
        } else {
            $(content).empty().append(`<h2 class="text-muted well">` + data.Content + `</h2>`);
            $(content).append(`<div>
                            <a href="javascript:void(0);" onclick="showEditor(this,'#SPEditor','#backGroup');"
                               id="showSPEditor">填写你最简正确的答案</a>
                        </div>
                        <div>
                            <textarea name="content" id="SPEditor" class="hidden"></textarea>
                        </div>`);
            let button1 = ``;
            if ((data.QueueNum + 1) === data.Total) {
                button1 = `<a class="btn btn-success btn-lg" onclick="commitPractice('#` + $(sp).attr('id') + `',` + data.Role + `)">提交检测</a>`
            } else {
                button1 = `<a class="btn btn-danger btn-lg" onclick="commitPractice('#` + $(sp).attr('id') + `',` + data.Role + `)">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextSPQuestion">下一题</a>`
            }
            $(backGroup).empty().append(`<div class="col-sm-offset-9">
                            ` + button1 + `
                        </div>
                        <div class="col-sm-offset-9 hidden">
                            <a class="btn btn-primary btn-lg" onclick="backToLast('#backGroup','#SPEditor');">确认</a>
                        </div>`);
            $("#nextSPQuestion").on("click", (e) => {

                let parent = $(e.target).parent("div").parent("div").parent("div");
                let userAnswer = $(parent).find('#showSPEditor').attr("data-content");
                if (userAnswer !== undefined && userAnswer.length > 0) {
                    $(parent).empty();
                    let QueueNum = data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSpecialPractice(sp, QueueNum, commitData);
                } else {
                    alert("请填写你的答案！");
                }
            });
        }
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "SpecialPracticeContent"]);
    });
}

function commitPractice(sp, role) {
    let userAnswer;
    if (role === 1) {
        userAnswer = $(sp).find('input[name="choice"]:checked').val();
        if (userAnswer !== undefined) {
            $(sp).empty();
        } else {
            alert("请选择你认为正确的答案！");
            return
        }
    } else {
        userAnswer = $(sp).find('#showSPEditor').attr("data-content");
        if (userAnswer !== undefined && userAnswer.length > 0) {
            $(sp).empty();
        } else {
            alert("请填写你的答案！");
            return
        }
    }
    $.post("/commitPractice",
        {answer: userAnswer},
        (data) => {
            let tbody = ``;
            for (let i = 0; i < data.Practices.length; i++) {
                let textClass = ``;
                if (data.Practices[i].Select !== null) {
                    if (data.Practices[i].Select.Correct) {
                        textClass = `class="text-success"`;
                    } else {
                        textClass = `class="text-danger"`;
                    }
                    tbody += `<tr>
                                    <td>` + (i + 1) + `</td>
                                    <td>` + data.Practices[i].Select.Train.Content + `</td>
                                    <td ` + textClass + `>` + data.Practices[i].Select.UserAnswer + `</td>
                                    <td>` + data.Practices[i].Select.Answer + `</td>
                                </tr>`;
                } else {
                    if (data.Practices[i].UnSelect.Correct) {
                        textClass = `class="text-success"`;
                    } else {
                        textClass = `class="text-danger"`;
                    }
                    tbody += `<tr>
                                    <td>` + (i + 1) + `</td>
                                    <td>` + data.Practices[i].UnSelect.Train.Content + `</td>
                                    <td ` + textClass + `>` + data.Practices[i].UnSelect.UserAnswer + `</td>
                                    <td>` + data.Practices[i].UnSelect.Answer + `</td>
                                </tr>`;
                }
            }
            $(sp).append(`<div>
                        <h1 class="text-center text-muted">训练成果</h1>
                        <h2 class="text-center text-muted">当前总计：` + data.View + `</h2>
                        <h2 class="text-center text-success">正确数目：` + data.Correct + `</h2>   
                        <h2 class="text-center text-primary">正确率：` + number_format((data.Correct / data.View * 100), 2, ".", ",") + `%</h2>          
                        </div>
                        <div>
                        <a class="btn btn-primary" role="button" data-toggle="collapse" data-for="detail" href="#PracticeDetail" aria-expanded="false" aria-controls="PracticeDetail">
                          详情查看 <span class="caret"></span>
                        </a>
                        <div class="collapse" id="PracticeDetail">
                          <div class="well">
                            <table class="table table-hover">
                                <thead>
                                <tr>
                                    <td>No.</td>
                                    <td>题目</td>
                                    <td>你的答案</td>
                                    <td>参考答案</td>
                                </tr>
                                </thead>
                                <tbody>
                                ` + tbody + `
                                </tbody>
                            </table>
                          </div>
                        </div>
                        </div>`);
            $("#PracticeDetail").on('show.bs.collapse', () => {
                $('a[data-for="detail"]').addClass("dropup");
            });
            $("#PracticeDetail").on('hide.bs.collapse', () => {
                $('a[data-for="detail"]').removeClass("dropup");
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "PracticeDetail"]);
        });
}

function getQuestionReview(controls) {
    $.get("/getQuestionReview", (data) => {
        let tbody = ``;
        for (let i = 0; i < data.length; i++) {
            let addition = ``;
            if (data[i].Addition != null && data[i].Addition.length > 0) {
                for (let j = 0; j < data[i].Addition.length; j++) {
                    addition += `` + data[i].Addition[j];
                }
            } else {
                addition = `无`;
            }
            let reviewer = ``;
            if (data[i].Reviewers != null && data[i].Reviewers.length > 0) {
                for (let j = 0; j < data[i].Reviewers.length; j++) {
                    reviewer += `<p>` + data[i].Reviewers[j] + `</p>`;
                }
            } else {
                reviewer = `无`;
            }
            tbody += `<tr>
                        <td>` + (i + 1) + `</td>
                        <td width="320px;">` + data[i].Content + `</td>
                        <td>` + data[i].QuestionType + `</td>
                        <td>` + addition + `</td>
                        <td>` + data[i].Answer + `</td>
                        <td>` + data[i].ViewNum + `</td>
                        <td>` + reviewer + `</td>
                        <td><a class="btn btn-warning" href="javascript:void(0);" onclick="ChangeReview(` + data[i].Id + `,'` + controls + `')">修改</a></td>
                        <td><a class="btn btn-success" href="javascript:void(0);" onclick="QuestionReviewPass(` + data[i].Id + `,'` + controls + `')">通过</a></td>
                    </tr>`
        }
        $(controls).empty().append(`<table class="table table-hover">
                        <caption><h1 class="text-center text-muted">新增试题审核</h1></caption>
                        <thead>
                        <tr>
                            <td>No.</td>
                            <td>题目</td>
                            <td>题目类型</td>
                            <td>附加</td>
                            <td>答案</td>
                            <td>审核次数</td>
                            <td>审核人</td>
                            <td colspan="2" class="text-center">操作</td>
                        </tr>
                        </thead>
                        <tbody>
                        ` + tbody + `
                        </tbody>
                    </table>`);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, controls.substring(1)]);
    })
}

function ChangeReview(id, controls) {
    $.get("/getQuestion/" + id, (data, status, xhr) => {
        if (xhr.status == 200) {
            console.log(data);
            let other = ``;
            if (data.Role === 1) {
                other = `<div class="form-group row">
                            <label for="showSelectChangeA" class="col-sm-1 control-label">A.</label>
                            <div class="col-sm-5">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showSelectChangeA" data-content="` + data.Addition[0] + `">` + data.Addition[0] + `</a>
                            </div>
                            <label for="showSelectChangeB" class="col-sm-1 control-label">B.</label>
                            <div class="col-sm-5">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showSelectChangeB" data-content="` + data.Addition[1] + `">` + data.Addition[1] + `</a>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="showSelectChangeC" class="col-sm-1 control-label">C.</label>
                            <div class="col-sm-5">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showSelectChangeC" data-content="` + data.Addition[2] + `">` + data.Addition[2] + `</a>
                            </div>
                            <label for="showSelectChangeD" class="col-sm-1 control-label">D.</label>
                            <div class="col-sm-5">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showSelectChangeD" data-content="` + data.Addition[3] + `">` + data.Addition[3] + `</a>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="showAnswerChangeSelect" class="col-sm-1 control-label">答案：</label>
                            <div class="col-sm-5">
                                <select id="showAnswerChangeSelect">
                                    <option value="` + data.Addition[0] + `" ` + (data.Addition[0] === data.Answer ? "selected='selected'" : "") + `>A</option>
                                    <option value="` + data.Addition[1] + `" ` + (data.Addition[1] === data.Answer ? "selected='selected'" : "") + `>B</option>
                                    <option value="` + data.Addition[2] + `" ` + (data.Addition[2] === data.Answer ? "selected='selected'" : "") + `>C</option>
                                    <option value="` + data.Addition[3] + `" ` + (data.Addition[3] === data.Answer ? "selected='selected'" : "") + `>D</option>
                                </select>
                            </div>
                        </div>`;
            } else {
                other = `<div class="form-group row">
                            <label for="showAnswerChange" class="col-sm-2 control-label">答案：</label>
                            <div class="col-sm-10">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showAnswerChange" title="可填" data-content="` + data.Answer + `">` + data.Answer + `</a>
                            </div>
                        </div>`;
            }
            $(controls).empty().append(`
                    <h1 class="text-center text-muted">试题修改</h1>
                    <form action="" class="text-muted">
                        <div class="form-group row">
                            <label for="showChangeContent" class="col-sm-2 control-label">题目：</label>
                            <div class="col-sm-10">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showChangeContent" data-content="` + data.Content + `">` + data.Content + `</a>
                            </div>
                        </div>
                        ` + other + `
                        <div class="form-group">
                            <textarea name="content" id="changeEditor" class="hidden"></textarea>
                        </div>
                        <div class="form-group row" id="backChangeGroup">
                            <div class="col-md-3 col-md-offset-9">
                                <a class="btn btn-warning btn-lg" id="changeBtn">修改</a>
                            </div>
                            <div class="col-md-3 col-md-offset-9 hidden">
                                <a class="btn btn-primary btn-lg"
                                   onclick="backToLast('#backChangeGroup','#changeEditor');">确认</a>
                            </div>
                        </div>

                    </form>
                `);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, controls.substring(1)]);

            $("#changeBtn").on("click", () => {
                let changeData;
                if (data.Role === 1) {
                    let content = $("#showChangeContent").attr("data-content");
                    let answer = $("#showAnswerChangeSelect").val();

                    let allSelect = $(controls).find("a[id^=showSelectChange]");
                    let choice = "";
                    let choiceNum = 0;
                    for (let i = 0; i < allSelect.length; i++) {
                        if (typeof ($(allSelect[i]).attr("data-content")) !== "undefined" && $(allSelect[i]).attr("data-content").length>0) {
                            choice += $(allSelect[i]).attr("data-content") + "~￥";
                            choiceNum++;
                        }
                    }
                    if (choiceNum < 4) {
                        alert("选项不充足");
                        return
                    }
                    changeData = {
                        content: content,
                        choices: choice,
                        ans: answer,
                        role:data.Role,
                    };
                } else {
                    let content = $("#showChangeContent").attr("data-content");
                    let answer = $("#showAnswerChange").attr("data-content");
                    changeData = {
                        content: content,
                        ans: answer,
                        role:data.Role,
                    }
                }
                $.post(
                    "/changeQuestion/"+data.Id,
                    changeData,
                    (data,status,xhr)=>{
                        if(xhr.status===200){
                            getQuestionReview(controls);
                        }
                    });
            });
        }
    });
}

function QuestionReviewPass(id, controls) {
    $.get("/passQuestionReview/" + id, (data, status, xhr) => {
        if (xhr.status === 200) {
            getQuestionReview(controls)
        }
    })
}