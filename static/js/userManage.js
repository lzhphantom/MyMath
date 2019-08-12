$(() => {
    let aList = $("#userModal").find("a");
    for (let i = 0; i < aList.length; i++) {
        $(aList[i]).on("click", () => {
            let id = $(aList[i]).attr("for-id");
            $("#userModal").addClass("hidden");
            $(id).removeClass("hidden");
        });
    }

});

function backToUserModal(obj) {
    $(obj).parent("div").parent("div").addClass("hidden");
    $("#userModal").removeClass("hidden");
}