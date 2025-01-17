import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import SiteIcon from './Images/siteIcon.png';
import UserIcon from './Images/userIcon.png'; // Import the default user icon
import { useAuth } from './AuthContext';
import axios from 'axios';

const pages = [
  { name: 'Probleme', path: '/problems' },
  { name: 'Documente', path: '/documents' },
  { name: 'Clasament', path: '/board' },
  { name: 'Verificare soluții', path: '/plagiarism', adminOnly: true },
];

function ResponsiveAppBar() {
  const { isAuthenticated, logout } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [profilePicture, setProfilePicture] = React.useState(UserIcon); // Default to UserIcon
  const [isAdmin, setIsAdmin] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserData = () => {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      return {
        id: userData.id || '',
        token: userData.token || '',
        role: userData.role || '',
      };
    };

    const fetchProfilePicture = async () => {
      try {
        const { id, token } = fetchUserData();
        const response = await axios.get('http://localhost:8080/user/getPicture', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
          params: {
            userId: id,
          },
        });

        if (response.data.byteLength > 0) {
          const pictureUrl = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
          setProfilePicture(pictureUrl);
        } else {
          setProfilePicture(UserIcon); // Use default icon if the response is empty
        }
      } catch (error) {
        console.error('Error fetching profile picture', error);
        setProfilePicture(UserIcon); // Use default icon in case of an error
      }
    };

    const userData = fetchUserData();
    if (userData.role === 'admin') {
      setIsAdmin(true);
    }
    if (userData.role === 'user') {
      setIsAdmin(false);
    }

    if (isAuthenticated) {
      fetchProfilePicture();
    }
  }, [isAuthenticated]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const handlePageClick = (path) => {
    if (!isAuthenticated && path === '/home') {
      navigate('/login');
    } else {
      navigate(path);
    }
    handleCloseNavMenu();
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
    handleCloseUserMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar alt="Site Icon" src={SiteIcon} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/home" // Changed from "/" to "/home"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Despre
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                (!page.adminOnly || isAdmin) && (
                  <MenuItem
                    key={page.name}
                    onClick={() => handlePageClick(page.path)}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                )
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/home" // Changed from "/" to "/home"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Home
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              (!page.adminOnly || isAdmin) && (
                <Button
                  key={page.name}
                  onClick={() => handlePageClick(page.path)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              )
            ))}
          </Box>

          {isAuthenticated ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" src={profilePicture} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                
                <MenuItem onClick={handleProfileClick}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Button
                variant="contained"
                component={Link}
                to="/login"
                sx={{
                  my: 2,
                  backgroundColor: 'white',
                  color: 'black',
                  display: 'block',
                  fontSize: '1rem',
                  padding: '0.5rem 1.5rem',
                  '&:hover': {
                    backgroundColor: 'lightgray',
                  },
                }}
              >
                Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
