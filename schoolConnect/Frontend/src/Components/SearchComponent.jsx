import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Checkbox, FormControlLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const SearchComponent = ({ searchCriteria, onSearch }) => {
    const [searchParams, setSearchParams] = useState({});

    const handleInputChange = (field, value) => {
        setSearchParams({ ...searchParams, [field]: value });
    };

    const handleSearchClick = () => {
        onSearch(searchParams);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {searchCriteria.map((criteria) => (
                <React.Fragment key={criteria.field}>
                    {criteria.type === 'text' && (
                        <TextField
                            label={criteria.label}
                            variant="outlined"
                            value={searchParams[criteria.field] || ''}
                            onChange={(e) => handleInputChange(criteria.field, e.target.value)}
                        />
                    )}
                    {criteria.type === 'select' && (
                        <FormControl variant="outlined">
                            <InputLabel>{criteria.label}</InputLabel>
                            <Select
                                value={searchParams[criteria.field] || ''}
                                onChange={(e) => handleInputChange(criteria.field, e.target.value)}
                                label={criteria.label}
                            >
                                {criteria.options.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    {criteria.type === 'autocomplete' && (
                        <Autocomplete
                            multiple
                            options={criteria.options}
                            getOptionLabel={(option) => option}
                            value={searchParams[criteria.field] || []}
                            onChange={(event, value) => handleInputChange(criteria.field, value)}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" label={criteria.label} />
                            )}
                        />
                    )}
                    {criteria.type === 'checkbox' && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={searchParams[criteria.field] || false}
                                    onChange={(e) => handleInputChange(criteria.field, e.target.checked)}
                                />
                            }
                            label={criteria.label}
                        />
                    )}
                </React.Fragment>
            ))}
            <Button variant="contained" onClick={handleSearchClick}>Search</Button>
        </Box>
    );
};

export default SearchComponent;
