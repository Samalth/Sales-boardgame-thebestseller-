import { useNavigate } from 'react-router-dom';
import '../CSS/startStyle.css';


export function HomeScreen() {
  const navigate = useNavigate();

  const handleCreateGame = () => {
      // Navigate to the '/configuration' route
      navigate('/configuration');
  };
  const handleJoinGame = () => {
    navigate('/joingame')
  }

    return (
        <div>
          <div className="row" id="data-container">
            <h1 className="yes">The Best Seller</h1>
            <input
              type="button"
              className="Qbutton"
              value="?"
            //   onClick={openManual}
            />
          </div>
    
          <div className="row">
            <input type="submit" className="button game" value="Join Game" onClick={handleJoinGame}/>

            <input type="submit" className="button game" value="Create Game" onClick={handleCreateGame}/>
          </div>
    
          <div className="row languages">
            <img className='flagImg' src='../den_flag.png' alt=''/>
            <img className='flagImg' src='../uk_flag.png' alt=''/>
            <img className='flagImg' src='../nl_flag.png' alt=''/>
          </div>
        </div>
    );
}