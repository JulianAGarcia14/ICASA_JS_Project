var holme_sumOfDegrees, holme_shadowState, holme_nodesArray, holme_nodes, holme_edgesArray, holme_edges, holme_network, holme_degreeDist, holme_ClusterSum;

/**
 * Implements erdos reyni algorithm to later use as base for Holme-Kim, connecting each node by a given probability
 * @param  {float} prob Given probability that a node can connect to another
 * @param  {float} vertNum Number of vertices to create/connect
 */
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
    holmeWritedata();
}

/**
 * Shades each node by how high its degree is.
 */
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

/**
 * Simple binary search to look for key in a sorted array
 * @param  {array} sortedArray array to be parsed
 * @param  {key} key key to be found
 */
function binarySearch(sortedArray, key){
    var start = 0;
    var end = sortedArray.length - 1;

    while (start <= end) {
        var middle = Math.floor((start + end) / 2);

        if (sortedArray[middle] === key) {
            // found the key
            return true;
        } else if (sortedArray[middle] < key) {
            // continue searching to the right
            start = middle + 1;
        } else {
            // search searching to the left
            end = middle - 1;
        }
    }
    // key wasn't found
    return false;
}

/**
 * Randomly connects a neighbor or repeats holmeConnect
 * @param  {array} neighborhood list of nodes connected to the node who's neighborhood we're looking at
 * @param  {array} used List of nodes the newly added node is already connected to
 * @param  {int} idNum Id of the newest node
 */
function neighborConnect(neighborhood, used, idNum) {
    var nLen = neighborhood.length;
    var found = false;
    for (var i = 0; i < nLen - 1; i++) {
        //console.log(used);
        if(binarySearch(used, i) === false) {
            found = true;
            holme_edges.add({from: idNum, to: i});
            holme_sumOfDegrees = holme_sumOfDegrees + 1;
            break;
        }
    }
    if(found === false) {
        holmeConnect(idNum, true);
    }
}

/**
 * Handles the work of connecting nodes based on degree
 * @param  {int} idNum id of node that is being added
 * @param  {boolean} isLooped Tells us whether we're repeating the step in the case where there is no neighbor to connect to
 */
function holmeConnect(idNum, isLooped) {
    var sumDegree = holme_sumOfDegrees;
    //var idLen = Object.keys(nodes).length / 2;
    var idLen = holme_nodes.length;


    for (var i = 0; i < idLen - 1; i++) {
        var prob = holme_network.getConnectedEdges(i).length / sumDegree;
        var p = Math.random();
        if(p <= prob) {
            holme_edges.add({from: idNum, to: i});
            holme_sumOfDegrees = holme_sumOfDegrees + 1;
            if(isLooped === false) {
                var neighborhood = holme_network.getConnectedNodes(i);
                var used = holme_network.getConnectedNodes(idNum);
                neighborConnect(neighborhood, used, idNum);
            }
        }
    }

}

/**
 * Implements holme-kim algorithm to add as many nodes as desired, updates the visualization
 * @param  {int} vertNum number of nodes to be added using algorithm
 */
function createHolme(vertNum) {
    vertNum = parseInt(vertNum);
    var idLen = holme_nodes.length;
    //var idLen = Object.keys(nodes).length / 2;
    var idNum;

    for (var i = 0; i < vertNum; i++) {
        idNum = i + idLen;
        holme_nodes.add({id: idNum, label: 'Node'+ idNum});
        holmeConnect(idNum, false);
    }
    holmeShadeByDegree();
    holmeWritedata();
}

/**
 * Writes Clustering Coefficient and Degree to each nodes title.
 */
function holmeWritedata() {
    var idLen = holme_nodes.length;
    var arr = new Array(5);
    var localCluster;
    arr.fill(0);
    try {
        for (var i = 0; i < idLen; i++) {
            var deg = holme_network.getConnectedEdges(i).length;
            //getting track of degree distribution
            if(deg > arr.length) {
                while(arr.length <= deg) {
                    arr.push(0);
                }
            }

            arr[deg] += 1;



            localCluster = holme_ClusteringCount(i);
            holme_ClusterSum = holme_ClusterSum + localCluster;
            holme_nodes.update({
                id: i,
                label: 'Node'+ i,
                title: 'Node ' + i + '\n Degree: ' + deg + '\nLocal Clustering Coefficient: ' + localCluster,
            });
        }
    } catch (err) {
        alert(err);
    }


    holme_degreeDist = [];
    for(var j = 0; j < arr.length; j++) {
        holme_degreeDist.push({ x: j, y: arr[j] });
    }
    //console.log(holme_degreeDist);
    drawHolmeDistribution();
    var globalCluster = holme_ClusterSum / holme_nodes.length;

    document.getElementById("holmesCC").textContent= "Global Clustering Coefficient: " + globalCluster;
    document.getElementById("holmesNodes").textContent= '\n # of Nodes: ' + holme_nodes.length;

}

/**
 * Calculates local clustering coefficient by comparing connected nodes of origin node and neighborhood nodes
 * @param  {node} currNode a given node to be evaluated for clustering coefficient
 * @return {float}     local clustering coefficient of current node
 */
function holme_ClusteringCount(currNode) {
    var totalE = 0;
    var atMost;
    var clus = holme_network.getConnectedNodes(currNode);
    if (clus.length == 1) {
        totalE = 1;
        atMost = 1;
    } else {
        for (var i = 0; i < clus.length; i++) {
            var ed = holme_network.getConnectedNodes(clus[i]);
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
 * Draws the degree distribution using canvas js, takes holme_degreeDist as data
 */
function drawHolmeDistribution() {
    var chart = new CanvasJS.Chart("holmeGraph", {
        animationEnabled: true,
        zoomEnabled: true,
        backgroundColor: "rgba(255,255,255,1)",
        title:{
            text:"",
            fontFamily: "Segoe UI",
        },
        axisX:{
            interval: holme_degreeDist.length/5,
            titleFontSize: 18,
            title: "Degree",
        },
        axisY:{
            titleFontSize: 18,
            title: "Amount of nodes"
        },
        data: [{
            type: "column",
            color: "#ff615d",
            dataPoints: holme_degreeDist,
        }]
    });
    chart.render();


}

/**
 * Initializes the network drawing along with global variables. Contains options for vis network drawing as well.
 */
function drawHolme() {
    holme_shadowState = false;
    holme_ClusterSum = 0;
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
                min: 10,
                max: 30,
                label: {
                    min: 8,
                    max: 30,
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
            color: { inherit: "from" },
            smooth: {
                //enabled: false,
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
            "minVelocity": 45,
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
    holme_network = new vis.Network(container, data, options);
}
