import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectAgeProps {
  onAgeChange: (age: number) => void;
}

const SelectAge: React.FC<SelectAgeProps> = ({ onAgeChange }) => {
  const [age, setAge] = React.useState<string>('');

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedAge = event.target.value;
    setAge(selectedAge);
    onAgeChange(parseInt(selectedAge, 10));  // 親コンポーネントに年齢を渡す
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
