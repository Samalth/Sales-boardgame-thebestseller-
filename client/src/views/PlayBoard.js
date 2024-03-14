import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../CSS/playboardStyle.css';
import io from 'socket.io-client'
// import '../CSS/diceScreen.css'

const socket = io.connect("http://localhost:3001")

const BoardGrid = () => {

const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");

const [startpieces] = useState([
     '<div class = "startpieces" id= "lunar"><img src="LUNAR.png"></div>',
     '<div class = "startpieces" id= "world"><img src="WORLD.png"></div>'
]);

const width = 15;
const length = 9;
const totalTiles = width * length;


const [draggedElement, setDraggedElement] = useState(null);
const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

useEffect(() => {
        createBoard();
    }, []);

function createBoard() {
    const tiles = [
    'people','yellow','red','world','rainbow','blue','mask', 'purple', 'yellow', 'people','rainbow', 'green','world','blue','purple',
    'green','blank','blank','blank', 'blank','blank', 'blank', 'world', 'blank', 'blank','blank', 'blank', 'blank', 'blank','mask',
    'mask','blank','blank','blank','blank','blank', 'blank', 'red', 'blank','blank','blank', 'blank', 'blank','blank','orange',
    'orange','blank','blank','blank', 'blank','blank', 'blank', 'mask', 'blank', 'blank','blank', 'blank', 'blank','blank', 'rainbow',
    'rainbow','people','purple','mask', 'yellow','world', 'blue', 'start', 'rainbow', 'people','blue', 'world', 'yellow','green', 'people',
    'world','blank','blank', 'blank', 'blank','blank', 'blank', 'people', 'blank', 'blank','blank', 'blank', 'blank','blank', 'red',
    'blue','blank', 'blank', 'blank', 'blank','blank', 'blank', 'green', 'blank', 'blank','blank','blank','blank','blank','blue',
    'red', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'mask', 'blank', 'blank','blank', 'blank', 'blank','blank', 'world',
    'people', 'rainbow', 'orange', 'mask', 'purple','yellow', 'world', 'rainbow', 'red', 'people','purple','green', 'mask', 'rainbow', 'orange'
   ];


    const gameboard = document.getElementById('gameboard');

    if(!gameboard){
    console.error('Gameboard element not found');
    return;
    }

    // Loop through the tiles and create elements dynamically
   for (let i = 0; i < totalTiles; i++) {
       const tile = document.createElement('div');
       tile.classList.add('tile')
       tile.className = `tile ${tiles[i]}`;
       tile.setAttribute('tile-id', i );
       gameboard.append(tile);

       if (tiles[i] === 'start') {
           const pawnContainer = document.createElement('div');
           pawnContainer.classList.add('startpieces');
           pawnContainer.innerHTML = startpieces.map(piece => piece).join('');
           tile.appendChild(pawnContainer);

           tile.firstChild.childNodes.forEach(node => {
               if (node.nodeName === 'DIV') {
                   node.setAttribute('draggable', true);
                   gameboard.addEventListener('dragstart', dragStart);
                   gameboard.addEventListener('dragover', dragOver);
                   gameboard.addEventListener('drop', dragDrop);

               }
           });
       }
   }
}


function dragStart (e) {
    if(e.target.parentNode.classList.contains('startpieces')){
        e.dataTransfer.setData('text/HTML', e.target.parentNode.id);
    }
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const targetTile = e.target.closest('.tile');

        if (targetTile && !targetTile.classList.contains('blank')) {
            const LunarTurn = getCurrentPlayer() == 'lunar';
            const WorldTurn = getCurrentPlayer() == 'world';
        if((LunarTurn && draggedElement == 'lunar') || (WorldTurn && draggedElement == 'world')){
        // Als de doeltile al pionnen bevat
            if (targetTile.querySelector('.startpieces')) {
            // Voeg de gesleepte pion toe naast de bestaande pionnen
            targetTile.querySelector('.startpieces').appendChild(draggedElement);
            draggedElement = null
        } else {
            // Plaats de gesleepte pion in de doeltile
            const pawnContainer = document.createElement('div');
            pawnContainer.classList.add('startpieces')
            targetTile.appendChild(pawnContainer);

            pawnContainer.appendChild(draggedElement);
            draggedElement = null;
        }
        switchTurns();
     }
   }
}

function getCurrentPlayer() {
    const currentPlayerHTML = startpieces[currentPlayerIndex];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentPlayerHTML;
    const playerElement = tempDiv.querySelector('.startpieces');

    return playerElement ? playerElement.id : '';
}



function switchTurns(){
    currentPlayerIndex = (currentPlayerIndex + 1) % startpieces.length;
    playerDisplay.innerText = 'It is ' + getCurrentPlayer() + '\'s turn';
    }

    return (
    <>
    <div id="gameboard" className="board-grid"></div>
    <p className="info-display"></p>
    <span id="player" className="player">It is {getCurrentPlayer()}'s turn </span>
    </>
    );
};
    
const DiceContainer = () => {
    const [diceValue, setDiceValue] = useState(1);
    const [question, setQuestion] = useState("");

    useEffect(() => {
        socket.on("receive_question", (data) =>{
            // console.log("question received")
            setQuestion(data);
        });
        return () => {
            socket.off('receive_question');
        };
    }, [socket]);

    const sendQuestionRequest = (number) => {
        socket.emit("send_question_request", { questionNumber: number });
    };
    
    const roll = () => {
        const images = ["../Dia1.JPG", "../Dia2.JPG", "../Dia3.JPG", "../Dia4.JPG", "../Dia5.JPG", "../Dia6.JPG"];
        const dice = document.querySelector(".diceImage");
        dice.classList.add("shake");
    
        let interval = setInterval(function() {
            let diceValue = Math.floor(Math.random() * 6) + 1;
            dice.setAttribute("src", images[diceValue - 1]);
        }, 100);
    
        setTimeout(function(){
            clearInterval(interval);
            dice.classList.remove("shake");
            const newDiceValue = Math.floor(Math.random() * 6) + 1;
            setDiceValue(newDiceValue);
            dice.setAttribute("src", images[newDiceValue - 1]);
            sendQuestionRequest(newDiceValue); // Pass the new dice value directly
            // console.log(newDiceValue)
        }, 1000);
    };

    return (
        <div className="container">
            <div className="dice-wrapper">
                <img className="diceImage" src={`../Dia${diceValue}.JPG`} alt='#die-1' />
            </div>
            <button type='button' onClick={roll}>Roll the dice</button>
            <label className='total-text'>{question}</label>
        </div>
    );
};

export function PlayBoard() {
    return (
        <>
            <BoardGrid />
            <DiceContainer />
        </>
    );
};
