var aStar = require('a-star');
var fs = require('fs');
var cmb = require('./combinations.js');

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

function checkIsEnd(node){
    var same = 0;
    for(var i = 0; i < 9; i++){
        if(node[i] == cmb.endNode[i]){
            same++;
        }
    }
    return (same == 9);
}

function findPos(num, node){
    for(var i = 0; i < 9; i++){
        if(node[i] == num){
            return i;
        }
    }
}

function getColumn(num, node){
    return findPos(num, node) % 3;
}

function getRow(num, node){
    return ~~(findPos(num, node) / 3);
}

function forEachLine(cb, node){
    //Rows
    for(var i = 0; i < 3; i++){
        var currentNodes = [node[(i*3)], node[(i*3)+1], node[(i*3)+2]];
        var endNodes = [cmb.endNode[(i*3)], cmb.endNode[(i*3)+1], cmb.endNode[(i*3)+2]];
        cb(currentNodes, endNodes);
    }
    //Columns
    for(var i = 0; i < 3; i++){
        var currentNodes = [node[i], node[i+3], node[i+6]];
        var endNodes = [cmb.endNode[i], cmb.endNode[i+3], cmb.endNode[i+6]];
        cb(currentNodes, endNodes);
    }
}

var clockwiseIndex = [1, 2, 5, 0, -1, 8, 3, 6, 7];
function getClockwise(pos, node){
    return node[clockwiseIndex[pos]];
}

function findNeighborUp(node, neighbors){
    var emptyPos = findPos(0, node);
    if(emptyPos > 5) return;
    var neighbor = node.slice();
    neighbor[emptyPos] = neighbor[emptyPos + 3];
    neighbor[emptyPos + 3] = 0;
    neighbors.push(neighbor);
}

function findNeighborDown(node, neighbors){
    var emptyPos = findPos(0, node);
    if(emptyPos < 3) return;
    var neighbor = node.slice();
    neighbor[emptyPos] = neighbor[emptyPos - 3];
    neighbor[emptyPos - 3] = 0;
    neighbors.push(neighbor);
}

function findNeighborLeft(node, neighbors){
    var emptyPos = findPos(0, node);
    if(emptyPos % 3 == 2) return;
    var neighbor = node.slice();
    neighbor[emptyPos] = neighbor[emptyPos + 1];
    neighbor[emptyPos + 1] = 0;
    neighbors.push(neighbor);
}

function findNeighborRight(node, neighbors){
    var emptyPos = findPos(0, node);
    if(emptyPos % 3 == 0) return;
    var neighbor = node.slice();
    neighbor[emptyPos] = neighbor[emptyPos - 1];
    neighbor[emptyPos - 1] = 0;
    neighbors.push(neighbor);
}

function getNeighbors(node){
    var neighbors = [];
    findNeighborUp(node, neighbors);
    findNeighborDown(node, neighbors);
    findNeighborLeft(node, neighbors);
    findNeighborRight(node, neighbors);
    return neighbors;
}

function getDistance(a, b){
    return 1;
}

function nodesEqual(a, b){
    for(var i = 0; i < 9; i++){
        if(a[i] != b[i]){
            return false;
        }
    }
    return true;
}

function swapTiles(node, a, b){
    var posA = findPos(a, node);
    var posB = findPos(b, node);
    
    node[posA] = b;
    node[posB] = a;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

var misplacedTilesNodes = 0;
function misplacedTiles(node){
    misplacedTilesNodes++;
    var misplaced = 0;
    for(var i = 0; i < 9; i++){
        if(node[i] != cmb.endNode[i]){
            misplaced++;
        }
    }
    return misplaced;
}

var manhattanDistanceNodes = 0;
function manhattanDistance(node){
    manhattanDistanceNodes++;
    var distance = 0;
    for(var i = 0; i < 9; i++){
        distance += Math.abs(getColumn(i, node) - getColumn(i, cmb.endNode));
        distance += Math.abs(getRow(i, node) - getRow(i, cmb.endNode));
    }
    return distance;
}

var nilssonsSequenceScoreNodes = 0;
function nilssonsSequenceScore(node){
    nilssonsSequenceScoreNodes++;
    var score = 0;
    for(var i = 0; i < 9; i++){
        if(i == 4) {
            if(node[i] != 0) {
                score += 1;
            }
            continue;
        }
        if(i == 3){
            if(node[0] != 1){
                score += 2;
            }
            continue;
        }
        if(node[i] != (getClockwise(i, node) - 1)){
            score += 2;
        }
    }
    return manhattanDistance(node) + (3*score);
}

var outOfRowAndColumnNodes = 0;
function outOfRowAndColumn(node){
    outOfRowAndColumnNodes++;
    var count = 0;
    for(var i = 0; i < 9; i++){
        if(getRow(i, node) != getRow(i, cmb.endNode)) count++;
        if(getColumn(i, node) != getColumn(i, cmb.endNode)) count++;
    }
    return count;
}

var linearConflictNodes = 0;
function linearConflict(node){
    linearConflictNodes++;
    var conflicts = 0;
    forEachLine(function(currentTiles, endTiles){
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(i == j) continue;
                if(j < i) continue;
                if(currentTiles[i] == currentTiles[j]) conflicts++;
            }
        }
        if(currentTiles[0] == endTiles[1]
            || currentTiles[0] == endTiles[2]
            || currentTiles[1] == endTiles[2]
        ) conflicts++;
    }, node);
    return manhattanDistance(node) + (1*conflicts);
}

