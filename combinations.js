var startNodes = [
    {
        name: "Combination 5",
        node:
        [
            6,0,3,
            8,2,7,
            5,4,1
        ]
    },
    {
        name: "Combination 2",
        node:
        [
            8,7,6,
            1,0,5,
            2,3,4
        ]
    },
    {
        name: "Combination 25",
        node:
        [
            2,8,6,
            7,0,3,
            5,4,1
        ]
    },
    {
        name: "Combination 26",
        node:
        [
            5,8,6,
            0,7,3,
            4,2,1
        ]
    },
    {
        name: "Combination 15",
        node:
        [
            0,8,7,
            5,2,6,
            4,1,3
        ]
    },
    {
        name: "Combination 14",
        node:
        [
            8,6,3,
            4,5,1,
            7,0,2
        ]
    },
    {
        name: "Combination 12",
        node:
        [
            8,6,3,
            4,1,2,
            7,0,5
        ]
    },
    {
        name: "Combination 16",
        node:
        [
            7,6,3,
            0,4,2,
            8,5,1
        ]
    },
    {
        name: "Combination 23",
        node:
        [
            8,6,3,
            5,1,2,
            4,0,7
        ]
    },
    {
        name: "Combination 30",
        node:
        [
            8,6,3,
            5,2,1,
            0,7,4
        ]
    }
];


var endNode = [
    1,2,3,
    8,0,4,
    7,6,5
];

/*
var endNode = [
    1,2,3,
    4,5,6,
    7,8,0
];
*/

module.exports = {
    startNodes: startNodes,
    endNode: endNode
}