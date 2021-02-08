/* eslint-disable react/require-default-props */
/* eslint-disable array-callback-return */
import React, { useState, useRef, useCallback, useEffect } from 'react';

import { CircularProgress, Container, Grid } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import BasePage from '../../../components/BasePage';
import Loading from '../../../components/Loading';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import api from '../../../services/api';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import { ArroundButton } from './styles';

interface params {
  id: string;
}

interface TellerData {
  id?: string;
  description: string;
  cost_center: SelectData;
  trunk: boolean;
}

export interface SelectData {
  value?: string | number | undefined | null;
  label?: string;
}

interface Data {
  description: string;
  cost_center_id: string;
  trunk: boolean;
}

interface OptionsData {
  id: string;
  description: string;
  value: string;
  label: string;
}

const trunkOptions = [
  { value: '0', label: 'Não' },
  { value: '1', label: 'Sim' },
];

const Teller: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [tellerEdit, setTellerEdit] = useState<TellerData>();
  const params: params = useParams();
  const [costCenters, setCostCenters] = useState<OptionsData[]>([]);
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          description: Yup.string().required('Descrição obrigatória'),
          cost_center: Yup.string().required('Grau é obrigatório'),
          trunk: Yup.string().required('Tronco é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setSaveLoading(true);

        const formData: Data = {
          description: data.description,
          cost_center_id: data.cost_center,
          trunk: data.trunk !== '0',
        };

        if (params.id) {
          await api.put(`/tellers/${params.id}`, formData);
        } else {
          await api.post('/tellers', formData);
        }

        setSaveLoading(false);
        history.push('/app/financeiro/caixas');
        addToast({
          type: 'success',
          title: 'Caixa cadastrado com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        setSaveLoading(false);
        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, history, params.id],
  );

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api
        .get(`/tellers/${params.id}`)
        .then(res => {
          setTellerEdit({
            cost_center: {
              value: res.data.cost_center_id,
              label: res.data.costCenter.description,
            },
            description: res.data.description,
            trunk: res.data.trunk,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  useEffect(() => {
    api.get('/cost-centers').then(response => {
      const options: OptionsData[] = response.data;
      options.map(opt => {
        opt.label = opt.description;
        opt.value = opt.id;
      });
      setCostCenters(options);
    });
  }, []);

  return (
    <BasePage
      title={params.id ? 'Editar Caixa' : 'Novo Caixa'}
      backLink="/app/financeiro/caixas"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form ref={formRef} onSubmit={handleSubmit} initialData={tellerEdit}>
            <ArroundButton>
              <Button type="submit" disabled={!!saveLoading}>
                {saveLoading ? (
                  <CircularProgress style={{ color: '#FFF' }} />
                ) : (
                  'SALVAR'
                )}
              </Button>
            </ArroundButton>
            <Card title="Caixa">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Input
                    name="description"
                    label="Descrição"
                    placeholder="Digite a descrição"
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <Select
                    name="cost_center"
                    label="Centro de custo"
                    placeholder="Selecione o centro de custo"
                    options={costCenters}
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Select
                    name="trunk"
                    label="Tronco de Beneficência?"
                    placeholder="Selecione o centro de custo"
                    options={trunkOptions}
                    defaultValue={
                      tellerEdit?.trunk ? trunkOptions[1] : trunkOptions[0]
                    }
                  />
                </Grid>
              </Grid>
            </Card>
          </Form>
        </Container>
      )}
    </BasePage>
  );
};

export default Teller;
