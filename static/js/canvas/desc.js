$(() => {
    window.onload = function () {
        $.get("/center/trainingAnalysis", (data) => {
            if (data.code === 0) {
                let Data = data.data;
                if (Data === null || Data.length === 0) {
                    $("#trainingAnalysis").append(`<p class="text-warning">暂无记录无法分析</p>`)
                    return
                }
                let trainingAnalysis = [];
                let max = 0;
                let index = 0;
                for (let i = 0; i < Data.length; i++) {
                    if (max < Data[i].Num) {
                        max = Data[i].Num;
                        index = i;
                    }
                    trainingAnalysis.push({y: number_format(Data[i].Percent, 2, '.', ','), name: Data[i].Name});
                }
                trainingAnalysis[index].exploded = true;

                var chart = new CanvasJS.Chart("trainingAnalysis", {
                    // exportEnabled: true,
                    animationEnabled: true,
                    title: {
                        text: "分析比"
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: explodePie
                    },
                    data: [{
                        type: "pie",
                        showInLegend: true,
                        toolTipContent: "{name}: <strong>{y}%</strong>",
                        indexLabel: "{name} - {y}%",
                        dataPoints: trainingAnalysis
                    }]
                });
                chart.render();
            } else {
                errorAlert(data.msg);
                return
            }
        });

    };


});

function explodePie(e) {
    if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();

}