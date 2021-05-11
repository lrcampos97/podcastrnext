import { format, parseISO  } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import { api } from '../../services/api';
import Link from 'next/link';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import * as S from './episode.module';
import { usePlayer } from '../../contexts/PlayerContext';
import React, { ReactNode } from 'react';
import { IconContext } from 'react-icons';
import { FaRegStopCircle } from 'react-icons/fa';

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    members: string,
    publishedAt: string,
    duration: number,
    durationAsString: string,    
    description: string,
    url: string,    
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
    const { play, isPlaying, currentEpisodeIndex } = usePlayer();
    
    function getIconPlayEpisode(): ReactNode{          
        if (isPlaying) {
            return greenIconStop();
        } else {
            return <img src="/play.svg" alt="Tocar episódio"/>
        }
    }
    
    function greenIconStop() {
        return (
          <IconContext.Provider
            value={{ color: `${props => props.theme.colors.default}`, size: '1.5rem' }}>
            <div>
              <FaRegStopCircle />
            </div>
          </IconContext.Provider>
        )
    }

    return (
       <S.Episode>
            <Head>
                <title>{episode.title}</title>
            </Head>

           <div className="thumbnailContainer">
               <Link href="/"> 
                <button type="button">
                    <img src="/arrow-left.svg" alt="Voltar"/>
                </button>
               </Link>
               
               <Image 
                width={700} 
                height={160}
                src={episode.thumbnail}
                objectFit="cover" 
               />

               <button type="button" onClick={() => play(episode)}>
                   {getIconPlayEpisode()}
               </button>
           </div>

           <header>
               <h1>{episode.title}</h1>
               <span>{episode.members}</span>
               <span>{episode.publishedAt}</span>
               <span>{episode.durationAsString}</span>
           </header>

           <div 
                className="description" 
                dangerouslySetInnerHTML={{ __html: episode.description }} // utilizar para prevenir ataques no HTML, é o substituto do innerHTML. Em geral, adicionar HTML através de código é arriscado, podendo sofrer um ataque cross-site scripting
            />
                
       </S.Episode>
    )
}


export const getStaticPaths: GetStaticPaths = async () => { // ESSA FUNÇÃO SERVE PARA AJUDAR O BUILD QUANDO GERAR AS PÁGINAS ESTÁTICAS 
    // posso gerar determinadas páginas já de forma estática, para a melhor perfomance SÓ PASSAR NO PATH...
    // tipos os episódios mais buscados  

    const { data } = await api.get('episodes', { // na hora do build ele vai fazer as requisições e deixar as paginas estática já
        params: { 
            __limit: 2,
            __sort: 'published_at',
            __order: 'desc'
        }
    });

    const paths = data.map(episode => {
        return { 
            params: {
                slug: episode.id
            }
        }
    });

    // quais páginas estaticas eu quero gerar quando fazer o build (sao aquelas telas quem tem o [slug])
    return {
        paths, 
        fallback: 'blocking' 
        /* se FALLBACK = FALSE então o next retonar página 404
           se FALLBACK = TRUE será necessário importar um router e colocar um HTML de carregando.. além de, o next carregar toda a página pelo lado do CLIENT pelo browser, só carrega os dados quando o user acessar  
           se FALLBACK = BLOCKING vai rodar no servidor NODE DO NEXT, o user só vai ir para a outra tela após os dados serem carregados (melhor para os mecanismos de busca)
        */
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
 
    const { data } = await api.get(`/episodes/${slug}`)

    const episode =  {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,                  
    };

    return {
        props: {
            episode
        }, 
        revalidate: 60 * 60 * 24, // 24 horas
    }
}
