import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const MapComponent = () => {
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

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, []);

  return <div id="chartdiv3" style={{ width: '100%', height: '200px' }}></div>;
};

export default MapComponent;