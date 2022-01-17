import V, { Element } from "..";
import "../modifications/window";

type RouteProps = {
  route: string
}

export const setPath = (path: string) => {
  window.history.pushState({}, "", path);
}

export const Route: V.FunctionComponent<RouteProps> = ({ children, route }) => {
  return <div id={route}>{children}</div>;
}

const Router: V.FunctionComponent<{}> = ({ children }, { replace }) => {
  const selectRoute = (route: string) => {
    return V.Children.toArray(children).find(
      (child): child is Element<RouteProps, typeof Route> => {
        if (!(child instanceof Element)) return false;
        if (child.type !== Route) return false;
        const props = child.props as RouteProps;
        return props.route === route
      }
    )
  }

  window.addEventListener("pushState", () => {
    const route = selectRoute(window.location.pathname);
    if (route) replace(route);
  })

  return selectRoute(window.location.pathname) ?? null;
}

<Router>
  <Route route="asd"></Route>
  <Route route="lol"></Route>
</Router>

export default Router;