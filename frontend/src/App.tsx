import Chatbot from './components/chatbot';
import TitleBar from './components/title_bar/titleBar';
import SidePane from './components/side_pane/sidePane';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game_A from './games/game-a';
import { Navbar } from 'react-bootstrap';
import CurrentChatSession from './components/current_chat_session/currentChatSession';
import { useContext, useRef } from 'react';
import { sharedInfoContext } from './utils/sharedContext';
import QueryInput from './components/queryInput/queryInput';


function HomePage() {
  // const {chatContainerRef} = useContext(sharedInfoContext);

  return (
    <div className='masterDiv'>
      <header>
        {/* header */}
        <TitleBar />
      </header>
      <main>
        <nav className='sidebar'>
          <SidePane />
        </nav>
        <div className='companionArea'>
          <section className='convoLog'>
            {/* TODO: still need to work on the items within the chat section */}
            {/* convoLog */}
            {/* <Chatbot/> */}
            {/* <div ref={chatContainerRef} className="currentChatSession"> */}
            <CurrentChatSession />
            {/* </div> */}
          </section>
          <section className='inputQuery'>
            {/* inputQuery */}
            <QueryInput />
          </section>
        </div>
      </main>
      <footer className='d-flex justify-content-center pe-3'>
        {/* <Navbar bg='light' variant='light'> */}
        {/* <Navbar.Brand href='#'>
            NOVA Chatbot
          </Navbar.Brand> */}
        {/* </Navbar> */}
        <div className='pe-2'>
          Created by Bobby Lawson
        </div>
        <div>
          {/* GitHub Link */}
          <a className='pe-2' href='https://github.com/forces23' target='_blank' rel='noopener noreferrer' >
            <i className="bi bi-github"></i>
          </a>
          {/* linkedIn Link */}
          <a href='https://www.linkedin.com/in/bobby-lawson-528824126/' target='_blank' rel='noopener noreferrer'>
            <i className="bi bi-linkedin"></i>
          </a>
        </div>
        <div></div>


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

