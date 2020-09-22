import React from 'react';

import { Container } from './styles';

interface CardProps {
  title: string;
}

const Card: React.FC<CardProps> = ({ title, children, ...rest }) => {
  return (
    <Container>
      <div className="card-header">
        <div className="title">{title}</div>
      </div>
      <hr />
      <div className="card-body">{children}</div>
    </Container>
  );
};

export default Card;
