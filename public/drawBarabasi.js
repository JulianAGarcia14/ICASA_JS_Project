var bar_sumOfDegrees, bar_shadowState, bar_nodesArray, bar_nodes, bar_edgesArray, bar_edges, bar_network, bar_degreeDist, bar_ClusterSum;

/**
 * Implements erdos reyni algorithm to later use as base for barabasi, connecting each node by a given probability
 * @param  {float} prob Given probability that a node can connect to another
 * @param  {float} vertNum Number of vertices to create/connect
 */
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
    barShadeByDegree();
    barabasiWritedata();
}

/**
 * Shades each node by how high its degree is.
 */
function barShadeByDegree() {
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

/**
 * Handles actual connection of nodes based on degree
 * @param  {int} idNum id of the node we're adding onto the network
 */
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

/**
 * Implements barabasi algorithm to add as many nodes as desired, updates the visualization
 * @param  {int} vertNum number of nodes to be added using algorithm
 */
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
    barShadeByDegree();
    barabasiWritedata();
}


/**
 * Writes Clustering Coefficient and Degree to each nodes title.
 */
function barabasiWritedata() {
    var idLen = bar_nodes.length;
    var arr = new Array(5);
    var localCluster;
    arr.fill(0);
    try {
        for (var i = 0; i < idLen; i++) {
            var deg = bar_network.getConnectedEdges(i).length;
            //getting track of degree distribution
            if(deg > arr.length) {
                while(arr.length <= deg) {
                    arr.push(0);
                }
            }

            arr[deg] += 1;



            localCluster = bar_ClusteringCount(i);
            bar_ClusterSum = bar_ClusterSum + localCluster;
            bar_nodes.update({
                id: i,
                label: 'Node'+ i,
                title: 'Node ' + i + '\n Degree: ' + deg + '\nLocal Clustering Coefficient: ' + localCluster,
            });
        }
    } catch (err) {
        alert(err);
    }


    bar_degreeDist = [];
    for(var j = 0; j < arr.length; j++) {
        bar_degreeDist.push({ x: j, y: arr[j] });
    }
    drawBarabasiDistribution();
    var globalCluster = bar_ClusterSum / bar_nodes.length;

    document.getElementById("baraCC").textContent= "Global Clustering Coefficient: " + globalCluster;
    document.getElementById("baraNodes").textContent="# of Nodes: " + bar_nodes.length;
}

/**
 * Calculates local clustering coefficient by comparing connected nodes of origin node and neighborhood nodes
 * @param  {node} currNode a given node to be evaluated for clustering coefficient
 * @return {float}     local clustering coefficient of current node
 */
function bar_ClusteringCount(currNode) {
    var totalE = 0;
    var atMost;
    var clus = bar_network.getConnectedNodes(currNode);
    if (clus.length == 1) {
        totalE = 1;
        atMost = 1;
    } else {
        for (var i = 0; i < clus.length; i++) {
            var ed = bar_network.getConnectedNodes(clus[i]);
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
 * Draws the degree distribution using canvas js, takes bar_degreeDist as data
 */
function drawBarabasiDistribution() {
    var bar_chart = new CanvasJS.Chart("barabasiGraph", {
        animationEnabled: true,
        zoomEnabled: true,
        backgroundColor: "rgba(255,255,255,1)",
        title:{
            text:"",
            fontFamily: "Segoe UI",
        },
        axisX:{
            interval: bar_degreeDist.length/5,
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
            dataPoints: bar_degreeDist,
        }]
    });
    bar_chart.render();


}


/**
 * Initializes the network drawing along with global variables. Contains options for vis network drawing as well.
 */
function drawBarabasi() {
    bar_shadowState = false;
    bar_ClusterSum = 0;
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
    bar_network = new vis.Network(container, data, options);
}
