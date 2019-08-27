$(function () {
    $("#login").on('show.bs.modal',(e)=>{
        $("#register").modal('hide');
    })
});