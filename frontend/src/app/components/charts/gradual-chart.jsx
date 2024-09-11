import React, { useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const PieChartComponent = ({ data }) => {
  useLayoutEffect(() => {
    am4core.useTheme(am4themes_animated);

    const chart = am4core.create('chartdiv5', am4charts.PieChart);

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "meetings";
    pieSeries.dataFields.category = "Sources";

    chart.innerRadius = am4core.percent(30);

    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.cursorOverStyle = [
      {
        property: 'cursor',
        value: 'pointer',
      },
    ];

    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    const shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter());
    shadow.opacity = 0;

    const hoverState = pieSeries.slices.template.states.getKey('hover');
    const hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter());
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;

    chart.legend = new am4charts.Legend();

    const countOccurrences = (arr) => {
      return arr.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {});
    };

    const occurrences = countOccurrences(data.map((entry) => entry.source));

    const sortedOccurrences = Object.entries(occurrences)
      .sort((a, b) => b[1] - a[1]);

    const topThree = sortedOccurrences.slice(0, 4);
    const topThreeKeys = new Set(topThree.map(([key]) => key));

    const othersCount = sortedOccurrences
      .filter(([key]) => !topThreeKeys.has(key))
      .reduce((acc, [, count]) => acc + count, 0);

    const chartData = [
      ...topThree.map(([key, value]) => ({
        Sources: key,
        meetings: value,
      })),
      {
        Sources: "Autres",
        meetings: othersCount,
      },
    ];

    console.log(chartData);

    chart.data = chartData;


    return () => {
      chart.dispose();
    };
  }, [data]);

  return <div id="chartdiv5" className='w-full h-full' style={{minHeight: '300px'}}></div>;
};

export default PieChartComponent;
