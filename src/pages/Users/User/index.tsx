/* eslint-disable react/require-default-props */
/* eslint-disable array-callback-return */
import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { cpf } from 'cpf-cnpj-validator';
import * as Yup from 'yup';
import {
  makeStyles,
  Theme,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

import {
  FiLock,
  FiUser,
  FiKey,
  FiMail,
  FiCalendar,
  FiCamera,
} from 'react-icons/fi';
import {
  FaAddressCard,
  FaCity,
  FaFlag,
  FaBuilding,
  FaPhoneSquare,
  FaGopuram,
  FaMale,
  FaFemale,
  FaSort,
  FaSyringe,
  FaIdBadge,
  FaRoad,
  FaSortNumericUp,
  FaMapSigns,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaWhatsapp,
  FaMobileAlt,
  FaPhoneAlt,
  FaVenusMars,
  FaGenderless,
  FaBezierCurve,
} from 'react-icons/fa';

import { Container, Grid, Box, AppBar, Tabs, Tab } from '@material-ui/core';
import {
  Info as InfoIcon,
  Contacts as ContactsIcon,
  Home as HomeIcon,
  SupervisorAccount as DependentsIcon,
  Edit,
  Delete,
} from '@material-ui/icons';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useParams, useHistory } from 'react-router-dom';
import MaterialTable from 'material-table';
import BasePage from '../../../components/BasePage';
import { Title, ArroundButton, AvatarInput } from './styles';
import labels from '../../../utils/labels';

import Input from '../../../components/Input';
import InputHidden from '../../../components/InputHidden';
import DatePicker from '../../../components/DatePicker';
import Loading from '../../../components/Loading';
import Select from '../../../components/Select';
import api from '../../../services/api';
import InputMask from '../../../components/InputMask';
import Button from '../../../components/Button';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

interface params {
  id: string;
}

interface OptionsData {
  id: string;
  description: string;
  value: string;
  label: string;
}

interface UFData {
  id: number;
  sigla: string;
  value: number;
  label: string;
}

interface CityData {
  id: number;
  nome: string;
  value: number;
  label: string;
}

interface UFRes {
  id: number;
  sigla: string;
}

interface CityRes {
  id: number;
  nome: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface Address {
  id?: string;
  uf: string;
  uf_id: number;
  city: string;
  city_id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zip_code: string;
  type: string;
  tableData?: TableData;
}

interface Dependent {
  id?: string;
  name_dependent: string;
  date_of_birth_dependent: string;
  gender: string | undefined;
  gender_id: string;
  kinship: string | undefined;
  kinship_id: string;
  tableData?: TableData;
}

interface TableData {
  id: number;
}

interface DegreeFormData {
  description: string;
}

interface CreateUserFormData {
  name: string;
  email: string | undefined;
  password?: string;
  old_password?: string;
  cim: number;
  cpf: string;
  date_of_birth: string | null | undefined;
  degree_id: string;
  degree?: DegreeFormData;
  administrative_function_id?: string;
  avatar_url?: string;
  blood_type?: string;
  naturalness_uf?: string;
  naturalness_uf_id?: number;
  naturalness_city?: string;
  naturalness_city_id?: number;
  civil_status?: string;
  father?: string;
  mother?: string;
  rg_number?: string;
  rg_issuing_body?: string;
  rg_uf_id?: number | undefined | null;
  rg_uf?: string;
  rg_date_of_issue?: string;
  company?: string;
  company_telephone?: string;
  adresses?: AddressFormData[];
  contacts?: ContactFormData[];
  dependents?: DependentFormData[];
}

interface UserFormData {
  name: string;
  email: string | undefined;
  cim: number;
  cpf: string;
  date_of_birth: Date | null;
  degree_id: SelectData;
  administrative_function_id?: string;
  avatar_url?: string;
  blood_type?: SelectData;
  naturalness_uf_id?: SelectData;
  naturalness_city_id?: SelectData;
  civil_status?: SelectData;
  father?: string;
  mother?: string;
  rg_number?: string;
  rg_issuing_body?: string;
  rg_uf_id?: SelectData;
  rg_date_of_issue?: Date | null;
  company?: string;
  company_telephone?: string;
  telephone?: string;
  cell_phone?: string;
  whatsapp?: string;
}

interface SelectData {
  value?: string | number | undefined | null;
  label?: string;
}

interface AddressFormData {
  uf_id: number;
  uf: string;
  city_id: number;
  city: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zip_code: string;
  type: string;
}

interface ContactFormData {
  telephone?: string;
  cell_phone?: string;
  whatsapp?: string;
}

interface DependentFormData {
  gender_id: string;
  kinship_id: string;
  name: string;
  date_of_birth: string;
}

function TabPanel(props: TabPanelProps): any {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </div>
  );
}

