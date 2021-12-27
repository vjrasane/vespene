namespace JSX {
  export interface Element {
    element: JQuery<HTMLElement>;
    remove: () => void;
    append: (elem: JSX.Element) => void;
    appendTo: (elem: JSX.Element) => void;
    replace: (elem: JSX.Element) => void;
    text: (str?: string | number | boolean) => string | undefined;
    cleanup: (handler: () => void) => void;
    on: (event: string, handler: () => void) => void;
  }

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
