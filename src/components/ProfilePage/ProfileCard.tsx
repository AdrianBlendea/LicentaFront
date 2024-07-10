// IMPORTS
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";

// STYLES
const styles = {
  details: {
    padding: "1rem",
    borderTop: "1px solid #e1e1e1"
  },
  value: {
    padding: "1rem 2rem",
    borderTop: "1px solid #e1e1e1",
    color: "#899499"
  }
};

// Default profile picture
const defaultProfilePicture = './userIcon';

const fetchUserData = () => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  return {
    id: userData.id || '',
    token: userData.token || '',
    name: userData.name || '',
    role: userData.role || '',
  };
};

// APP
export default function ProfileCard(props: any) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [totalProblems, setTotalProblems] = useState(0);
  const [lplace, setLplace] = useState(0);
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);

  useEffect(() => {
    const fetchData = async () => {
      const { id, token, name, role } = fetchUserData();
      setName(name);
      setRole(role);

      try {
        // Fetch total problems resolved
        const problemsResponse = await axios.get('http://localhost:8080/statistics/problems', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          params: {
            userId: id,
          },
        });

        setTotalProblems(problemsResponse.data);

        // Fetch ranking place
        const placeResponse = await axios.get('http://localhost:8080/statistics/lplace', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          params: {
            userId: id,
          },
        });

        setLplace(placeResponse.data);

        // Fetch profile picture
        const pictureResponse = await axios.get('http://localhost:8080/user/getPicture', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
          params: {
            userId: id,
          },
        });

        const pictureUrl = URL.createObjectURL(new Blob([pictureResponse.data], { type: 'image/jpeg' }));
        setProfilePicture(pictureUrl);

      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdatePicture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const { id, token } = fetchUserData();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', id);

      const response = await axios.post('http://localhost:8080/user/setPicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });

      const newPictureUrl = URL.createObjectURL(file);
      setProfilePicture(newPictureUrl);
      console.log('Profile picture updated successfully');

      window.location.reload();
    } catch (error) {
      console.error('Error updating profile picture', error);
    }
  };

  const handleDeletePicture = async () => {
    try {
      const { id, token } = fetchUserData();
      await axios.delete('http://localhost:8080/user/deletePicture', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        params: {
          userId: id,
        },
      });

      setProfilePicture(defaultProfilePicture);
      console.log('Profile picture deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting profile picture', error);
    }
  };

  return (
    <Card variant="outlined">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* CARD HEADER START */}
        <Grid item sx={{ p: "1.5rem 0rem", textAlign: "center" }}>
          {/* PROFILE PHOTO */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Avatar
              sx={{ width: 100, height: 100, mb: 1.5 }}
              src={profilePicture}
            ></Avatar>
          </Badge>

          {/* Update and Delete Buttons */}
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-picture-file"
                type="file"
                onChange={handleUpdatePicture}
              />
              <label htmlFor="profile-picture-file">
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                >
                  Actualizare
                </Button>
              </label>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDeletePicture}
              >
                Ștergere
              </Button>
            </Grid>
          </Grid>

          {/* DESCRIPTION */}
          <Typography variant="h6" sx={{ mt: 2 }}>{name}</Typography>
          <Typography color="text.secondary">{role}</Typography>
        </Grid>
        {/* CARD HEADER END */}

        {/* DETAILS */}
        <Grid container>
          <Grid item xs={6}>
            <Typography style={styles.details}>Total probleme rezolvate</Typography>
            <Typography style={styles.details}>Loc in clasament</Typography>
          </Grid>
          {/* VALUES */}
          <Grid item xs={6} sx={{ textAlign: "end" }}>
            <Typography style={styles.value}>{totalProblems}</Typography>
            <Typography style={styles.value}>{lplace}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
