import styled from 'styled-components';

export const Episode = styled.div `
    max-width: 45rem;
    padding: 3rem 2rem;
    margin: 0 auto;    

    .thumbnailContainer{
        position: relative;

        img {
            border-radius: 1rem;
        }

        button {
            width: 3rem;
            height: 3rem;
            border-radius: 0.75rem;
            border: 0;
            position: absolute;
            z-index: 5; // deixar por cima da imagem
            font-size: 0;

            transition: filter 0.2s;

            &:first-child { // primeiro botão 
                left: 0;
                top: 50%;
                background: var(--purple-500);
                transform: translate(-50%, -50%); // para posicionar ao centro
            }

            &:last-child { // esse simbulo "&" está se referenciando ao button
                right: 0;
                top: 50%;
                background: var(--green-500);
                transform: translate(50%, -50%); // para posicionar ao centro
            }

            &:hover {
                filter: brightness(0.9)
            }
        }
    }

    header { 
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--gray-100);

        h1 { 
            margin-top: 2rem;
            margin-bottom: 1.5rem;
        }

        span {
            display: inline-block;
            font-size: 0.875rem;

            & + span { // todo o SPAN depois do primeiro
                margin-left: 1rem;
                padding-left: 1rem;
                position: relative;

                &::before {
                    content: "";
                    width: 4px;
                    height: 4px;
                    border-radius: 2px;
                    background: #DDD;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translate(-50%, -50%); // alinhar
                }
            }
        }
    }

    .description {
        margin-top: 2rem;
        line-height: 1.675rem;
        color: var(--gray-800);

        p {
            margin: 1.5rem 0;
        }
    }    
`;
