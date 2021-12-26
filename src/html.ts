import $ from "jquery";
import { entries, isFunction, isString } from "lodash/fp";

type Hooks = {
  remove: () => void;
  append: (elem: JSX.Element) => void;
  replace: (elem: JSX.Element) => void;
  text: (str?: string | number | boolean) => string | undefined;
  cleanup: (handler: () => void) => void;
};

export type FunctionComponent<P extends object = {}> = (
  props: P,
  children: Array<JQuery<HTMLElement> | string>,
  hooks: Hooks
) => JSX.Element;

type HTMLElementTag = keyof HTMLElementTagNameMap;

type Event = "create" | "remove";

export const createElement = <P extends object>(
  component: FunctionComponent | HTMLElementTag,
  props: P,
  ...children: Array<JSX.Element | string>
): JSX.Element => {
  let element: JQuery<HTMLElement> | undefined;
  const listeners: Record<Event, Array<() => void>> = {
    create: [],
    remove: [],
  };

  const cleanup = (handler: () => void): void => {
    listeners.remove.push(handler);
  };

  const remove = (): void => {
    listeners.remove.forEach((handler) => handler());
    element?.remove();
    element = undefined;
  };

  const replace = (elem: JSX.Element): void => {
    const replaced = elem.render();
    element?.replaceWith(replaced);
  };

  const append = (elem: JSX.Element): void => {
    const appended = elem.render();
    element?.append(appended);
  };

  const text = (str?: string | number | boolean): string | undefined => {
    if (!str) return element?.text();
    element?.text(str);
  };

  const hooks: Hooks = {
    remove,
    replace,
    append,
    text,
    cleanup,
  };

  const render = (): JQuery<HTMLElement> => {
    const renderedChildren: Array<JQuery<HTMLElement> | string> = children.map(
      (child) => (isString(child) ? child : child.render())
    );
    if (isFunction(component)) {
      element = $(component(props, renderedChildren, hooks).render());
    } else {
      element = $(`<${component}></${component}>`);
      element.append(...renderedChildren);
    }

    entries(props)
      .filter(([property]) => property.startsWith("on"))
      .forEach(([property, handler]) =>
        element?.on(property.substring(2).toLowerCase(), handler)
      );

    return element;
  };

  return {
    element,
    render,
    remove,
    append,
    replace,
    text,
  };
};
