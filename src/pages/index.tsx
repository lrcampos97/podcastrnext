/* 
 SPA (Single Page Application)
 
 SSR (Server Side Rendering)
 
 SSG (Static Site Generation)
    - Utilizado para quando a página atualiza poucas vezes, ou seja, o conteúdo muda poucas vezes ao dia 
    - É gerado uma versão estática da página, para todas as pessoas que acessarem (por determinado tempo)
    - Para nao ficar requisitando coisas repetidas para a API
    - SÓ FUNCIONA EM PRODUÇÃO
*/

import { GetStaticProps } from 'next';
import Image from 'next/image'; 
import Head from 'next/head'; 
import { format, parseISO } from 'date-fns';
import { api } from '../services/api';
import { FaBeer, FaRegStopCircle } from 'react-icons/fa';
import { IconContext } from "react-icons";
import Link from 'next/link';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss'
import { usePlayer } from '../contexts/PlayerContext';
import { ReactNode } from 'react';

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    members: string,
    publishedAt: string,
    duration: number,
    durationAsString: string,    
    url: string,    
}

type HomeProps = {
    allEpisodes: Episode[],
    latestEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes  }: HomeProps){
    const { playList, isPlaying, currentEpisodeIndex } = usePlayer();

    const episodeList = [...latestEpisodes, ...allEpisodes]; // juntando os dois arrays de episodes dentro de um

    function getIconPlayEpisode(currentIndex: number): ReactNode{

        if (currentIndex === currentEpisodeIndex){            
            if (isPlaying) {
              return greenIconStop();
            } else {
                return <img src="/play-green.svg" alt="Tocar episódio"/>
            }
        } else { 
            return <img src="/play-green.svg" alt="Tocar episódio"/>
        }

    }

    function greenIconStop() {
        return (
          <IconContext.Provider
            value={{ color: 'var(--green-500)', size: '1.3rem' }}>
            <div>
              <FaRegStopCircle />
            </div>
          </IconContext.Provider>
        )
    }

    return(
        <div className={styles.homepage}>
            <Head>
                <title>Home | Podcastr</title>
            </Head>

            <section className={styles.latestEpisodes}>
                <h2>Últimos lançamento</h2>

                <ul>
                    {/* o MAP percorre um array retornando algo para cada registro */}
                    {latestEpisodes.map((episode, index) => { 
                        return (
                            <li key={episode.id}> {/* Isso é necessário no react, para ele se achar por exemplo no momento de deletar algum item */} 
                                 <Image 
                                    width={192} 
                                    height={192} 
                                    src={episode.thumbnail} 
                                    alt={episode.title} 
                                    objectFit="cover"
                                /> 

                                {/* No next ele utiliza o componente IMAGE esse componente para renderizar e otimizar imagens */}
                                
                                <div className={styles.episodeDetails}>
                                   <Link href={`/episodes/${episode.id}`}>
                                    <a>{episode.title}</a>
                                   </Link>

                                   {/* Componente Link mantem um "cache" da página, fazendo que não carregue todos os componentes novamente */}

                                   <p>{episode.members}</p>
                                   
                                   <span>{episode.publishedAt}</span>
                                   <span>{episode.durationAsString}</span>

                                </div>                        

                                <button type="button" onClick={() => playList(episodeList, index)}>
                                    {getIconPlayEpisode(index)}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>

            <section className={styles.allEpisodes}>
               <h2>Todos episódios</h2>

               <table cellSpacing={0}>
                   <thead>
                       <tr>
                            <th></th>
                            <th>Podcast</th>
                            <th>Integrantes</th>
                            <th>Data</th>
                            <th>Duração</th>
                            <th></th>
                        </tr>
                   </thead>

                   <tbody>
                       {allEpisodes.map((episode, index) => {
                           return (
                                <tr key={episode.id}>
                                    <td style={{ width: 72}}>
                                        <Image 
                                            width={120}
                                            height={120}
                                            src={episode.thumbnail}
                                            alt={episode.title}
                                            objectFit="cover"
                                        />
                                    </td>

                                    <td>
                                        <Link href={`/episodes/${episode.id}`}>
                                            <a>{episode.title}</a>
                                        </Link>
                                    </td>

                                    <td>{episode.members}</td>
                                    <td style={{ width: 100}}>{episode.publishedAt}</td>
                                    <td>{episode.durationAsString}</td>

                                    <td>
                                        <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                                            {getIconPlayEpisode(index + latestEpisodes.length)}
                                        </button>
                                    </td>

                                </tr>
                           )
                       })}

                   </tbody>

               </table>
            
            </section>            
        </div>

    )
}

export const getStaticProps: GetStaticProps = async () => { // Tipando a função por completo, tanto os parâmetros como o retorno
    const { data } = await api.get('episodes', {
        params: { 
            __limit: 12,
            __sort: 'published_at',
            __order: 'desc'
        }
    })

    const episodes = data.map(episode => {
        return {
            id: episode.id,
            title: episode.title,
            thumbnail: episode.thumbnail,
            members: episode.members,
            publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
            duration: Number(episode.file.duration),
            durationAsString: convertDurationToTimeString(Number(episode.file.duration)),            
            url: episode.file.url,            
        }
    })

    const latestEpisodes = episodes.slice(0, 2); // pegando os 2 primeiros elementos do json
    const allEpisodes = episodes.slice(2, episodes.length); 

    return {
        props: {
            latestEpisodes,
            allEpisodes
        },
        revalidate: 60 * 60 * 8, // a cada 8 horas uma nova chamada sera feita (pessoas vao consumir uma página estatica )
    }
}