$(() => {
    window.onload=function () {
        $.get("/center/trainingAnalysis",(data,status,xhr)=>{
            if(xhr.status===200){
                console.log(data);
                let trainingAnalysis=[]
                let max=0;
                let index=0;
                for (let i = 0; i < data.length; i++) {
                    if(max<data[i].Num){
                        max=data[i].Num;
                        index=i;
                    }
                    trainingAnalysis.push({y:data[i].Percent,name:data[i].Name});
                }
                trainingAnalysis[index].exploded=true;

                var chart = new CanvasJS.Chart("trainingAnalysis", {
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
                        dataPoints: trainingAnalysis
                    }]
                });
                chart.render();
            }
        });

    };


});

function explodePie (e) {
    if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();

}