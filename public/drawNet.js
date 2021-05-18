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
}

// create a network
var container = document.getElementById('mynetwork');
let data = erdos(0.8, 20);

var options = {};

// initialize network
var network = new vis.Network(container, data, options);