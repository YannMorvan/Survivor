import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const MapComponent = ({ clientData }) => {
  useEffect(() => {
    let chart = am4core.create("chartdiv3", am4maps.MapChart);

    if (chart.logo) {
        chart.logo.disabled = true;
    }

    am4core.useTheme(am4themes_animated);

    chart.geodata = am4geodata_worldLow;

    chart.projection = new am4maps.projections.Miller();

    let worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
    worldSeries.exclude = ["AQ"];
    worldSeries.useGeodata = true;

    let polygonTemplate = worldSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#C7D3E4");
    polygonTemplate.nonScalingStroke = true;

    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#9CADF3");

    const countryCounts = clientData.reduce((acc, client) => {
      if (!client.country_code) return acc;
      if (!acc[client.country_code]) {
        acc[client.country_code] = 0;
      }
      acc[client.country_code]++;
      return acc;
    }, {});

    worldSeries.data = Object.keys(countryCounts).map(country => ({
      id: country,
      value: countryCounts[country]
    }));

    const values = Object.values(countryCounts);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    const getColor = (value) => {
      const ratio = (value - minValue) / (maxValue - minValue);
      return am4core.color(am4core.color("#A6D7FF").brighten(ratio * -0.2).toString());
    };

    polygonTemplate.adapter.add("fill", (fill, target) => {
      let value = target.dataItem && target.dataItem.value;
      return value !== undefined ? getColor(value) : fill;
    });

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, [clientData]);

  return <div id="chartdiv3" style={{ width: '100%', height: '200px' }}></div>;
};

export default MapComponent;
