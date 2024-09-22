import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateForm from './CreateForm';
import Conversation from './Conversation';
import { PersonaProvider } from './context/PersonaContext';

function App() {
  return (
    <PersonaProvider>
      <Router>
        <Routes>
          {/* ペルソナ作成フォームのルート */}
          <Route path="/" element={<CreateForm/>} />
          {/* 会話ページのルート */}
          <Route path="/conversation/:id" element={<Conversation />} />
        </Routes>
      </Router>
    </PersonaProvider>
  );
}

export default App;
