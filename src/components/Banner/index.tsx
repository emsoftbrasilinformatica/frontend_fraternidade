import React from 'react';

import { Container } from './styles';

import fachada from '../../assets/fachada-sem-fundo.png';

const Banner: React.FC = () => {
  return (
    <section>
      <Container>
        {/* <h1>Banner Fraternidade</h1> */}
        <img style={{ maxWidth: '94%' }} src={fachada} alt="Fachada Site" />
      </Container>
    </section>
  );
};

export default Banner;
