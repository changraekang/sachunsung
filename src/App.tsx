import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import HomePage from "./pages/HomePage";
import ShisenSho from "./pages/ShisenSho";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shisen-sho" element={<ShisenSho />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
