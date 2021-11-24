//purpose of function: retrieve data of querys, check for overlap a. assign to json objects for venn diagram
//should be integrated after query is run by clicking search button and before venn diagram production
// disComp = name of query function for specific component

async function getData(dis1, dis2, comp) {

    //output arrays for Venn diagram
    var AB = new Array(), A = new Array(), B = new Array();
    var contDiagA = "", contDiagB = "", contDiagAB = "";

    // dis1 a. dis2 are dummy variables, to be filled in once function to retrieve specific properties of query is done
    // likely need module to retrieve needed data from query return json object

    // calls retrieve function from query file, need to adjust to final names
    if (comp == "treat") {
        var results1 = await TreatQuery(dis1);
        var results2 = await TreatQuery(dis2);
    } else if (comp == "symp") {
        var results1 = await SymptQuery(dis1);
        var results2 = await SymptQuery(dis2);
    } else if (comp == "gene") {
        var results1 = await GeneQuery(dis1);
        var results2 = await GeneQuery(dis2);
    } else if (comp == "struct") {
        var results1 = await StructQuery(dis1);
        var results2 = await StructQuery(dis2);
    } else { alert('selected condition cannot be found') }


    // loops through data and checks if elements are identical, if true adds to AB array, if not adds to A/B respectively
    // also checks if any component is doubled in the query
    for (let i in results1) {

        for (let j in results2) {

            if (results1[i] == results2[j]) {
                AB.push(results2[j]);
            }
        }
    }
    for (var i in results1) {
        if (!(AB.includes(results1[i])) && !(A.includes(results1[i]))) {
            A.push(results1[i]);
        }
    }

    for (var j in results2) {
        if (!(AB.includes(results2[j])) && !(B.includes(results2[j]))) {
            B.push(results2[j]);
        }
    }


// construct string of items in arrays

for(let n in A){
  contDiagA += A[(n)]; 
  contDiagA += '\n';
} 

for(var m in B){
  contDiagB += B[m]; 
  contDiagB += '\n';
} 

for(var j in AB){
  contDiagAB += AB[j]; 
  contDiagAB += '\n';
    }

// computes relative size of the diagram parts
var AB_total = A.length + B.length + AB.length;
var A_size = parseInt(A.length/AB_total*100);
var B_size = parseInt(B.length/AB_total*100);
var AB_size =parseInt(AB.length/AB_total*100);


// returns the json objects thats passed to the anychart.venn function
return [
        {
          x: 'A',
          value: A_size,
          name: dis1,
          tooltipTitle: contDiagA,
          normal: {fill: "#8ecafb 0.7"},
          hovered: {fill: "#8ecafb 1"},
          selected: {fill: "#8ecafb 1.3"}
        },
        {
          x: 'B',
          value: B_size,
          name: dis2,
            tooltipTitle: contDiagB,
          normal: {fill: "#ffeaa6 0.7"},
          hovered: {fill: "#ffeaa6 1"},
          selected: {fill: "#ffeaa6 1.3"}
        },
        {
          x: ['A', 'B'],
          value: AB_size,
          name: 'Overlap between ' + dis1 + ' and ' + dis2,
          tooltipTitle: contDiagAB,
          tooltipDesc: comp + ' associated with both ' + dis1 + ' and ' + dis2,
          normal: {fill: "#9fdebe 0.8"},
          hovered: {fill: "#9fdebe 1"},
          selected: {fill: "#9fdebe 1.3"},
          hatchFill: {
            type:"weave",
            color: "#83c3a3"
          }    
        }
      ];
}

async function vennDiagram(dis1, dis2, comp) {
    // set chart theme
    anychart.theme('pastel');

    // gets data from getData function
    // might need to add path or smth 
    var data = await getData(dis1, dis2, comp);

    // create venn diagram
    var chart = anychart.venn(data);

    // set chart title
    chart
        .title()
        .enabled(true)
        .fontFamily('Roboto, sans-serif')
        .fontSize(24)
        .padding({ bottom: 30 })
        .text('Overlap in ' + comp + ' between ' + dis1 + ' and ' + dis2 + ':');

    // set chart stroke
    chart.stroke('1 #fff');

    // set labels settings
    chart
        .labels()
        .fontSize(16)
        .fontColor('#5e6469')
        .hAlign("center")
        .vAlign("center")
        .fontFamily('Roboto, sans-serif')
        .fontWeight('500')
        .format('{%Name}');

    // set intersections labels settings
    chart
        .intersections()
        .labels()
        .fontStyle('italic')
        .fontColor('#fff')
        .format('{%Name}');

    // disable legend
    chart.legend(false);

    // set tooltip settings
    chart
        .tooltip()
        .titleFormat('{%tooltipTitle}')
        .format("{%tooltipDesc}")
        .background().fill("#000 0.5");

    // set container id for the chart
    chart.container('container');

    // initiate chart drawing
    chart.draw();
};

