import {
  compact,
  entries,
  flatten,
  isFunction,
  isString,
  partition,
} from "lodash/fp";
import $ from "../jquery";

type HTMLElementTag = keyof HTMLElementTagNameMap;

type Hooks = {
  remove: () => void;
  append: (elem: Vespene.Element) => void;
  appendTo: (elem: Vespene.Element) => void;
  replace: (elem: Vespene.Element) => void;
  text: (str?: string | number | boolean) => string | undefined;
  cleanup: (handler: () => void) => void;
  on: (event: string, handler: () => void) => void;
};

export type FunctionComponent<
  P extends object = {},
  C extends Vespene.Node = Vespene.Node
> = (props: P, children: Array<C>, hooks: Hooks) => Vespene.Element | null;

export const createElement = <P extends object, C extends Vespene.Node>(
  component: FunctionComponent<P, C> | HTMLElementTag,
  props: P,
  ...children: Array<C | Array<C>>
): Vespene.Element => {
  let element: JQuery<HTMLElement> | Vespene.Element | undefined | null;
  let listeners: Record<string, Array<() => void>> = {};

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

  const replace = (replacer?: Vespene.Element): void => {
    const rendered = replacer?.render();
    if (!rendered) return remove();
    element?.replaceWith(rendered);
    element = rendered;
  };

  const append = (appended?: Vespene.Element): void => {
    const rendered = appended?.render();
    if (!rendered) return;
    element?.append(rendered);
  };

  const appendTo = (appended: Vespene.Element): void => {
    const rendered = appended?.render();
    if (!rendered) return;
    element?.appendTo(rendered);
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

  const create = (): JQuery<HTMLElement> | undefined => {
    listeners = {};
    const flattenedChildren = flatten(children);
    if (isFunction(component)) {
      element = component(props, flattenedChildren, hooks);
    } else {
      const renderedChildren: Array<JQuery<HTMLElement> | string> = compact(
        flattenedChildren.map((child) =>
          isString(child) ? child : child?.render()
        )
      );
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

    return element;
  };

  const render = (): JQuery<HTMLElement> | undefined => {
    element = create();
    return element;
  };

  return {
    render,
    props,
    remove,
    append,
    appendTo,
    replace,
    text,
    cleanup,
    on,
  };
};
