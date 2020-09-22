import React, { useCallback, useRef, useEffect, useState } from 'react';

import { Container, Grid } from '@material-ui/core';
import { VscWholeWord } from 'react-icons/vsc';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import BasePage from '../../components/BasePage';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';

interface SemiannualWord {
  current_word: string;
  last_word: string;
}

const SemiannualWords: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [semiannualWords, setSemiannualWords] = useState<SemiannualWord>();

  const handleSubmit = useCallback(
    async (data: SemiannualWord) => {
      // console.log(data);
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          current_word: Yup.string().required('Palavra Atual obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { current_word } = data;

        const response = await api.post('/semiannual-words', {
          word: current_word,
        });

        const semiannualWordUpdated: SemiannualWord = response.data;

        setSemiannualWords(semiannualWordUpdated);
        setLoading(false);
        addToast({
          type: 'success',
          title: 'Palavra semestral cadastrada com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          setLoading(false);
          formRef.current?.setErrors(errors);

          return;
        }
        setLoading(false);
        console.log(err);
        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast],
  );

  useEffect(() => {
    setLoading(true);
    api.get('/semiannual-words').then(res => {
      setSemiannualWords(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <BasePage title="Palavra Semestral">
      {!loading ? (
        <Container style={{ marginTop: 32 }}>
          <Form
            ref={formRef}
            initialData={semiannualWords}
            onSubmit={handleSubmit}
          >
            <Card title="Palavra Semestral">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Input
                    name="current_word"
                    icon={VscWholeWord}
                    label="Palavra Atual"
                    placeholder="Digite a palavra semestral atual"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Input
                    name="last_word"
                    label="Palavra anterior"
                    icon={VscWholeWord}
                    readOnly
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button type="submit" style={{ marginTop: 27 }}>
                    SALVAR
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Form>
        </Container>
      ) : (
        <Loading />
      )}
    </BasePage>
  );
};

export default SemiannualWords;
