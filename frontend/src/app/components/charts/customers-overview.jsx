import React, { useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { create } from '@amcharts/amcharts4/core';

const LineChart = ({ clientData }) => {
  useEffect(() => {

    const generateComparisonData = () => {
      const data = [];
      const currentYear = 2024;

      for (let day = 1; day <= 30; day++) {
        data.push({
          date: new Date(currentYear, 8, day).getTime(),
          value1: 0,
          value2: 0
        });
      }

      return data;
    };

    const processClientData = (data) => {
      const counts = generateComparisonData();

      data.forEach(client => {
        const date = new Date(client.join_date.split('/').reverse().join('-'));
        const month = date.getMonth();
        const day = date.getDate();

        if (month === 8) {
          counts[day - 1].value1++;
        } else if (month === 7) {
          if (day <= 30) {
            counts[day - 1].value2++;
          }
        }
      });

      return counts;
    };

    const data = processClientData(clientData);

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
      paddingRight: 30,
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
      strictMinMax: true,
      renderer: am5xy.AxisRendererY.new(root, { 
        grid: { visible: false },
        minorGridEnabled: false,
        axisFills: { visible: false },
        labels: {
          adapter: {
            text: (text, target) => {
              let value = target.dataItem.value;
              if (value === 0 || value === 5) {
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
      paddingTop: 20,
      paddingBottom: 15,
      paddingLeft: 20,
      paddingRight: 30,
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

    series.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true,
      fill: am5.color("#FF0000")
    });

    series2.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true,
      fill: am5.color("#FF0000")
    });

    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["valueX"]
    });

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
    createRange(2, yAxis, "2");
    createRange(4, yAxis, "4");
    createRange(new Date(2024, 8, 1).getTime(), xAxis, "01 Sep, 2024");
    createRange(new Date(2024, 8, 15).getTime(), xAxis, "15 Sep, 2024");
    createRange(new Date(2024, 8, 31).getTime(), xAxis, "30 Sep, 2024");

    yAxis.get("renderer").grid.template.set("forceHidden", true);
    xAxis.get("renderer").grid.template.set("forceHidden", true);

    series.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [clientData]);

  return (
    <div id="chartdiv" style={{ width: "100%", height: "250px" }}></div>
  );
};

export default LineChart;
