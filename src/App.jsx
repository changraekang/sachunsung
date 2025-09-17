import React, { useState } from "react";
import { isMobile } from "./utils/isMobile";
import QRCode from "react-qr-code";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import QuizPage from "./pages/QuizPage.jsx";
import ResultPage from "./pages/ResultPage";
import styled from "styled-components";
import { ghibliThemes } from "./styles/ghibliThemes.js";
import SvgIcon from "./map";

const randomTheme =
  ghibliThemes[Math.floor(Math.random() * ghibliThemes.length)];
const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Subtext = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

function App() {
  return (
    <div>
      <SvgIcon />
    </div>
  );
}

export default App;
