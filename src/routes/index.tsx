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
import Sessions from '../pages/Sessions';
import Session from '../pages/Sessions/Session';
import Presences from '../pages/Sessions/Presences';

const Routes: React.FC = () => (
  <Switch>
    <RouteDOM path="/" exact component={Home} />
    <RouteDOM exact path="/noticias" component={News} />
    <RouteDOM path="/noticias/:id" component={NewsDetail} />

    <Route path="/app/login" component={SignIn} />
    <Route path="/app/dashboard" component={Dashboard} isPrivate />
    <Route path="/app/gestoes" component={Managements} isPrivate />
    <Route path="/app/gestao/:id" component={Management} isPrivate />
    <Route path="/app/noticias" component={AppNews} isPrivate />
    <Route path="/app/noticia/:id?" component={AppNewsOne} isPrivate />
    <Route
      path="/app/palavra-semestral"
      component={SemiannualWords}
      isPrivate
    />

    <Route path="/app/sessoes" component={Sessions} isPrivate />
    <Route path="/app/sessao/:id?" component={Session} isPrivate />
    <Route path="/app/tipos-sessao" component={SessionTypes} isPrivate />
    <Route path="/app/presencas-sessao/:id" component={Presences} isPrivate />

    <Route path="/app/usuarios" component={Users} isPrivate />
    <Route path="/app/usuario/:id?" component={User} isPrivate />
  </Switch>
);

export default Routes;
