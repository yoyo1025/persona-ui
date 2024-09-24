import * as React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import SelectGender from "./SelectGender";
import SelectAge from "./SelectAge";
import { useNavigate } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import { borders } from '@mui/system';


const PersonaForm: React.FC = () => {
  const [formValues, setFormValues] = React.useState({
    name: '',
    sex: '',
    age: 0,
    profession: '',
    problems: '',
    behavior: ''
  });

  const navigate = useNavigate();
  const [progress, setProgress] = React.useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleGenderChange = (gender: string) => {
    setFormValues({ ...formValues, sex: gender });
  };

  const handleAgeChange = (age: number) => {
    setFormValues({ ...formValues, age});
  };

  const handleProgress = () => {
    setProgress(!progress);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(JSON.stringify(formValues));
    
    // JSON形式のデータを送信
    const response = await fetch("http://localhost:30000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("成功：", data);
      navigate(`/conversation/${data.id}`)
    } else {
      console.error("エラー：", response.statusText);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: 1,
          borderRadius: '10px',
          paddingLeft: 5,
          paddingRight: 5,
          paddingTop: 5, 
          paddingBottom: 3,
          boxShadow: 5, // ここで影を追加
        }}
      >
        {progress ? 
          <Box sx={{ width: '100%'}}>
            now createing
            <LinearProgress />
          </Box> : <></>
        }
        <Typography component="h1" variant="h4">
          Create Persona
        </Typography>

        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formValues.name}
            onChange={handleInputChange}
            variant="outlined" 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} 
          />
          {/* 性別と年齢を縦並びにするためのボックス */}
          <Box sx={{ display: 'flex', width: '100%', alignItems: "center", justifyContent: "center"}}>
            <SelectGender onGenderChange={handleGenderChange}/>
            <SelectAge onAgeChange={handleAgeChange} />
          </Box>
          <TextField
            required
            fullWidth
            name="profession"
            label="profession"
            type="text"
            id="profession"
            value={formValues.profession}
            onChange={handleInputChange}
            variant="outlined" // variantを指定
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} // 丸みを追加
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="problems"
            label="problems"
            type="text"
            id="problems"
            value={formValues.problems}
            onChange={handleInputChange}
            variant="outlined" // variantを指定
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} // 丸みを追加
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="behavior"
            label="behavior"
            type="text"
            id="behavior"
            value={formValues.behavior}
            onChange={handleInputChange}
            variant="outlined" // variantを指定
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} // 丸みを追加
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, textTransform: 'none',  borderRadius: '8px', fontWeight: 'bold'}}
            onClick={handleProgress}
          >
            Create Persona
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PersonaForm;
