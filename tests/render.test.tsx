import V, { FunctionComponent, render } from "../src";

describe("render", () => {
  it("renders hello world", () => {
    render(document.body, <div>HELLO WORLD!</div>);
    expect(document.body).toMatchSnapshot();
  });

  it("does not render falsy value", () => {
    const Component = () => null;
    render(document.body, <Component />);
    expect(document.body.childElementCount).toBe(0);
  });

  it("renders component with attributes", () => {
    render(
      document.body,
      <div
        id="id"
        className="class"
        style={{
          cssProperty: "value",
          otherProperty: 1234,
        }}
      >
        Attributes
      </div>
    );
    expect(document.body).toMatchSnapshot();
  });

  it("renders function component", () => {
    const Component = () => <div>Function</div>;

    render(document.body, <Component />);
    expect(document.body).toMatchSnapshot();
  });

  it("renders function component with children", () => {
    const Component: FunctionComponent = ({ children }) => (
      <div>
        <span>Function</span>
        {children}
      </div>
    );

    render(
      document.body,
      <Component>
        <span>Children</span>
      </Component>
    );
    expect(document.body).toMatchSnapshot();
  });
});
