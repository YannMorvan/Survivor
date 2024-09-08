import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {

    am4core.useTheme(am4themes_animated);

    let chart = am4core.create('chartdiv4', am4charts.XYChart);

    if (chart.logo) {
        chart.logo.disabled = true;
    }

    chart.data = [
      { date: new Date(2019, 1, 12), value1: 50, previousDate: new Date(2019, 5, 5) },
      { date: new Date(2019, 2, 13), value1: 53, previousDate: new Date(2019, 5, 6) },
      { date: new Date(2019, 3, 14), value1: 56, previousDate: new Date(2019, 5, 7) },
      { date: new Date(2019, 4, 15), value1: 52, previousDate: new Date(2019, 5, 8) },
      { date: new Date(2019, 5, 16), value1: 48, previousDate: new Date(2019, 5, 9) },
      { date: new Date(2019, 6, 17), value1: 47, previousDate: new Date(2019, 5, 10) },
      { date: new Date(2019, 7, 18), value1: 59, previousDate: new Date(2019, 5, 11) }
    ];

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    dateAxis.renderer.labels.template.adapter.add("visible", function(visible, target) {
      return target.dataItem.index % 2 === 0;
    });
    dateAxis.renderer.labels.template.fill = am4core.color("#808080");
    dateAxis.renderer.labels.template.fontSize = 12;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value1';
    series.dataFields.dateX = 'date';
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltipText = "[bold]{date.formatDate()}:[/] {value1}\n[bold]{previousDate.formatDate()}:[/] {value2}";
    series.tooltip.pointerOrientation = 'vertical';

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = 'value2';
    series2.dataFields.dateX = 'date';
    series2.strokeWidth = 2;
    series2.strokeDasharray = '3,4';
    series2.stroke = series.stroke;

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.disabled = true;
    bullet.propertyFields.disabled = "disabled";

    var secondCircle = bullet.createChild(am4core.Circle);
    secondCircle.radius = 6;
    secondCircle.fill = chart.colors.getIndex(8);


    bullet.events.on("inited", function(event){
    animateBullet(event.target.circle);
    })


    function animateBullet(bullet) {
        var animation = bullet.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
        animation.events.on("animationended", function(event){
        animateBullet(event.target.object);
        })
    }

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, []);

  return <div id="chartdiv4" style={{ width: '100%', height: '200px' }}></div>;
};

export default LineChart;
