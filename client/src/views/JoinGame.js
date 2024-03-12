import { useNavigate } from 'react-router-dom';
import '../CSS/JoinScreenStyle.css';
import { useEffect, useState } from "react"


export function JoinGame() {
    const [gamepin, setGamepin] = useState("54123");
    const [username, setUsername] = useState("MarketMogul");

  const navigate = useNavigate();

  const handleGame = () => {
      // Navigate to the '/game' route
      navigate('/game');
  };
  const handleHome = () => {
    navigate('/home')
  }
  const emptyPin = () => {
    setGamepin("")
  }
  const emptyUsername = () => {
    setUsername("")
  }

    return (
        <div className="parent-container">
        <div className="row gamepin">
            <label>Gamepin:</label>
            <input type="text" className='input' value={gamepin} onClick={emptyPin} onChange={event => setGamepin(event.target.value)}/>
        </div>

        <div className="row strategy">
            <label for="strategy">Strategy:</label>
            <select name="strategy" id="strategy">
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
            <label for="fullName">Full name:</label>
            <input type="text" id="fullName" className='input' name="fullName" value={username} onClick={emptyUsername} onChange={event => setUsername(event.target.value)}/>
        </div>

        <div class="row">
            <input type="submit" className="start button" value="Start!" onClick={handleGame}/>
            <input type="submit" className="back button" value="Home" onClick={handleHome}/>
        </div>
    </div>
    );
}