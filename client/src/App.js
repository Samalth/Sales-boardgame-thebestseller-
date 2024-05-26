import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { HomeScreen } from './HomeScreen/HomeScreen';
import { ModSettings } from './CreateGame/ModSettings'
import { Game } from './PlayerScreen/Game';
import { JoinGame } from './JoinGame/JoinGame';
import { Gamepin } from './CreateGame/Gamepin'
import { ModView } from './ModeratorScreen/ModView'
import musicOn from "./Assets/musicOn.png";
import musicOff from "./Assets/musicOff.png";

function App() {

  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route index element={<HomeScreen/>}/>
            <Route path='/home' element={<HomeScreen/>}/>
            <Route path='/configuration' element={<ModSettings/>}/>
            <Route path='/game' element={<Game/>}/>
            <Route path='/joingame' element={<JoinGame/>}/>
            <Route path='/gamepin' element={<Gamepin/>}/>
            <Route path='/modview' element={<ModView/>}/>
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;