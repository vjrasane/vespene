

namespace JSX {
  export type Element = import("../src/html/vespene").default.Element;

  type Node = import("../src/html/vespene").default.Node;

  interface ElementChildrenAttribute { children: {}; }
  interface ElementAttributesProperty { props: {}; }

  type CommonProps = {
    id?: string;
    className?: string;
    children?: Node | undefined;
  };

  export interface IntrinsicElements {
    div: {} & CommonProps;
    span: {} & CommonProps;
    button: { onClick: () => void } & CommonProps;
  }
}
