$(() => {
    let aList = $("#userModal").find("a");
    for (let i = 0; i < aList.length; i++) {
        $(aList[i]).on("click", () => {
            let id = $(aList[i]).attr("for-id");
            $("#userModal").addClass("hidden");
            $(id).removeClass("hidden");
        });
    }
    $("input,select").not("[type=submit]").jqBootstrapValidation();

    $("#userAddBtn").on("click", () => {
        let userName = $("input[name=userName]").val();
        let password = $("input[name=password]").val();
        let name = $("input[name=name]").val();
        let sex = $("input[name=sex]").val();
        let tel = $("input[name=tel]").val();
        let province = $("select[name=province]").val();
        let city = $("select[name=city]").val();
        let street = $("select[name=street]").val();
        let userGroup = $("select[name=userGroup]").val();
        console.log(userName, password, name, sex, tel, province, city, street, userGroup);
    });

});

function backToUserModal(obj) {
    $(obj).parent("div").parent("div").addClass("hidden");
    $("#userModal").removeClass("hidden");
}