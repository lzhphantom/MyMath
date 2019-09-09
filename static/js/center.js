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

    $("#changeInfo").on('click',()=>{
       $.get('/center/getPersonalInfo',(data,status,xhr)=>{
           if(xhr.status==200){
               $("#personal").empty().append(`
        <form class="col-xs-12 form-horizontal">
                    <div><h1 class="text-muted text-center">个人信息详情修改</h1></div>
                    <div class="form-group">
                        <div class="row">
                            <label class="control-label col-xs-4">登录名：</label>
                            <div class="col-xs-8">
                                <span>
                                    `+data.LoginName+`
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <label class="control-label col-xs-4">姓名：</label>
                            <div class="col-xs-8">
                                <input type="text" value="`+data.UserName+`" name="UserName">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <label class="control-label col-xs-4">性别：</label>
                            <div class="col-xs-8">
                                <span>
                                    `+data.Sex+`
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <label class="control-label col-xs-4">联系电话：</label>
                            <div class="col-xs-8">
                                <input type="text" value="`+data.Tel+`" maxlength="11" name="Tel">
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="row">
                            <label class="control-label col-xs-4">地址：</label>
                            <div class="col-xs-8">
                                <div data-toggle="personalAddress">
                                    <select data-province="---- 选择省 ----" name="province"></select>
                                    <select data-city="---- 选择市 ----" name="city"></select>
                                    <select data-district="---- 选择区 ----" name="street"></select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-xs-4 col-xs-offset-8">
                                <button type="submit" class="btn btn-lg btn-warning">提交</button>
                            </div>
                        </div>
                    </div>
                </form>`);
               $("#personalAddress").distpicker({
                   provice:'四川省',
                   city:'成都市',
                   district:'春熙路',
               });
           }
       })
    });

});