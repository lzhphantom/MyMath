//为login检测
function notLogin() {
    alert("请登录在进行其他操作！");
    $("#login").modal("show");
}

function UNACTION() {
    alert("该功能正在修建中...");
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

function delPagraph(text,allowLength) {
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