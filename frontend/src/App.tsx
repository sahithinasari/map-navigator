import { ThemeProvider } from "@mui/material/styles";
import Routers from "./routers/Routers";
import { BrowserRouter as Router } from "react-router-dom";
import theme from "./styles/theme";
import { CssBaseline } from "@mui/material";

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />  
        <Router>
          <Routers />
        </Router>
      </ThemeProvider>
    </>
  );
}
