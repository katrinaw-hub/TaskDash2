import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
} from "@mui/material";
import MainRouter from "./MainRouter.jsx";


const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#008080" },   // teal
    secondary: { main: "#FF9800" }, // orange
    background: {
      default: "#121212", // dark background
      paper: "#1e1e1e",   // slightly lighter for cards
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.7)",
    },
  },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h2: { fontWeight: 700, letterSpacing: "-0.03em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999 }, // pill buttons
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212", // dark header
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);