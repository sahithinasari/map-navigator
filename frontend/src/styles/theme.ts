import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#A7C7E7" },
    secondary: { main: "#B5EAD7" },
    background: {
      default: "#181825",
      paper: "#24243E",
    },
    text: {
      primary: "#F8F9FA",
      secondary: "#C8C8D3",
    },
  },

  typography: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12, // smaller base font
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: 12,
      letterSpacing: "0.4px",
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: "6px",
          padding: "4px 12px",
          minWidth: "64px",
          boxShadow: "none",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 1px 4px rgba(167, 199, 231, 0.3)",
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            borderRadius: "6px",
            backgroundColor: "#1F1F33",
            fontSize: 12,
            padding: "4px 8px",
          },
          "& .MuiInputLabel-root": {
            fontSize: 12,
            color: "#C8C8D3",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#38385A",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#A7C7E7",
          },
          "& .MuiInputBase-input": {
            color: "#F8F9FA",
            padding: "6px 8px",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.3)",
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 12,
        },
      },
    },

    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          padding: 4,
        },
      },
    },

    MuiSelect: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        select: {
          padding: "4px 8px",
        },
      },
    },
  },
});

export default theme;
