import React, { useState } from 'react';
import { Container, TextField, MenuItem, Button, Grid, Box, Typography } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ListingsCard from './ListingsCard';

const educationLevels = ['Bachelor', 'Degree', 'Diploma'];
const subjects = ['Mathematics', 'Science', 'English', 'History'];
const genderCompositions = ['Male', 'Female', 'Mixed'];
const religiousTypes = ['Christian', 'Islamic', 'Hindu', 'None'];

const SearchComponent = ({ searchType }) => {
    const [searchCriteria, setSearchCriteria] = useState({
        name: '',
        location: '',
        educationLevel: '',
        subject: '',
        genderComposition: '',
        religiousType: ''
    });
    const [results, setResults] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria({ ...searchCriteria, [name]: value });
    };

    const handleSearch = async () => {
        let collectionRef;
        if (searchType === 'volunteers') {
            collectionRef = collection(db, 'volunteers');
        } else {
            collectionRef = collection(db, 'schools');
        }

        let q = query(collectionRef);

        if (searchCriteria.name) {
            q = query(q, where('name', '==', searchCriteria.name));
        }
        if (searchCriteria.location) {
            q = query(q, where('location', '==', searchCriteria.location));
        }
        if (searchType === 'volunteers') {
            if (searchCriteria.educationLevel) {
                q = query(q, where('educationLevel', '==', searchCriteria.educationLevel));
            }
            if (searchCriteria.subject) {
                q = query(q, where('subjects', 'array-contains', searchCriteria.subject));
            }
        }
        if (searchType === 'schools') {
            if (searchCriteria.genderComposition) {
                q = query(q, where('genderComposition', '==', searchCriteria.genderComposition));
            }
            if (searchCriteria.religiousType) {
                q = query(q, where('religiousType', '==', searchCriteria.religiousType));
            }
        }

        const querySnapshot = await getDocs(q);
        const resultsArray = [];
        querySnapshot.forEach((doc) => {
            resultsArray.push(doc.data());
        });
        setResults(resultsArray);
    };

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {searchType === 'volunteers' ? 'Search Volunteers' : 'Search Schools'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={searchCriteria.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={searchCriteria.location}
                            onChange={handleChange}
                        />
                    </Grid>
                    {searchType === 'volunteers' && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Education Level"
                                    name="educationLevel"
                                    value={searchCriteria.educationLevel}
                                    onChange={handleChange}
                                >
                                    {educationLevels.map((level) => (
                                        <MenuItem key={level} value={level}>
                                            {level}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Subject"
                                    name="subject"
                                    value={searchCriteria.subject}
                                    onChange={handleChange}
                                >
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            {subject}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </>
                    )}
                    {searchType === 'schools' && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Gender Composition"
                                    name="genderComposition"
                                    value={searchCriteria.genderComposition}
                                    onChange={handleChange}
                                >
                                    {genderCompositions.map((composition) => (
                                        <MenuItem key={composition} value={composition}>
                                            {composition}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Religious Type"
                                    name="religiousType"
                                    value={searchCriteria.religiousType}
                                    onChange={handleChange}
                                >
                                    {religiousTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </>
                    )}
                </Grid>
                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Box>
            </Box>
            <Box>
                <Typography variant="h5" component="h2" gutterBottom>
                    Results
                </Typography>
                {results.length > 0 ? (
                    <ListingsCard listings={results} searchType={searchType} />
                ) : (
                    <Typography variant="body1">No results found</Typography>
                )}
            </Box>
        </Container>
    );
};

export default SearchComponent;
