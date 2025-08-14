import { Route, Routes } from 'react-router-dom'
import './index.css'
import "./css/style.css";
import Mappage from './pages/Mappage';
import Reportpage from './pages/Reportpage';
import Uploadpage from './pages/Uploadpage';
import Loginpage from './pages/Loginpage';
import Start from './pages/Start';
import Errpage from './pages/Errpage';


function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Mappage/>} />
        <Route path='/report' element={<Reportpage/>} />
        <Route path='/upload' element={<Uploadpage/>} />
        <Route path='/login' element={<Loginpage/>}/>
        <Route path='/hamkae' element={<Start/>}/>
        <Route path='/err' element={<Errpage/>}/>
      </Routes>
    </div>
  )
}

export default App;
