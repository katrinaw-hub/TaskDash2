import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import auth from "../lib/auth-helper.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../core/assets/taskdash-logo.png"; // <-- import your logo

const isActive = (location, path) =>
  location.pathname === path ||
  (path !== "/" && location.pathname.startsWith(path));

const navButtonSx = (location, path) => ({
  color: isActive(location, path) ? "#FF9800" : "#ffffff", // orange highlight
  fontWeight: isActive(location, path) ? 700 : 500,
  px: 1.5,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
});

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const jwt = auth.isAuthenticated();
  const user = jwt && jwt.user;

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        backgroundColor: "#121212", // dark background
        px: 3,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Logo + Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <img
            src={logo}
            alt="TaskDash Logo"
            style={{
              width: 64,
              height: 64,
              borderRadius: "8px",
              objectFit: "cover",
              boxShadow: "0 0 6px rgba(0,0,0,0.4)",
            }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 700, color: "#FF9800" }}
          >
            TaskDash
          </Typography>
        </Box>

        {/* Right: Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Home */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <IconButton
              sx={{
                color: isActive(location, "/") ? "#FF9800" : "#ffffff",
              }}
            >
              <HomeIcon />
            </IconButton>
          </Link>

          {/* Tasks */}
          {jwt && (
            <Link to="/tasks" style={{ textDecoration: "none" }}>
              <Button sx={navButtonSx(location, "/tasks")}>Tasks</Button>
            </Link>
          )}

          {/* Employees list only for admin/manager */}
          {jwt && (user.role === "admin" || user.role === "manager") && (
            <Link to="/employees" style={{ textDecoration: "none" }}>
              <Button sx={navButtonSx(location, "/employees")}>Employees</Button>
            </Link>
          )}

          {/* When NOT signed in: Sign Up / Sign In */}
          {!jwt && (
            <>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Button sx={navButtonSx(location, "/signup")}>Sign Up</Button>
              </Link>
              <Link to="/signin" style={{ textDecoration: "none" }}>
                <Button sx={navButtonSx(location, "/signin")}>Sign In</Button>
              </Link>
            </>
          )}

          {/* When signed in: My Profile / Sign out */}
          {jwt && (
            <>
              <Link
                to={`/employees/${user._id}`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  sx={navButtonSx(location, `/employees/${user._id}`)}
                >
                  My Profile
                </Button>
              </Link>
              <Button
                sx={{ color: "#ffffff", ml: 1 }}
                onClick={() => {
                  auth.clearJWT(() => navigate("/"));
                }}
              >
                Sign out
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}