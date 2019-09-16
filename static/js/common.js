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

function delPagraph(text) {
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
        while (newString.length > 14) {
            if (newString[end] === "{") {
                lbrace++
            } else if (newString[end] === "}") {
                rbrace++
            } else if (isChinese(newString[end])) {
                chnWord ++;
            }
            if (end + chnWord >= 14 && lbrace === rbrace) {
                let param = newString.substring(0, end + 1);
                content.push(param);
                newString = newString.substring(end + 1);
                lbrace = 0;
                rbrace = 0;
                chnWord = 0;
                end = 0
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
    var re = /[\u4e00-\u9fa5]/;
    if (re.test(temp)) return true;
    return false;
}