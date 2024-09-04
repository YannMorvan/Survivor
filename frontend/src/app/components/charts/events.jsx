import React, { useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";

const LineChart = () => {
  useEffect(() => {
    let root = am5.Root.new("chartdiv1");

    const myTheme = am5.Theme.new(root);

    myTheme.rule("AxisLabel", ["minor"]).setAll({
      dy: 1
    });

    root.setThemes([
      am5themes_Animated.new(root),
      myTheme,
      am5themes_Responsive.new(root)
    ]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 30,
      paddingRight: 30,
    }));

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }));
    cursor.lineY.set("visible", false);

    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true,
        minorLabelsEnabled: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    xAxis.set("minorDateFormats", {
      "day": "dd",
      "month": "MM"
    });

    xAxis.get("renderer").labels.template.setAll({
      paddingTop: 20,
      paddingBottom: 15,
      paddingLeft: 10,
      fontSize: 10,
      fill: am5.color("#ACB9CA"),
    });

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    var rendererY = yAxis.get("renderer");
    rendererY.labels.template.set("forceHidden", true);
    var rendererX = xAxis.get("renderer");
    rendererX.grid.template.set("forceHidden", true);
    rendererX.labels.template.set("forceHidden", true);

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    series.columns.template.setAll({
      strokeOpacity: 0,
      fill: am5.color("#9CAAFF")
    });

    const data = [
      { date: new Date(2024, 6, 1).getTime(), value: 100 },
      { date: new Date(2024, 6, 2).getTime(), value: 105 },
      { date: new Date(2024, 6, 3).getTime(), value: 110 },
      { date: new Date(2024, 6, 4).getTime(), value: 95 },
      { date: new Date(2024, 6, 5).getTime(), value: 120 },
      { date: new Date(2024, 6, 6).getTime(), value: 90 },
      { date: new Date(2024, 6, 7).getTime(), value: 115 },
      { date: new Date(2024, 6, 8).getTime(), value: 105 },
      { date: new Date(2024, 6, 9).getTime(), value: 95 },
      { date: new Date(2024, 6, 10).getTime(), value: 95 },
      { date: new Date(2024, 6, 11).getTime(), value: 95 },
      { date: new Date(2024, 6, 12).getTime(), value: 95 },
      { date: new Date(2024, 6, 13).getTime(), value: 95 },
      { date: new Date(2024, 6, 14).getTime(), value: 95 },
      { date: new Date(2024, 6, 15).getTime(), value: 95 },
      { date: new Date(2024, 6, 16).getTime(), value: 95 },
      { date: new Date(2024, 6, 17).getTime(), value: 95 },
      { date: new Date(2024, 6, 18).getTime(), value: 95 },
      { date: new Date(2024, 6, 19).getTime(), value: 95 },
      { date: new Date(2024, 6, 20).getTime(), value: 95 },
      { date: new Date(2024, 6, 21).getTime(), value: 95 },
      { date: new Date(2024, 6, 22).getTime(), value: 95 },
      { date: new Date(2024, 6, 23).getTime(), value: 95 },
      { date: new Date(2024, 6, 24).getTime(), value: 95 },
      { date: new Date(2024, 6, 25).getTime(), value: 95 },
      { date: new Date(2024, 6, 26).getTime(), value: 95 },
      { date: new Date(2024, 6, 27).getTime(), value: 95 },
      { date: new Date(2024, 6, 28).getTime(), value: 95 },
      { date: new Date(2024, 6, 29).getTime(), value: 95 },
      { date: new Date(2024, 6, 30).getTime(), value: 110 },
    ];

    series.data.setAll(data);

    function createRange(value, axis, label) {
      let rangeDataItem = axis.makeDataItem({
        value: value
      });
      
      let range = axis.createAxisRange(rangeDataItem);
      
      range.get("label").setAll({
        forceHidden: false,
        text: label
      });
    
      range.get("grid").setAll({
        forceHidden: false,
        strokeOpacity: 0.2,
        location: 1,
      });
    }

    createRange(new Date(2024, 6, 1).getTime(), xAxis, "01 Jul, 2024");
    createRange(new Date(2024, 6, 31).getTime(), xAxis, "30 Jul, 2024");

    xAxis.get("renderer").grid.template.set("forceHidden", true);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div id="chartdiv1" style={{ width: "100%", height: "250px" }}></div>
  );
};

export default LineChart;
