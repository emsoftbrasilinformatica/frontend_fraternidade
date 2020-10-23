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

const Routes: React.FC = () => (
  <Switch>
    <RouteDOM path="/" exact component={Home} />
    <RouteDOM exact path="/noticias" component={News} />
    <RouteDOM path="/noticias/:id" component={NewsDetail} />

    <Route path="/app/login" component={SignIn} />
    <Route path="/app/dashboard" component={Dashboard} isPrivate />
    <Route path="/app/cad/gestoes" component={Managements} isPrivate />
    <Route path="/app/cad/gestao/:id" component={Management} isPrivate />
    <Route path="/app/cad/noticias" component={AppNews} isPrivate />
    <Route path="/app/cad/noticia/:id?" component={AppNewsOne} isPrivate />
    <Route
      path="/app/cad/palavra-semestral"
      component={SemiannualWords}
      isPrivate
    />

    <Route path="/app/cad/sessoes" component={Sessions} isPrivate />
    <Route path="/app/cad/sessao/:id?" component={Session} isPrivate />
    <Route path="/app/cad/tipos-sessao" component={SessionTypes} isPrivate />
    <Route path="/app/cad/tipo-sessao/:id?" component={SessionType} isPrivate />
    <Route
      path="/app/cad/presencas-sessao/:id"
      component={Presences}
      isPrivate
    />

    <Route path="/app/cad/estatutos" component={Statutes} isPrivate />
    <Route path="/app/cad/estatuto/:id?" component={Statute} isPrivate />

    <Route path="/app/cad/usuarios" component={Users} isPrivate />
    <Route path="/app/cad/usuario/:id?" component={User} isPrivate />
  </Switch>
);

export default Routes;
