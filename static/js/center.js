$(function () {

    $('a[role-tab="center"]').on('show.bs.tab', (e) => {
        let id = $(e.target).attr('href');
        $(id).removeClass("hidden");
        $("#welcome").addClass("hidden");
        if (id === "#trainingHistory") {
            $("#personal").addClass("hidden");
            $("#uploadRecord").addClass("hidden");
            $("#noPassQuestion").addClass("hidden");
            $.get("/center/trainingHistory", (data, status, xhr) => {
                if (xhr.status === 200) {
                    let tbody = ``;
                    for (let i = 0; i < data.length; i++) {
                        let choices = ``;
                        if (data[i].Addition != null) {
                            for (let j = 0; j < data[i].Addition.length; j++) {
                                choices += `` + data[i].Addition[j];
                            }
                        }
                        if (choices.length == 0) {
                            choices = `无`;
                        }
                        let final = ``;
                        let finalClass = ``;
                        if (data[i].Correct) {
                            finalClass = `class="text-success"`
                            final = `<span class="glyphicon glyphicon-ok"></span>`
                        } else {
                            finalClass = `class="text-danger"`
                            final = `<span class="glyphicon glyphicon-remove"></span>`
                        }

                        tbody += `<tr>
                                    <td>` + (i + 1) + `</td>
                                    <td width="320px;">` + data[i].Content + `</td>
                                    <td>` + data[i].Role + `</td>
                                    <td>` + choices + `</td>
                                    <td>` + data[i].UserAnswer + `</td>
                                    <td>` + data[i].Answer + `</td>
                                    <td ` + finalClass + `>` + final + `</td>
                                </tr>`;
                    }
                    $(id).empty().append(`<table class="table table-hover">
                    <caption><h1 class="text-muted text-center">题海历史</h1></caption>
                    <thead>
                    <tr>
                        <td>NO.</td>
                        <td>题目</td>
                        <td>类型</td>
                        <td>附加</td>
                        <td>答案</td>
                        <td>参考答案</td>
                        <td>对错</td>
                    </tr>
                    </thead>
                    <tbody>
                        ` + tbody + `
                    </tbody>
                </table>`)
                }
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, id.substring(1)]);
            });

        }
        if (id === "#uploadRecord") {
            $("#personal").addClass("hidden");
            $("#trainingHistory").addClass("hidden");
            $("#noPassQuestion").addClass("hidden");
            $.get("/center/uploadRecord", (data, status, xhr) => {
                if (xhr.status === 200) {
                    let tbody = ``;
                    for (let i = 0; i < data.length; i++) {
                        let choices = ``;
                        if (data[i].Addition != null) {
                            for (let j = 0; j < data[i].Addition.length; j++) {
                                choices += `` + data[i].Addition[j];
                            }
                        }
                        if (choices.length == 0) {
                            choices = `无`;
                        }
                        let reviewers=``;
                        if (data[i].Reviewers != null){
                            for (let j=0;j<data[i].Reviewers.length;j++){
                                reviewers+=`<p>`+data[j].Reviewers[j]+`</p>`;
                            }
                        }
                        if (reviewers.length==0){
                            reviewers=`无`;
                        }
                        let time=dayjs(data[i].CreateTime).format('YYYY年MM月DD日');
                        console.log(time);
                        tbody += `<tr>
                                    <td>` + (i + 1) + `</td>
                                    <td width="320px;">` + data[i].Content + `</td>
                                    <td>` + data[i].Role + `</td>
                                    <td>` + choices + `</td>
                                    <td>` + data[i].Answer + `</td>
                                    <td>` + time + `</td>
                                    <td>` + data[i].Review + `</td>
                                    <td>` + reviewers + `</td>
                                </tr>`;
                    }
                    $(id).empty().append(`<table class="table table-hover">
                    <caption><h1 class="text-muted text-center">上传题目记录</h1></caption>
                    <thead>
                    <tr>
                        <td>NO.</td>
                        <td>内容</td>
                        <td>类型</td>
                        <td>附加</td>
                        <td>参考答案</td>
                        <td>创建时间</td>
                        <td>审核</td>
                        <td>审核人员</td>
                    </tr>
                    </thead>
                    <tbody>
                        ` + tbody + `
                    </tbody>
                </table>`)
                }
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, "uploadRecord"]);
            });
        }
        if(id==="#personal"){
            $("#trainingHistory").addClass("hidden");
            $("#uploadRecord").addClass("hidden");
            $("#noPassQuestion").addClass("hidden");
        }
    });

});