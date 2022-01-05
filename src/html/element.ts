import { flatten } from "lodash/fp";

type Maybe<T> = T | undefined | null;

type ElementLike = JQuery<HTMLElement> | Element;

type Hooks = {
  remove: () => void;
  append: (elem: Vespene.Element) => void;
  appendTo: (elem: Vespene.Element) => void;
  replace: (elem: Vespene.Element) => void;
  text: (str?: string | number | boolean) => string | undefined;
  cleanup: (handler: () => void) => void;
  on: (event: string, handler: () => void) => void;
};

type FunctionComponent<
  P extends object = {},
  C extends Vespene.Node = Vespene.Node
> = (props: P, children: Array<C>, hooks: Hooks) => Vespene.Element | null;

type HTMLElementTag = keyof HTMLElementTagNameMap;

type ComponentLike<
  P extends Object = {},
  C extends Vespene.Node = Vespene.Node
> = FunctionComponent<P, C> | HTMLElementTag;

namespace Vespene {
  export type Node = Element | string | null | undefined;

  export class Element<
    P extends Object = {},
    C extends Vespene.Node = Vespene.Node
  > {
    protected element: Maybe<ElementLike>;

    private listeners: Record<string, Array<() => void>> = {};

    private component: ComponentLike<P, C>;

    private props: P;

    private children: Array<C>;

    constructor(
      component: ComponentLike,
      props: P,
      children: Array<C | Array<C>>
    ) {
      this.children = flatten(children);
      this.component = component;
      this.props = props;
    }

    get hooks(): Hooks {
      return {};
    }

    renderFunction(component: FunctionComponent<P, C>): Maybe<Element> {
      return component(this.props, this.children, this.hooks);
    }

    render(): Maybe<ElementLike> {
      this.listeners = {};
      // if (isFunction(component)) {
      // } else {
      //   const renderedChildren: Array<JQuery<HTMLElement> | string> = compact(
      //     flattenedChildren.map((child) =>
      //       isString(child) ? child : child?.render()
      //     )
      //   );
      //   element = $(`<${component}></${component}>`);
      //   element.append(...renderedChildren);
      // }
    }
  }
}

export {};
