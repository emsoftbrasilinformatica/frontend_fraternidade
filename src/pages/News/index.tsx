import React from 'react';

import { Container } from './styles';

import Header from '../../components/Header';

import TopNews from '../../components/TopNews';
import ListNews from '../../components/ListNews';

import Footer from '../../components/Footer';

const News: React.FC = () => {
  return (
    <>
      <Header />

      <Container>
        <TopNews />
        <ListNews />
      </Container>

      <Footer />
    </>
  );
};

export default News;
