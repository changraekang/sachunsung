import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import ShisenSho from "./pages/ShisenSho";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ShisenSho />
    </ThemeProvider>
  );
};

export default App;
