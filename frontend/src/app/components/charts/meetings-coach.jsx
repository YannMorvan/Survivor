import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const ChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    am4core.useTheme(am4themes_animated);

    const chart = am4core.create('chartdiv', am4charts.XYChart3D);

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    chart.data = [
      { country: 'Jav', visits: 284 },
      { country: 'Fev', visits: 311 },
      { country: 'Mar', visits: 365 },
      { country: 'Avr', visits: 480 },
      { country: 'Mai', visits: 443 },
      { country: 'Jun', visits: 541 },
      { country: 'Jui', visits: 795 },
      { country: 'Aou', visits: 886 },
      { country: 'Sep', visits: 784 },
      { country: 'Oct', visits: 838 },
      { country: 'Nov', visits: 728 },
      { country: 'Dec', visits: 928 },
    ];

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.horizontalCenter = 'middle';
    categoryAxis.renderer.labels.template.verticalCenter = 'bottom';

    categoryAxis.renderer.labels.template.fill = am4core.color('#808080');
    categoryAxis.renderer.labels.template.fontSize = 12;

    categoryAxis.tooltip.label.rotation = 0;
    categoryAxis.tooltip.label.horizontalCenter = 'middle';
    categoryAxis.tooltip.label.verticalCenter = 'bottom';

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.labels.template.fill = am4core.color('#808080');
    valueAxis.renderer.labels.template.fontSize = 12;

    valueAxis.renderer.minGridDistance = 50; 

    const series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = 'visits';
    series.dataFields.categoryX = 'country';
    series.name = 'Visits';
    series.tooltipText = '{categoryX}: [bold]{valueY}[/]';
    series.columns.template.fillOpacity = 0.8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color('#FFFFFF');

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
  }, []);

  return <div id="chartdiv" style={{ width: '100%', height: '200px' }}></div>;
};

export default ChartComponent;
