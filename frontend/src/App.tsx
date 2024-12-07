import Chatbot from './components/chatbot';
import TitleBar from './components/title_bar/titleBar';
import SidePane from './components/side_pane/sidePane';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game_A from './games/game-a';


function HomePage() {
  return (
    <div className="d-flex flex-column ">
      {/* Header */}
      <TitleBar />

      {/* Main Content */}
      <main className="d-flex flex-grow-1">
        {/* <SidePane /> */}

        {/* Main Content Area */}
        <div className="d-flex flex-grow-1">
          <Chatbot />
        </div>
      </main>

      {/* Footer (Optional) */}
      {/* <footer className="py-3 bg-light">
        <p className="text-center">Footer</p>
      </footer> */}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* Add additional routes here */}
        <Route path='/have-fun-game-a' element={<Game_A />} />
      </Routes>
    </Router>
  );
}

export default App;

