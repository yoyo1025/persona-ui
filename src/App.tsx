import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateForm from './CreateForm';
import Conversation from './Conversation';
import { PersonaProvider } from './context/PersonaContext';
import { DialogsProvider } from '@toolpad/core/useDialogs'; 

function App() {
  return (
    <PersonaProvider>
      <DialogsProvider>
        <Router>
          <Routes>
            {/* ペルソナ作成フォームのルート */}
            <Route path="/" element={<CreateForm/>} />
            {/* 会話ページのルート */}
            <Route path="/conversation/:id" element={<Conversation />} />
          </Routes>
        </Router>
      </DialogsProvider>
    </PersonaProvider>
  );
}

export default App;
