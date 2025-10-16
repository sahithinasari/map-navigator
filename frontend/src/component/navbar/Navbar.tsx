import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  window?: () => Window;
}

export default function Navbar(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  //mobile menu items
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate("/login");
    handleMenuClose();
  };

  // Navigate to Profile Page
  const handleProfile = () => {
    navigate("/base");
    handleMenuClose();
  };

  // Logout User
  const handleLogout = () => {
    //logout(); // Clears token and updates auth state
    navigate("/");
    handleMenuClose();
  };

  const navigate = useNavigate(); // React Router navigation

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          borderRadius: "24px",
          backgroundColor: "#1C1C2E",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          px: 2, // horizontal padding
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            py: 0.5, // vertical padding to shrink height
            minHeight: "auto", // let content define height
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, letterSpacing: 1.2 }}
          >
            NaviX
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="small" // smaller size fits dense toolbar
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle fontSize="medium" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/** Profile Menu */}
      <>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {isAuthenticated ? (
            <>
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleLogin}>Login / Signup</MenuItem>
          )}
        </Menu>
      </>
    </Box>
  );
}
