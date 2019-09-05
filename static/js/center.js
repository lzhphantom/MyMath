$(function () {

    $('a[role-tab="center"]').on('show.bs.tab', (e) => {
        let id=$(e.target).attr('href');
        $(id).removeClass("hidden");
        $("#welcome").addClass("hidden")
    });
    $('a[role-tab="center"]').on('hide.bs.tab', (e) => {
        let id=$(e.target).attr('href');
        $(id).addClass("hidden")
    });
});