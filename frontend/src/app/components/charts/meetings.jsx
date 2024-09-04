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
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";

    chart.innerRadius = am4core.percent(30);

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

    chart.legend = new am4charts.Legend();

    chart.data = [
      { country: "Lithuania", litres: 501.9 },
      { country: "Germany", litres: 165.8 },
      { country: "Australia", litres: 139.9 },
      { country: "Austria", litres: 128.3 },
      { country: "UK", litres: 99 },
      { country: "Belgium", litres: 60 },
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