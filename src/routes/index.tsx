import React from 'react';
import { Switch, Route as RouteDOM } from 'react-router-dom';

import Route from './Route';

import Home from '../pages/Home';
import News from '../pages/News';
import NewsDetail from '../pages/NewsDetail';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';

import SemiannualWords from '../pages/SemiannualWords';

import Users from '../pages/Users';
import User from '../pages/Users/User';

import AppNews from '../pages/AppNews';
import AppNewsOne from '../pages/AppNews/AppNewsOne';

import Managements from '../pages/Managements';
import Management from '../pages/Managements/Management';

import SessionTypes from '../pages/SessionTypes';
import SessionType from '../pages/SessionTypes/SessionType';
import Sessions from '../pages/Sessions';
import Session from '../pages/Sessions/Session';
import Presences from '../pages/Sessions/Presences';
import Frequencies from '../pages/Frequencies';

import Statutes from '../pages/Statutes';
import Statute from '../pages/Statutes/Statute';

import Library from '../pages/Library';
import LibraryItem from '../pages/Library/LibraryItem';

import SessionRecords from '../pages/SessionRecords';
import SessionRecord from '../pages/SessionRecords/SessionRecord';

import Uploads from '../pages/Uploads';
import Upload from '../pages/Uploads/Upload';

import Profile from '../pages/Profile';

import TypesFinancialPostings from '../pages/TypesFinancialPostings';
import TypeFinancialPosting from '../pages/TypesFinancialPostings/TypeFinancialPosting';

import CostCenters from '../pages/CostCenters';
import CostCenter from '../pages/CostCenters/CostCenter';

import FinancialPostings from '../pages/FinancialPostings';
import FinancialPosting from '../pages/FinancialPostings/FinancialPosting';
import MonthlyPaymentPosting from '../pages/FinancialPostings/MonthlyPaymentPosting';

import Tellers from '../pages/Tellers';
import Teller from '../pages/Tellers/Teller';

import Donations from '../pages/Donations';
import Donation from '../pages/Donations/Donation';

import Demonstrations from '../pages/Demonstrations';

import BankAccounts from '../pages/BankAccounts';
import BankAccount from '../pages/BankAccounts/BankAccount';

import NonPayments from '../pages/NonPayments';
import FinancialConsultation from '../pages/FinancialConsultation';
import SessionSchedule from '../pages/SessionSchedule';
import OneSession from '../pages/SessionSchedule/OneSession';

import GeneralLibrary from '../pages/GeneralLibrary';
import GeneralStatutes from '../pages/GeneralStatutes';

import IndividualFrequencies from '../pages/IndividualFrequencies';
import Historic from '../pages/Historic';

