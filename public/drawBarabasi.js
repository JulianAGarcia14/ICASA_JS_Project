var bar_sumOfDegrees, bar_shadowState, bar_nodesArray, bar_nodes, bar_edgesArray, bar_edges, bar_network;

function barabasiInitialize(prob, vertNum) {
    prob = parseFloat(prob);
    vertNum = parseInt(vertNum);
    //prob = 1 - prob;

    bar_nodes.clear();
    bar_edges.clear();
    bar_nodesArray = [];
    bar_edgesArray = [];

    var idLen = bar_nodes.length;
    var idNum;

    for (var i = 0; i < vertNum; i++) {
        idNum = i + idLen;
        bar_nodesArray.push({id: idNum, label: 'Node'+ idNum});
    }

    for (var i = 0; i <= vertNum + idLen; i++) {
        for (var j = i+1; j <= vertNum + idLen; j++) {
            var p = Math.random();
            if(p <= prob) {
                bar_edgesArray.push({from: i, to: j});
                bar_sumOfDegrees = bar_sumOfDegrees + 1;
            }
        }
    }
    bar_nodes.add(bar_nodesArray);
    bar_edges.add(bar_edgesArray);
    shadeByDegree();
}

function shadeByDegree() {
    var idLen = bar_nodes.length;
    for (var i = 0; i < idLen; i++) {
        var cool = bar_network.getConnectedEdges(i).length;
        var heat = (0.1 * cool);
        var clickedNode = bar_nodes.get(i);
        clickedNode.color = {
            border: '#000000',
            background: 'rgba(240, 0, 0, ' + heat + ')',
            highlight: {
                border: '#2B7CE9',
                background: 'rgba(0, 240, 0, 1)'
            }
        }
        bar_nodes.update(clickedNode);
    }
}

function barabasiConnect(idNum) {
    var sumDegree = bar_sumOfDegrees;
    //var idLen = Object.keys(nodes).length / 2;
    var idLen = bar_nodes.length;


    for (var i = 0; i < idLen - 1; i++) {
        var prob = bar_network.getConnectedEdges(i).length / sumDegree;
        var p = Math.random();
        if(p <= prob) {
            bar_edges.add({from: idNum, to: i});
            bar_sumOfDegrees = bar_sumOfDegrees + 1;
        }
    }

}

function createBarabasi(vertNum) {
    vertNum = parseInt(vertNum);
    var idLen = bar_nodes.length;
    //var idLen = Object.keys(nodes).length / 2;
    var idNum;

    for (var i = 0; i < vertNum; i++) {
        idNum = i + idLen;
        bar_nodes.add({id: idNum, label: 'Node'+ idNum});
        barabasiConnect(idNum);
    }
    shadeByDegree();
}

function drawBarabasi() {
    bar_shadowState = false;
    bar_sumOfDegrees = 0;
    // create an array with nodes

    bar_nodesArray = [
        {id: 0, label: "Node 0"},
    ];

    bar_nodes = new vis.DataSet(bar_nodesArray);
    // create an array with edges

    bar_edgesArray = [];

    bar_edges = new vis.DataSet(bar_edgesArray);
    // create a network
    var container = document.getElementById("mynetwork3");
    var data = {
        nodes: bar_nodes,
        edges: bar_edges,
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
    bar_network = new vis.Network(container, data, options);
}
