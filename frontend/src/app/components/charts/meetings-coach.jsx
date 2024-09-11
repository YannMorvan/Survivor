import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const ChartComponent = ({ encounterss }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    am4core.useTheme(am4themes_animated);

    // Process encounters data to count by month
    const encounterCountByMonth = encounterss.reduce((acc, encounter) => {
      const month = new Date(encounter.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(encounterCountByMonth).map(month => ({
      month,
      encounters: encounterCountByMonth[month],
    }));

    const chart = am4core.create('chartdiv', am4charts.XYChart);

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    chart.data = chartData;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'month';
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.horizontalCenter = 'middle';
    categoryAxis.renderer.labels.template.verticalCenter = 'bottom';
    categoryAxis.renderer.labels.template.fill = am4core.color('#808080');
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.minGridDistance = 20;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = am4core.color('#808080');
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.minGridDistance = 50;

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'encounters';
    series.dataFields.categoryX = 'month';
    series.name = 'Encounters';
    series.tooltipText = '{categoryX}: [bold]{valueY}[/]';
    series.columns.template.fillOpacity = 0.8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color('#FFFFFF');
    series.columns.template.width = am4core.percent(40);

    columnTemplate.adapter.add('fill', (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

    columnTemplate.adapter.add('stroke', (stroke, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [encounterss]);

  return <div id="chartdiv" style={{ width: '100%', height: '200px' }}></div>;
};

export default ChartComponent;
