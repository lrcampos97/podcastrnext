import GlobalStyle from '../styles/global';
import styles from '../styles/app.module.scss';
import { Header } from '../components/Header'
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';


function MyApp({ Component, pageProps }){
    
    return(
        <PlayerContextProvider> 
            <GlobalStyle />
            <div className={styles.wrapper}>
                <main>
                    <Header />
                    <Component {...pageProps} />
                </main>
                <Player />
            </div>
        </PlayerContextProvider>
    )
}

export default MyApp;