import {  useRef, useEffect, useState } from 'react';
import Image from 'next/image'; 
import {  usePlayer } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { PlayerContainer, CurrentEpisode, EmptyPlayer, Progress, SliderDiv, EmptySlider, Buttons } from './styles.module';


export function Player() {

    // REF é utilizado para manipular objetos javascript na tela, tipo o "document.getElementById"
    // utilizando a tipagem do TypeScript para quando usar, verificar quais métodos estão disponíveis e tudo mais..
    const audioRef = useRef<HTMLAudioElement>(null); 
    const [progress, setProgress] = useState(0);

    const { 
            episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            isShuffling,
            isLooping,
            togglePlay,
            toggleLoop,
            toggleShuffel,
            setPlayingState,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            clearPlayerState
    } = usePlayer()

    useEffect(() => {
        if (!audioRef.current){ // current é a única propriedade de um REF, apartir dela tenho acesso a tudo
            return; 
        }

        if (isPlaying) {
            audioRef.current.play(); // propriedade do componente audio do HTML
        } else {
            audioRef.current.pause();// propriedade do componente audio do HTML
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;    

        setProgress(amount);
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext();
        } else {
            clearPlayerState();
        }
    }

    const episodePlayer = episodeList[currentEpisodeIndex];

    return (
        <PlayerContainer>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>          

            { episodePlayer ? (
                <CurrentEpisode>
                    <Image 
                        width={392} 
                        height={392} 
                        src={episodePlayer.thumbnail} 
                        objectFit="cover" 
                    />

                    <strong>{episodePlayer.title}</strong>
                    <span>{episodePlayer.members}</span>

                </CurrentEpisode>
            ) : (
                <EmptyPlayer>
                    <strong>Selecione um podcast para ouvir</strong>                                
                </EmptyPlayer>  
            ) }

            <footer className={!episodePlayer ? ".empty" : ''}>
                <Progress>
                    <span>{convertDurationToTimeString(progress)}</span>
                    
                    <SliderDiv>
                        { episodePlayer ? (
                            <Slider 
                                max={episodePlayer.duration}
                                value={progress}
                                trackStyle={{ backgroundColor: '#04d361'}}
                                railStyle = {{ backgroundColor: '#9f75ff'}}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                                onChange={handleSeek}
                            />
                        ) : (
                            <EmptySlider />
                        )}
                    </SliderDiv>

                    <span>{convertDurationToTimeString(episodePlayer?.duration ?? 0)}</span>
                </Progress>

                 { episodePlayer && (
                     <audio 
                        src={episodePlayer.url}
                        ref={audioRef} // utilizando o RAF do react aq, para conseguir manipular  o JS
                        autoPlay // ao mudar o SRC ele já começa a tocar
                        loop={isLooping} // tag para o audio ficar repetindo (já é nativo do componente HTML)
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                 ) } { /* condição && SÓ VAI EXECUTAR OQ ESTÁ APÓS SE A CONDIÇÃO FOR VERDADEIRA */}

                <Buttons>

                    <button 
                        type="button" 
                        disabled={!episodePlayer || episodeList.length === 1}
                        onClick={toggleShuffel}
                        className={isShuffling ? "isActive" : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>

                    <button type="button" disabled={!episodePlayer || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>

                    <button 
                        type="button" 
                        className="playButton" 
                        disabled={!episodePlayer}
                        onClick={togglePlay}
                    >
                        { isPlaying 
                            ? <img src="/pause.svg" alt="Pausar"/>
                            : <img src="/play.svg" alt="Tocar"/> }
                        
                    </button>
                    <button type="button" disabled={!episodePlayer || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>                    
                    <button 
                        type="button" 
                        disabled={!episodePlayer}
                        onClick={toggleLoop}
                        className={isLooping ? "isActive" : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir"/> {/* GERALMENTE UTILIZAMOS OS ICONES DO PACOTE REACT ICONS*/}
                    </button>                    
                </Buttons>
            </footer>
        </PlayerContainer>
    );
}