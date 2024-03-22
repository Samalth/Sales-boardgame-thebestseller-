const possiblePositions = [
    "1,9", "2,9", "3,9", "4,9", "5,9", "6,9", "7,9", "8,9", "9,9", "10,9", "11,9", "12,9", "13,9", "14,9", "15,9",
    "1,8", "8,8", "15,8",
    "1,7", "8,7", "15,7",
    "1,6", "8,6", "15,6",
    "1,5", "2,5", "3,5", "4,5", "5,5", "6,5", "7,5", "8,5", "9,5", "10,5", "11,5", "12,5", "13,5", "14,5", "15,5",
    "1,4", "8,4", "15,4",
    "1,3", "8,3", "15,3",
    "1,2", "8,2", "15,2",
    "1,1", "2,1", "3,1", "4,1", "5,1", "6,1", "7,1", "8,1", "9,1", "10,1", "11,1", "12,1", "13,1", "14,1", "15,1",
];

function coordinateToObj(coord) {
    const [x, y] = coord.split(",");
    return { x: parseInt(x), y: parseInt(y) };
}

const possiblePositionsObj = possiblePositions.map(coordinateToObj);

function getPossibleMoves(start, steps) {
    let visited = new Set();
    let result = [];

    function dfs(pos, step) {
        let key = `${pos.x},${pos.y}`;

        if (step > steps || visited.has(key)) {
            return;
        }

        visited.add(key);

        if (step === steps) {
            result.push(pos);
            return;
        }

        const potentialMoves = [
            { x: pos.x + 1, y: pos.y },
            { x: pos.x - 1, y: pos.y },
            { x: pos.x, y: pos.y + 1 },
            { x: pos.x, y: pos.y - 1 }
        ];

        potentialMoves.forEach(move => {
            if (possiblePositionsObj.some(p => p.x === move.x && p.y === move.y)) {
                dfs(move, step + 1);
            }
        });

        visited.delete(key);
    }

    dfs(start, 0);

    return result;
}

// Convert start coordinate to object and call function
function getMovesFromCoordinate(startX, startY, steps) {
    const start = { x: startX, y: startY };
    return getPossibleMoves(start, steps);
}

// Example usage:
// const startCoordinate = { x: 8, y: 5 }; // Starting at (8,5)
// const steps = 2; // Number of steps you can take
// console.log(getMovesFromCoordinate(startCoordinate.x, startCoordinate.y, steps));


module.exports=getMovesFromCoordinate;