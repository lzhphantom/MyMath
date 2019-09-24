$(() => {
    var chart = new CanvasJS.Chart("test_vas", {
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: "题量比"
        },
        legend:{
            cursor: "pointer",
            itemclick: explodePie
        },
        data: [{
            type: "pie",
            showInLegend: true,
            toolTipContent: "{name}: <strong>{y}%</strong>",
            indexLabel: "{name} - {y}%",
            dataPoints: [
                { y: 26, name: "几何", exploded: true },
                { y: 20, name: "集合" },
                { y: 5, name: "不等式" },
                { y: 3, name: "平面向量" },
                { y: 7, name: "数列" },
                { y: 17, name: "排列组合" },
                { y: 22, name: "概率、统计"}
            ]
        }]
    });
    chart.render();

});

function explodePie (e) {
    if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();

}