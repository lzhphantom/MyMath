$(() => {
    let aList = $("#userModal").find("a");
    for (let i = 0; i < aList.length; i++) {
        $(aList[i]).on("click", () => {
            let id = $(aList[i]).attr("for-id");
            if (id === "#studentManage" || id === "#teacherManage" || id === "#adminManage") {
                let reqData = {};
                if (id === "#studentManage") {
                    reqData.group = 1
                } else if (id === "#teacherManage") {
                    reqData.group = 2
                } else if (id === "#adminManage") {
                    reqData.group = 0
                }
                $.post(
                    "/LS/searchUser",
                    reqData,
                    function (data, status) {
                        $(id).find("tbody").empty();
                        for (let i = 0; i < data.length; i++) {
                            let sex = "";
                            if (data[i].UserInfo.Sex === 0) {
                                sex = "女"
                            } else {
                                sex = "男"
                            }
                            $(id).find("tbody").append(`
                            <tr>
                                <td>` + (i + 1) + `</td>
                                <td>` + data[i].UserName + `</td>
                                <td>` + data[i].Password.replace(/\S{28}(\S{4})/, '*********$1') + `</td>
                                <td>` + data[i].UserInfo.Name.replace(/(\S{1})\S*/, '$1**') + `</td>
                                <td>` + sex + `</td>
                                <td>` + data[i].UserInfo.Tel.replace(/\d{7}(\d{4})/, '*******$1') + `</td>
                                <td>` + data[i].UserInfo.Address + `</td>
                            </tr>`)
                        }
                    }
                )

            }
            $("#userModal").addClass("hidden");
            $(id).removeClass("hidden");
        });
    }

    $("input,select").not("[type=submit]").jqBootstrapValidation();

});

function backToUserModal(obj) {
    let userAdd = $(obj).closest("#userAdd");
    if (userAdd.length > 0) {
        $("#userAdd").addClass("hidden");
    } else {
        $(obj).parent("div").parent("div").addClass("hidden");
    }
    $("#userModal").removeClass("hidden");

}