import { useNavigate } from 'react-router-dom';
import './JoinScreenStyle.css';
import { useEffect, useState } from "react"
import {socket} from '../client'

export function JoinGame() {
    const [gamepin, setGamepin] = useState("");
    const [username, setUsername] = useState("");
    const [strategy, setStrategy] = useState("");
    const [information, setInformation] = useState("");
    const navigate = useNavigate();

    const setName = (username) => {
        if (!username) {
            setInformation("Please enter a name");
            return;
        }
        socket.emit("join_room", { name: username, room: gamepin, strategy: strategy});
    };

  useEffect(() =>{
    socket.on('join_succes', (data) => {
        if (data === 'available'){
            handleGame()
        } else {
            setInformation(data)
        }
    })
  })

  const handleGame = () => {
      navigate('/game');
  };

  const handleHome = () => {
    navigate('/home')
  }
    return (
        <div className="parent-container">
        <div className='joinscreen-row error'>{information}</div>
        <div className="joinscreen-row gamepin">
            <label>Game pin:</label>
            <input type="text" className='input' value={gamepin} placeholder='Enter gamepin' onChange={event => setGamepin(event.target.value)}/>
        </div>
        <div className="joinscreen-row strategy">
            <label htmlFor="strategy">Strategy:</label>
            <select className={`${
                strategy === 'Lunar' ? 'dropyellow' :
                strategy === 'Top of the World' ? 'dropgreen' :
                strategy === 'Safeline' ? 'dropred' :
                strategy === 'Jysk Telepartner' ? 'droporange' :
                strategy === 'Domino House' ? 'dropblue' :
                strategy === 'Klaphatten' ? 'droppurple' : ''}`}
                name="strategy" id="strategy" onChange={event => setStrategy(event.target.value)}>
                <option value="" hidden="hidden">Pick a strategy</option>
                <option className='dropyellow' value="Lunar">1. Lunar</option>
                <option className='dropgreen' value="Top of the World">2. Top of the World</option>
                <option className='dropred' value="Safeline">3. Safeline</option>
                <option className='droporange' value="Jysk Telepartner">4. Jysk Telepartner</option>
                <option className='dropblue' value="Domino House">5. Domino House</option>
                <option className='droppurple' value="Klaphatten">6. Klaphatten</option>
            </select>
        </div>
        <div className="joinscreen-row name">
            <label htmlFor="fullName">Full name:</label>
            <input type="text" id="fullName" className='input' name="fullName" value={username} placeholder='Enter name' onChange={event => setUsername(event.target.value)}/>
        </div>
        <div className="joinscreen-row">
            <input type="submit" className="startgame button" value="Start!" onClick={() => setName(username, gamepin, strategy)}/>
            <input type="submit" className="back button" value="Home" onClick={handleHome}/>
        </div>
    </div>
    );
}