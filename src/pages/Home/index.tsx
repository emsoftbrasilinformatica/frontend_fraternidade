import React from 'react';

import { Container } from './styles';

import Header from '../../components/Header';

import Banner from '../../components/Banner';
import Links from '../../components/Links';
import History from '../../components/History';
import CurrentManagement from '../../components/CurrentManagement';
import Venerables from '../../components/Venerables';
import NewsHome from '../../components/NewsHome';

import Footer from '../../components/Footer';

const Home: React.FC = () => {
  return (
    <>
      <Header />

      <Container>
        <Banner />
        <Links />
        <History />
        <CurrentManagement />
        <Venerables />
        <NewsHome />
      </Container>

      <Footer />
    </>
  );
};

export default Home;
