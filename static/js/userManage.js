$(() => {
    let aList = $("#userModal").find("a");
    for (let i = 0; i < aList.length; i++) {
        $(aList[i]).on("click", () => {
            let id = $(aList[i]).attr("for-id");
            if (id === "#studentManage") {
                $.post(
                    "/admin/searchUser",
                    {group: 1},
                    function (data, status) {
                        console.log(data);
                        console.log(data[0].UserInfo);
                    }
                )
                $(id).find("tbody").empty().append(`<tr>
                    <td>1</td>
                    <td>luotest</td>
                    <td>1234</td>
                    <td>罗</td>
                    <td>男</td>
                    <td>1321456</td>
                    <td>地址</td>
                </tr>`)
            }
            $("#userModal").addClass("hidden");
            $(id).removeClass("hidden");
        });
    }

    $("input,select").not("[type=submit]").jqBootstrapValidation();

});

function backToUserModal(obj) {
    $(obj).parent("div").parent("div").addClass("hidden");
    $("#userModal").removeClass("hidden");
}