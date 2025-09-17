import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
  font-family: 'Ownglyph_corncorn-Rg';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2412-1@1.0/Ownglyph_corncorn-Rg.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  }
  html, body {
    overscroll-behavior-y: contain;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Ownglyph_corncorn-Rg', sans-serif;
    display: flex;
    flex-direction: column;
  }
`;
