import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import HomePage from "./pages/HomePage";
import ShisenSho from "./pages/ShisenSho";
import CrabMemory from "./pages/CrabMemory";
import OceanRun from "./pages/OceanRun";
import SleepTest from "./pages/SleepTest";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shisen-sho" element={<ShisenSho />} />
          <Route path="/crab-memory" element={<CrabMemory />} />
          <Route path="/ocean-run" element={<OceanRun />} />
          <Route path="/sleep-test" element={<SleepTest />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
