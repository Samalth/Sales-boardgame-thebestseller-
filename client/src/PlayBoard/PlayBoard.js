import Lunar from '../Assets/LUNAR.png';
import DominoHouse from '../Assets/DOMINOHOUSE.png';
import SafeLine from '../Assets/SAFELINE.png';
import KlapHatten from '../Assets/KLAPHATTEN.png';
import Jysk from '../Assets/JYSK.png';
import {Component} from "react";
import {socket} from "../client";

class PlayBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validPositions: [],
            startPieces: [Lunar, DominoHouse, SafeLine, KlapHatten, Jysk],
            updatedPieces: false
        }
    }

    tileInfo = [
        'sales','yellow','red','megatrends','rainbow','blue','chance', 'purple', 'yellow', 'sales','rainbow', 'green','megatrends','blue','purple',
        'green','blank','blank','blank', 'blank','blank', 'blank', 'megatrends', 'blank', 'blank','blank', 'blank', 'blank', 'blank','chance',
        'chance','blank','blank','blank','blank','blank', 'blank', 'red', 'blank','blank','blank', 'blank', 'blank','blank','orange',
        'orange','blank','blank','blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'rainbow',
        'rainbow','sales','purple','chance', 'yellow','megatrends', 'blue', 'start', 'rainbow', 'sales','blue', 'megatrends', 'yellow','green', 'sales',
        'megatrends','blank','blank', 'blank', 'blank','blank', 'blank', 'sales', 'blank', 'blank','blank', 'blank', 'blank','blank', 'red',
        'blue','blank', 'blank', 'blank', 'blank','blank', 'blank', 'green', 'blank', 'blank','blank','blank','blank','blank','blue',
        'red', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'megatrends',
        'sales', 'rainbow', 'orange', 'chance', 'purple','yellow', 'megatrends', 'rainbow', 'red', 'sales','purple','green', 'chance', 'rainbow', 'orange'
    ];

    possiblePositions = [
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

    componentDidMount() {
        socket.on("update_valid_positions", (data) => {
            this.setState({ validPositions: data });
        });

        socket.on("add_piece", (data) => {
            this.setState({ startPieces: data })
        });

        socket.on("update_position", (data) => {
            const { newPosition, selectedPawn } = data;
            const selectedPawnElement = document.getElementById(selectedPawn);
            if (selectedPawnElement && this.state.validPositions.includes(newPosition)) {
                const newTile = document.querySelector(`.tile[pos="${newPosition}"]`);
                newTile.appendChild(selectedPawnElement);
                this.setState({ position: newPosition });
                document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('blink'));
            }
        });
        this.fetchStartPieces();
    }

    componentWillUnmount() {
        // Clean up socket event listeners
        socket.off("update_valid_positions");
        socket.off("add_piece");
        socket.off("update_position");
    }

    fetchStartPieces = () => {
        if (!this.state.updatedPieces) {
            socket.emit('get_pieces', 'player');
            socket.emit('get_data', 'leaderboard_update');
            this.setState({ updatedPieces: true });
        }
    };

    renderStartPieces = () => {
        return this.state.startPieces.map((piece, index) => (
            <div key={index} className={`startpieces piece${piece}`} id={`${piece}`} />
        ));
    };

    handleClick = event => {
        const targetTile = event.target.closest('.tile');
        if (startPieces.includes(event.target.id)) {
            event.target.classList.add('highlight');
            // setSelectedPawn(event.target);
            console.log(event.target)
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

    render() {
        const { totalTiles, tileInfo, possiblePositions } = this.props;
        const tiles = [];

        for (let i = 0; i < totalTiles; i++) {
            const position = possiblePositions[i];
            const isHighlighted = this.state.validPositions.includes(position);
            const tileClass = `tile ${tileInfo[i]} ${isHighlighted ? 'blink' : ''}`;
            if (tileInfo[i] === 'start') {
                tiles.push(
                    <div key={i} className={tileClass} tile-id={i} pos={position}>
                        {this.renderStartPieces()}
                    </div>
                );
            } else {
                tiles.push(<div key={i} className={tileClass} tile-id={i} pos={position}></div>);
            }
        }

        return (
            <div className='board-grid' onClick={this.handleClick}>
                {tiles}
            </div>
        );
    }
}
export default PlayBoard;