import React from 'react';
import { Container, Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Hall from '../../assets/hall.jpeg';
import TemploAntigo from '../../assets/templo-antigo.jpg';
import Fundadores from '../../assets/fundadores.png';
import macons from '../../assets/22macons.jpg';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Slide = require('react-reveal/Slide');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    sectionAnchor: {
      position: 'relative',
      background: '#F1F1E6',
      color: '#2d2d2d',
    },
    shadeColor: {
      background: '#327db9',
      borderRadius: 10,
      padding: 32,
    },
    anchor: {
      position: 'absolute',
      top: -62,
    },
    container: {
      padding: '25px 0',
    },
    title: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px',
    },
    titleText: {
      position: 'relative',
      color: '#2d2d2d',
      fontSize: 32,
      fontWeight: 'bold',
      letterSpacing: 4,
      marginBottom: 8,
    },
    imgContent: {
      width: '100%',
      height: 'auto',
      borderRadius: '10px',
    },
    textContent: {
      textAlign: 'justify',
      alignItems: 'center',
    },
    text: {
      alignItems: 'center',
    },
    textContentMiddle: {
      textAlign: 'justify',
      color: '#FFF',
    },
    legend: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 14,
      fontStyle: 'italic',
    },
    legendMiddle: {
      color: '#FFF',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 14,
      fontStyle: 'italic',
    },
  }),
);

const History: React.FC = () => {
  const classes = useStyles();

  return (
    <section className={classes.sectionAnchor}>
      <span id="historia" className={classes.anchor} />
      <div className={classes.container}>
        <Container>
          <div className={classes.title}>
            <div className={classes.titleText}>Nossa História</div>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Slide left>
                <img
                  className={classes.imgContent}
                  src={TemploAntigo}
                  alt="Templo Antigo"
                />
                <p className={classes.legend}>
                  Primeiro Templo, situado na Av. Sebastião Evangelista Barbosa,
                  Parque Industrial.
                </p>
              </Slide>
            </Grid>
            <Grid item xs={12} md={8}>
              <Slide right>
                <div className={classes.textContent}>
                  Muitos foram os irmãos que se empenharam em sua fundação, bem
                  como inúmeras Lojas coirmãs de nosso município e de cidades
                  vizinhas.
                  <br />
                  <br />
                  Em meados do ano de 1998, um grupo de seis amigos reunidos
                  sentiram a necessidade de praticar a virtude que possuíam
                  dentro de si e juntos formaram e fundaram em 01 de março de
                  1999 a Loja Maçônica Fraternidade, Caminho e Luz e a partir
                  daí, se tornaram irmãos. Com extrema dedicação,
                  comprometimento e um inimaginável esforço, realizaram seus
                  sonhos nessa tão ilustre fundação. Todos os irmãos que por
                  aqui passaram, deixaram seu legado, fizeram parte da história
                  e assentaram um tijolo na fundação dessa tão conceituada Loja
                  Maçônica, sempre fortalecendo suas colunas.
                  <br />
                  <br />
                  Sem possuir um Templo próprio, mesmo assim, os irmãos
                  fundadores ainda se mantinham motivados, com uma dedicação e
                  entusiasmo ímpar, mostravam sempre seu comprometimento com a
                  Ordem, participando de reuniões semanais, viajando cerca de 70
                  km, para a cidade de Guaranésia-MG, onde é sediada a Loja
                  centenária Fernando Osório, que veio a ser nossa Loja-mãe. Lá
                  eles participavam de reuniões e aos poucos, gradativamente
                  juntavam conhecimento para administrarem posteriormente a nova
                  Loja que estariam fundando em definitivo.
                </div>
              </Slide>
            </Grid>
          </Grid>
          <br />
          <br />
        </Container>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Slide left>
                <div className={classes.textContent}>
                  Em 28 de abril de 1999 houve a primeira reunião em um Templo
                  próprio, com a presença de 22 maçons, entre membros do quadro
                  e visitantes. Esse Templo foi montado em um prédio alugado,
                  mas as dificuldades ainda não deixariam de existir, pois não
                  havia membros em quantidade mínima suficiente para realizar as
                  reuniões semanais. Sem pestanejar, muitos irmãos da Loja
                  Fernando Osório faziam o deslocamento semanal para participar
                  de nossas reuniões, orientando, instruindo e completando a
                  quantidade mínima de membros para realização das sessões.
                  Contávamos também com a presença de vários irmãos das Lojas
                  coirmãs de nosso município, que nessa época eram apenas a
                  Fraternidade Universal e a Apóstolos da Liberdade. Vínhamos
                  então ser a terceira Loja Maçônica do município de São
                  Sebastião do Paraíso.
                </div>
              </Slide>
            </Grid>
            <Grid item xs={12} md={4}>
              <Slide right>
                <img
                  className={classes.imgContent}
                  src={macons}
                  alt="Templo Antigo"
                />
                <p className={classes.legend}>
                  Primeira reunião no Tempo próprio (Parque Industrial).
                </p>
              </Slide>
            </Grid>
          </Grid>
          <br />
          <br />
        </Container>
        <Container className={classes.shadeColor}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Slide left>
                <img className={classes.imgContent} src={Hall} alt="Hall" />
              </Slide>
              <p className={classes.legendMiddle}>
                Templo atual, situado na Praça São José nº 52, Centro.
              </p>
            </Grid>
            <Grid item xs={12} md={8}>
              <Slide right>
                <div className={classes.textContentMiddle}>
                  Em meados do ano de 2004, a Fraternidade, Caminho e Luz, com
                  uma quantidade já representativa de membros ativos, após
                  inúmeras negociações, oficialmente e legalmente, tomou posse
                  das instalações da Sociedade Beneficente Recreativa Operária –
                  LIGA, realizando uma grande reforma em seu prédio, que estava
                  abandonado e bastante degradado. Com o apoio de novos irmãos e
                  ainda de alguns dos fundadores originais, após sete meses de
                  trabalho árduo o prédio ganhou novo visual e passaríamos então
                  a ter um Templo construído em uma sede própria. A primeira
                  reunião oficial no novo Templo ocorreu em 23 de fevereiro de
                  2005 e desde então utilizamos esse mesmo espaço para nossas
                  reuniões regulares.
                </div>
              </Slide>
            </Grid>
          </Grid>
        </Container>
        <br />
        <br />
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Slide left>
                <div className={classes.textContent}>
                  Fica aqui o agradecimento aos 6 amigos, que se tornaram irmãos
                  e com muita competência fundaram nossa querida Fraternidade,
                  Caminho e Luz nº 3216.
                </div>
              </Slide>
            </Grid>
            <Grid item xs={12} md={4}>
              <Slide right>
                <img
                  className={classes.imgContent}
                  src={Fundadores}
                  alt="Loja"
                />
                <p className={classes.legend}>
                  Os fundadores, da esquerda para a direita: Wilson Mendes,
                  Amadeu de Jesus Coelho Garcia, José Luiz Tusi Perazzolo,
                  Marcos Antônio Bernardes, Reynaldo Formágio e Antônio Vicente
                  da Silva.
                </p>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </div>
    </section>
  );
};

export default History;
