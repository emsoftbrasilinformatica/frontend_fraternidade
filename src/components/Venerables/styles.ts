import styled from 'styled-components';

import background from '../../assets/background-venerables.png';

export const Section = styled.section`
  position: relative;
  background-image: url("${background}");
  background-color: '#F1F1E6';
  color: '#2d2d2d';

  &:after {
    content: '';
    position: absolute;
    right: 0;
    left: -0%;
    top: 100%;
    z-index: 1;
    display: block;
    height: 50px;
    background-size: 50px 100%;
    background-image: url("${background}"), linear-gradient(135deg, #F1F1E6 25%, transparent 25%),
      linear-gradient(225deg, #F1F1E6 25%, transparent 25%);
    background-position: 0 0;
  }
`;
