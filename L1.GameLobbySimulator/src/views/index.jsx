import { createBrowserHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Route, Router, Switch } from "react-router-dom";

import Header from "./components/header.jsx";
import routes from "./routes.jsx";

const history = createBrowserHistory();

class Application extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Header />
        <Switch>
          {routes.map(({ path, component }, key) => (
            <Route
              key={key}
              path={path}
              render={props => React.createElement(component, props)}
            />
          ))}
          <Redirect to={routes[0].path} />
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById("app"));
