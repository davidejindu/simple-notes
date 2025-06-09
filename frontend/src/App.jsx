import {Routes, Route} from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Create from './pages/Create';
import NoteDetail from './pages/NoteDetail';



const App = () => {
  return (
    <div data-theme="emerald">
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/home" element={<Home/>} />
            <Route path="/create" element={<Create/>} />
            <Route path="/note/:id" element={<NoteDetail/>} />
        </Routes>


    </div>
  )
};

export default App