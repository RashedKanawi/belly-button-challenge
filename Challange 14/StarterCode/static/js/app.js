const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    var selector = d3.select("#selDataset");
  
    d3.json(url).then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json(url).then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
  
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  function buildCharts(sample) {
    d3.json(url).then((data) => {
      console.log(data);
      var samplesArray = data.samples;
      var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
  
      var metadataArray = data.metadata;
      var resultMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);
  
      var firstSample = resultArray[0];
      console.log(firstSample);
  
      var firstMetadata = resultMetadata[0];
      console.log(firstMetadata);
  
      var otuIds = firstSample.otu_ids;
      var otuLabels = firstSample.otu_labels;
      var sampleValues = firstSample.sample_values;
  
      var wFreq = parseFloat(firstMetadata.wfreq);
  
      var yticks = otuIds.slice(0, 10).map(id => "OTU " + id + " ").reverse();
  
      var barData = [{
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks,
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation:"h",
        marker:{color: "#2986CC"}
        }];
      var barLayout = {
        title: "TOP 10 Bacteria Cultures Found"
      }
      Plotly.newPlot("bar", barData, barLayout);
    
  
      var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        type: "scatter",
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Earth"
        }
      }];
  
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        margins: {
          l: 0,
          r: 0,
          b: 0,
          t: 0     
        },
        hovermode: "closest"
      };
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: wFreq,
        title: {text: "<br><b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
        axis: { range: [null, 9],
          tickmode: 'linear'},
        bar: {color: "#A2165F"},
        steps: [
          { range: [0, 1], color: "#F6EFCC" },
          { range: [1, 2], color: "#EFF0AB" },
          { range: [2, 3], color: "#D6E88B" },
          { range: [3, 4], color: "#B4E06C" },
          { range: [4, 5], color: "#89D74D" },
          { range: [5, 6], color: "#56CD2F" },
          { range: [6, 7], color: "#1DC212" },
          { range: [7, 8], color: "#0DAC25" },
          { range: [8, 9], color: "#09963C" },
          ]}
      }];
      
      var gaugeLayout = { 
        width: 500, 
        height: 400,
        margin: {t: 0, r: 0, l: 0, b: 0}
      };
  
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
  
    });
  }