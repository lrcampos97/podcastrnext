import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle `

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :root {
        --white: #FFF;
        --green-500: #04D361;

        --purple-300: #9F75FF;
        --purple-400: #9164FA;
        --purple-500: #8257E5;
        --purple-800: #6F48C9;
    }

    @media (min-width: 1080px){
        html {
            font-size: 93.75%; //15px
        }
    }

    @media (min-width: 1080px){
        html {
            font-size: 87.5%; //14px
        }
    }


    body {
        background: ${props => props.theme.colors.gray50};
    }

    body, input, textarea, button {
        font: 500 1rem Inter, sans-serif;
        color: ${props => props.theme.colors.gray500};
    }

    h1, h2, h3, h4, h5, h5 {
        font-weight: 600;
        font-family: Lexend, sans-serif;
        color: ${props => props.theme.colors.gray800};   
    }

    h1 {
        font-size: 2rem;
    }

    h2 {
        font-size: 1.5rem;
    }

    button {
        cursor: pointer;
    }
`;
