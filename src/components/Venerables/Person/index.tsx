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
        <div
          style={{
            backgroundImage: `url(${image})`,
            borderRadius: '50%',
            width: 150,
            height: 150,
            boxShadow: '0px 0px 10px -1px rgba(0, 0, 0, 0.75)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <h1 style={{ textAlign: 'center', paddingTop: 20 }}>{name}</h1>
        <div>{occupation}</div>
      </Card>
    </Container>
  );
};

export default Person;
