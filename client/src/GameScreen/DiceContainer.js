import React from "react";
import { socket } from "../client";
import './Dice.css'
import Dice1 from '../Assets/Dia1.JPG';
import Dice2 from '../Assets/Dia2.JPG';
import Dice3 from '../Assets/Dia3.JPG';
import Dice4 from '../Assets/Dia4.JPG';
import Dice5 from '../Assets/Dia5.JPG';
import Dice6 from '../Assets/Dia6.JPG';


class DiceContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            diceValue: 1,
            playerName: '',
            myTurn: true
        };
    }

    roll = () => {
        socket.emit("roll_dice")
        this.setState({ myTurn: false });
    };

    componentDidMount() {
        const { position } = this.props;
        const images = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

        socket.on("set_dice", (data) => {
            const dice = document.querySelector(".diceImage");
            dice.classList.add("shake");

            let interval = setInterval(() => {
                let diceValue = Math.floor(Math.random() * 6) + 1;
                dice.setAttribute("src", images[diceValue - 1]);
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                dice.classList.remove("shake");
                this.setState({ diceValue: data });
                dice.setAttribute("src", images[data - 1]);
                socket.emit("send_dice_roll_and_position", { diceValue: data, position: position });
            }, 1000);
        });

        socket.on('players_name', (data) => {
            this.setState({ playerName: data });
        });
    }

    componentWillUnmount() {
        // Cleanup logic if needed
        socket.off("set_dice");
        socket.off("players_name");
    }

    getDiceValue = () => {
        return this.state.diceValue;
    }

    render() {
        const { diceValue, playerName, myTurn } = this.state;
        const { isModeratorScreen } = this.props;
        const images = [ Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];


        return (
            <div className="dice-container">
                <div className="dice-wrapper">
                    <img className="diceImage" src={images[diceValue-1]} />
                </div>
                {isModeratorScreen ?
                    <div className="turnsModView"> {playerName} is rolling the dice </div> :
                    <div>
                        { myTurn && <button type='button' onClick={this.roll}>Roll the dice</button> }
                    </div>
                }
            </div>
        );
    }
}

export default DiceContainer;
