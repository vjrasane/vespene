namespace JSX {
  export interface Element {
    element: JQuery<HTMLElement> | undefined;
    render: () => JQuery<HTMLElement>;
    remove: () => void;
    append: (elem: JSX.Element) => void;
    replace: (elem: JSX.Element) => void;
    text: (str?: string | number | boolean) => string | undefined;
  }
  export interface IntrinsicElements {
    div: {};
    span: {};
    button: { onClick: () => void };
  }
}
