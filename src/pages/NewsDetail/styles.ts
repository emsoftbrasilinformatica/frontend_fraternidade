import styled, { css } from 'styled-components';

interface ImageProps {
  image_url: string;
}

export const Container = styled.div`
  min-height: 70vh;
  padding-top: 70px;
`;

export const ImageCarousel = styled.div<ImageProps>`
  ${props =>
    props.image_url &&
    css`
      background-image: url('${props.image_url}');
      width: 100%;
      height: 500px;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    `}
  img {
    display: none;
  }
`;