var aStarOptions = {
    isEnd: checkIsEnd,
    neighbor: getNeighbors,
    distance: getDistance
}

var tStart;
var result;
function runAStar(heuristic){
    aStarOptions.heuristic = heuristic;
    tStart = process.hrtime();
    result = aStar(aStarOptions);
    tEnd = process.hrtime(tStart);
}

var nodeStats = {
    'totals': {
        'Manhattan Distance': 0,
        'Misplaced Tiles': 0,
        'Nilsson\'s Sequence Score': 0,
        'Tiles out of row and column': 0,
        'Linear conflict': 0
    },
    'averages': {
        'Manhattan Distance': 0,
        'Misplaced Tiles': 0,
        'Nilsson\'s Sequence Score': 0,
        'Tiles out of row and column': 0,
        'Linear conflict': 0
    }
}

var timeStats = {
    'totals': {
        'Manhattan Distance': 0,
        'Misplaced Tiles': 0,
        'Nilsson\'s Sequence Score': 0,
        'Tiles out of row and column': 0,
        'Linear conflict': 0
    },
    'averages': {
        'Manhattan Distance': 0,
        'Misplaced Tiles': 0,
        'Nilsson\'s Sequence Score': 0,
        'Tiles out of row and column': 0,
        'Linear conflict': 0
    }
}

function printResults(nodeCount, heuristicName, finish){
    var time = ((tEnd[0] > 0) ? (tEnd[0] + "s ") : "") + (tEnd[1]/1000000) + "ms";
    
    nodeStats.totals[heuristicName] += nodeCount;
    timeStats.totals[heuristicName] += (tEnd[0]/1000) + (tEnd[1]/1000000);
    
    if(finish){
        nodeStats.averages[heuristicName] = nodeStats.totals[heuristicName]/10;
        timeStats.averages[heuristicName] = timeStats.totals[heuristicName]/10;
    }
    
    console.log("\t" + heuristicName);
    fs.appendFileSync('report.html', "<h2>" + heuristicName + "</h2>");
    
    fs.appendFileSync('report.html', `
    <div class="stats">
        <div class="moves"><div class="title">Moves</div><div class="value">${result.cost}</div></div>
        <div class="nodes"><div class="title">Nodes</div><div class="value">${nodeCount}</div></div>
        <div class="time"><div class="title">Time</div><div class="value">${time}</div></div>
    </div>
    `);
    console.log("\t\tMoves:\t" + result.cost + "\n\t\tNodes:\t" + nodeCount
        + "\n\t\tTime:\t" + time + "\n");
}

fs.writeFileSync('report.html', "<html><head><link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head><body><center>");

var currentCombination = 0;

cmb.startNodes.forEach(function(item){
    currentCombination ++;
    var finish = (currentCombination == cmb.startNodes.length);
    console.log(item.name + "\n");
    aStarOptions.start = item.node;
    
    fs.appendFileSync('report.html', "<div class=\"combination\"><h1>" + item.name + "</h1>");
    fs.appendFileSync('report.html', `
        <table>
            <tr><td>${item.node[0]}</td><td>${item.node[1]}</td><td>${item.node[2]}</td></tr>
            <tr><td>${item.node[3]}</td><td>${item.node[4]}</td><td>${item.node[5]}</td></tr>
            <tr><td>${item.node[6]}</td><td>${item.node[7]}</td><td>${item.node[8]}</td></tr>
        </table>
    `);
    
    manhattanDistanceNodes = 0;
    runAStar(manhattanDistance);
    printResults(manhattanDistanceNodes, 'Manhattan Distance', finish);
    
    misplacedTilesNodes = 0;
    runAStar(misplacedTiles);
    printResults(misplacedTilesNodes, 'Misplaced Tiles', finish);
    
    nilssonsSequenceScoreNodes = 0;
    runAStar(nilssonsSequenceScore);
    printResults(nilssonsSequenceScoreNodes, 'Nilsson\'s Sequence Score', finish);
    
    outOfRowAndColumnNodes = 0;
    runAStar(outOfRowAndColumn);
    printResults(outOfRowAndColumnNodes, 'Tiles out of row and column', finish);
    
    linearConflictNodes = 0;
    runAStar(linearConflict);
    printResults(linearConflictNodes, 'Linear conflict', finish);
    
    fs.appendFileSync('report.html', "</div>");
});

fs.appendFileSync('report.html', "</center></body></html>");

console.log(nodeStats);
console.log(timeStats);