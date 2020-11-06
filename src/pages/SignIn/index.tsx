import React, { useCallback, useRef } from 'react';
import { FiLock, FiUser, FiKey } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { Container, Content, AnimationContainer, Background } from './styles';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignInFormData {
  cim: string;
  semiannual_word: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const history = useHistory();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          cim: Yup.string().required('CIM obrigatório'),
          semiannual_word: Yup.string().required(
            'Palavra semestral obrigatória',
          ),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          cim: data.cim,
          semiannual_word: data.semiannual_word,
          password: data.password,
        });

        history.push('/app/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
        });
      }
    },
    [signIn, history, addToast],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          {/* <img src={logoImg} alt="Fraternidade Caminho e Luz" /> */}

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu login</h1>

            <Input
              name="cim"
              icon={FiUser}
              label="CIM"
              placeholder="Digite seu CIM"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              label="Senha"
              placeholder="Digite sua senha"
            />
            <Input
              name="semiannual_word"
              icon={FiKey}
              type="password"
              label="Palavra Semestral"
              placeholder="Digite a Palavra Semestral"
            />

            <Button type="submit">Entrar</Button>

            <a href="forgot">Esqueci minha senha</a>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
