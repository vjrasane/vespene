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

  it("renders fragment", () => {
    render(document.body, 
    <>
      <div>Div</div>
      Text
      <span>Span</span>
    </>);
    expect(document.body).toMatchSnapshot();
  });

  it("renders array", () => {
    render(document.body, 
    <div>
      {[
        <div>Div</div>,
        "Text",
        <span>Span</span>,
        [
          <div>Div</div>,
          "Text",
          <span>Span</span>,
          [
            <div>Div</div>,
            "Text",
            <span>Span</span>,
          ]
        ]
      ]}
    </div>);
    expect(document.body).toMatchSnapshot();
  });

  it("does not call render multiple times for mounted component", () => {
    const func = jest.fn();
    const Component = () => { 
      func();
      return <div>Function</div>;
    };

    const elem = <Component />;

    expect(func).not.toHaveBeenCalled();
    render(document.body, elem);
    render(document.body, elem);
    console.log(document.body.innerHTML);
    render(document.body, elem);
    expect(document.body).toMatchSnapshot();
    expect(func).toHaveBeenCalledTimes(1);
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
