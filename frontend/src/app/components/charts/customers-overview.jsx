import React, { useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const LineChart = () => {
  useEffect(() => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    }));

    chart.get("colors").set("step", 3);

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.3,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, { 
        grid: { visible: false },
        minorGridEnabled: false,
        labels: {
          template: {
            adapter: {
              text: (text, target) => text,
            }
          }
        }
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      max: 1200,
      strictMinMax: true,
      renderer: am5xy.AxisRendererY.new(root, { 
        grid: { visible: false },
        minorGridEnabled: false,
        axisFills: { visible: false },
        labels: {
          adapter: {
            text: (text, target) => {
              let value = target.dataItem.value;
              if (value === 0 || value === 1200) {
                return text;
              } else {
                return "";
              }
            }
          }
        },
        ticks: {
          template: {
            forceHidden: false,
            visible: true,
            strokeWidth: 1,
            strokeOpacity: 1
          }
        }
      })
    }));

    xAxis.get("renderer").labels.template.setAll({
      paddingTop: 35,
      paddingBottom: 15,
      paddingLeft: 15,
      fontSize: 10,
      fill: am5.color("#ACB9CA"),
    });

    yAxis.get("renderer").labels.template.setAll({
      paddingLeft: 15,
      paddingRight: 15,
      fill: am5.color("#ACB9CA"),
    });

    let series = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value1",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueX}: {valueY}\n{previousDate}: {value2}"
      })
    }));

    var rendererY = yAxis.get("renderer");
    rendererY.grid.template.set("forceHidden", true);
    rendererY.labels.template.set("forceHidden", true);

    var rendererX = xAxis.get("renderer");
    rendererX.grid.template.set("forceHidden", true);
    rendererX.labels.template.set("forceHidden", true);

    series.strokes.template.setAll({
      strokeWidth: 2
    });

    series.get("tooltip").get("background").set("fillOpacity", 0.5);

    let series2 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Series 2",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value2",
      valueXField: "date"
    }));

    series2.strokes.template.setAll({
      strokeDasharray: [2, 2],
      strokeWidth: 2
    });

    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["valueX"]
    });

    series.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true
    });

    let data = [{
      date: new Date(2024, 7, 1).getTime(),
      value1: 1050,
      value2: 948,
    }, {
      date: new Date(2024, 7, 5).getTime(),
      value1: 953,
      value2: 851,
    }, {
      date: new Date(2024, 7, 15).getTime(),
      value1: 856,
      value2: 758,
    }, {
      date: new Date(2024, 7, 20).getTime(),
      value1: 1052,
      value2: 953,
    }, {
      date: new Date(2024, 7, 25).getTime(),
      value1: 848,
      value2: 744,
    }, {
      date: new Date(2024, 7, 30).getTime(),
      value1: 1047,
      value2: 942,
    }];

    series.data.setAll(data);
    series2.data.setAll(data);

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

    createRange(0, yAxis, "0");
    createRange(1200, yAxis, "1200");
    createRange(new Date(2024, 7, 1).getTime(), xAxis, "01 Jul, 2024");
    createRange(new Date(2024, 7, 15).getTime(), xAxis, "15 Jul, 2024");
    createRange(new Date(2024, 7, 30).getTime(), xAxis, "30 Jul, 2024");

    yAxis.get("renderer").grid.template.set("forceHidden", true);
    xAxis.get("renderer").grid.template.set("forceHidden", true);

    series.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div id="chartdiv" style={{ width: "100%", height: "250px" }}></div>
  );
};

export default LineChart;
