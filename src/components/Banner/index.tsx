import React from 'react';

import { Container, Text } from './styles';

import fachada from '../../assets/fachada-sem-fundo.png';

const Banner: React.FC = () => {
  return (
    <section>
      <Container>
        {/* <h1>Banner Fraternidade</h1> */}
        <img style={{ maxWidth: '94%' }} src={fachada} alt="Fachada Site" />

        <div>
          <Text>Utilidade Pública Municipal – Lei nº 2785 de 01/12/2000</Text>
          <Text>Reuniões às Quartas Feiras às 20:00 horas</Text>
        </div>
      </Container>
    </section>
  );
};

export default Banner;