const Routes: React.FC = () => (
  <Switch>
    {/* site  */}
    <RouteDOM path="/" exact component={Home} />
    <RouteDOM exact path="/noticias" component={News} />
    <RouteDOM path="/noticias/:id" component={NewsDetail} />
    {/* site  */}

    {/* application  */}
    <Route path="/app/login" component={SignIn} />
    <Route path="/app/dashboard" component={Dashboard} isPrivate />

    {/** managements */}
    <Route
      path="/app/cad/gestoes"
      component={Managements}
      allowed={['Venerável']}
      isPrivate
    />
    <Route
      path="/app/cad/gestao/:id"
      component={Management}
      allowed={['Venerável']}
      isPrivate
    />
    {/** managements */}

    {/** news */}
    <Route
      path="/app/cad/noticias"
      component={AppNews}
      allowed={['Venerável', 'Secretário']}
      isPrivate
    />
    <Route
      path="/app/cad/noticia/:id?"
      component={AppNewsOne}
      allowed={['Venerável', 'Secretário']}
      isPrivate
    />
    {/** news */}

    {/** semiannualwords */}
    <Route
      path="/app/cad/palavra-semestral"
      component={SemiannualWords}
      allowed={['Venerável']}
      isPrivate
    />
    {/** semiannualwords */}

    {/** sessions */}
    <Route
      path="/app/cad/sessoes"
      component={Sessions}
      allowed={['Venerável', 'Chanceler']}
      isPrivate
    />
    <Route
      path="/app/cad/sessao/:id?"
      component={Session}
      allowed={['Venerável', 'Chanceler']}
      isPrivate
    />
    <Route
      path="/app/cad/tipos-sessao"
      component={SessionTypes}
      allowed={['Venerável', 'Chanceler']}
      isPrivate
    />
    <Route
      path="/app/cad/tipo-sessao/:id?"
      component={SessionType}
      allowed={['Venerável', 'Chanceler']}
      isPrivate
    />
    <Route
      path="/app/cad/presencas-sessao/:id"
      component={Presences}
      allowed={['Venerável', 'Chanceler']}
      isPrivate
    />

    <Route
      path="/app/cad/frequencias"
      component={Frequencies}
      allowed={['Venerável', 'Chanceler']}
      isPrivate
    />
    {/** sessions */}

    {/** statutes */}
    <Route
      path="/app/cad/estatutos"
      component={Statutes}
      allowed={['Venerável', 'Secretário']}
      isPrivate
    />
    <Route
      path="/app/cad/estatuto/:id?"
      component={Statute}
      allowed={['Venerável', 'Secretário']}
      isPrivate
    />
    {/** statutes */}

    {/** works */}
    <Route
      path="/app/cad/bibliotecas"
      component={Library}
      allowed={['Venerável', 'Secretário']}
      isPrivate
    />
    <Route
      path="/app/cad/biblioteca/:id?"
      component={LibraryItem}
      allowed={['Venerável', 'Secretário']}
      isPrivate
    />
    {/** works */}

    {/** session records */}
    <Route
      path="/app/cad/atas-sessao"
      component={SessionRecords}
      allowed={['Venerável', 'Secretário']}
      isPrivate
    />
    <Route
      path="/app/cad/ata-sessao/:id?"
      component={SessionRecord}
      allowed={['Venerável', 'Secretário']}
      isPrivate
    />
    {/** session records */}

    {/** profile */}
    <Route path="/app/profile" component={Profile} isPrivate />
    {/** profile */}

    {/** financial */}
    <Route
      path="/app/financeiro/tipos-lancamentos"
      component={TypesFinancialPostings}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />
    <Route
      path="/app/financeiro/tipo-lancamento/:id?"
      component={TypeFinancialPosting}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />

    <Route
      path="/app/financeiro/centros-custo/"
      allowed={['Venerável', 'Tesoureiro']}
      component={CostCenters}
      isPrivate
    />
    <Route
      path="/app/financeiro/centro-custo/:id?"
      component={CostCenter}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />

    <Route
      path="/app/financeiro/caixas/"
      component={Tellers}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />
    <Route
      path="/app/financeiro/caixa/:id?"
      component={Teller}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />

    <Route
      path="/app/financeiro/lancamentos/"
      component={FinancialPostings}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />
    <Route
      path="/app/financeiro/lancamento/:id?"
      component={FinancialPosting}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />
    <Route
      path="/app/financeiro/carne"
      component={MonthlyPaymentPosting}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />

    <Route
      path="/app/financeiro/demonstracao"
      component={Demonstrations}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />

    <Route
      path="/app/doacoes"
      component={Donations}
      allowed={['Venerável', 'Hospitaleiro']}
      isPrivate
    />
    <Route
      path="/app/doacao/:id?"
      component={Donation}
      allowed={['Venerável', 'Hospitaleiro']}
      isPrivate
    />

    <Route
      path="/app/financeiro/contas-bancarias"
      component={BankAccounts}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />
    <Route
      path="/app/financeiro/conta-bancaria/:id?"
      component={BankAccount}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />

    <Route
      path="/app/financeiro/inadimplentes"
      component={NonPayments}
      allowed={['Venerável', 'Tesoureiro']}
      isPrivate
    />
    {/** financial */}

    {/** general */}
    <Route
      path="/app/geral/consulta"
      component={FinancialConsultation}
      isPrivate
    />

    <Route
      path="/app/geral/agenda-sessoes"
      component={SessionSchedule}
      exact
      isPrivate
    />

    <Route
      path="/app/geral/agenda-sessoes/sessao/:id"
      component={OneSession}
      isPrivate
    />

    <Route path="/app/geral/biblioteca" component={GeneralLibrary} isPrivate />

    <Route path="/app/geral/estatutos" component={GeneralStatutes} isPrivate />

    <Route
      path="/app/geral/frequencia"
      component={IndividualFrequencies}
      isPrivate
    />

    <Route path="/app/geral/historico" component={Historic} isPrivate />
    {/** general */}

    {/** uploads */}
    <Route path="/app/cad/uploads" component={Uploads} isPrivate />
    <Route path="/app/cad/upload/:id?" component={Upload} isPrivate />
    {/** uploads */}

    {/** users */}
    <Route
      path="/app/cad/usuarios"
      component={Users}
      allowed={['Venerável', 'Chanceler']}
      isPrivate
    />
    <Route
      path="/app/cad/usuario/:id?"
      component={User}
      allowed={['Venerável', 'Chanceler']}
      isPrivate
    />
    {/** users */}
  </Switch>
);

export default Routes;
