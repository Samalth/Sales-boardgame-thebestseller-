import Lunar from '../Assets/LUNAR.png';
import DominoHouse from '../Assets/DOMINO.png';
import SafeLine from '../Assets/SAFELINE.png';
import KlapHatten from '../Assets/KLAPPENHATTEN.png';
import Jysk from '../Assets/JYSK.png';
import React, {Component} from "react";
import {socket} from "../client";

class Pawns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startPieces: [Lunar, DominoHouse, SafeLine, KlapHatten, Jysk],
            updatedPieces: false
        }
    }

    componentDidMount() {
        socket.on('add_piece')
        this.fetchStartPieces();
    }

    componentWillUnmount() {
        socket.off('add_piece');
    }

    fetchStartPieces = () => {
        if (!this.updatedPieces) {
            socket.emit('get_pieces', 'player');
            socket.emit('get_data', 'leaderboard_update');
            this.updatedPieces(true);
        }
    }

    renderStartPieces = () => {
        return this.startPieces.map((piece, index) => (
            <div key={index} className={`startpieces piece${piece}`} id={`${piece}`}/>
        ));
    };

    render() {
        return (
            <div>
                {this.renderStartPieces()}
            </div>
        );
    }
}
export default Pawns;