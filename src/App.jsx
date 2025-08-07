import './fonts.css'
import { Route, Routes } from 'react-router-dom'
import './index.css'
import "./css/style.css";
import Maps from './pages/Maps';


function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Maps/>} />
      </Routes>
    </div>
  )
}

export default App;
