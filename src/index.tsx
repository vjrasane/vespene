import { format } from "date-fns";
import { times } from "lodash/fp";
import Router, { Route, setPath } from "./components/router";
import * as html from "./html";
import "./index.css";

const Clock: html.FunctionComponent = (
  props,
  children,
  { cleanup, remove }
) => {
  const element = (
    <span className="clock">{format(Date.now(), "dd-MM-yy HH:mm:ss")}</span>
  );

  let interval: NodeJS.Timer;
  interval = setInterval(
    () => element.text(format(Date.now(), "dd-MM-yy HH:mm:ss:SS")),
    1
  );

  cleanup(() => {
    clearInterval(interval);
  });

  return element;
};

const r = (
  <Router>
    <Route route="/">

    <asd id="asd">ASD</asd>
      <span>ROOT</span>
    </Route>
    <Route route="/clock">

      <span>
        {times(() => <Clock />, 200)}
      </span>
    </Route>
    <Route route="/bbb">
      <span>BBB</span>

    </Route>
  </Router>
);
html.render(document.body, r);

let clock = true;

// setInterval(() => {
//   window.history.pushState({}, "", clock ? "/clock" : "/");
//   clock = !clock;
// }, 2000);
