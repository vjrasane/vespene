import { format } from "date-fns";
import Router, { Route, setPath } from "./components/router";
import * as html from "./html";
import "./index.css";


// const Clock: html.FunctionComponent = (props, children, { cleanup, remove }) => {
//   const element = <span className="clock">{format(Date.now(), "dd-MM-yy HH:mm:ss")}</span>;

//   const interval = setInterval(
//     () => element.text(format(Date.now(), "dd-MM-yy HH:mm:ss:SS")),
//     1
//   );

//   cleanup(() => { console.log("CLEANUP"); clearInterval(interval) });

//   // setTimeout(remove, 3000);

//   return element;
// };

// const child = (<div>child</div>)

// child.cleanup(() => console.log("child removed"))

// const parent = (<div id="wat"><Clock /></div>)

// child.appendTo(parent)

// parent.cleanup(() => console.log("parent removed"))

//  setTimeout(() => parent.text("REPLACED"), 1000);

//  setTimeout(() => parent.replace(<div>REPLACED AGAIN</div>), 2000);

const r = <Router>
<Route route="/"><span>ROOT</span></Route>
<Route route="/aaa"><span>AAA</span></Route>
<Route route="/bbb"><span>BBB</span></Route>
</Router>;

console.log("R", r)
html.render(
  document.body, (

    r)
)


// console.log(elem);

setTimeout(() => setPath("/aaa"), 2000);
