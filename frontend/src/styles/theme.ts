// theme-light.ts
import { createTheme, alpha } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#edcf5d", contrastText: "#010101" }, // Golden Yellow
    secondary: { main: "#a4a4a4", contrastText: "#f2f0ea" }, // Gray accent
    background: { default: "#f2f0ea", paper: "#ffffff" }, // Cream + white
    text: { primary: "#010101", secondary: "#a4a4a4" },
    action: { disabled: "#a4a4a4" },
  },

  typography: {
    fontFamily: "Calibri, sans-serif",
    fontSize: 12,
    button: { textTransform: "none", fontWeight: 500, fontSize: 12 },
  },

  components: {
    // Typography
    MuiTypography: {
      styleOverrides: {
        h4: {
          color: "#212123",
          textAlign: "center",
          textTransform: "capitalize",
        },
        h6: { color: "#8f8f8f", textTransform: "capitalize", paddingTop: "0.7%" },
        body1: { fontSize: "14px", "&.error": { color: "red" } },
        body2: { fontSize: "12px" },
      },
    },

    // Buttons
    MuiButton: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          fontSize: 12,
          borderRadius: 6,
          padding: "4px 12px",
          backgroundColor: "#ffffff",
          color: "#212123",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          "&:hover": {
            backgroundColor: "#edcf5d",
            color: "#010101",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          },
        },
      },
    },

    // TextFields
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          marginBottom: 5,
          "& .MuiInputBase-root": {
            backgroundColor: "#ffffff",
            borderRadius: 6,
            fontSize: 12,
            padding: "4px 8px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cccccc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#edcf5d",
          },
          "& .MuiInputLabel-root": { color: "#212123", fontSize: 12 },
          "& .MuiInputLabel-root.Mui-focused": { color: "#edcf5d" },
        },
      },
    },

    // // AppBar (for your oval navbar)
    // MuiAppBar: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: 24,
    //       backgroundColor: "#ffffff",
    //       boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    //       height: 48,
    //     },
    //   },
    // },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 8,
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 8,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        },
      },
    },

    MuiIconButton: {
      defaultProps: { size: "small" },
      styleOverrides: { root: { padding: 4, color: "#212123" } },
    },

    MuiSelect: {
      defaultProps: { size: "small" },
      styleOverrides: { select: { padding: "4px 8px" } },
    },
  },
});

export default theme;
