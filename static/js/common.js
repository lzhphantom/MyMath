//为login检测
function notLogin() {
    infoAlert("请登录在进行其他操作！");
    $("#login").modal("show");
}

function UNACTION() {
    infoAlert("该功能正在修建中...");
}

/**
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 */
function number_format(number, decimals, dec_point, thousands_sep) {

    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,

        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.floor(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.floor(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function delPagraph(text, allowLength) {
    let arr = text.split(/<p>\\\(|\\\)<\/p>/);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
            arr.splice(i, 1);
            i--;
        }
    }
    let newContent = ``;
    for (let i = 0; i < arr.length; i++) {
        let content = [];

        let newString = arr[i];
        let end = 0;
        let lbrace = 0;
        let rbrace = 0;
        let chnWord = 0;
        while (isStringLengthIncludeChinese(newString) > allowLength) {
            if (newString[end] === "{") {
                lbrace++
            } else if (newString[end] === "}") {
                rbrace++
            } else if (isChinese(newString[end])) {
                chnWord++;
            }
            if (end + chnWord >= allowLength && lbrace === rbrace) {
                let param = newString.substring(0, end + 1);
                content.push(param);
                newString = newString.substring(end + 1);
                lbrace = 0;
                rbrace = 0;
                chnWord = 0;
                end = 0
                continue
            }
            end++
        }
        if (newString.length > 0) {
            content.push(newString)
        }
        newContent += `<p>\\(` + content.join("\\\\") + `\\)</p>`;
    }

    return newContent
}

function addMathFormula(text) {
    let arr = text.split(/<p>|<\/p>/);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
            arr.splice(i, 1);
            i--;
        }
    }
    let content = ``;
    for (let i = 0; i < arr.length; i++) {
        content += `<p>\\\(` + arr[i] + `\\\)</p>`;
    }
    return content
}

function isChinese(temp) {
    //中文
    let re = /[\u4e00-\u9fa5]/;
    //中文符号
    let pointre = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/
    if (re.test(temp) || pointre.test(temp)) return true;
    return false;
}

function isStringLengthIncludeChinese(text) {
    let length = 0;
    for (let i = 0; i < text.length; i++) {
        if (isChinese(text[i])) {
            length += 2;
        } else {
            length++;
        }
    }
    return length
}

// function sweetAlert() {
//     swal({
//         text: "",//显示文本
//         title: "",//标题
//         icon: "",//图标[warning,error,success,info]
//         button: "",//[string,boolean,buttonOptions]
//         content: "",//[Node,string]
//         closeOnClickOutside: false, //点击提示框外部是否可以关闭提示框
//         closeOnEsc: false,//esc关闭提示框
//         dangerMode:false,//true,确认按钮变为红色，并且默认焦点设置在取消按钮上。 在显示确认方式很危险的警告模式（例如删除项目）时，这很方便。
//         buttons:false,
//         timer:1000,//1s后关闭modal，通常和buttons:false联合使用
//         className:"",//将自定义类添加到SweetAlert模态。 这对于更改外观非常方便。
//     });
// }
/**
 * 警告提示框
 * @param message 文本内容
 */
function warningAlert(message) {
    swal({
        title: "m(｡≧ｴ≦｡)m警告",
        text: message,
        icon: "warning",
        buttons: false,
        timer: 1000,
        closeOnClickOutside: false,
        closeOnEsc: false,
    });
}

/**
 * 成功提示框
 * @param message 文本内容
 */
function successAlert(message) {
    swal({
        title: "ξ( ✿＞◡❛)恭喜",
        text: message,
        icon: "success",
        buttons: false,
        timer: 1000,
        closeOnClickOutside: false,
        closeOnEsc: false,
    });
}

/**
 * 错误提示框
 * @param message 文本内容
 */
function errorAlert(message) {
    swal({
        title: "(;´༎ຶД༎ຶ`)出错啦!",
        text: message,
        icon: "error",
        buttons: false,
        timer: 1000,
        closeOnClickOutside: false,
        closeOnEsc: false,
    });
}

/**
 * 消息提示框
 * @param message 文本内容
 */
function infoAlert(message) {
    swal({
        title: "ε٩(๑> ₃ <)۶з嗨！",
        text: message,
        icon: "info",
        buttons: false,
        timer: 1000,
        closeOnClickOutside: false,
        closeOnEsc: false,
    });
}

function errorJump(back) {

    setInterval(function () {
        if (back === 1) {
            window.history.back(-1);
        }else {
            window.location.href="/"
        }
    }, 3000);

}