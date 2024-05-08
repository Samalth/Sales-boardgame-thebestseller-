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
            startPieces: [],
            updatedPieces: false
        }
    }

    componentDidMount() {
        this.fetchStartPieces();
        socket.on('add_piece',(data) => {
            this.setState({ startPieces: data})
        })
    }

    componentWillUnmount() {
        socket.off('add_piece');
    }

    fetchStartPieces = () => {
        if (!this.state.updatedPieces) {
            socket.emit('get_pieces', 'player');
            socket.emit('get_data', 'leaderboard_update');
            this.setState({updatedPieces: true});
        }
    }

    renderStartPieces = () => {
        return this.state.startPieces.map((piece, index) => (
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