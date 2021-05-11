import styled from 'styled-components';


export const HeaderContainer = styled.header `
    background: ${props => props.theme.colors.default};
    height: 6.5rem;
    display: flex;
    align-items: center;
    padding: 2rem 4rem;
    border-bottom: 1px solid ${props => props.theme.colors.gray100};

    p {
        margin-left: 2rem;
        padding: 0.25rem 0 0.25rem 2rem;
        border-left: 1px solid ${props => props.theme.colors.gray100};
    }

    .switch {
        margin-left: auto;
    }

    span {
        margin-left: 3rem;
        text-transform: capitalize;
    }

    img {
        cursor: pointer;
    }
`;
