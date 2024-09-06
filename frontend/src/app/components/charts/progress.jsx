import React, { useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const IncomeChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv", am4charts.XYChart3D);

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    if (!data || data < 0 || data > 100) {
      console.error("Invalid data for percentage chart. Data must be between 0 and 100.");
      return;
    }

    // Déterminer la couleur en fonction des seuils
    const getColor = (value) => {
      if (value <= 60) return am4core.color("red");
      if (value <= 75) return am4core.color("#F8DB7A");
      if (value <= 90) return am4core.color("lightgreen");
      return am4core.color("darkgreen");
    };

    // Assigner la couleur basée sur la valeur des données
    chart.data = [
      { year: "2024", income: data, color: getColor(data) }
    ];

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = false;
    categoryAxis.renderer.labels.template.disabled = true;
    categoryAxis.renderer.line.strokeOpacity = 0.5;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.renderer.labels.template.disabled = false;
    valueAxis.renderer.grid.template.strokeOpacity = 0.5;
    valueAxis.renderer.line.strokeOpacity = 0;

    let series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueX = "income";
    series.dataFields.categoryY = "year";
    series.name = "Percentage";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.tooltipText = "{valueX}";
    series.columns.template.column3D.stroke = am4core.color("#fff");
    series.columns.template.column3D.strokeOpacity = 0.2;

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [data]);

  return (
    <div style={{ width: "100%", height: "120px" }}>
      <div id="chartdiv" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default IncomeChart;
