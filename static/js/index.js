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
            }
        });

    });

});


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
                    <div id="Content">
                        
                    </div>
                    <div id="backGroup" class="row">
                        <a class="btn btn-danger btn-lg col-sm-offset-9">结束训练</a>
                        <a class="btn btn-success btn-lg" id="nextQuestion">下一题</a>
                    </div>`);
    let content = $(controls).find("#Content");
    console.log($(content));
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

