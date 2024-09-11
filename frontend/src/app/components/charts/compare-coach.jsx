import React, { useLayoutEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { groupBy, map } from 'lodash';

const CoachMeetingComparisonChart = ({ coach1, coach2, data1, data2 }) => {
  useLayoutEffect(() => {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv", am4charts.XYChart);

    if (chart.logo) {
        chart.logo.disabled = true;
    }

    const processData = (data) => {
      const groupedByMonth = groupBy(data, item => new Date(item.date).toLocaleString('default', { month: 'long' }));
      return Object.entries(groupedByMonth).map(([month, entries]) => ({
        month,
        count: entries.length
      }));
    };

    const processedData1 = processData(data1);
    const processedData2 = processData(data2);

    // Merge data, ensuring months align
    const months = [...new Set([...processedData1.map(d => d.month), ...processedData2.map(d => d.month)])];
    const mergedData = months.map(month => ({
      month,
      coach1: processedData1.find(d => d.month === month)?.count || 0,
      coach2: processedData2.find(d => d.month === month)?.count || 0
    }));

    chart.data = mergedData;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "coach1";
    series.dataFields.categoryX = "month";
    series.clustered = false;
    series.tooltipText = coach1 + " encounters in {categoryX}: [bold]{valueY}[/]";
    series.name = coach1;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "coach2";
    series2.dataFields.categoryX = "month";
    series2.clustered = false;
    series2.columns.template.width = am4core.percent(50);
    series2.tooltipText = coach2 + " encounters in {categoryX}: [bold]{valueY}[/]";
    series2.name = coach2;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

    chart.legend = new am4charts.Legend();

    return () => {
      chart.dispose();
    };
  }, [data1, data2]);

  return <div id="chartdiv" style={{ width: "100%", height: "250px" }}></div>;
};

export default CoachMeetingComparisonChart;
