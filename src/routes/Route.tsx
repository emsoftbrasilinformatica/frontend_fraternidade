import React from 'react';
import {
  RouteProps as ReactDOMRouterProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouterProps {
  isPrivate?: boolean;
  component: React.ComponentType;
  allowed?: string[];
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  allowed,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        if (isPrivate && user) {
          if (allowed) {
            const canContinue = allowed.find(
              el => el === user.administrative_function?.description,
            );

            if (canContinue) {
              return <Component />;
            }

            return (
              <Redirect
                to={{
                  pathname: isPrivate ? '/app/login' : '/app/dashboard',
                  state: { from: '/' },
                }}
              />
            );
          }
          return <Component />;
        }

        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/app/login' : '/app/dashboard',
              state: { from: '/' },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
