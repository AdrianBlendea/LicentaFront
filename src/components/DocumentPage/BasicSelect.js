import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function BasicSelect({ value, onChange, categories }) {
  return (
    <Box sx={{ minWidth: 80 }}>
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          value={value}
          onChange={onChange}
          label="Category"
        >
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default BasicSelect;