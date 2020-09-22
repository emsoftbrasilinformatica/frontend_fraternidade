import React from 'react';

import { Container, Card } from './styles';

interface PersonProps {
  image: string;
  name: string;
  occupation: string;
}

const Person: React.FC<PersonProps> = ({
  name,
  image,
  occupation,
  ...rest
}) => {
  return (
    <Container>
      <Card>
        <div>
          <img src={image} alt={name} />
        </div>
        <h1 style={{ textAlign: 'center' }}>{name}</h1>
        <div>{occupation}</div>
      </Card>
    </Container>
  );
};

export default Person;
