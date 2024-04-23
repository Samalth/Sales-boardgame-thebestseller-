import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { HomeScreen } from './HomeScreen/HomeScreen';
import { ModSettings } from './ModeratorScreen/ModSettings'
import { PlayBoard } from './GamerScreen/PlayBoard';
import { JoinGame } from './JoinGameScreen/JoinGame';
import { Gamepin } from './Gamepin/Gamepin'
import { ModView } from './ModeratorScreen/ModView'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<HomeScreen/>} />
          <Route path='/home' element={<HomeScreen/>} />
          <Route path='/configuration' element={<ModSettings/>} />
          <Route path='/game' element={<PlayBoard/>} />
          <Route path='/joingame' element={<JoinGame/>} />
          <Route path='/gamepin' element={<Gamepin/>} />
          <Route path='/modview' element={<ModView/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;