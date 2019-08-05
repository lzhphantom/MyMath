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

            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                let id = $(e.target).attr("data-id");
                let controls = $(e.target).attr("href");
                $.get("/admin/basicContent/" + id, function (data, status) {
                    let $modal = $(controls);
                    $($modal).empty();
                    $($modal).append(`<h1 class="text-center">基础知识</h1>`);

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

});

