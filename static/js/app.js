// Assign URL to a variable
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function buildMetadata(newSample) {
     d3.json(url).then((data) => {
    // Define metadata variable
    let metadata = data.metadata

    // Filter metadata where ID matches the selected ID fom the dropdown
    let filteredMetadata = metadata.filter(d => d.id == newSample);

    // Use d3 to select the demographic panel
    let selectDemographics = document.getElementById("sample-metadata");

    // Clear existing data from the demographic panel
    selectDemographics.innerHTML = " "

    let paragraph = document.createElement('p')

    //Define the paragraph text
    paragraph.innerHTML = `ID: ${filteredMetadata[0].id}<br></br>
                           Ethnicity: ${filteredMetadata[0].ethnicity}<br></br>
                           Gender: ${filteredMetadata[0].gender}<br></br>
                           Age:${filteredMetadata[0].age}<br></br>
                           Location: ${filteredMetadata[0].location}<br></br>
                           bbtype: ${filteredMetadata[0].bbtype}<br></br>
                           wfreq: ${filteredMetadata[0].wfreq}`;

    // Append to the demographics panel
    selectDemographics.appendChild(paragraph);
    
    // use `html("")to clear any existing metadata

    // Hint: inside the loop, you will need to use d3 to append new tags for each key-value in the metadata

     }); // d3 datacall bracket
}; // metadata function bracket





function buildCharts(newSample) {
    d3.json(url).then((data) => {

        /////       Arranging the data for charts       /////

            let samples = data.samples

            let allSamples = [];
            let tenSamples = [];

            // Create variables for samples and the data that will be used in the bar chart
            for(let i = 0; i < samples.length; i++) {
    
                // Empty array to hold each samples values
                let sampleArray = [];
        
                // Create a list of all of the following values
                let ids = samples[i].id
                let otuIDs = samples[i].otu_ids;
                let otuLabels = samples[i].otu_labels;
                let sampleValues = samples[i].sample_values; 
        
                // Loop through the three lists to group each set together
                for (let j = 0; j < otuIDs.length; j++) {
        
                    // Match up the correct IDs, otuID, otuLabel, and sampleValue
                    let eachSample = {
                        otuID : otuIDs[j],
                        otuLabel : otuLabels[j],
                        sampleValue : sampleValues[j]
                        }; 
        
                        // Add each OTU ID, Label, and Sample Value to the array
                        sampleArray.push(eachSample)
                        
                }; // j for loop
        
                // Sort sampleArray in descending order by Sample Value
                let sortedArray = sampleArray.sort((a,b) => b.sampleValue - a.sampleValue)
                
        
                // Push all samples to the allSamples list
                allSamples.push({
                    id: ids,
                    samples: sortedArray
                });
        
                // Select the ten highest sample values
                let topTen = sortedArray.slice(0,10).reverse();
        
                // Push the top ten sample values to the all samples 
                tenSamples.push({
                    id: ids,
                    topTen: topTen
                });
        
            }; // i for loop

            /////       Building the bar chart      /////

            // Select the data where the sample ID matches the selected DOM option
            let barSample = tenSamples.filter(sample => sample.id == newSample);

            let sampleSet = barSample[0].topTen

            let barTrace = {
                x: sampleSet.map(sample => sample.sampleValue),
                y: sampleSet.map(sample => `OTU ${sample.otuID}`),
                text: sampleSet.map(sample => sample.otuLabel),
                type: 'bar', 
                orientation: 'h'
            }

            let barLayout = {
                title: 'Top Ten Bacterial Counts by Individual', 
                height: 500,
                width: 450
            }

            // Plot bar chart
            Plotly.newPlot("bar", [barTrace], barLayout);

            /////      Building the scatter plot        /////

            // Select the data where the sample ID matches the selected DOM option
            let scatterSample = allSamples.filter(sample => sample.id == newSample);

            let scatterData = scatterSample[0].samples;

            let value = scatterData.map(sample => sample.sampleValue)
            let otuID = scatterData.map(sample => sample.otuID)
            let hoverText = scatterData.map(sample => sample.otuLabel)

            let scatterTrace = {
                x: otuID,
                y: value,
                mode: 'markers',
                marker: {
                    size: value,
                    color: otuID
                },
                text: hoverText
            };

            let scatterLayout = {
                title: "Belly Button Bacterial Counts",
                height: 500,
                width: 1200
            };

            // Plot scatter plot
            Plotly.newPlot("bubble", [scatterTrace], scatterLayout);

    }); // d3 data call bracket 
}; // initializeCharts function bracket


function init() {
    d3.json(url).then((data) => {
    
    // Assign names to a variable
    let names = data.names;

    // Select DOM
    let selectElement = document.getElementById("selDataset");

    // Append each name as an option element in the DOM html
    names.forEach((item) => {
        let optionElement = document.createElement('option');
        optionElement.textContent = item;
        selectElement.appendChild(optionElement)
    });

    // Use the first sample from the list to build the initial plots and demographic table
    buildCharts(names[0]);

    buildMetadata(names[0]);

    }); // close data call
}; // init function bracket

init();


function optionChanged(newSample){
    buildCharts(newSample);
    buildMetadata(newSample);
}; // optionChanged function






