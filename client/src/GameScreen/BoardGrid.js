import React, {useEffect, useState} from "react";
import './BoardGridStyle.css'
import {socket} from "../client";

const BoardGrid = ({ moveMade, setMoveMade, setSelectedPawn, selectedPawn, setPosition, setCurrentPlayer, setColor, color}) => {
    const [startPieces, setStartPieces] = useState([]);
    const [validPositions, setValidPositions] = useState([]);
    const [updatedPieces, setUpdatedPieces] = useState(false);
    const [joinedColors, setJoinedColors] = useState([]);

    // const tileInfo = [
    //     'sales','yellow','red','megatrends','rainbow','blue','chance', 'purple', 'yellow', 'sales','rainbow', 'green','megatrends','blue','purple',
    //     'green','blank','blank','blank', 'blank','blank', 'blank', 'megatrends', 'blank', 'blank','blank', 'blank', 'blank', 'blank','chance',
    //     'chance','blank','blank','blank','blank','blank', 'blank', 'red', 'blank','blank','blank', 'blank', 'blank','blank','orange',
    //     'orange','blank','blank','blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'rainbow',
    //     'rainbow','sales','purple','chance', 'yellow','megatrends', 'blue', 'start', 'rainbow', 'sales','blue', 'megatrends', 'yellow','green', 'sales',
    //     'megatrends','blank','blank', 'blank', 'blank','blank', 'blank', 'sales', 'blank', 'blank','blank', 'blank', 'blank','blank', 'red',
    //     'blue','blank', 'blank', 'blank', 'blank','blank', 'blank', 'green', 'blank', 'blank','blank','blank','blank','blank','blue',
    //     'red', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'megatrends',
    //     'sales', 'rainbow', 'orange', 'chance', 'purple','yellow', 'megatrends', 'rainbow', 'red', 'sales','purple','green', 'chance', 'rainbow', 'orange'
    // ];
    const tileInfo = [
        'sales', 'color1', 'color3', 'megatrends', 'rainbow', 'color4', 'chance', 'color2', 'color7', 'sales', 'rainbow', 'color12', 'megatrends', 'color10', 'color8',
        'color6', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance',
        'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color11',
        'color5', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'rainbow',
        'rainbow', 'sales', 'color8', 'chance', 'color1', 'megatrends', 'color10', 'start', 'rainbow', 'sales', 'color4', 'megatrends', 'color7', 'color6', 'sales',
        'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'sales', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9',
        'color10', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color12', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color4',
        'color3', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends',
        'sales', 'rainbow', 'color11', 'chance', 'color2', 'color7', 'megatrends', 'rainbow', 'color9', 'sales', 'color8', 'color6', 'chance', 'rainbow', 'color5'
    ];
    const tileInfo2 = [
        'sales','color1','color5','megatrends','rainbow','color4','chance', 'color2', 'color1', 'sales','rainbow', 'color3','megatrends','color4','color2',
        'color3','blank','blank','blank', 'blank','blank', 'blank', 'megatrends', 'blank', 'blank','blank', 'blank', 'blank', 'blank','chance',
        'chance','blank','blank','blank','blank','blank', 'blank', 'color5', 'blank','blank','blank', 'blank', 'blank','blank','color5',
        'color5','blank','blank','blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank','rainbow',
        'rainbow','sales','color2','chance', 'color1','megatrends', 'color4', 'start', 'rainbow', 'sales','color4', 'megatrends', 'color1','color3', 'sales',
        'megatrends','blank','blank', 'blank', 'blank','blank', 'blank', 'sales', 'blank', 'blank','blank', 'blank', 'blank','blank', 'color5',
        'color4','blank', 'blank', 'blank', 'blank','blank', 'blank', 'color3', 'blank', 'blank','blank','blank','blank','blank','color4',
        'color5', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'megatrends',
        'sales', 'rainbow', 'color5', 'chance', 'color2','color1', 'megatrends', 'rainbow', 'color5', 'sales','color2','color3', 'chance', 'rainbow', 'color5'
    ];

    const possiblePositions = [
        "1-9", "2-9", "3-9", "4-9", "5-9", "6-9", "7-9", "8-9", "9-9", "10-9", "11-9", "12-9", "13-9", "14-9", "15-9",
        "1-8", "", "", "", "", "", "", "8-8", "", "", "", "", "", "", "15-8",
        "1-7", "", "", "", "", "", "", "8-7", "", "", "", "", "", "", "15-7",
        "1-6", "", "", "", "", "", "", "8-6", "", "", "", "", "", "", "15-6",
        "1-5", "2-5", "3-5", "4-5", "5-5", "6-5", "7-5", "8-5", "9-5", "10-5", "11-5", "12-5", "13-5", "14-5", "15-5",
        "1-4", "", "", "", "", "", "", "8-4", "", "", "", "", "", "", "15-4",
        "1-3", "", "", "", "", "", "", "8-3", "", "", "", "", "", "", "15-3",
        "1-2", "", "", "", "", "", "", "8-2", "", "", "", "", "", "", "15-2",
        "1-1", "2-1", "3-1", "4-1", "5-1", "6-1", "7-1", "8-1", "9-1", "10-1", "11-1", "12-1", "13-1", "14-1", "15-1",
    ];

    const tiles = [];

    const renderStartPieces = () => {
        if (!updatedPieces) {
            socket.emit('get_pieces', 'player')
            socket.emit('get_data', 'leaderboard_update');
            socket.emit('get_playerstrategy', 'player');
            setUpdatedPieces(true);
        }
        return startPieces.map((piece, index) => (
            <div key={index} className={`startpieces piece${piece} ${selectedPawn && selectedPawn.id !== piece ? 'black-border-piece' : ''}`} id={`${piece}`}>
                {selectedPawn && selectedPawn.id === piece && <div className="gradient-background round-border"></div>}
            </div>
        ));
    };

    const sendQuestionRequest = (colorTile) => {
        socket.emit("send_question_request", { questionColor: colorTile, userColor: color });
    };

    useEffect(() => {
        socket.on("update_valid_positions", (data) => {
            setValidPositions(data);
        });
        socket.on("add_piece", (data) => {
            let joinedColorsArray = [];
            const colorMap = {
                "world": "green",
                "lunar": "yellow",
                "domino": "blue",
                "jysk": "orange",
                "klaphatten": "purple",
                "safeline": "red"
            }
            joinedColorsArray = data.map(color => colorMap[color]);
            
            setStartPieces(data)
            setJoinedColors(joinedColorsArray);
        });

        socket.on("register_currentplayer", (data) => {
            setCurrentPlayer(data.strategy)
            setColor(data.color);
        });

        socket.on("update_position", (data) => {
            const newPosition = data.newPosition;
            const selectedPawnName = data.selectedPawn;
            const selectedPawnElement = document.getElementById(selectedPawnName);
            if (selectedPawnElement && validPositions.includes(newPosition)) {
                const newTile = document.querySelector(`.tile[pos="${newPosition}"]`);
                newTile.appendChild(selectedPawnElement);
                setPosition(newPosition);
                document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('blink'));
            }
        });
        const boardGrid = document.querySelector('.board-grid');

        const handleClick = event => {
            const targetTile = event.target.closest('.tile');
            if (startPieces.includes(event.target.id)) {
                event.target.classList.add('highlight');
                // setSelectedPawn(event.target);

            } else if (targetTile && validPositions.includes(targetTile.getAttribute('pos'))) {
                const newPosition = targetTile.getAttribute('pos');
                if (validPositions.includes(newPosition) && !moveMade) {
                    if (selectedPawn instanceof HTMLElement) {
                        event.target.appendChild(selectedPawn);
                        const color = targetTile.className.split(' ')[1];
                        sendQuestionRequest(color);
                        setMoveMade(true);
                        document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('blink'));
                        // setPosition(newPosition);
                        socket.emit("update_position", {newPosition: newPosition, selectedPawn: selectedPawn.id});
                    } else {
                        console.error("Selected pawn is not a valid DOM element");
                    }
                }
            }
        };
        boardGrid.addEventListener('click', handleClick);
        return () => {
            boardGrid.removeEventListener('click', handleClick);
        };
    }, [moveMade, validPositions, selectedPawn, setMoveMade, setPosition, setSelectedPawn, setCurrentPlayer, setColor, color]);

    const totalTiles = tileInfo.length;
    for (let i = 0; i < totalTiles; i++) {
        const position = possiblePositions[i];
        const isHighlighted = validPositions.includes(position);

        let totalColors = joinedColors.length;
        let currentColor = joinedColors[0];
        let colorRanges = {
            0: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
            1: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
            2: [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]],
            3: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]],
            4: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]],
            5: [[1, 2, 3, 4, 5]],
            6: [[1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12]]
        }
        let currentTileInfo = (totalColors === 5) ? tileInfo2 : tileInfo;

        if (currentTileInfo[i].startsWith('color')) {
            let temp = parseInt(currentTileInfo[i].replace('color', ''));
            for (let range = 0; range < colorRanges[totalColors].length; range++) {
                if (colorRanges[totalColors][range].includes(temp)) {
                    currentColor = joinedColors[range];
                    break;
                }
            }
        } else {
            currentColor = currentTileInfo[i];
        }

        const tileClass = `tile ${currentColor} ${isHighlighted ? 'blink' : ''}`
        if (tileInfo[i] === 'start') {
            tiles.push(
                <div key={i} className={tileClass} tile-id={i} pos={position}>
                    {renderStartPieces()}
                </div>
            );
        } else {
            tiles.push(<div key={i} className={tileClass} tile-id={i} pos={position}></div>);
        }
    }
    return (
        <div className='board-grid'>
            {tiles}
        </div>
    );
};


export default BoardGrid;