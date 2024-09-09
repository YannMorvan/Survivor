import React, { useLayoutEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const CoachMeetingComparisonChart = () => {
  useLayoutEffect(() => {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv", am4charts.XYChart);

    if (chart.logo) {
        chart.logo.disabled = true;
    }

    chart.numberFormatter.numberFormat = "#.#";

    chart.data = [
      { month: "January", coach1: 30, coach2: 25 },
      { month: "February", coach1: 28, coach2: 32 },
      { month: "March", coach1: 35, coach2: 30 },
      { month: "April", coach1: 32, coach2: 28 },
      { month: "May", coach1: 30, coach2: 27 },
      { month: "June", coach1: 40, coach2: 35 },
      { month: "July", coach1: 38, coach2: 33 },
      { month: "August", coach1: 45, coach2: 40 },
      { month: "September", coach1: 42, coach2: 37 },
      { month: "October", coach1: 50, coach2: 45 },
      { month: "November", coach1: 48, coach2: 44 },
      { month: "December", coach1: 55, coach2: 50 }
    ];

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "coach1";
    series.dataFields.categoryX = "month";
    series.clustered = false;
    series.tooltipText = "Coach 1 meetings in {categoryX}: [bold]{valueY}[/]";
    series.name = "Coach 1";
2
    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "coach2";
    series2.dataFields.categoryX = "month";
    series2.clustered = false;
    series2.columns.template.width = am4core.percent(50);
    series2.tooltipText = "Coach 2 meetings in {categoryX}: [bold]{valueY}[/]";
    series2.name = "Coach 2";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

    chart.legend = new am4charts.Legend();

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "250px" }}></div>;
};

export default CoachMeetingComparisonChart;
