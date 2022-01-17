import EventEmitter from "events";
// import * as html from "../html";
import V from "../html/vespene";
import "../window";

type RouteProps = {
  route: string
}

export const setPath = (path: string) => {
  window.history.pushState({}, "", path);
}

export const Route: V.FunctionComponent<RouteProps> = ({ children, route }) => {
  return <div id={route}>{children}</div>;
}

const Router: V.FunctionComponent<{ children: Array<V.Element<RouteProps>> }> = ({ children }) => {
  const selectRoute = (route: string) => {
    return children?.find(
      (child) => child.props?.route === route
    )
  }

  window.addEventListener("pushState", () => {
    const route = selectRoute(window.location.pathname);
    // if (route) replace(route);
  })

  return selectRoute(window.location.pathname) ?? null;
}

export default Router;