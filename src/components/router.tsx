import EventEmitter from "events";
import * as html from "../html";

type RouteProps = {
  route: string
}

const emitter = new EventEmitter();

export const setPath = (path: string) => {
  window.history.pushState({}, "", path);
  emitter.emit("change", path);
}

export const Route: html.FunctionComponent<RouteProps> = (props, children) => {
  return <div id={props.route}>{children}</div>;
}

const Router: html.FunctionComponent<{}, Vespene.Element<RouteProps>> = (props, children, { replace }) => {
  const selectRoute = (route: string) => {
    return children.find(
      (child) => child.props?.route === route
    )
  }

  emitter.on("change", (path: string) => {
    const route = selectRoute(path);
    if (route) replace(route);
  });

  return selectRoute(window.location.pathname) ?? null;
}

export default Router;