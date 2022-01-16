

namespace JSX {
  export type Element = import("../src/html/vespene").default.Element;
  interface ElementChildrenAttribute { children: import("../src/html/vespene").default.Children; }

  type CommonProps = {
    id?: string;
    className?: string;
  } & ElementChildrenAttribute;

  export interface IntrinsicElements {
    div: {} & CommonProps;
    span: {} & CommonProps;
    button: { onClick: () => void } & CommonProps;
  }
}
