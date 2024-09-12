import React, { useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const LineChart = ({ clientData, period }) => {
  useEffect(() => {

    let root = am5.Root.new("chartdiv");

    console.log(period);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingRight: 30,
    }));

    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: "day", count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    const generateComparisonData = () => {
      const data = [];
      const currentYear = 2024;
      let startDate, endDate;
      const today = new Date();

      if (period === "3M") {
        startDate = (currentYear, today.getMonth() - 3, today.getDate());
        endDate = (currentYear, today.getMonth(), 30);
      } else if (period === "1M") {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 30);
      } else if (period === "7J") {
        startDate = (currentYear, today.getMonth(), today.getDate() - 7);
        endDate = today
      }

      const joinCounts = {};
      clientData.forEach(client => {
        const joinDate = new Date(client.join_date).toDateString();
        if (joinCounts[joinDate]) {
          joinCounts[joinDate] += 1;
        } else {
          joinCounts[joinDate] = 1;
        }
      });

      return Object.keys(joinCounts).map(date => ({
        date: new Date(date).getTime(),
        value1: joinCounts[date],
        value2: 0,
      }));
    };

    const dynamicData = generateComparisonData();

    const fixedData = [
      { date: new Date(2024, 8, 10).getTime(), value1: 10, value2: 0 },
      { date: new Date(2024, 8, 6).getTime(), value1: 30, value2: 0 },
      { date: new Date(2024, 8, 4).getTime(), value1: 10, value2: 0 },
    ];

    const data = [...dynamicData, ...fixedData];

    let series = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value1",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueX.formatDate('dd/MM/yyyy')}: {valueY}"
      })
    }));

    let series2 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Series 2",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value2",
      valueXField: "date"
    }));

    series.strokes.template.setAll({
      strokeWidth: 2
    });

    series2.strokes.template.setAll({
      strokeDasharray: [2, 2],
      strokeWidth: 2
    });

    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["valueX"]
    });

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



    var months = [ "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December" ];

    let startDate, endDate;

    const today = new Date();

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

    if (period === "30 jours") {
      startDate = new Date(2024, today.getMonth(), 1).getTime();
      endDate = new Date(2024, today.getMonth(), 30).getTime();
      createRange(startDate, xAxis, "01 " + months[today.getMonth()] + ", 2024");
      createRange(new Date(2024, 8, 15).getTime(), xAxis, "15 " + months[today.getMonth()] + ", 2024");
      createRange(endDate, xAxis, "30 " + months[today.getMonth()] + ", 2024");
    } else if (period === "7 jours") {
      startDate = new Date(2024, today.getMonth(), today.getDate() - 7).getTime();
      endDate = new Date(2024, today.getMonth(), today.getDate()).getTime();
      createRange(startDate, xAxis, today.getDate() - 7 + " " + months[today.getMonth()] + ", 2024");
      createRange(endDate, xAxis, today.getDate() + " " + months[today.getMonth()] + ", 2024");
    } else if (period === "3 mois") {
      startDate = new Date(2024, today.getMonth() - 3, 1).getTime();
      endDate = new Date(2024, today.getMonth(), 30).getTime();
      createRange(new Date(2024, today.getMonth() - 3, 1).getTime(), xAxis, "01 " + months[today.getMonth() - 2] + ", 2024");
      createRange(new Date(2024, today.getMonth(), 30).getTime(), xAxis, "30 " + months[today.getMonth()] + ", 2024");
    }

    var rendererY = yAxis.get("renderer");
    rendererY.labels.template.set("forceHidden", false);
    var rendererX = xAxis.get("renderer");
    rendererX.grid.template.set("forceHidden", true);
    rendererX.labels.template.set("forceHidden", true);

    series.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true,
      fill: am5.color("#FF0000")
    });

    xAxis.set("min", startDate);
    xAxis.set("max", endDate);

    series.data.setAll(data);
    series2.data.setAll(data);

    series.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [clientData, period]);

  return (
    <div id="chartdiv" style={{ width: "100%", height: "250px" }}></div>
  );
};

export default LineChart;
