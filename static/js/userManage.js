$(() => {
    let aList = $("#userModal").find("a");
    for (let i = 0; i < aList.length; i++) {
        $(aList[i]).on("click", () => {
            let id = $(aList[i]).attr("for-id");
            $("#userModal").addClass("hidden");
            $(id).removeClass("hidden");
        });
    }

    jQuery.validator.setDefaults({
        // 仅做校验，不提交表单
        debug: true,
        // 提交表单时做校验
        onsubmit: true,
        // 焦点自动定位到第一个无效元素
        focusInvalid: true,
        // 元素获取焦点时清除错误信息
        focusCleanup: true,
        //忽略 class="ignore" 的项不做校验
        ignore: ".ignore",
        // 忽略title属性的错误提示信息
        ignoreTitle: true,
        // 为错误信息提醒元素的 class 属性增加 invalid
        errorClass: "invalid",
        // 为通过校验的元素的 class 属性增加 valid
        validClass: "valid",
        // 使用 <em> 元素进行错误提醒
        errorElement: "em",
        // 使用 <li> 元素包装错误提醒元素
        wrapper: "li",
        // 将错误提醒元素统一添加到指定元素
        //errorLabelContainer: "#error_messages ul",
        // 自定义错误容器
        errorContainer: "#error_messages ul",
        showErrors: function (errorMap, errorList) {
            $("#error_tips").html("你的信息中有 " + this.numberOfInvalids() + " 个不符合要求, 注意查看要求.");
            this.defaultShowErrors();
        },
        // 自定义错误提示位置
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        // 单个元素校验通过后处理
        success: function (label, element) {
            console.log(label);
            console.log(element);
            label.addClass("valid text-success").text("✔")
        },

        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]").addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element.form).find("label[for=" + element.id + "]").removeClass(errorClass);
        },
        //校验通过后的回调，可用来提交表单
        submitHandler: function (form, event) {
            console.log($(form).attr("id"));
            //$(form).ajaxSubmit();
            //form.submit();
        },
        //校验未通过后的回调
        invalidHandler: function (event, validator) {
            // 'this' refers to the form
            var errors = validator.numberOfInvalids();
            if (errors) {
                var message = errors == 1 ? 'You missed 1 field. It has been highlighted' : 'You missed ' + errors + ' fields. They have been highlighted';
                console.log(message);
            }
        }
    });

    $("#userAddForm").validate({
        rules: {
            userName: {
                required: true,
                minlength: 4,
                maxlength: 12,
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 18,
            },
            password2: {
                required: true,
                minlength: 6,
                maxlength: 18,
            },
            name:{
              required:true,
              minlength:2,
              maxlength:20,
            },
            tel:{
                required:true,
            },
        },
        messages: {
            userName: "输入用户名不符",
            password: "密码不符合",
            password2: "密码不符合",
            name:"姓名不符",
            tel:"手机号码不符"
        }
    });

});

function backToUserModal(obj) {
    $(obj).parent("div").parent("div").addClass("hidden");
    $("#userModal").removeClass("hidden");
}