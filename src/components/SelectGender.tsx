import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface SelectGenderProps {
  onGenderChange: (gender: string) => void;
}

const SelectGender: React.FC<SelectGenderProps> = ({ onGenderChange }) => {
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onGenderChange(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1 }} component="fieldset">
      <FormLabel component="legend"></FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="sex"
        onChange={handleGenderChange}  // 親コンポーネントに変更を渡す
      >
        <FormControlLabel value="female" control={<Radio />} label="female"/>
        <FormControlLabel value="male" control={<Radio />} label="male"/>
      </RadioGroup>
    </FormControl>
  );
};

export default SelectGender;
