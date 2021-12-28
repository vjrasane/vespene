import EventEmitter from "events";
import * as html from "../html";
import "../window";

type RouteProps = {
  route: string
}

export const setPath = (path: string) => {
  window.history.pushState({}, "", path);
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

  window.addEventListener("pushState", () => {
    const route = selectRoute(window.location.pathname);
    if (route) replace(route);
  })

  return selectRoute(window.location.pathname) ?? null;
}

export default Router;