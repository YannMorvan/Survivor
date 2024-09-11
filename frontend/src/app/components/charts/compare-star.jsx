import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const StarComparisonChart = ({ coach1, coach2, data1, data2 }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create('chartdiv4', am4charts.XYChart);

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    let chartData = [];

    const combinedData = [...data1, ...data2].reduce((acc, current) => {
      const existing = acc.find(item => new Date(item.date).getTime() === new Date(current.date).getTime());
      if (existing) {
        if (data1.includes(current)) {
          existing.star1 = current.rating;
        } else {
          existing.star2 = current.rating;
        }
      } else {
        acc.push({
          date: new Date(current.date),
          star1: data1.includes(current) ? current.rating : undefined,
          star2: data2.includes(current) ? current.rating : undefined,
        });
      }
      return acc;
    }, []);

    chart.data = combinedData;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.labels.template.adapter.add("visible", function(visible, target) {
      return target.dataItem.index % 2 === 0;
    });
    dateAxis.renderer.labels.template.fill = am4core.color("#808080");
    dateAxis.renderer.labels.template.fontSize = 12;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Star Ratings";
    valueAxis.title.fontWeight = 800;
    valueAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;

    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = 'star1';
    series1.dataFields.dateX = 'date';
    series1.strokeWidth = 2;
    series1.minBulletDistance = 10;
    series1.tooltipText = "[bold]{date.formatDate()}:[/] " + coach1 + ": {valueY}";
    series1.tooltip.pointerOrientation = 'vertical';
    series1.name = coach1;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = 'star2';
    series2.dataFields.dateX = 'date';
    series2.strokeWidth = 2;
    series2.strokeDasharray = '3,4';
    series2.tooltipText = "[bold]{date.formatDate()}:[/] " + coach2 + ": {valueY}";
    series2.name = coach2;

    series1.fillOpacity = 0.5; 
    series1.fill = am4core.color("#AAD9FF");

    series2.fillOpacity = 0.5; 
    series2.fill = am4core.color("#67b7dc");

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [data1, data2]);

  return <div id="chartdiv4" style={{ width: '100%', height: '250px' }}></div>;
};

export default StarComparisonChart;
