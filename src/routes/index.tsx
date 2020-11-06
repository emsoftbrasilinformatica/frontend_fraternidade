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

import Statutes from '../pages/Statutes';
import Statute from '../pages/Statutes/Statute';

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
import Tellers from '../pages/Tellers';
import Teller from '../pages/Tellers/Teller';

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
    <Route path="/app/cad/gestoes" component={Managements} isPrivate />
    <Route path="/app/cad/gestao/:id" component={Management} isPrivate />
    {/** managements */}

    {/** news */}
    <Route path="/app/cad/noticias" component={AppNews} isPrivate />
    <Route path="/app/cad/noticia/:id?" component={AppNewsOne} isPrivate />
    {/** news */}

    {/** semiannualwords */}
    <Route
      path="/app/cad/palavra-semestral"
      component={SemiannualWords}
      isPrivate
    />
    {/** semiannualwords */}

    {/** sessions */}
    <Route path="/app/cad/sessoes" component={Sessions} isPrivate />
    <Route path="/app/cad/sessao/:id?" component={Session} isPrivate />
    <Route path="/app/cad/tipos-sessao" component={SessionTypes} isPrivate />
    <Route path="/app/cad/tipo-sessao/:id?" component={SessionType} isPrivate />
    <Route
      path="/app/cad/presencas-sessao/:id"
      component={Presences}
      isPrivate
    />
    {/** sessions */}

    {/** statutes */}
    <Route path="/app/cad/estatutos" component={Statutes} isPrivate />
    <Route path="/app/cad/estatuto/:id?" component={Statute} isPrivate />
    {/** statutes */}

    {/** session records */}
    <Route path="/app/cad/atas-sessao" component={SessionRecords} isPrivate />
    <Route
      path="/app/cad/ata-sessao/:id?"
      component={SessionRecord}
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
      isPrivate
    />
    <Route
      path="/app/financeiro/tipo-lancamento/:id?"
      component={TypeFinancialPosting}
      isPrivate
    />

    <Route
      path="/app/financeiro/centros-custo/"
      component={CostCenters}
      isPrivate
    />
    <Route
      path="/app/financeiro/centro-custo/:id?"
      component={CostCenter}
      isPrivate
    />

    <Route path="/app/financeiro/caixas/" component={Tellers} isPrivate />
    <Route path="/app/financeiro/caixa/:id?" component={Teller} isPrivate />

    <Route
      path="/app/financeiro/lancamentos/"
      component={FinancialPostings}
      isPrivate
    />
    {/** financial */}

    {/** uploads */}
    <Route path="/app/cad/uploads" component={Uploads} isPrivate />
    <Route path="/app/cad/upload/:id?" component={Upload} isPrivate />
    {/** uploads */}

    {/** users */}
    <Route path="/app/cad/usuarios" component={Users} isPrivate />
    <Route path="/app/cad/usuario/:id?" component={User} isPrivate />
    {/** users */}
  </Switch>
);

export default Routes;
