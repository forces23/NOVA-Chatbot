import Chatbot from './components/chatbot';
import TitleBar from './components/title_bar/titleBar';
import SidePane from './components/side_pane/sidePane';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game_A from './games/game-a';
import Navbar from 'react-bootstrap';


function HomePage() {
  return (
    <div className='masterDiv'>
      <header>
        header
      </header>
      <main>
        <section className='convoLog'>
          convoLog
        </section>
        <section className='inputQuery'>
          inputQuery
        </section>
      </main>
      <footer>
        footer
      </footer>
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

