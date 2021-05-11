// Arquivo de definação de tipos globais, que será acessível por vários arquivs
import "styled-components";

declare module 'styled-components' {
    export interface DefaultTheme {
        title: string;

        colors: {
            default: string,
            gray50: string;
            gray100: string;
            gray200: string;
            gray500: string;
            gray800: string;
        }
    }
}