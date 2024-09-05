import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const PieChartComponent = () => {
  useEffect(() => {

    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv4", am4charts.PieChart);

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "meetings";
    pieSeries.dataFields.category = "Sources";

    chart.innerRadius = am4core.percent(40);

    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.cursorOverStyle = [
      {
        property: "cursor",
        value: "pointer",
      },
    ];

    pieSeries.labels.template.disabled = true;

    let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter());
    shadow.opacity = 0;

    let hoverState = pieSeries.slices.template.states.getKey("hover");
    let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter());
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;

    pieSeries.colors.list = [
      am4core.color("#798BFF"),
      am4core.color("#B8ACFF"),
      am4core.color("#FFA9CE"),
      am4core.color("#F8D974")
    ];

    chart.legend = new am4charts.Legend();

    chart.legend.valueLabels.template.html = `
    <div>
        <span style="color: #000; font-size: 16px;"> {value}</span>
        <span style="color: #91A3B9; font-size: 12px;">{value.percent.formatNumber('#.0')}%</span>
    </div>
  `;

    chart.legend.labels.template.fontSize = 12;
    chart.legend.labels.template.fill = am4core.color("#91A3B9");
    
    chart.data = [
      { Sources: "Dating app", meetings: 301 },
      { Sources: "Social media", meetings: 165 },
      { Sources: "Outside", meetings: 139 },
      { Sources: "Friends", meetings: 128 }
    ];
  

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, []);

  return <div id="chartdiv4" style={{ width: "100%", height: "300px" }}></div>;
};

export default PieChartComponent;
