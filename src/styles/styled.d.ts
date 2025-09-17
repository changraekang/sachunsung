import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      surfaceMuted: string;
      surfaceStrong: string;
      text: string;
      textMuted: string;
      primary: string;
      onPrimary: string;
      accent: string;
      outline: string;
      border: string;
      warning: string;
      onWarning: string;
      danger: string;
      onDanger: string;
      success: string;
      onSuccess: string;
      overlay: string;
      hint: string;
      bg: string;
      textLegacy: string;
      accentLegacy: string;
      sky: string;
      earth: string;
      button: string;
      buttonText: string;
    };
    spacing: string[];
    radii: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    shadows: {
      xs: string;
      sm: string;
      md: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeights: {
      regular: number;
      medium: number;
      bold: number;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
    };
    transitions: {
      base: string;
      slow: string;
    };
    zIndices: {
      base: number;
      overlay: number;
      modal: number;
    };
  }
}
