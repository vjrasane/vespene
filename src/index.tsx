

import V from "./html/vespene";
import "./index.css";

const Func: V.FunctionComponent<{ children: V.Children }> = ({ children }) => {
  return <div><span>{children}</span></div>
}

V.render(document.body, <div>HELLO WORLD!<Func><div>STR</div><span>as</span></Func></div>);