import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateForm from './CreateForm';
import Conversation from './Conversation';
import { PersonaProvider } from './context/PersonaContext';
import { DialogsProvider } from '@toolpad/core/useDialogs'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import SignInSide from './sign-in-side/SignInSide';
import SignUpSide from './sign-up-side/SignUpSide';


function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = createTheme({
    palette: {
      mode: mode,
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <PersonaProvider>
        <DialogsProvider>
          <Router>
            <Routes>
              {/* Pass setMode and mode as props */}
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