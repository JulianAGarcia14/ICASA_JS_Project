var nodeIds, shadowState, nodesArray, nodes, edgesArray, edges, network;
/*
function erdos(prob, vertNum) {

    var nodes = [];
    var edges = [];


    for (var i = 0; i < vertNum; i++) {
        nodes.push({id: i, label: 'Node'+ i});
    }

    for (var i = 0; i < vertNum; i++) {
        for (var j = i+1; j < vertNum; j++) {
            var p = Math.random();
            if(p > prob) {
                edges.push({from: i, to: j});
            }
        }
    }

    var data= {
        nodes: nodes,
        edges: edges,
    };
    return data;
}*/

function erdos2(prob, vertNum) {
    prob = parseFloat(prob);
    vertNum = parseInt(vertNum);
    prob = 1 - prob;
    var idLen = nodes.length;
    var idNum;
    nodes.clear();
    edges.clear();
    nodesArray = [];
    edgesArray = [];

    for (var i = 0; i < vertNum; i++) {
        idNum = i + idLen;
        nodesArray.push({id: idNum, label: 'Node'+ idNum});
    }

    for (var i = 0; i <= vertNum + idLen; i++) {
        for (var j = i+1; j <= vertNum + idLen; j++) {
            var p = Math.random();
            if(p > prob) {
                edgesArray.push({from: i, to: j});
            }
        }
    }
    nodes.add(nodesArray);
    edges.add(edgesArray);

}

function startNetwork() {
    // this list is kept to remove a random node.. we do not add node 1 here because it's used for changes
    nodeIds = [0];
    shadowState = false;

    // create an array with nodes

    nodesArray = [
        {id: 0, label: "Node 0"},
    ];

    nodes = new vis.DataSet(nodesArray);
    // create an array with edges

    edgesArray = [];

    edges = new vis.DataSet(edgesArray);
    // create a network
    var container = document.getElementById("mynetwork2");
    var data = {
        nodes: nodes,
        edges: edges,
    };
    var options = {};
    network = new vis.Network(container, data, options);
}


// create a network
//var container = document.getElementById('mynetwork');
//let data = erdos(0.8, 20);

//var options = {};

// initialize network
//var network = new vis.Network(container, data, options);