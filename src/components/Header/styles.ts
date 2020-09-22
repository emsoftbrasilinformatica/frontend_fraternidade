import styled from 'styled-components';
import { shade } from 'polished';

export const Content = styled.div`
  header {
    background: #631925;
    position: fixed;
    top: 0; /* Stick it to the top */
    max-height: 70px;
    width: 100vw;
    padding: 10px 0;
    z-index: 1;

    display: grid;
    grid-template-areas: 'logo nav';
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

    img {
      grid-area: logo;
      margin: 0 24px 0 24px;
      height: 50px;
      border-radius: 50%;
    }

    nav {
      display: grid;
      grid-area: nav;
      grid-template-columns: repeat(8, auto);
      align-items: center;
      justify-items: center;

      a {
        text-decoration: none;
        color: #fff;
        position: relative;
        margin-right: 8px;

        &:hover {
          color: ${shade(0.25, '#FFF')};
        }

        &.active::after {
          content: '';
          width: 100%;
          height: 2px;
          position: absolute;
          bottom: -5px;
          left: 0;
          background: #fff;
          margin-top: 10px;
        }
      }

      button {
        border-radius: 10px;
        outline: none;
        border: 3px solid #fff;
        padding: 10px;
        background: none;
        font-weight: bold;
        color: #fff;
        width: 115px;
      }
    }

    .Menu {
      display: none;
      grid-area: menu;
      margin: 0 20px 0 0;
      padding: 0;
      justify-self: end;
      font-size: 40px;
      border: none;
      background: none;
      outline: none;
      transition: 0.1s;
      color: #fff;
    }
    .Menu:active {
      transform: scale(1.2);
    }
  }

  @media (max-width: 700px) {
    header {
      grid-template-areas: 'logo menu' 'nav nav';

      nav {
        grid-template-rows: repeat(8, auto);
        grid-template-columns: none;
        grid-row-gap: 20px;

        padding: 30px 0 30px;
        background: rgba(40, 44, 47, 0.95);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        margin-top: 10px;
        width: 100%;
      }

      .Menu {
        display: inline;
      }
    }
  }

  .NavAnimation-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  .NavAnimation-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 350ms, transform 350ms;
  }
  .NavAnimation-exit {
    opacity: 1;
  }
  .NavAnimation-exit-active {
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 350ms, transform 350ms;
  }
`;
