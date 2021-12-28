namespace Vespene {
  export interface Element<P extends object = {}> {
    render: () => JQuery<HTMLElement> | undefined;
    props?: P;
    remove: () => void;
    append: (elem: JSX.Element) => void;
    appendTo: (elem: JSX.Element) => void;
    replace: (elem: JSX.Element) => void;
    text: (str?: string | number | boolean) => string | undefined;
    cleanup: (handler: () => void) => void;
    on: (event: string, handler: () => void) => void;
  }

  export type Node = Element | string | null | undefined;
}

namespace JSX {
  export type Element = Vespene.Element;

  type CommonProps = {
    id?: string;
    className?: string;
  };

  export interface IntrinsicElements {
    div: {} & CommonProps;
    span: {} & CommonProps;
    button: { onClick: () => void } & CommonProps;
  }
}
