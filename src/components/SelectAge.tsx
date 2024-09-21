import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const SelectAge: React.FC = () => {
  const [age, setAge] = React.useState<string>('');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120}} size="small">
      <InputLabel id="demo-select-small-label">年齢</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label="年齢"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>選択なし</em>
        </MenuItem>
        <MenuItem value="10">10代</MenuItem>
        <MenuItem value="20">20代</MenuItem>
        <MenuItem value="30">30代</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectAge;
