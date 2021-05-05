import { createContext, useState, ReactNode, useContext } from 'react';

// Context API é utilizado para compartilhar dados entre os componentes do sistema

type Episode = {        
    title: string,
    thumbnail: string,
    members: string,    
    duration: number,
    url: string,                  
}

type PlayerContextData = { 
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void; // função
    playList: (episode: Episode[], index: number) => void; 
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffel: () => void;
    clearPlayerState: () => void;
    setPlayingState: (state: boolean) => void; 
    hasNext: boolean;
    hasPrevious: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData); // formato dos dados que o contexto vai iniciar, hack do react colocar valor vazio e dizer que ele é de tal tipo


type PlayerContextProviderProps = {
    children: ReactNode; // Esse tipo aceita qualquer código react e HTML é próprio para isso
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) { // desestruturando as PROPS e pegando apenas a children
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLopping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    
    function play(episode: Episode){ // tipando episode                     
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        togglePlay();  
    }

    function playList(list: Episode[], index: number){
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        togglePlay();  
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop(){
        setIsLopping(!isLooping);
    }

    function toggleShuffel(){
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext(){
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length) // floor é para arredondar o número

            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious(){        
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0)
    }

    return (
       <PlayerContext.Provider 
        value={{ 
                episodeList, 
                currentEpisodeIndex, 
                play, 
                isPlaying, 
                isLooping,
                isShuffling,
                togglePlay, 
                toggleShuffel,
                setPlayingState, 
                playList,
                playNext,
                playPrevious,
                hasNext,
                hasPrevious,
                toggleLoop,
                clearPlayerState
        }}>   
        {children}
       </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}