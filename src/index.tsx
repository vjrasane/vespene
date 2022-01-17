

import V from "./html/vespene";
import "./index.css";

const Func: V.FunctionComponent<{ children: () => V.Element }> = ({ children }) => {
  return <div><span>{children}</span></div>
}

V.render(document.body, <div>HELLO WORLD!<Func>{() => <div><div>STR</div><span>as</span></div>}</Func></div>);