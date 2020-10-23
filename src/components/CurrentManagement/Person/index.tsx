import React from 'react';

import { Container, Card } from './styles';

interface PersonProps {
  image: string;
  name: string;
  occupation: string;
  jewel: string | undefined;
}

const Person: React.FC<PersonProps> = ({
  name,
  image,
  occupation,
  jewel,
  ...rest
}) => {
  return (
    <Container>
      <Card>
        {jewel && (
          <div
            style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              width: 42,
              height: 42,
              backgroundImage: `url("${jewel}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

        <div
          style={{
            backgroundImage: `url('${image}')`,
            borderRadius: '50%',
            width: 150,
            height: 150,
            boxShadow: '0px 0px 10px -1px rgba(0, 0, 0, 0.75)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* <img src={image} alt={name} />
        </div> */}
        <h1 style={{ textAlign: 'center', paddingTop: 20 }}>{name}</h1>
        <div>{occupation}</div>
        {console.log(image)}
      </Card>
    </Container>
  );
};

export default Person;