function a11yProps(index: any): any {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: 24,
    borderRadius: 10,
  },
  topTab: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  tableAddresses: {
    marginTop: 16,
    border: '1px solid red',
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#631925',
    },
    secondary: {
      main: '#631925',
    },
  },
});

const User: React.FC = () => {
  const optionsBloodTypes = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];
  const optionsCivilStatus = [
    { value: 'Solteiro', label: 'Solteiro' },
    { value: 'Casado', label: 'Casado' },
    { value: 'Viúvo', label: 'Viúvo' },
    { value: 'Separado judicialmente', label: 'Separado judicialmente' },
    { value: 'Divorciado', label: 'Divorciado' },
  ];
  const optionsTypeAddress = [
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Residencial', label: 'Residencial' },
  ];
  const formRef = useRef<FormHandles>(null);
  const params: params = useParams();
  const [degrees, setDegrees] = useState<OptionsData[]>([]);
  const [kinships, setKinships] = useState<OptionsData[]>([]);
  const [genders, setGenders] = useState<OptionsData[]>([]);
  const [ufsNaturalness, setUfsNaturalness] = useState<UFData[]>([]);
  const [citiesNaturalness, setCitiesNaturalness] = useState<CityData[]>([]);
  const [ufsRG, setUfsRG] = useState<UFData[]>([]);
  const [ufsAddress, setUfsAddress] = useState<UFData[]>([]);
  const [citiesAddress, setCitiesAddress] = useState<CityData[]>([]);
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const { addToast } = useToast();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState<UserFormData | undefined>();
  const [idAddress, setIdAddress] = useState<number>(-1);
  const [idDependent, setIdDependent] = useState<number>(-1);

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number,
  ): any => {
    setValue(newValue);
  };

  const handleSubmit = useCallback(
    async (data: CreateUserFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          password: params.id
            ? Yup.string()
            : Yup.string().required('Senha obrigatória'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          cim: Yup.number()
            .transform((v, o) => (o === '' ? null : v))
            .nullable()
            .required('CIM é obrigatório'),
          cpf: Yup.string()
            .required('CPF é obrigatório')
            .test('cpfIsValid', 'CPF inválido', cpfValidate => {
              return cpf.isValid(cpfValidate);
            }),
          degree_id: Yup.string().required('Grau de Acesso é obrigatório'),
          date_of_birth: Yup.string()
            .nullable()
            .required('Data de Nascimento obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const contact: ContactFormData = {
          cell_phone: formRef.current?.getFieldValue('cell_phone'),
          telephone: formRef.current?.getFieldValue('telephone'),
          whatsapp: formRef.current?.getFieldValue('whatsapp'),
        };

        const contacts: ContactFormData[] = [];
        if (
          contact.cell_phone !== '' ||
          contact.telephone !== '' ||
          contact.whatsapp !== ''
        ) {
          contacts.push(contact);
        }

        const adressesToBeCreate: AddressFormData[] = addresses.map(address => {
          return {
            street: address.street,
            number: address.number,
            city: address.city,
            city_id: address.city_id,
            neighborhood: address.neighborhood,
            type: address.type,
            uf: address.uf,
            uf_id: address.uf_id,
            zip_code: address.zip_code,
            complement: address.complement,
          };
        });

        const dependentsToBeCreate: DependentFormData[] = dependents.map(
          dependent => {
            return {
              name: dependent.name_dependent,
              date_of_birth: format(
                new Date(dependent.date_of_birth_dependent),
                'yyyy-MM-dd',
              ),
              gender_id: dependent.gender_id,
              kinship_id: dependent.kinship_id,
            };
          },
        );

        const user: CreateUserFormData = {
          name: data.name,
          email: data.email ? data.email : undefined,
          password: data.password,
          old_password: data.old_password,
          cim: Number(data.cim),
          cpf: data.cpf,
          degree_id: data.degree_id,
          date_of_birth: data.date_of_birth
            ? format(new Date(data.date_of_birth), 'yyyy-MM-dd')
            : null,
          blood_type: data.blood_type,
          naturalness_city_id: data.naturalness_city_id
            ? data.naturalness_city_id
            : undefined,
          naturalness_city: citiesNaturalness.find(
            citySelect => citySelect.id === data.naturalness_city_id,
          )?.nome,
          naturalness_uf_id: data.naturalness_uf_id
            ? data.naturalness_uf_id
            : undefined,
          naturalness_uf: ufsNaturalness.find(
            ufSelect => ufSelect.id === data.naturalness_uf_id,
          )?.sigla,
          civil_status: data.civil_status,
          company: data.company,
          company_telephone: data.company_telephone,
          father: data.father,
          mother: data.mother,
          rg_date_of_issue:
            data.rg_date_of_issue &&
            format(new Date(data.rg_date_of_issue), 'yyyy-MM-dd'),
          rg_issuing_body: data.rg_issuing_body,
          rg_number: data.rg_number,
          rg_uf: ufsRG.find(ufSelect => ufSelect.id === data.rg_uf_id)?.sigla,
          rg_uf_id: Number(data.rg_uf_id) === 0 ? null : Number(data.rg_uf_id),
          contacts,
          adresses: adressesToBeCreate,
          dependents: dependentsToBeCreate,
        };

        if (params.id) {
          await api.put(`/users/${params.id}`, user);
        } else {
          await api.post('/users', user);
        }
        history.push('/app/cad/usuarios');

        addToast({
          type: 'success',
          title: `Usuário ${
            params.id ? 'atualizado' : 'cadastrado'
          } com sucesso.`,
          description: `O usuário ${user.name} foi ${
            params.id ? 'atualizado' : 'cadastrado'
          } com sucesso!`,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        console.log(err);
        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [
      addToast,
      params.id,
      citiesNaturalness,
      ufsNaturalness,
      ufsRG,
      addresses,
      dependents,
      history,
    ],
  );

  useEffect(() => {
    api.get('/degrees').then(response => {
      const options: OptionsData[] = response.data;
      options.map(opt => {
        opt.label = opt.description;
        opt.value = opt.id;
      });
      setDegrees(options);
    });

    api.get('/kinships').then(response => {
      const options: OptionsData[] = response.data;
      options.map(opt => {
        opt.label = opt.description;
        opt.value = opt.id;
      });
      setKinships(options);
    });

    api.get('/genders').then(response => {
      const options: OptionsData[] = response.data;
      options.map(opt => {
        opt.label = opt.description;
        opt.value = opt.id;
      });
      setGenders(options);
    });
  }, []);

  useEffect(() => {
    axios
      .get<UFRes[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then(res => {
        const ufs = res.data.map(uf => {
          const ufData = {
            id: uf.id,
            sigla: uf.sigla,
            value: uf.id,
            label: uf.sigla,
          };

          return ufData;
        });
        ufs.sort((a, b) => {
          // eslint-disable-next-line no-nested-ternary
          return a.sigla > b.sigla ? 1 : b.sigla > a.sigla ? -1 : 0;
        });
        setUfsNaturalness(ufs);
        setUfsRG(ufs);
        setUfsAddress(ufs);
      });
  }, []);

  const handleChangeUfNaturalness = useCallback(data => {
    formRef.current?.setFieldValue('naturalness_city_id', '');
    axios
      .get<CityRes[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.id}/municipios`,
      )
      .then(res => {
        const cities = res.data.map(city => {
          const cityData = {
            id: city.id,
            nome: city.nome,
            value: city.id,
            label: city.nome,
          };

          return cityData;
        });
        setCitiesNaturalness(cities);
      });
  }, []);

  const handleChangeUfAddress = useCallback(data => {
    formRef.current?.setFieldValue('city', '');
    axios
      .get<CityRes[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.id}/municipios`,
      )
      .then(res => {
        const cities = res.data.map(city => {
          const cityData = {
            id: city.id,
            nome: city.nome,
            value: city.id,
            label: city.nome,
          };

          return cityData;
        });
        setCitiesAddress(cities);
      });
  }, []);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api.get(`/users/${params.id}`).then(res => {
        const user: CreateUserFormData = res.data;

        const userToBeEdited: UserFormData = {
          name: user.name,
          email: user.email,
          cim: user.cim,
          cpf: user.cpf,
          avatar_url: user.avatar_url,
          date_of_birth: user.date_of_birth
            ? new Date(user.date_of_birth)
            : null,
          degree_id: { value: user.degree_id, label: user.degree?.description },
          blood_type: { value: user.blood_type, label: user.blood_type },
          naturalness_uf_id: {
            value: user.naturalness_uf_id,
            label: user.naturalness_uf,
          },
          naturalness_city_id: {
            value: user.naturalness_city_id,
            label: user.naturalness_city,
          },
          civil_status: { value: user.civil_status, label: user.civil_status },
          mother: user.mother,
          father: user.father,
          rg_number: user.rg_number,
          rg_uf_id: { value: user.rg_uf_id, label: user.rg_uf },
          rg_date_of_issue: user.rg_date_of_issue
            ? new Date(user.rg_date_of_issue)
            : null,
          rg_issuing_body: user.rg_issuing_body,
          company: user.company,
          company_telephone: user.company_telephone,
          telephone:
            user.contacts && user.contacts[0] ? user.contacts[0].telephone : '',
          cell_phone:
            user.contacts && user.contacts[0]
              ? user.contacts[0].cell_phone
              : '',
          whatsapp:
            user.contacts && user.contacts[0] ? user.contacts[0].whatsapp : '',
        };
        if (user.adresses) {
          const userAdresses: Address[] = user.adresses;
          setAddresses(userAdresses);
        }

        if (user.dependents) {
          const userDependents: Dependent[] = user.dependents.map(dep => {
            return {
              name_dependent: dep.name,
              date_of_birth_dependent: dep.date_of_birth,
              gender_id: dep.gender_id,
              gender: genders.find(gen => gen.id === dep.gender_id)
                ?.description,
              kinship_id: dep.kinship_id,
              kinship: kinships.find(kin => kin.id === dep.kinship_id)
                ?.description,
            };
          });
          setDependents(userDependents);
        }
        axios
          .get<CityRes[]>(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${userToBeEdited.naturalness_uf_id?.value}/municipios`,
          )
          .then(data => {
            const cities = data.data.map(city => {
              const cityData = {
                id: city.id,
                nome: city.nome,
                value: city.id,
                label: city.nome,
              };

              return cityData;
            });
            setCitiesNaturalness(cities);
          });
        setEditUser(userToBeEdited);
        setLoading(false);
      });
    }
  }, [params.id, genders, kinships]);

  const handleAddAddress = useCallback(() => {
    // console.log(
    //   formRef.current?.getFieldValue('city'),
    //   formRef.current?.getFieldValue('uf'),
    // );
    if (
      formRef.current?.getFieldValue('city') === '' ||
      formRef.current?.getFieldValue('uf') === '' ||
      formRef.current?.getFieldValue('street') === '' ||
      formRef.current?.getFieldValue('number') === '' ||
      formRef.current?.getFieldValue('neighborhood') === '' ||
      formRef.current?.getFieldValue('type') === '' ||
      formRef.current?.getFieldValue('zip_code') === ''
    ) {
      addToast({
        type: 'error',
        title: 'Erro ao adicionar endereço',
        description:
          'Preencha os campos para adicionar um endereço, complemento não é obrigatório.',
      });
    } else {
      const city_id = Number(formRef.current?.getFieldValue('city'));
      const city = citiesAddress.find(citySelect => citySelect.id === city_id)
        ?.nome;
      const uf_id = Number(formRef.current?.getFieldValue('uf'));
      const uf = ufsAddress.find(ufSelect => ufSelect.id === uf_id)?.sigla;

      // console.log(city, uf);

      if (city === undefined || uf === undefined) {
        return;
      }

      const address: Address = {
        street: formRef.current?.getFieldValue('street'),
        number: formRef.current?.getFieldValue('number'),
        neighborhood: formRef.current?.getFieldValue('neighborhood'),
        zip_code: formRef.current?.getFieldValue('zip_code'),
        type: formRef.current?.getFieldValue('type'),
        complement: formRef.current?.getFieldValue('complement'),
        city_id,
        city,
        uf,
        uf_id,
      };

      const addressExist = addresses.find(
        add => add.tableData?.id === idAddress,
      );

      if (addressExist) {
        const index = addresses.indexOf(addressExist);
        const addressesUpdated: Address[] = addresses.reduce(
          (acc: Address[], cv: Address, idx, arr) => {
            // err
            if (idx === index) return acc;
            return [...acc, cv];
          },
          [],
        );

        addressesUpdated.splice(index, 0, address);
        setAddresses(addressesUpdated);
        setIdAddress(-1);
      } else {
        setAddresses([...addresses, address]);
      }

      formRef.current?.setFieldValue('street', '');
      formRef.current?.setFieldValue('number', '');
      formRef.current?.setFieldValue('neighborhood', '');
      formRef.current?.setFieldValue('zip_code', '');
      formRef.current?.setFieldValue('type', '');
      formRef.current?.setFieldValue('complement', '');
      formRef.current?.setFieldValue('city', '');
      formRef.current?.setFieldValue('uf', '');
    }
  }, [citiesAddress, ufsAddress, addresses, idAddress, addToast]);

  const handleEditAddress = useCallback(rowData => {
    setIdAddress(rowData.tableData.id);
    formRef.current?.setFieldValue('street', rowData.street);
    formRef.current?.setFieldValue('number', rowData.number);
    formRef.current?.setFieldValue('neighborhood', rowData.neighborhood);
    formRef.current?.setFieldValue('complement', rowData.complement);
    formRef.current?.setFieldValue('type', {
      value: rowData.type,
      label: rowData.type,
    });
    formRef.current?.setFieldValue('zip_code', rowData.zip_code);
    formRef.current?.setFieldValue('uf', {
      value: rowData.uf_id,
      label: rowData.uf,
    });
    axios
      .get<CityRes[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${rowData.uf_id}/municipios`,
      )
      .then(data => {
        const cities = data.data.map(city => {
          const cityData = {
            id: city.id,
            nome: city.nome,
            value: city.id,
            label: city.nome,
          };

          return cityData;
        });
        setCitiesAddress(cities);
        formRef.current?.setFieldValue('city', {
          value: rowData.city_id,
          label: rowData.city,
        });
      });
  }, []);

  const handleRemoveAddress = useCallback(
    rowData => {
      const address = addresses.find(
        add => add.tableData?.id === rowData.tableData.id,
      );

      if (!address) {
        return;
      }

      const index = addresses.indexOf(address);

      const addressesUpdated: Address[] = addresses.reduce(
        (acc: Address[], cv: Address, idx, arr) => {
          // err
          if (idx === index) return acc;
          return [...acc, cv];
        },
        [],
      );
      setAddresses(addressesUpdated);
    },
    [addresses],
  );

  const handleAddDependent = useCallback(() => {
    if (
      formRef.current?.getFieldValue('gender') === '' ||
      formRef.current?.getFieldValue('kinship') === '' ||
      formRef.current?.getFieldValue('name_dependent') === '' ||
      formRef.current?.getFieldValue('date_of_birth_dependent') === ''
    ) {
      addToast({
        type: 'error',
        title: 'Erro ao adicionar dependente',
        description: 'Preencha todos os campos para adicionar um dependente',
      });
    } else {
      const gender_id = formRef.current?.getFieldValue('gender');
      const gender = genders.find(
        genderSelected => genderSelected.id === gender_id,
      )?.description;
      const kinship_id = formRef.current?.getFieldValue('kinship');
      const kinship = kinships.find(
        kinshipSelected => kinshipSelected.id === kinship_id,
      )?.description;

      if (gender === undefined || kinship === undefined) {
        return;
      }

      const dependent: Dependent = {
        name_dependent: formRef.current?.getFieldValue('name_dependent'),
        date_of_birth_dependent: formRef.current?.getFieldValue(
          'date_of_birth_dependent',
        ),
        gender,
        gender_id,
        kinship,
        kinship_id,
      };

      const dependentExist = dependents.find(
        dep => dep.tableData?.id === idDependent,
      );

      if (dependentExist) {
        const index = dependents.indexOf(dependentExist);
        const dependentsUpdated: Dependent[] = dependents.reduce(
          (acc: Dependent[], cv: Dependent, idx, arr) => {
            // err
            if (idx === index) return acc;
            return [...acc, cv];
          },
          [],
        );

        dependentsUpdated.splice(index, 0, dependent);
        setDependents(dependentsUpdated);
        setIdDependent(-1);
      } else {
        setDependents([...dependents, dependent]);
      }

      formRef.current?.clearField('name_dependent');
      formRef.current?.clearField('date_of_birth_dependent');
      formRef.current?.setFieldValue('gender', '');
      formRef.current?.setFieldValue('kinship', '');
    }
  }, [kinships, genders, dependents, idDependent, addToast]);

  const handleEditDependent = useCallback(rowData => {
    // console.log(rowData);
    setIdDependent(rowData.tableData.id);
    formRef.current?.setFieldValue('name_dependent', rowData.name_dependent);
    formRef.current?.setFieldValue(
      'date_of_birth_dependent',
      rowData.date_of_birth_dependent,
    );
    formRef.current?.setFieldValue('gender', {
      value: rowData.gender_id,
      label: rowData.gender,
    });
    formRef.current?.setFieldValue('kinship', {
      value: rowData.kinship_id,
      label: rowData.kinship,
    });
  }, []);

  const handleRemoveDependent = useCallback(
    rowData => {
      // const addressesSafe = [...addresses];
      const dependent = dependents.find(
        dep => dep.tableData?.id === rowData.tableData.id,
      );

      if (!dependent) {
        return;
      }

      const index = dependents.indexOf(dependent);

      const dependentsUpdated: Dependent[] = dependents.reduce(
        (acc: Dependent[], cv: Dependent, idx, arr) => {
          // err
          if (idx === index) return acc;
          return [...acc, cv];
        },
        [],
      );
      setDependents(dependentsUpdated);
    },
    [dependents],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch(`/users/avatar/${params.id}`, data).then(res => {
          // const userResponse = res.data.avatar_url;
          const newEditUser = editUser;
          if (newEditUser) {
            newEditUser.avatar_url = res.data.avatar_url;
          }
          setEditUser(newEditUser);
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });
      }
    },
    [addToast, editUser, params.id],
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <BasePage
        title={params.id ? 'Editar Usuário' : 'Novo Usuário'}
        backLink="/app/cad/usuarios"
      >
        <Container>
          <Form ref={formRef} initialData={editUser} onSubmit={handleSubmit}>
            <ArroundButton>
              <Button type="submit">SALVAR</Button>
            </ArroundButton>
            <div className={classes.root}>
              <AppBar position="static" className={classes.topTab}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="on"
                  indicatorColor="secondary"
                  textColor="secondary"
                  aria-label="scrollable force tabs example"
                >
                  <Tab
                    label="Informações Gerais"
                    icon={<InfoIcon />}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Endereços"
                    icon={<HomeIcon />}
                    {...a11yProps(1)}
                  />
                  <Tab
                    label="Contatos"
                    icon={<ContactsIcon />}
                    {...a11yProps(2)}
                  />
                  <Tab
                    label="Dependentes"
                    icon={<DependentsIcon />}
                    {...a11yProps(3)}
                  />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                <Title>Informações Gerais</Title>
                {params.id && (
                  <AvatarInput>
                    <img
                      src={
                        editUser?.avatar_url
                          ? editUser?.avatar_url
                          : 'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png'
                      }
                      alt={editUser?.name}
                    />
                    <label htmlFor="avatar">
                      <FiCamera />
                      <input
                        type="file"
                        id="avatar"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </AvatarInput>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Input
                      name="name"
                      icon={FiUser}
                      placeholder="Digite o nome"
                      label="Nome"
                    />
                  </Grid>
                  {!params.id && (
                    <Grid item xs={12} sm={6}>
                      <Input
                        name="password"
                        icon={FiLock}
                        placeholder="Digite a senha"
                        label="Senha"
                        type="password"
                      />
                    </Grid>
                  )}
                  {params.id && (
                    <>
                      <Grid item xs={12} sm={3}>
                        <Input
                          name="password"
                          icon={FiLock}
                          placeholder="Digite a nova senha"
                          label="Nova Senha"
                          type="password"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Input
                          name="old_password"
                          icon={FiLock}
                          label="Senha Antiga"
                          placeholder="Digite a senha antiga"
                          type="password"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="email"
                      icon={FiMail}
                      placeholder="Digite o e-mail"
                      label="E-mail"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="cim"
                      icon={FiKey}
                      placeholder="Digite o CIM"
                      label="CIM"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputMask
                      name="cpf"
                      icon={FaAddressCard}
                      placeholder="Digite o CPF"
                      label="CPF"
                      mask="999.999.999-99"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      name="date_of_birth"
                      icon={FiCalendar}
                      label="Data de Nascimento"
                      placeholderText="Insira a data de nascimento"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="degree_id"
                      icon={FaSort}
                      label="Grau de Acesso"
                      placeholder="Selecione o grau de acesso"
                      options={degrees}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="blood_type"
                      label="Tipo Sanguíneo"
                      placeholder="Selecione o tipo sanguíneo"
                      icon={FaSyringe}
                      isSearchable={false}
                      options={optionsBloodTypes}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="naturalness_uf_id"
                      label="UF de Naturalidade"
                      icon={FaFlag}
                      options={ufsNaturalness}
                      onChange={handleChangeUfNaturalness}
                      placeholder="Selecione a UF"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="naturalness_city_id"
                      label="Cidade Naturalidade"
                      icon={FaCity}
                      options={citiesNaturalness}
                      placeholder="Selecione a cidade"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="civil_status"
                      label="Estado Civil"
                      icon={FaBezierCurve}
                      placeholder="Selecione o estado civil"
                      options={optionsCivilStatus}
                      isSearchable={false}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="mother"
                      icon={FaFemale}
                      label="Mãe"
                      placeholder="Digite o nome da mãe"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="father"
                      icon={FaMale}
                      label="Pai"
                      placeholder="Digite o nome do pai"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="rg_number"
                      label="RG"
                      icon={FaIdBadge}
                      placeholder="Digite o número do RG"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="rg_uf_id"
                      label="UF de Emissão RG"
                      icon={FaFlag}
                      options={ufsRG}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      name="rg_date_of_issue"
                      icon={FiCalendar}
                      label="Data de Emissão RG"
                      placeholderText="Insira a data de emissão do RG"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="rg_issuing_body"
                      label="Orgão Emissor RG"
                      icon={FaGopuram}
                      placeholder="Digite o orgão emissor do RG"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="company"
                      label="Empresa"
                      icon={FaBuilding}
                      placeholder="Digite o nome da empresa"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputMask
                      name="company_telephone"
                      label="Telefone Empresa"
                      icon={FaPhoneSquare}
                      placeholder="Digite o telefone da empresa"
                      mask="(99) 99999-9999"
                    />
                  </Grid>
                </Grid>
                {/* </Card> */}
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Title>Endereços</Title>
                <Grid container spacing={2}>
                  <InputHidden name="id_address" />
                  <Grid item xs={12} sm={5}>
                    <Input
                      name="street"
                      icon={FaRoad}
                      placeholder="Digite o nome do logradouro"
                      label="Logradouro"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Input
                      name="number"
                      icon={FaSortNumericUp}
                      placeholder="Digite o número"
                      label="Número"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="neighborhood"
                      icon={FaMapSigns}
                      placeholder="Digite do bairro"
                      label="Bairro"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="complement"
                      icon={FaMapMarkerAlt}
                      placeholder="Digite o complemento"
                      label="Complemento"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="type"
                      label="Tipo de Endereço"
                      placeholder="Selecione o tipo do endereço"
                      icon={FaLocationArrow}
                      isSearchable={false}
                      options={optionsTypeAddress}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputMask
                      name="zip_code"
                      icon={FaAddressCard}
                      placeholder="Digite o CEP"
                      label="CEP"
                      mask="99.999-999"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Select
                      name="uf"
                      label="UF"
                      icon={FaFlag}
                      options={ufsAddress}
                      onChange={handleChangeUfAddress}
                      placeholder="Selecione a UF"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Select
                      name="city"
                      label="Cidade"
                      icon={FaCity}
                      options={citiesAddress}
                      placeholder="Selecione a cidade"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button onClick={handleAddAddress}>Adicionar</Button>
                  </Grid>
                </Grid>
                <MaterialTable
                  title="Lista de Endereços"
                  localization={labels.materialTable.localization}
                  columns={[
                    { title: 'Rua', field: 'street', width: '25%' },
                    { title: 'Número', field: 'number', width: '10%' },
                    { title: 'Bairro', field: 'neighborhood', width: '20%' },
                    { title: 'Cidade', field: 'city', width: '30%' },
                    { title: 'Estado', field: 'uf', width: '5%' },
                    { title: 'Tipo', field: 'type', width: '10%' },
                  ]}
                  data={addresses}
                  options={{
                    headerStyle: {
                      zIndex: 0,
                    },
                  }}
                  style={{ marginTop: 16, border: '2px solid #631925' }}
                  actions={[
                    rowData => ({
                      icon: () => <Edit />,
                      onClick: () => handleEditAddress(rowData),
                    }),
                    rowData => ({
                      icon: () => <Delete />,
                      onClick: () => handleRemoveAddress(rowData),
                    }),
                  ]}
                />
                {/* </Card> */}
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Title>Contatos</Title>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <InputMask
                      name="telephone"
                      icon={FaPhoneAlt}
                      placeholder="Digite o telefone"
                      label="Telefone"
                      mask="(99) 9999-9999"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputMask
                      name="cell_phone"
                      icon={FaMobileAlt}
                      placeholder="Digite o celular"
                      label="Celular"
                      mask="(99) 99999-9999"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputMask
                      name="whatsapp"
                      icon={FaWhatsapp}
                      placeholder="Digite o whatsapp"
                      label="Whatsapp"
                      mask="(99) 99999-9999"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Title>Dependentes</Title>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Input
                      name="name_dependent"
                      icon={FiUser}
                      placeholder="Digite o nome do dependente"
                      label="Nome"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      name="date_of_birth_dependent"
                      icon={FiCalendar}
                      placeholderText="Digite a data de nascimento"
                      label="Data de Nascimento"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="gender"
                      label="Genêro"
                      icon={FaVenusMars}
                      options={genders}
                      placeholder="Selecione o genêro"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="kinship"
                      label="Parentesco"
                      icon={FaGenderless}
                      options={kinships}
                      placeholder="Selecione o parentesco"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button onClick={handleAddDependent}>Adicionar</Button>
                  </Grid>
                </Grid>
                <MaterialTable
                  title="Lista de Dependentes"
                  localization={labels.materialTable.localization}
                  columns={[
                    { title: 'Nome', field: 'name_dependent', width: '40%' },
                    {
                      title: 'Data de Nascimento',
                      field: 'date_of_birth_dependent',
                      type: 'date',
                      width: '20%',
                    },
                    { title: 'Genêro', field: 'gender', width: '20%' },
                    { title: 'Dependente', field: 'kinship', width: '20%' },
                  ]}
                  data={dependents}
                  options={{
                    headerStyle: {
                      zIndex: 0,
                    },
                  }}
                  style={{ marginTop: 16, border: '2px solid #631925' }}
                  actions={[
                    rowData => ({
                      icon: () => <Edit />,
                      onClick: () => handleEditDependent(rowData),
                    }),
                    rowData => ({
                      icon: () => <Delete />,
                      onClick: () => handleRemoveDependent(rowData),
                    }),
                  ]}
                />
                {/* </Card> */}
              </TabPanel>
            </div>
          </Form>
        </Container>
      </BasePage>
    </ThemeProvider>
  );
};

export default User;