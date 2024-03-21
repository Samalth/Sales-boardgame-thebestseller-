import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { HomeScreen } from './views/HomeScreen';
import { ModSettings } from './views/ModSettings'
import { PlayBoard } from './views/PlayBoard';
import { JoinGame } from './views/JoinGame';
import { Gamepin } from './views/Gamepin'

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// const [room, setRoom] = useState("")

// const [message, setMessage] = useState("")
// const [messageReceived, setMessageReceived] = useState("")

// const joinRoom = () =>{
//   if (room !== ""){
//     socket.emit("join_room", room)
//   }
// }

// const sendMessage = () =>{
//   socket.emit("send_message", {message, room})
// }

// useEffect(() => {
//   socket.on("receive_message", (data) =>{
//     setMessageReceived(data.message)
//   })
// }, [socket])


// <input placeholder='Room number' onChange={(event) => {
//         setRoom(event.target.value)
//       }}/>
//       <button onClick={joinRoom}>Join room</button>
//       <input placeholder='Message' onChange={(event) =>{
//         setMessage(event.target.value)
//       }}/>
//       <button onClick={sendMessage}>Send message</button>
//       <h1>Message: </h1>
//       {messageReceived}