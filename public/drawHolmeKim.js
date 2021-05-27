var holme_sumOfDegrees, holme_shadowState, holme_nodesArray, holme_nodes, holme_edgesArray, holme_edges, holme_network;

function holmeInitialize(prob, vertNum) {
    prob = parseFloat(prob);
    vertNum = parseInt(vertNum);
    //prob = 1 - prob;

    holme_nodes.clear();
    holme_edges.clear();
    holme_nodesArray = [];
    holme_edgesArray = [];

    var idLen = holme_nodes.length;
    var idNum;

    for (var i = 0; i < vertNum; i++) {
        idNum = i + idLen;
        holme_nodesArray.push({id: idNum, label: 'Node'+ idNum});
    }

    for (var i = 0; i <= vertNum + idLen; i++) {
        for (var j = i+1; j <= vertNum + idLen; j++) {
            var p = Math.random();
            if(p <= prob) {
                holme_edgesArray.push({from: i, to: j});
                holme_sumOfDegrees = holme_sumOfDegrees + 1;
            }
        }
    }
    holme_nodes.add(holme_nodesArray);
    holme_edges.add(holme_edgesArray);
    holmeShadeByDegree();
}

function holmeShadeByDegree() {
    var idLen = holme_nodes.length;
    for (var i = 0; i < idLen; i++) {
        var cool = holme_network.getConnectedEdges(i).length;
        var heat = (0.1 * cool);
        var clickedNode = holme_nodes.get(i);
        clickedNode.color = {
            border: '#000000',
            background: 'rgba(240, 0, 0, ' + heat + ')',
            highlight: {
                border: '#2B7CE9',
                background: 'rgba(0, 240, 0, 1)'
            }
        }
        holme_nodes.update(clickedNode);
    }
}

function holmeConnect(idNum) {
    var sumDegree = holme_sumOfDegrees;
    //var idLen = Object.keys(nodes).length / 2;
    var idLen = holme_nodes.length;


    for (var i = 0; i < idLen - 1; i++) {
        var prob = holme_network.getConnectedEdges(i).length / sumDegree;
        var p = Math.random();
        if(p <= prob) {
            holme_edges.add({from: idNum, to: i});
            holme_sumOfDegrees = holme_sumOfDegrees + 1;
        }
    }

}

function createHolme(vertNum) {
    vertNum = parseInt(vertNum);
    var idLen = holme_nodes.length;
    //var idLen = Object.keys(nodes).length / 2;
    var idNum;

    for (var i = 0; i < vertNum; i++) {
        idNum = i + idLen;
        holme_nodes.add({id: idNum, label: 'Node'+ idNum});
        holmeConnect(idNum);
    }
    holmeShadeByDegree();
}

function drawHolme() {
    holme_shadowState = false;
    holme_sumOfDegrees = 0;
    // create an array with nodes

    holme_nodesArray = [
        {id: 0, label: "Node 0"},
    ];

    holme_nodes = new vis.DataSet(holme_nodesArray);
    // create an array with edges

    holme_edgesArray = [];

    holme_edges = new vis.DataSet(holme_edgesArray);
    // create a network
    var container = document.getElementById("mynetwork");
    var data = {
        nodes: holme_nodes,
        edges: holme_edges,
    };
    //var options = {};
    var options = {
        physics: false,
        nodes: {
            shape: "dot",
            scaling: {
                min: 0.2,
                max: 1,
                label: {
                    min: 2,
                    max: 10,
                    drawThreshold: 12,
                    maxVisible: 20,
                },
            },
            font: {
                size: 12,
                face: "Tahoma",
            },
        },
        edges: {
            width: 0.15,
            color: { inherit: true },
            smooth: {
                type: "continuous",
            },
        },
        physics: {
            enabled: true,
            solver: "forceAtlas2Based",
            forceAtlas2Based: {
                "gravitationalConstant": -1000,
                "springLength": 25,
                "springConstant": 0.09,
                "avoidOverlap": 0.2,
            },
        },
        layout: {
        },
        interaction: {
            tooltipDelay: 200,
            hideEdgesOnDrag: true,
            hideEdgesOnZoom: true,
        },
    };
    holme_network = new vis.Network(container, data, options);
}
