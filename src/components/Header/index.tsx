import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import { HeaderContainer } from './styles.module';

export function Header() {
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR
    });


    return (
        <HeaderContainer>
            <Link href={`/`}> 
                <img src="/logo.svg" alt="Podcastr"></img>
            </Link>
            

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </HeaderContainer>
    );
}