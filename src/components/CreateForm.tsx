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

const CreatForm: React.FC = () => {
  const [formValues, setFormValues] = React.useState({
    name: '',
    profession: '',
    problems: '',
    dailyLife: ''
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Submit logic here
    console.log(formValues);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ color: 'black' }}>
          ペルソナを新規作成
        </Typography>

        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="名前"
            name="name"
            autoComplete="name"
            autoFocus
            value={formValues.name}
            onChange={handleInputChange}
          />
          {/* 性別と年齢を縦並びにするためのボックス */}
          <Box sx={{ display: 'flex', width: '100%', alignItems: "center", justifyContent: "center"}}>
            <SelectGender />
            <SelectAge />
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            name="profession"
            label="職業"
            type="text"
            id="profession"
            value={formValues.profession}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="problems"
            label="困りごと"
            type="text"
            id="problems"
            value={formValues.problems}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="dailyLife"
            label="普段の生活の様子"
            type="text"
            id="daily-life"
            value={formValues.dailyLife}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            新規作成
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreatForm;
