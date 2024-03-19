import { useNavigate } from 'react-router-dom';
import '../CSS/JoinScreenStyle.css';
import { useEffect, useState } from "react"
import {socket} from '../client'

export function JoinGame() {
    const [gamepin, setGamepin] = useState("");
    const [username, setUsername] = useState("");
    const [strategy, setStrategy] = useState("");
    const [information, setInformation] = useState("");

  const navigate = useNavigate();

  const setName = (username) => {
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
      // Navigate to the '/game' route
    //   setName(username, gamepin, strategy)

      navigate('/game');
  };
  const handleHome = () => {
    navigate('/home')
  }

    return (
        <div className="parent-container">
        <div className='row error'>{information}</div>
        <div className="row gamepin">
            <label>Gamepin:</label>
            <input type="text" className='input' value={gamepin} placeholder='54123' onChange={event => setGamepin(event.target.value)}/>
        </div>

        <div className="row strategy">
            <label htmlFor="strategy">Strategy:</label>
            <select name="strategy" id="strategy" onChange={event => setStrategy(event.target.value)}>
                <option value="" hidden="hidden">Pick a strategy</option>
                <option value="Lunar">1. Lunar</option>
                <option value="Top of the World">2. Top of the World</option>
                <option value="Safeline">3. Safeline</option>
                <option value="Strat 4">4. Strat 4</option>
                <option value="Strat 5">5. Strat 5</option>
                <option value="Strat 6">6. Strat 6</option>
            </select>
        </div>

        <div className="row name">
            <label htmlFor="fullName">Full name:</label>
            <input type="text" id="fullName" className='input' name="fullName" value={username} placeholder='MarketMogul' onChange={event => setUsername(event.target.value)}/>
        </div>

        <div className="row">
            <input type="submit" className="start button" value="Start!" onClick={() => setName(username, gamepin, strategy)}/>
            <input type="submit" className="back button" value="Home" onClick={handleHome}/>
        </div>
    </div>
    );
}