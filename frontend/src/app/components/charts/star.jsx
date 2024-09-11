import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const StarComparisonChart = ({ encounters }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    am4core.useTheme(am4themes_animated);

    const sortedEncounters = [...encounters].sort((a, b) => new Date(a.date) - new Date(b.date));

    let chart = am4core.create('chartdiv4', am4charts.XYChart);

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    chart.data = sortedEncounters.map(encounter => ({
      date: new Date(encounter.date),
      star1: encounter.rating
    }));

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.labels.template.fill = am4core.color("#808080");
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.fontWeight = 800;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'star1';
    series.dataFields.dateX = 'date';
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltipText = "[bold]{date.formatDate()}:[/] Rating: {valueY}";
    series.tooltip.pointerOrientation = 'vertical';

    series.fillOpacity = 0.5; 
    series.fill = am4core.color("#67b7dc");

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [encounters]);

  return <div id="chartdiv4" style={{ width: '100%', height: '200px' }}></div>;
};

export default StarComparisonChart;
