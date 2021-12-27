import { entries, isFunction, isString, partition } from "lodash/fp";
import $ from "../jquery";

type HTMLElementTag = keyof HTMLElementTagNameMap;

type Hooks = {
  remove: () => void;
  append: (elem: JSX.Element) => void;
  appendTo: (elem: JSX.Element) => void;
  replace: (elem: JSX.Element) => void;
  text: (str?: string | number | boolean) => string | undefined;
  cleanup: (handler: () => void) => void;
  on: (event: string, handler: () => void) => void;
};

export type FunctionComponent<P extends object = {}> = (
  props: P,
  children: Array<JQuery<HTMLElement> | string>,
  hooks: Hooks
) => JSX.Element;

export const createElement = <P extends object>(
  component: FunctionComponent | HTMLElementTag,
  props: P,
  ...children: Array<JSX.Element | string>
): JSX.Element => {
  let element: JQuery<HTMLElement> | undefined;
  const listeners: Record<string, Array<() => void>> = {};

  const bindEventHandlers = (event: string, handlers: Array<() => void>) => {
    element?.on(event, () => handlers.forEach((handler) => handler()));
  };

  const on = (event: string, handler: () => void) => {
    if (!(event in listeners)) {
      listeners[event] = [];
      bindEventHandlers(event, listeners[event]);
    }
    listeners[event].push(handler);
  };

  const cleanup = (handler: () => void): void => {
    on("remove", handler);
  };

  const remove = (): void => {
    element?.remove();
    element = undefined;
  };

  const replace = (elem: JSX.Element): void => {
    element?.replaceWith(elem.element);
    element = elem.element;
  };

  const append = (elem: JSX.Element): void => {
    element?.append(elem.element);
  };

  const appendTo = (elem: JSX.Element): void => {
    element?.appendTo(elem.element);
  };

  const text = (str?: string | number | boolean): string | undefined => {
    if (!str) return element?.text();
    element?.text(str);
  };

  const hooks: Hooks = {
    remove,
    replace,
    append,
    appendTo,
    text,
    cleanup,
    on,
  };

  const renderedChildren: Array<JQuery<HTMLElement> | string> = children.map(
    (child) => (isString(child) ? child : child.element)
  );
  if (isFunction(component)) {
    element = component(props, renderedChildren, hooks).element;
  } else {
    element = $(`<${component}></${component}>`);
    element.append(...renderedChildren);
  }

  const [attributes, handlers] = partition(
    ([property]) => !property.startsWith("on"),
    entries(props)
  );

  handlers.forEach(([property, handler]) =>
    element?.on(property.substring(2).toLowerCase(), handler)
  );

  attributes.forEach(([property, value]) => {
    switch (property) {
      case "className":
        element?.attr("class", value);
      default:
        element?.attr(property, value);
    }
  });

  entries(listeners).forEach(([event, handlers]) =>
    bindEventHandlers(event, handlers)
  );

  return {
    element,
    remove,
    append,
    appendTo,
    replace,
    text,
    cleanup,
    on,
  };
};
