import { useContext } from 'react';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import Switch from 'react-switch';
import { HeaderContainer } from './styles.module';
import { ThemeContext } from 'styled-components';

interface props {
    toggleTheme(): void;
}

export function Header({ toggleTheme }) {
    const { title } = useContext(ThemeContext); 

    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR
    });

    return (
        <HeaderContainer>
            <Link href={`/`}> 
                <img src="/logo.svg" alt="Podcastr"></img>
            </Link>
            

            <p>O melhor para você ouvir, sempre</p>

            <div className="switch">
                <Switch 
                    onChange={toggleTheme}
                    checked={title === 'dark'}
                    checkedIcon={true}
                    uncheckedIcon={true}
                    height={20}
                    width={50}
                    handleDiameter={30}
                />
            </div>

            <span>{currentDate}</span>
        </HeaderContainer>
    );
}