import { format } from "date-fns";
import $ from "jquery";
import * as html from "./html";
import "./index.css";

const Clock: html.FunctionComponent = (props, children, { cleanup, remove }) => {
  const element = <span>{format(Date.now(), "dd-MM-yy HH:mm:ss")}</span>;

  const interval = setInterval(
    () => element.text(format(Date.now(), "dd-MM-yy HH:mm:ss")),
    1000
  );

  cleanup(() => { clearInterval(interval) });

  setTimeout(remove, 3000);

  return element;
};

$("body").append(
  (
    <div>
      <Clock />
    </div>
  ).render()
);

// console.log(elem);

// setTimeout(() => elem.remove(), 2000);
