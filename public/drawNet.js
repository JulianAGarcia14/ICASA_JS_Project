var er_nodeIds, er_shadowState, er_nodesArray, er_nodes, er_edgesArray, er_edges, er_network, er_degreeDist, er_ClusterSum;

/**
 * Implements erdos reyni algorithm, connecting each node by a given probability
 * @param  {float} prob Given probability that a node can connect to another
 * @param  {float} vertNum Number of vertices to create/connect
 */
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
    erdosWritedata();
}

/**
 * Shades each node by how high its degree is.
 */
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


/**
 * Writes Clustering Coefficient and Degree to each nodes title.
 */
function erdosWritedata() {
    var idLen = er_nodes.length;
    var arr = new Array(5);
    var localCluster;
    arr.fill(0);
    try {
        for (var i = 0; i < idLen; i++) {
            var deg = er_network.getConnectedEdges(i).length;
            //getting track of degree distribution
            if(deg > arr.length) {
                while(arr.length <= deg) {
                    arr.push(0);
                }
            }

            arr[deg] += 1;



            localCluster = er_ClusteringCount(i);
            er_ClusterSum = er_ClusterSum + localCluster;
            er_nodes.update({
                id: i,
                label: 'Node'+ i,
                title: 'Node ' + i + '\n Degree: ' + deg + '\nLocal Clustering Coefficient: ' + localCluster,
            });
        }
    } catch (err) {
        alert(err);
    }


    er_degreeDist = [];
    for(var j = 0; j < arr.length; j++) {
        er_degreeDist.push({ x: j, y: arr[j] });
    }
    drawErdosDistribution();
    var globalCluster = er_ClusterSum / er_nodes.length;

    document.getElementById("erdosCC").textContent= "Global Clustering Coefficient: " + globalCluster;
    document.getElementById("erdoNodes").textContent="# of Nodes: " + er_nodes.length;
}

/**
 * Calculates local clustering coefficient by comparing connected nodes of origin node and neighborhood nodes
 * @param  {node} currNode a given node to be evaluated for clustering coefficient
 * @return {float}     local clustering coefficient of current node
 */
function er_ClusteringCount(currNode) {
    var totalE = 0;
    var atMost;
    var clus = er_network.getConnectedNodes(currNode);
    if (clus.length == 1) {
        totalE = 1;
        atMost = 1;
    } else {
        for (var i = 0; i < clus.length; i++) {
            var ed = er_network.getConnectedNodes(clus[i]);
            for (var j = 0; j < ed.length; j++) {
                if (binarySearch(clus, ed[j]) === true) {
                    totalE = totalE + 1;
                }
            }
        }

        totalE = 1.0 * totalE / 2;
        atMost = 1.0 * clus.length * (clus.length - 1) / 2;
    }

    //console.log(totalE);
    var coef
    if (atMost != 0) {
        coef = 1.0 * totalE/atMost;
    } else {
        coef = 0;
    }


    //console.log(atMost);
    //console.log(coef);
    return coef;

}

/**
 * Draws the degree distribution using canvas js, takes er_degreeDist as data
 */
function drawErdosDistribution() {
    var er_chart = new CanvasJS.Chart("erdosGraph", {
        animationEnabled: true,
        zoomEnabled: true,
        backgroundColor: "rgba(255,255,255,1)",
        title:{
            text:"",
            fontFamily: "Segoe UI",
        },
        axisX:{
            interval: er_degreeDist.length/5,
            titleFontSize: 18,
            title: "Degree"
        },
        axisY:{
            titleFontSize: 18,
            title: "Amount of nodes"
        },
        data: [{
            type: "column",
            color: "#ff615d",
            dataPoints: er_degreeDist,
        }]
    });
    er_chart.render();


}

/**
 * Initializes the network drawing along with global variables. Contains options for vis network drawing as well.
 */
function drawErdos() {
    // this list is kept to remove a random node.. we do not add node 1 here because it's used for changes
    er_nodeIds = [0];
    er_ClusterSum = 0;
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
                "damping": 1,
            },
        },
        layout: {
        },
        interaction: {
            hover:true,
            hoverConnectedEdges: true,
            tooltipDelay: 200,
            hideEdgesOnDrag: true,
            hideEdgesOnZoom: true,
        },

    };
    er_network = new vis.Network(container, data, options);
}

