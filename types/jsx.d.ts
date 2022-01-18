namespace JSX {
  export type Element = import("../src").default.Element;

  type Node = import("../src").default.Node;

  interface ElementChildrenAttribute { children: {}; }
  interface ElementAttributesProperty { props: {}; }

  type MouseEventProps = {
    onClick?: (event: MouseEvent) => void;
    onMouseOver?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseOut?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
  }

  type CommonProps = {
    id?: string;
    className?: string;
    style?: Record<string, string | number>;
    children?: Node | undefined;
  } & MouseEventProps;
  export interface IntrinsicElements {
    div: {} & CommonProps;
    span: {} & CommonProps;
    button: {} & CommonProps;
  }
}
