import $ from "jquery";
import * as html from "./html";
import "./index.css"

const Child: html.FunctionComponent = (props, children, { append, text }) => {
  const replace =     <div>REPLACE THIS</div>;
  return (
    <span>
      {replace}
      <button onClick={() => text("SOME TEXAT")}>DASD</button>
      <button onClick={() => append(<div>APPEND</div>)}>REMOVE</button>HELLO
      WORLD!
    </span>
  );
};

const elem = (
  <div>
    <Child />
    AGAIN
  </div>
);

console.log(elem, elem.render());

$("body").append(elem.render());

// console.log(elem);

// setTimeout(() => elem.remove(), 2000);
