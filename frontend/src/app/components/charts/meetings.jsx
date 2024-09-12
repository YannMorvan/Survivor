import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const PieChartComponent = ({ data }) => {

  useEffect(() => {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv4", am4charts.PieChart);

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "meetings";
    pieSeries.dataFields.category = "Sources";

    chart.innerRadius = am4core.percent(40);

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

    pieSeries.colors.list = [
      am4core.color("#798BFF"),
      am4core.color("#B8ACFF"),
      am4core.color("#FFA9CE"),
      am4core.color("#F8D974"),
      am4core.color("#FF6F61"),
      am4core.color("#6B8E23"),
    ];

    chart.legend = new am4charts.Legend();

    chart.legend.valueLabels.template.html = `
    <div>
        <span style="color: #000; font-size: 16px;"> {value}</span>
        <span style="color: #91A3B9; font-size: 12px;">{value.percent.formatNumber('#.0')}%</span>
    </div>
  `;

    chart.legend.labels.template.fontSize = 12;
    chart.legend.labels.template.fill = am4core.color("#91A3B9");

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

  
    chart.data = chartData;

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, [data]);

  return <div id="chartdiv4" style={{ width: "100%", height: "300px" }}></div>;
};

export default PieChartComponent;
