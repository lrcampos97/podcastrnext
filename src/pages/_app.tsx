import GlobalStyle from '../styles/global';
import styles from '../styles/app.module.scss';
import { Header } from '../components/Header'
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import { ThemeProvider } from 'styled-components';
import  light  from '../styles/themes/light';
import  dark  from '../styles/themes/dark';
import usePersistedState from '../hooks/usePersistedState';


function MyApp({ Component, pageProps }){
    const [theme, setTheme] = usePersistedState('theme', light);

    const toggleTheme = () => {
        setTheme(theme.title === 'light' ? dark : light);
    }

    return(
        <ThemeProvider theme={theme}>
            <PlayerContextProvider> 
                <GlobalStyle />
                <div className={styles.wrapper}>
                    <main>
                        <Header toggleTheme={toggleTheme} />
                        <Component {...pageProps} />
                    </main>
                    <Player />
                </div>
            </PlayerContextProvider>
        </ThemeProvider>
    )
}

export default MyApp;