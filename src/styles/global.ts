import { createGlobalStyle } from 'styled-components';
import { shade } from 'polished';

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body{
    background: #F1F1E6 !important;
    -webkit-font-smoothing: antialiased;
    /*padding-top: 70px;*/
  }

  body, input, button{
    font-family: 'Roboto', sans-serif;
    font-size: 16px !important;
  }

  h1, h2, h3, h4, h5, h6, strong{
    font-weight: 500;
  }

  button{
    cursor: pointer;
  }

  body::-webkit-scrollbar {
    width: 12px;
  }

  body::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  body::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
  }

  .buttonConfirm {
    background-color: #28a745 !important;
    color: #FFF !important;
    flex: 1;
    &:hover {
      background-color: ${shade(0.25, '#28a745')} !important;
    }
  }

  .buttonCancel {
    background-color: #c53030 !important;
    color: #FFF !important;
    flex: 1;
    &:hover {
      background-color: ${shade(0.25, '#c53030')} !important;
    }
  }
`;
