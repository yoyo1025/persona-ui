import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateForm from './CreateForm';
import Conversation from './Conversation';

function App() {
  return (
    <Router>
      <Routes>
        {/* ペルソナ作成フォームのルート */}
        <Route path="/" element={<CreateForm/>} />
        {/* 会話ページのルート */}
        <Route path="/conversation/:id" element={<Conversation />} />
      </Routes>
    </Router>
  );
}

export default App;
