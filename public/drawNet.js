var er_nodeIds, er_shadowState, er_nodesArray, er_nodes, er_edgesArray, er_edges, er_network;

function erdos(prob, vertNum) {
    prob = parseFloat(prob);
    vertNum = parseInt(vertNum);

    er_nodes.clear();
    er_edges.clear();
    er_nodesArray = [];
    er_edgesArray = [];
    var idLen = er_nodes.length;
    var idNum;

    for (var i = 0; i < vertNum; i++) {
        idNum = i + idLen;
        er_nodesArray.push({id: idNum, label: 'Node'+ idNum});
    }

    for (var i = 0; i <= vertNum + idLen; i++) {
        for (var j = i+1; j <= vertNum + idLen; j++) {
            var p = Math.random();
            if(p <= prob) {
                er_edgesArray.push({from: i, to: j});
            }
        }
    }
    er_nodes.add(er_nodesArray);
    er_edges.add(er_edgesArray);
    shadeErdos();
}

function shadeErdos() {
    var idLen = er_nodes.length;
    for (var i = 0; i < idLen; i++) {
        var cool = er_network.getConnectedEdges(i).length;
        var heat = (0.1 * cool);
        var clickedNode = er_nodes.get(i);
        clickedNode.color = {
            border: '#000000',
            background: 'rgba(240, 0, 0, ' + heat + ')',
            highlight: {
                border: '#2B7CE9',
                background: 'rgba(0, 240, 0, 1)'
            }
        }
        er_nodes.update(clickedNode);
    }
}

function drawErdos() {
    // this list is kept to remove a random node.. we do not add node 1 here because it's used for changes
    er_nodeIds = [0];
    er_shadowState = false;

    // create an array with nodes

    er_nodesArray = [
        {id: 0, label: "Node 0"},
    ];

    er_nodes = new vis.DataSet(er_nodesArray);
    // create an array with edges

    er_edgesArray = [];

    er_edges = new vis.DataSet(er_edgesArray);
    // create a network
    var container = document.getElementById("mynetwork2");
    var data = {
        nodes: er_nodes,
        edges: er_edges,
    };
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
    er_network = new vis.Network(container, data, options);
}

