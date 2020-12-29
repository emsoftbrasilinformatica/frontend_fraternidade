export interface OptionsData {
  id: string;
  description: string;
  value: string;
  label: string;
}

export interface UFData {
  id: number;
  sigla: string;
  value: number;
  label: string;
}

export interface CityData {
  id: number;
  nome: string;
  value: number;
  label: string;
}

export interface UFRes {
  id: number;
  sigla: string;
}

export interface CityRes {
  id: number;
  nome: string;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export interface Address {
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

export interface Dependent {
  id?: string;
  name_dependent: string;
  date_of_birth_dependent: string;
  gender: string | undefined;
  gender_id: string;
  kinship: string | undefined;
  kinship_id: string;
  tableData?: TableData;
}

export interface TableData {
  id: number;
}

export interface DegreeFormData {
  description: string;
}

export interface CreateUserFormData {
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
  number_sessions_aprendiz: number;
  number_sessions_companheiro: number;
  number_sessions_mestre: number;
  number_sessions_mestre_instalado: number;
  wedding_date?: string | null | undefined;
  elevacao_date?: string | null | undefined;
  exaltacao_date?: string | null | undefined;
  instalacao_date?: string | null | undefined;
  iniciacao_date?: string | null | undefined;
  first_access?: boolean;
  adresses?: AddressFormData[];
  contacts?: ContactFormData[];
  dependents?: DependentFormData[];
}

export interface UserFormData {
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
  number_sessions_aprendiz: number;
  number_sessions_companheiro: number;
  number_sessions_mestre: number;
  number_sessions_mestre_instalado: number;
  wedding_date?: Date | null;
  elevacao_date?: Date | null;
  exaltacao_date?: Date | null;
  instalacao_date?: Date | null;
  iniciacao_date?: Date | null;
}

export interface SelectData {
  value?: string | number | undefined | null;
  label?: string;
}

export interface AddressFormData {
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

export interface ContactFormData {
  telephone?: string;
  cell_phone?: string;
  whatsapp?: string;
}

export interface DependentFormData {
  gender_id: string;
  kinship_id: string;
  name: string;
  date_of_birth: string;
}
