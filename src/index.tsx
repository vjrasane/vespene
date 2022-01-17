

import V, { FunctionComponent, render } from "./vespene";
import "./index.css";

const Func: FunctionComponent<{ children: () => V.Element }> = ({ children }) => {
  return <div><span>{children()}</span></div>
}

render(document.body, <div>HELLO WORLD!<Func>{() => <div><div>STR</div><span>as</span></div>}</Func></div>);