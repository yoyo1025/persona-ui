import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateForm from './CreateForm';
import Conversation from './Conversation';
import { PersonaProvider } from './context/PersonaContext';
import { DialogsProvider } from '@toolpad/core/useDialogs'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import SignInSide from './sign-in-side/SignInSide';
import SignUpSide from './sign-up-side/SignUpSide';
import { getDesignTokens } from './sign-in-side/theme/themePrimitives'; // カスタムテーマをインポート

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  // カスタムテーマを適用
  const theme = createTheme(getDesignTokens(mode));

  return (
    <ThemeProvider theme={theme}>
      <PersonaProvider>
        <DialogsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<CreateForm setMode={setMode} mode={mode} />} />
              <Route path="/conversation/:id" element={<Conversation setMode={setMode} mode={mode} />} />
              <Route path="/login" element={<SignInSide />} />
              <Route path="/signup" element={<SignUpSide />} />
            </Routes>
          </Router>
        </DialogsProvider>
      </PersonaProvider>
    </ThemeProvider>
  );
}

export default App;
