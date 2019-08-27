$(function () {

    $("#register").on('show.bs.modal',(e)=>{
        $("#login").modal('hide');
    });
});