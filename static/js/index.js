$(function () {
    let mathBasic = document.getElementById("math_basic");
    $('#collapseOne').on('show.bs.collapse', function () {
        $("#collapseTwo").collapse('hide');
        $("#collapseThree").collapse('hide');
        $("#collapse4").collapse('hide');
        $("#collapse5").collapse('hide');
        $.get("/user/basicCommon",
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
                let Data = data.data;
                for (let i = 0; i < Data.length; i++) {
                    if ((i + 1) % 2 === 0) {
                        $(oneUl).append(`<li role="presentation"><a href="#jihe" aria-controls="jihe" role="tab"
                                                           data-toggle="tab" data-id="` + Data[i].Id + `" role-tab="basic">` + Data[i].Name + `<br></a></li>`);
                    } else {
                        $(oneUl).append(`<li role="presentation"><a href="#sjhs" aria-controls="sjhs" role="tab"
                                                           data-toggle="tab" data-id="` + Data[i].Id + `" role-tab="basic">` + Data[i].Name + `<br></a></li>`);
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
                    $.get("/user/basicContent/" + id, function (data) {
                        if (data.code !== 0) {
                            errorAlert(data.msg);
                            return
                        }
                        let Data = data.data;
                        let $modal = $(controls);
                        $($modal).empty();
                        $($modal).append(`<h1 class="text-center text-muted">基础知识</h1>`);

                        $($modal).append(`<div>
                    <h2>` + Data.Name + `</h2>
                </div>`);
                        //概念部分
                        if (Data.BasicContent[0] !== undefined) {
                            $($modal).append(`<div>
                    <h3>1.` + Data.BasicContent[0].Title + `的概念</h3>
                    ` + Data.BasicContent[0].Concept + `
                </div>`);
                            //知识点精讲部分
                            if (Data.BasicContent[0].KnowledgeImportant !== undefined) {
                                let content = ``;
                                let letterNumber = 97;

                                for (let i = 0; i < Data.BasicContent[0].KnowledgeImportant.length; i++) {
                                    content += `<div>
                        <h4>` + String.fromCharCode(letterNumber++) + `.</h4>
                        ` + Data.BasicContent[0].KnowledgeImportant[i].Content + `
                    </div>`;
                                }
                                $($modal).append(`<div>
                    <h3>2.知识点精讲</h3>
                    ` + content + `
                </div>`);
                            }
                            //公式部分
                            if (Data.BasicContent[0].Formula !== undefined) {
                                let content = ``;
                                for (let i = 0; i < Data.BasicContent[0].Formula.length; i++) {
                                    content += `` + Data.BasicContent[0].Formula[i].Content;
                                }
                                $($modal).append(`<div>
                    <h3>3.相关公式</h3>
                    ` + content + `
                </div>`);
                            }
                            //考点部分
                            if (Data.BasicContent[0].ExaminationCenter !== undefined) {
                                let content = ``;
                                for (let i = 0; i < Data.BasicContent[0].ExaminationCenter.length; i++) {
                                    content += `` + Data.BasicContent[0].ExaminationCenter[i].Content;
                                }
                                $($modal).append(`<div>
                    <h3 class="text-danger">4.考点</h3>
                    ` + content + `
                </div>`);
                            }
                            //重难点部分
                            if (Data.BasicContent[0].HDifficulty !== undefined) {
                                let content = ``;
                                for (let i = 0; i < Data.BasicContent[0].HDifficulty.length; i++) {
                                    content += `` + Data.BasicContent[0].HDifficulty[i].Content;
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
        $.get("/user/basicCommon", (data, status, xhr) => {
            if (xhr.status === 264) {
                notLogin();
                setTimeout(() => {
                    $("#collapseThree").collapse('hide');
                }, 0);
                return
            }
            let threeUl = $('#collapseThree').find('ul');
            $(threeUl).empty();
            let Data = data.data;
            for (let i = 0; i < Data.length; i++) {
                $(threeUl).append(`<li role="presentation"><a href="#SpecialPractice" aria-controls="SpecialPractice" role="tab"
                                                           data-toggle="tab" data-id="` + Data[i].Id + `" role-tab="sp">` + Data[i].Name + `<br></a></li>`);
            }
            // /user/getQuestionByCommonId/:id
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
            if (target === "#UploadSelect") {
                $.get("/user/basicCommon", (data, status, xhr) => {
                    if (xhr.status === 200) {
                        let options = ``;
                        let Data = data.data;
                        for (let i = 0; i < Data.length; i++) {
                            options += `<option value="` + Data[i].Id + `">` + Data[i].Name + `</option>`;
                        }
                        $("#selectQuestionRole").empty().append(options)
                    }
                })
            } else if (target === "#UploadBlank") {
                $.get("/user/basicCommon", (data, status, xhr) => {
                    if (xhr.status === 200) {
                        let options = ``;
                        let Data = data.data;
                        for (let i = 0; i < Data.length; i++) {
                            options += `<option value="` + Data[i].Id + `">` + Data[i].Name + `</option>`;
                        }
                        $("#blankQuestionRole").empty().append(options)
                    }
                })
            }
        });
        $('a[role-tab="upload"]').on("hide.bs.tab", (e) => {
            let target = $(e.target).attr("href");
            $(target).addClass("hidden");
        });
        $("#mulChoiceUpBtn").on("click", () => {
            let allSelect = $("#UploadSelect").find("a[id^=showSelect]");
            let role = $("#selectQuestionRole").val();
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
                warningAlert("无可上传的内容");
            } else if (choice.length <= 0) {
                warningAlert("请填写选择选项");
            } else if (choiceNum <= 3) {
                warningAlert("选择数量不足");
            } else {
                let content = $(select).attr("data-content");
                let ans = $("#showAnswerSelect").val();
                if (content.length > 0) {
                    $.post(
                        "/user/uploadQuestion",
                        {
                            data: JSON.stringify({
                                content: content,
                                choices: choice,
                                answer: ans,
                                role: role,
                            }),
                            role: 1,
                        },
                        (Data) => {
                            if (Data.code === 0) {
                                successAlert(Data.msg);
                                clearSelect();
                            } else {
                                errorAlert(Data.msg);
                                return
                            }

                        }
                    );
                } else {
                    warningAlert("无可上传的内容")
                }
            }
        });
        $("#solveUpBtn").on("click", () => {
            let blank = $("#showSolve");
            if (typeof ($(blank).attr("data-content")) === "undefined") {
                warningAlert("无可上传的内容");
            } else {
                let content = $(blank).attr("data-content");
                let role = $("#blankQuestionRole").val();
                let db = {
                    content: content,
                    role: role,
                };
                let ans = $("#showAnswerSolve");
                if (typeof ($(ans).attr("data-content")) !== "undefined") {
                    db.answer = $(ans).attr("data-content");
                }
                if (content.length > 0) {
                    $.post(
                        "/user/uploadQuestion",
                        {
                            data: JSON.stringify(db),
                            role: 3,
                        },
                        (Data) => {
                            if (Data.code === 0) {
                                successAlert(Data.msg);
                                clearBlank();
                            } else {
                                errorAlert(Data.msg);
                                return
                            }
                        }
                    );
                } else {
                    warningAlert("无可上传的内容")
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
                getQuestionReview(1,target, 1);
            } else if (target === "#KnowledgeReview") {
                getBasicReview(target);
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
        warningAlert("正在编辑中...");
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
    let arr = data.split(/\\\(|\\\)/);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
            arr.splice(i, 1);
            i--;
        }
    }
    let content = "";
    for (let i = 0; i < arr.length; i++) {
        let newString = arr[i];
        let end = 0;
        let lbrace = 0;
        let rbrace = 0;
        let slash = 0;
        let newContent = [];
        while (end < newString.length) {
            if (newString[end] == "\\") {
                slash++
            } else {
                if (slash > 0) {
                    slash = 0
                }
            }

            if (newString[end] == "{") {
                lbrace++
            } else if (newString[end] == "}") {
                rbrace++
            }
            if (lbrace == rbrace && slash == 2) {
                newContent.push(newString.substring(0, end - 1));
                newString = newString.substring(end + 1)
            }
            end++

        }
        if (newString.length > 0) {
            newContent.push(newString)
        }

        content += newContent.join("");
    }
    return content
}

function regularEditorContent(data, lineNumber) {
    let arr = data.split(/<p>|<\/p>/);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
            arr.splice(i, 1);
            i--;
        }
    }
    let newContent = ``;
    for (let i = 0; i < arr.length; i++) {
        let content = [];

        let newString = arr[i];
        let end = 0;
        let lbrace = 0;
        let rbrace = 0;
        while (newString.length >= lineNumber) {
            if (newString[end] === "{") {
                lbrace++
            } else if (newString[end] === "}") {
                rbrace++
            }
            if (end > 30 && lbrace === rbrace) {
                let param = newString.substring(0, end + 1);
                content.push(param);
                newString = newString.substring(end + 1);
                lbrace = 0;
                rbrace = 0;
                end = 0
            }
            end++
        }
        if (newString.length > 0) {
            content.push(newString)
        }
        newContent += `<p>\\(` + content.join("\\\\") + `\\)</p>`;
    }

    return newContent
}

//准备生成富文本编辑器
function editorCheck(show) {
    let knowFlag = false;
    var editorCheck = setInterval(() => {
        if (editor !== undefined && editor !== null && !knowFlag) {
            editor.model.document.on("change:data", () => {
                let data = editor.getData();
                let content = regularEditorContent(data, 30);
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
    const data = addMathFormula(editor.getData());
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
    $.get("/user/getQuestion/-1", (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(() => {
                $("#collapseTwo").collapse('hide');
            }, 0);
            return
        }
        if (data.code !== 0) {
            errorAlert(data.msg);
            return
        }
        let Data = data.data;
        let percent = number_format((Data.QueueNum + 1) / Data.Total * 100, 2, ".", ",");
        let button1 = ``;
        if ((Data.QueueNum + 1) === Data.Total) {
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

        $(content).empty().append(`<h2 class="well">` + Data.Content + `</h2>`);
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
                    let QueueNum = Data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getUnSelect(controls, QueueNum, commitData)
                } else {
                    warningAlert("请填写你的答案！");
                }
            }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "blankContent"]);
    });
}

function getUnSelect(controls, num, commitData) {
    $.post("/user/getTrain/unselect/" + num, commitData, (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(() => {
                $("#collapseTwo").collapse('hide');
            }, 0);
            return
        }
        if (data.code !== 0) {
            errorAlert(data.msg);
            return
        }
        let Data = data.data;
        let percent = number_format((Data.QueueNum + 1) / Data.Total * 100, 2, ".", ",");
        let button1 = ``;
        if ((Data.QueueNum + 1) === Data.Total) {
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

        $(content).empty().append(`<h2 class="well">` + Data.Content + `</h2>`);
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
                    let QueueNum = Data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getUnSelect(controls, QueueNum, commitData)
                } else {
                    warningAlert("请填写你的答案！");
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
        warningAlert("请填写你的答案！");
        return
    }
    $.post("/user/commitTraining/unselect",
        {answer: userAnswer},
        (data) => {
            if (data.code !== 0) {
                errorAlert(data.msg);
                return
            }
            infoAlert("训练完成！辛苦啦！");
            let Data = data.data;
            let tbody = ``;
            for (let i = 0; i < Data.UnSelects.length; i++) {
                let textClass = ``;
                if (Data.UnSelects[i].Correct) {
                    textClass = `class="text-success"`;
                } else {
                    textClass = `class="text-danger"`;
                }
                tbody += `<tr>
                                <td>` + (i + 1) + `</td>
                                <td>` + Data.UnSelects[i].Train.Content + `</td>
                                <td ` + textClass + `>` + Data.UnSelects[i].UserAnswer + `</td>
                                <td>` + Data.UnSelects[i].Answer + `</td>
                            </tr>`;
            }
            $(controls).append(`<div>
                        <h1 class="text-center text-muted">训练成果</h1>
                        <h2 class="text-center text-muted">当前总计：` + Data.View + `</h2>
                        <h2 class="text-center text-success">正确数目：` + Data.Correct + `</h2>   
                        <h2 class="text-center text-primary">正确率：` + number_format((Data.Correct / Data.View * 100), 2, ".", ",") + `%</h2>          
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
                                    <td width="3%">No.</td>
                                    <td width="37%">题目</td>
                                    <td width="30%">你的答案</td>
                                    <td width="30%">参考答案</td>
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

    $.get("/user/getQuestion/1", (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(() => {
                $("#collapseTwo").collapse('hide');
            }, 0);
            return
        }
        if (data.code !== 0) {
            errorAlert(data.msg);
            return
        }
        let Data = data.data;
        let percent = number_format((Data.QueueNum + 1) / Data.Total * 100, 2, ".", ",");
        let button1 = ``;
        if ((Data.QueueNum + 1) === Data.Total) {
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
        for (let i = 0; i < Data.Choices.length; i++) {
            choices += `<div>
                            <label for="">
                            <input type="radio" name="choice" value="` + Data.Choices[i] + `">
                                <span>` + String.fromCharCode(letterNumber++) + `.` + Data.Choices[i] + `</span>
                            </label>
                        </div>`
        }
        $(content).empty().append(`<h2 class="well">` + Data.Content + `</h2>`);
        $(content).append(choices);
        $(content).find("p").css("display", "inline");
        $("#nextQuestion").on("click", (e) => {
            let parent = $(e.target).parent("div").parent("div");
            if ($(parent).attr("id") === "Select") {
                let userAnswer = $(parent).find('input[name="choice"]:checked').val();
                if (userAnswer !== undefined) {
                    $(parent).empty();
                    let QueueNum = Data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSelect(controls, QueueNum, commitData);
                } else {
                    warningAlert("请选择你认为正确的答案！");
                }
            }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "selectContent"]);
    });
}

function getSelect(controls, num, commitData) {
    $.post("/user/getTrain/select/" + num, commitData, (data, status, xhr) => {
        if (xhr.status === 264) {
            notLogin();
            setTimeout(() => {
                $("#collapseTwo").collapse('hide');
            }, 0);
            return
        }
        if (data.code !== 0) {
            errorAlert(data.msg);
            return
        }
        let Data = data.data;
        let percent = number_format((Data.QueueNum + 1) / Data.Total * 100, 2, ".", ",");
        let button1 = ``;
        if ((Data.QueueNum + 1) === Data.Total) {
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
        for (let i = 0; i < Data.Choices.length; i++) {
            choices += `<div>
                            <label for="">
                            <input type="radio" name="choice" value="` + Data.Choices[i] + `">
                                <span>` + String.fromCharCode(letterNumber++) + `.` + Data.Choices[i] + `</span>
                            </label>
                        </div>`
        }
        $(content).empty().append(`<h2 class="well">` + Data.Content + `</h2>`);
        $(content).append(choices);
        $(content).find("p").css("display", "inline");
        $("#nextQuestion").on("click", (e) => {
            let parent = $(e.target).parent("div").parent("div");
            if ($(parent).attr("id") === "Select") {
                let userAnswer = $(parent).find('input[name="choice"]:checked').val();
                if (userAnswer !== undefined) {
                    $(parent).empty();
                    let QueueNum = Data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSelect(controls, QueueNum, commitData);
                } else {
                    warningAlert("请选择你认为正确的答案！");
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
        warningAlert("请选择你认为正确的答案！");
        return
    }
    $.post("/user/commitTraining/select",
        {answer: userAnswer},
        (data) => {
            if (data.code !== 0) {
                errorAlert(data.msg);
                return
            }
            infoAlert("训练完成！辛苦啦！");
            let Data = data.data;
            let tbody = ``;
            for (let i = 0; i < Data.Selects.length; i++) {
                let textClass = ``;
                if (Data.Selects[i].Correct) {
                    textClass = `class="text-success"`;
                } else {
                    textClass = `class="text-danger"`;
                }
                tbody += `<tr>
                                <td>` + (i + 1) + `</td>
                                <td>` + Data.Selects[i].Train.Content + `</td>
                                <td ` + textClass + `>` + Data.Selects[i].UserAnswer + `</td>
                                <td>` + Data.Selects[i].Answer + `</td>
                            </tr>`;
            }
            $(controls).append(`<div>
                        <h1 class="text-center text-muted">训练成果</h1>
                        <h2 class="text-center text-muted">当前总计：` + Data.View + `</h2>
                        <h2 class="text-center text-success">正确数目：` + Data.Correct + `</h2>   
                        <h2 class="text-center text-primary">正确率：` + number_format((Data.Correct / Data.View * 100), 2, ".", ",") + `%</h2>
                        <div>
                        <a class="btn btn-primary" role="button" data-for="detail" data-toggle="collapse" href="#TrainingDetail" aria-expanded="false" aria-controls="TrainingDetail">
                          详情查看 <span class="caret"></span>
                        </a>
                        <div class="collapse" id="TrainingDetail">
                          <div class="well">
                            <table class="table table-hover">
                                <thead>
                                <tr>
                                    <td width="3%">No.</td>
                                    <td width="37%">题目</td>
                                    <td width="30%">你的答案</td>
                                    <td width="30%">参考答案</td>
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
    $.get("/user/getQuestionByCommonId/" + id, (data) => {
        if (data.code !== 0) {
            errorAlert(data.msg);
            return
        }
        let Data = data.data;
        let percent = number_format((Data.QueueNum + 1) / Data.Total * 100, 2, ".", ",");
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
        if (Data.Content === undefined) {
            $(content).empty().append(`<h2 class="text-center text-danger"> 暂无题库</h2>`);
            return
        }
        if (Data.Role === 1) {
            let choices = ``;
            let letterNumber = 65;
            for (let i = 0; i < Data.Choices.length; i++) {
                choices += `<div>
                            <label for="">
                            <input type="radio" name="choice" value="` + Data.Choices[i] + `">
                                <span>` + String.fromCharCode(letterNumber++) + `.` + Data.Choices[i] + `</span>
                            </label>
                        </div>`
            }
            $(content).empty().append(`<h2 class="text-muted well">` + Data.Content + `</h2>`);
            $(content).append(choices);
            $(content).find("p").css("display", "inline");
            let button1 = ``;
            if ((Data.QueueNum + 1) === Data.Total) {
                button1 = `<a class="btn btn-success btn-lg col-sm-offset-9" onclick="commitPractice('#` + $(sp).attr('id') + `',` + Data.Role + `)">提交检测</a>`
            } else {
                button1 = `<a class="btn btn-danger btn-lg col-sm-offset-9" onclick="commitPractice('#` + $(sp).attr('id') + `',` + Data.Role + `)">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextSPQuestion">下一题</a>`
            }
            $(backGroup).empty().append(button1);
            $("#nextSPQuestion").on("click", (e) => {
                let parent = $(e.target).parent("div").parent("div");
                let userAnswer = $(parent).find('input[name="choice"]:checked').val();
                if (userAnswer !== undefined) {
                    $(parent).empty();
                    let QueueNum = Data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSpecialPractice(sp, QueueNum, commitData);
                } else {
                    warningAlert("请选择你认为正确的答案！");
                }

            });
        } else {
            $(content).empty().append(`<h2 class="text-muted well">` + Data.Content + `</h2>`);
            $(content).append(`<div>
                            <a href="javascript:void(0);" onclick="showEditor(this,'#SPEditor','#backGroup');"
                               id="showSPEditor">填写你最简正确的答案</a>
                        </div>
                        <div>
                            <textarea name="content" id="SPEditor" class="hidden"></textarea>
                        </div>`);
            let button1 = ``;
            if ((Data.QueueNum + 1) === Data.Total) {
                button1 = `<a class="btn btn-success btn-lg" onclick="commitPractice('#` + $(sp).attr('id') + `',` + Data.Role + `)">提交检测</a>`
            } else {
                button1 = `<a class="btn btn-danger btn-lg" onclick="commitPractice('#` + $(sp).attr('id') + `',` + Data.Role + `)">结束训练</a>
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
                    let QueueNum = Data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer}
                    getSpecialPractice(sp, QueueNum, commitData);
                } else {
                    warningAlert("请填写你的答案！");
                }
            });
        }
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "SpecialPracticeContent"]);
    });
}

function getSpecialPractice(sp, num, commitData) {
    $.post("/user/getPractice/" + num, commitData, (data) => {
        if (data.code !== 0) {
            errorAlert(data.msg);
            return
        }
        let Data = data.data;
        let percent = number_format((Data.QueueNum + 1) / Data.Total * 100, 2, ".", ",");
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
        if (Data.Content === undefined) {
            $(content).empty().append(`<h2 class="text-center text-danger"> 暂无题库</h2>`);
            return
        }
        if (Data.Role === 1) {
            let choices = ``;
            let letterNumber = 65;
            for (let i = 0; i < Data.Choices.length; i++) {
                choices += `<div>
                            <label for="">
                            <input type="radio" name="choice" value="` + Data.Choices[i] + `">
                                <span>` + String.fromCharCode(letterNumber++) + `.` + Data.Choices[i] + `</span>
                            </label>
                        </div>`
            }
            $(content).empty().append(`<h2 class="text-muted well">` + Data.Content + `</h2>`);
            $(content).append(choices);
            $(content).find("p").css("display", "inline");
            let button1 = ``;
            if ((Data.QueueNum + 1) === Data.Total) {
                button1 = `<a class="btn btn-success btn-lg col-sm-offset-9" onclick="commitPractice('#` + $(sp).attr('id') + `',` + Data.Role + `)">提交检测</a>`
            } else {
                button1 = `<a class="btn btn-danger btn-lg col-sm-offset-9" onclick="commitPractice('#` + $(sp).attr('id') + `',` + Data.Role + `)">结束训练</a>
                            <a class="btn btn-success btn-lg" id="nextSPQuestion">下一题</a>`
            }
            $(backGroup).empty().append(button1);
            $("#nextSPQuestion").on("click", (e) => {
                let parent = $(e.target).parent("div").parent("div");
                let userAnswer = $(parent).find('input[name="choice"]:checked').val();
                if (userAnswer !== undefined) {
                    $(parent).empty();
                    let QueueNum = Data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSpecialPractice(sp, QueueNum, commitData);
                } else {
                    warningAlert("请选择你认为正确的答案！");
                }

            });
        } else {
            $(content).empty().append(`<h2 class="text-muted well">` + Data.Content + `</h2>`);
            $(content).append(`<div>
                            <a href="javascript:void(0);" onclick="showEditor(this,'#SPEditor','#backGroup');"
                               id="showSPEditor">填写你最简正确的答案</a>
                        </div>
                        <div>
                            <textarea name="content" id="SPEditor" class="hidden"></textarea>
                        </div>`);
            let button1 = ``;
            if ((Data.QueueNum + 1) === Data.Total) {
                button1 = `<a class="btn btn-success btn-lg" onclick="commitPractice('#` + $(sp).attr('id') + `',` + Data.Role + `)">提交检测</a>`
            } else {
                button1 = `<a class="btn btn-danger btn-lg" onclick="commitPractice('#` + $(sp).attr('id') + `',` + Data.Role + `)">结束训练</a>
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
                    let QueueNum = Data.QueueNum;
                    QueueNum++;
                    let commitData = {answer: userAnswer};
                    getSpecialPractice(sp, QueueNum, commitData);
                } else {
                    warningAlert("请填写你的答案！");
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
            warningAlert("请选择你认为正确的答案！");
            return
        }
    } else {
        userAnswer = $(sp).find('#showSPEditor').attr("data-content");
        if (userAnswer !== undefined && userAnswer.length > 0) {
            $(sp).empty();
        } else {
            warningAlert("请填写你的答案！");
            return
        }
    }
    $.post("/user/commitPractice",
        {answer: userAnswer},
        (data) => {
            if (data.code !== 0) {
                errorAlert(data.msg);
                return
            }
            infoAlert("训练完成！辛苦啦!");
            let Data = data.data;
            let tbody = ``;
            for (let i = 0; i < Data.Practices.length; i++) {
                let textClass = ``;
                if (Data.Practices[i].Select !== null) {
                    if (Data.Practices[i].Select.Correct) {
                        textClass = `class="text-success"`;
                    } else {
                        textClass = `class="text-danger"`;
                    }
                    tbody += `<tr>
                                    <td>` + (i + 1) + `</td>
                                    <td>` + Data.Practices[i].Select.Train.Content + `</td>
                                    <td ` + textClass + `>` + Data.Practices[i].Select.UserAnswer + `</td>
                                    <td>` + Data.Practices[i].Select.Answer + `</td>
                                </tr>`;
                } else {
                    if (Data.Practices[i].UnSelect.Correct) {
                        textClass = `class="text-success"`;
                    } else {
                        textClass = `class="text-danger"`;
                    }
                    tbody += `<tr>
                                    <td>` + (i + 1) + `</td>
                                    <td>` + Data.Practices[i].UnSelect.Train.Content + `</td>
                                    <td ` + textClass + `>` + Data.Practices[i].UnSelect.UserAnswer + `</td>
                                    <td>` + Data.Practices[i].UnSelect.Answer + `</td>
                                </tr>`;
                }
            }
            $(sp).append(`<div>
                        <h1 class="text-center text-muted">训练成果</h1>
                        <h2 class="text-center text-muted">当前总计：` + Data.View + `</h2>
                        <h2 class="text-center text-success">正确数目：` + Data.Correct + `</h2>   
                        <h2 class="text-center text-primary">正确率：` + number_format((Data.Correct / Data.View * 100), 2, ".", ",") + `%</h2>          
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

function getQuestionReview(pageNow,controls, total) {
    if (pageNow < 1) {
        infoAlert("已经是第一页了，别按了!");
        return;
    }
    if (pageNow > total) {
        infoAlert("已经是最后一页了，我是有底线的!");
        return
    }
    $.get("/user/getQuestionReview/" + pageNow, (data) => {
        if (data.code !== 0) {
            errorAlert(data.msg);
            return
        }
        let tbody = ``;
        let Data = data.data;
        for (let i = 0; i < Data.length; i++) {
            let addition = ``;
            if (Data[i].Addition != null && Data[i].Addition.length > 0) {
                for (let j = 0; j < Data[i].Addition.length; j++) {
                    addition += `` + delPagraph(Data[i].Addition[j], 18);
                }
            } else {
                addition = `无`;
            }
            let reviewer = ``;
            if (Data[i].Reviewers != null && Data[i].Reviewers.length > 0) {
                for (let j = 0; j < Data[i].Reviewers.length; j++) {
                    reviewer += `<p>` + Data[i].Reviewers[j] + `</p>`;
                }
            } else {
                reviewer = `无`;
            }
            tbody += `<tr>
                        <td>` + (i + 1) + `</td>
                        <td>` + delPagraph(Data[i].Content, 18) + `</td>
                        <td>` + Data[i].QuestionType + `</td>
                        <td>` + addition + `</td>
                        <td>` + delPagraph(Data[i].Answer, 18) + `</td>
                        <td>` + Data[i].ViewNum + `</td>
                        <td>` + reviewer + `</td>
                        <td><a class="btn btn-warning" href="javascript:void(0);" onclick="ChangeReview(` + Data[i].Id + `,'` + controls + `')">修改</a></td>
                        <td><a class="btn btn-success" href="javascript:void(0);" onclick="QuestionReviewPass(` + Data[i].Id + `,'` + controls + `')">通过</a></td>
                    </tr>`
        }
        $(controls).empty().append(`<table class="table table-hover">
                        <caption><h1 class="text-center text-muted">新增试题审核</h1></caption>
                        <thead>
                        <tr>
                            <td width="5%">No.</td>
                            <td>题目</td>
                            <td width="9%">题目类型</td>
                            <td>附加</td>
                            <td>答案</td>
                            <td width="9%">审核次数</td>
                            <td width="9%">审核人</td>
                            <td colspan="2" class="text-center" width="10%">操作</td>
                        </tr>
                        </thead>
                        <tbody>
                        ` + tbody + `
                        </tbody>
                    </table>`);
        if (data.count >= 2) {
            let pages = ``;
            for (let i = 1; i <= data.count; i++) {
                pages += `<li><a href="javascript:void(0)" onclick="getQuestionReview(` + i + `,'` + controls + `',` + data.count + `)">` + i + `</a></li>`
            }
            let beforePage = pageNow - 1;
            let nextPage = pageNow + 1;
            $(controls).append(`<nav aria-label="Page navigation" class="text-center">
                    <ul class="pagination">
                    <li>
                    <a href="javascript:void(0);" onclick="getQuestionReview(` + beforePage + `,'` + controls + `',` + data.count + `)" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                    ` + pages + `
                <li>
                <a href="javascript:void(0);" onclick="getQuestionReview(` + nextPage + `,'` + controls + `',` + data.count + `)" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
                </ul>
                </nav>`);
        }
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, controls.substring(1)]);
    })
}

function getBasicReview(controls) {
    $.get("/user/getBasicReview", (data) => {
        if (data.code === 0) {
            let tbody = ``;
            let Data = data.data;
            for (let i = 0; i < Data.length; i++) {
                let formulas = ``;
                for (let k = 0; k < Data[i].FormulaReviews.length; k++) {
                    formulas += `<a tabindex="0" class="btn btn-default" role="button" data-toggle="popover"
                                   data-trigger="focus" title="可执行操作"
                                   data-template="<div class='popover' role='tooltip'>
                       <div class='arrow'></div>
                       <h3 class='popover-title'></h3>
                       <div>
                       <a class='btn btn-success' onclick='passBasic(` + Data[i].FormulaReviews[k].Id + `,70)'>通过</a>
                       <a class='btn btn-warning' onclick='changeBasic(` + Data[i].FormulaReviews[k].Id + `,70)'>修改</a>
                       </div>
                       </div>">` + delPagraph(Data[i].FormulaReviews[k].Content, 14) + `</a>`;
                }

                let knowledges = ``;
                for (let k = 0; k < Data[i].KnowledgeReviews.length; k++) {
                    knowledges += `<a tabindex="0" style="" class="btn btn-default" role="button" data-toggle="popover"
                                   data-trigger="focus" title="可执行操作"
                                   data-template="<div class='popover' role='tooltip'>
                       <div class='arrow'></div>
                       <h3 class='popover-title'></h3>
                       <div>
                       <a class='btn btn-success' onclick='passBasic(` + Data[i].KnowledgeReviews[k].Id + `,75)'>通过</a>
                       <a class='btn btn-warning' onclick='changeBasic(` + Data[i].KnowledgeReviews[k].Id + `,75)'>修改</a>
                       </div>
                       </div>">` + delPagraph(Data[i].KnowledgeReviews[k].Content, 14) + `</a>`;
                }

                let hds = ``;
                for (let k = 0; k < Data[i].HDifficultReviews.length; k++) {
                    hds += `<a tabindex="0" class="btn btn-default" role="button" data-toggle="popover"
                                   data-trigger="focus" title="可执行操作" data-placement="top"
                                   data-template="<div class='popover' role='tooltip'>
                       <div class='arrow'></div>
                       <h3 class='popover-title'></h3>
                       <div>
                       <a class='btn btn-success' onclick='passBasic(` + Data[i].HDifficultReviews[k].Id + `,72)'>通过</a>
                       <a class='btn btn-warning' onclick='changeBasic(` + Data[i].HDifficultReviews[k].Id + `,72)'>修改</a>
                       </div>
                       </div>">` + delPagraph(Data[i].HDifficultReviews[k].Content, 14) + `</a>`;
                }

                let tests = ``;
                for (let k = 0; k < Data[i].TestReviews.length; k++) {
                    tests += `<a tabindex="0" class="btn btn-default" role="button" data-toggle="popover"
                                   data-trigger="focus" title="可执行操作"
                                   data-template="<div class='popover' role='tooltip'>
                       <div class='arrow'></div>
                       <h3 class='popover-title'></h3>
                       <div>
                       <a class='btn btn-success' onclick='passBasic(` + Data[i].TestReviews[k].Id + `,69)'>通过</a>
                       <a class='btn btn-warning' onclick='changeBasic(` + Data[i].TestReviews[k].Id + `,69)'>修改</a>
                       </div>
                       </div>">` + delPagraph(Data[i].TestReviews[k].Content, 14) + `</a>`;
                }

                tbody += `<tr>
                            <td>` + (i + 1) + `</td>
                            <td>` + Data[i].Role + `</td>
                            <td>
                            <a tabindex="0" class="btn btn-default" role="button" data-toggle="popover"
                                                               data-trigger="focus" title="可执行操作"
                                                               data-template="<div class='popover' role='tooltip'>
                                                   <div class='arrow'></div>
                                                   <h3 class='popover-title'></h3>
                                                   <div>
                                                   <a class='btn btn-success' onclick='passBasic(` + Data[i].Id + `,66)'>通过</a>
                                                   <a class='btn btn-warning' onclick='changeBasic(` + Data[i].Id + `,66)'>修改</a>
                                                   </div>
                                                   </div>">` + delPagraph(Data[i].Content, 14) + `</a>
                                                   </td>
                            <td>` + knowledges + `</td>
                            <td>` + formulas + `</td>
                            <td>` + tests + `</td>
                            <td>` + hds + `</td>     
                           </tr>`;
            }
            $(controls).empty().append(`<table class="table table-hover">
                        <caption><h1 class="text-muted text-center">新增基础知识审核</h1></caption>
                        
                        <thead>
                        <tr>
                            <td width="4%">No.</td>
                            <td width="8%">分类</td>
                            <td>概念</td>
                            <td>知识点精讲</td>
                            <td>相关公式</td>
                            <td>考点</td>
                            <td>重难点</td>
                        </tr>
                        </thead>
                        <tbody>
                        ` + tbody + `
                        </tbody>
                    </table>`);
            $('[data-toggle="popover"]').popover();
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, controls.substring(1)]);
        }
    });
}

function passBasic(id, group) {
    let g = String.fromCharCode(group);
    $.get("/user/passBasic/" + id + "/" + g, (data) => {
        if (data.code === 0) {
            successAlert(data.msg);
            getBasicReview('#KnowledgeReview')
        }
    });
}

function changeBasic(id, group) {
    let g = String.fromCharCode(group);
    $.get("/user/changeBasic/" + id + "/" + g, (data) => {
        if (data.code === 0) {
            let controls = "#KnowledgeReview";
            $(controls).empty().append(`
                    <h1 class="text-center text-muted">基础知识修改</h1>
                    <form action="" class="text-muted">
                        <div class="form-group row">
                            <label for="showChangeBasicContent" class="col-sm-2 control-label">题目：</label>
                            <div class="col-sm-10">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeBasicEditor','#backChangeBasicGroup');"
                                   id="showChangeBasicContent" data-content="` + data.data + `">` + data.data + `</a>
                            </div>
                        </div>
                        <div class="form-group">
                            <textarea name="content" id="changeBasicEditor" class="hidden"></textarea>
                        </div>
                        <div class="form-group row" id="backChangeBasicGroup">
                            <div class="col-md-3 col-md-offset-9">
                                <a class="btn btn-warning btn-lg" id="changeBasicBtn">修改</a>
                            </div>
                            <div class="col-md-3 col-md-offset-9 hidden">
                                <a class="btn btn-primary btn-lg"
                                   onclick="backToLast('#backChangeBasicGroup','#changeBasicEditor');">确认</a>
                            </div>
                        </div>

                    </form>
                `);
            $("#changeBasicBtn").on("click", () => {
                let content = $("#showChangeBasicContent").attr("data-content");
                $.post(
                    "/user/updateBasic",
                    {
                        id: id,
                        content: content,
                        group: g,
                    },
                    (data) => {
                        if (data.code === 0) {
                            successAlert(data.msg);
                            getBasicReview(controls);
                        }
                    })
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, controls.substring(1)]);
        }
    })
}

function ChangeReview(id, controls) {
    $.get("/user/getSingleReviewQuestion/" + id, (data) => {
        if (data.code === 0) {
            let other = ``;
            let Data = data.data;
            if (Data.Role === 1) {
                other = `<div class="form-group row">
                            <label for="showSelectChangeA" class="col-sm-1 control-label">A.</label>
                            <div class="col-sm-5">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showSelectChangeA" data-content="` + Data.Addition[0] + `">` + Data.Addition[0] + `</a>
                            </div>
                            <label for="showSelectChangeB" class="col-sm-1 control-label">B.</label>
                            <div class="col-sm-5">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showSelectChangeB" data-content="` + Data.Addition[1] + `">` + Data.Addition[1] + `</a>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="showSelectChangeC" class="col-sm-1 control-label">C.</label>
                            <div class="col-sm-5">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showSelectChangeC" data-content="` + Data.Addition[2] + `">` + Data.Addition[2] + `</a>
                            </div>
                            <label for="showSelectChangeD" class="col-sm-1 control-label">D.</label>
                            <div class="col-sm-5">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showSelectChangeD" data-content="` + Data.Addition[3] + `">` + Data.Addition[3] + `</a>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="showAnswerChangeSelect" class="col-sm-1 control-label">答案：</label>
                            <div class="col-sm-5">
                                <select id="showAnswerChangeSelect">
                                    <option value="` + Data.Addition[0] + `" ` + (Data.Addition[0] === Data.Answer ? "selected='selected'" : "") + `>A</option>
                                    <option value="` + Data.Addition[1] + `" ` + (Data.Addition[1] === Data.Answer ? "selected='selected'" : "") + `>B</option>
                                    <option value="` + Data.Addition[2] + `" ` + (Data.Addition[2] === Data.Answer ? "selected='selected'" : "") + `>C</option>
                                    <option value="` + Data.Addition[3] + `" ` + (Data.Addition[3] === Data.Answer ? "selected='selected'" : "") + `>D</option>
                                </select>
                            </div>
                        </div>`;
            } else {
                other = `<div class="form-group row">
                            <label for="showAnswerChange" class="col-sm-2 control-label">答案：</label>
                            <div class="col-sm-10">
                                <a href="javascript:void(0);"
                                   onclick="showEditor(this,'#changeEditor','#backChangeGroup');"
                                   id="showAnswerChange" title="可填" data-content="` + Data.Answer + `">` + Data.Answer + `</a>
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
                                   id="showChangeContent" data-content="` + Data.Content + `">` + Data.Content + `</a>
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
                if (Data.Role === 1) {
                    let content = $("#showChangeContent").attr("data-content");
                    let answer = $("#showAnswerChangeSelect").val();

                    let allSelect = $(controls).find("a[id^=showSelectChange]");
                    let choice = "";
                    let choiceNum = 0;
                    for (let i = 0; i < allSelect.length; i++) {
                        if (typeof ($(allSelect[i]).attr("data-content")) !== "undefined" && $(allSelect[i]).attr("data-content").length > 0) {
                            choice += $(allSelect[i]).attr("data-content") + "~￥";
                            choiceNum++;
                        }
                    }
                    if (choiceNum < 4) {
                        warningAlert("选项不充足");
                        return
                    }
                    changeData = {
                        content: content,
                        choices: choice,
                        ans: answer,
                        role: Data.Role,
                    };
                } else {
                    let content = $("#showChangeContent").attr("data-content");
                    let answer = $("#showAnswerChange").attr("data-content");
                    changeData = {
                        content: content,
                        ans: answer,
                        role: Data.Role,
                    }
                }
                $.post(
                    "/user/changeQuestion/" + Data.Id,
                    changeData,
                    (data) => {
                        if (data.code === 0) {
                            successAlert(data.msg);
                            getQuestionReview(1,controls, 1);
                        }
                    });
            });
        }
    });
}

function QuestionReviewPass(id, controls) {
    $.get("/user/passQuestionReview/" + id, (data) => {
        if (data.code === 0) {
            successAlert(data.msg);
            getQuestionReview(1,controls, 1)
        }
    })
}