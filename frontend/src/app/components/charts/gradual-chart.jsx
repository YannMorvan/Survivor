import React, { useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const PieChartComponent = () => {
  useLayoutEffect(() => {
    am4core.useTheme(am4themes_animated);

    const chart = am4core.create('chartdiv5', am4charts.PieChart);

    if (chart.logo) {
        chart.logo.disabled = true;
    }

    chart.hiddenState.properties.opacity = 0;

    chart.data = [
      { country: 'Lithuania', value: 260 },
      { country: 'Czechia', value: 230 },
      { country: 'Ireland', value: 200 },
      { country: 'Germany', value: 165 },
      { country: 'Australia', value: 139 },
      { country: 'Austria', value: 128 }
    ];

    const series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = 'value';
    series.dataFields.radiusValue = 'value';
    series.dataFields.category = 'country';
    series.slices.template.cornerRadius = 6;
    series.colors.step = 3;

    series.hiddenState.properties.endAngle = -90;

    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;

    chart.legend = new am4charts.Legend();

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv5" className='w-full h-full'></div>;
};

export default PieChartComponent;
