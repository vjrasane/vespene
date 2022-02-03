import V, { FunctionComponent, render } from "../src";

describe("append", () => {
  it("appends unmounted element to mounted element", () => {
    const parent = <div id="parent"></div>;
    render(document.body, parent);
    parent.append(<div id="child"></div>);
    expect(document.body).toMatchSnapshot();
  });

  it("appends mounted element to mounted element", () => {
    const child1 = <div id="child1"></div>;
    const child2 = <div id="child2"></div>;
    render(
      document.body,
      <div id="parent">
        {child1}
        {child2}
      </div>
    );
    child1.append(child2);
    expect(document.body).toMatchSnapshot();
  });

  it("does not append mounted element to unmounted element", () => {
    const elem1 = <div id="elem1"></div>;
    const elem2 = <div id="elem2"></div>;
    render(document.body, elem1);
    elem2.append(elem1);
    expect(document.body.childElementCount).toBe(1);
    render(document.body, elem2);
    expect(document.body).toMatchSnapshot();
  });

  it("appends unmounted element to unmounted function element", () => {
    const Component: FunctionComponent = () => <div id="elem1"></div>;
    const elem1 = <Component />;
    const elem2 = <div id="elem2"></div>;
    elem1.append(elem2);
    expect(document.body.childElementCount).toBe(0);
    render(document.body, elem1);
    expect(document.body).toMatchSnapshot();
  });

  it("does not append mounted element to unmounted function element", () => {
    const Component = () => <div id="elem1"></div>;
    const elem1 = <Component />;
    const elem2 = <div id="elem2"></div>;
    render(document.body, elem2);
    expect(document.body.childElementCount).toBe(1);
    elem1.append(elem2);
    render(document.body, elem1);
    expect(document.body).toMatchSnapshot();
  });

  it("appends mounted element to mounted function element", () => {
    const Component = () => <div id="elem1"></div>;
    const elem1 = <Component />;
    const elem2 = <div id="elem2"></div>;
    render(document.body, elem1);
    expect(document.body.childElementCount).toBe(1);
    elem1.append(elem2);
    expect(document.body).toMatchSnapshot();
  });

  it("appends unmounted element to unmounted element", () => {
    const elem1 = <div id="elem1"></div>;
    const elem2 = <div id="elem2"></div>;
    elem2.append(elem1);
    render(document.body, elem2);
    expect(document.body).toMatchSnapshot();
  });

  it("throws an error when appending parent to its child", () => {
    const child = <div id="child"></div>;
    const parent = <div id="parent">{child}</div>;
    render(document.body, parent);
    expect(() => child.append(parent)).toThrowError(/incorrect node tree/);
    expect(document.body).toMatchSnapshot();
  });

  it("throws an error when appending element to itself", () => {
    const elem = <div id="elem"></div>;
    render(document.body, elem);
    expect(() => elem.append(elem)).toThrowError(/incorrect node tree/);
    expect(document.body).toMatchSnapshot();
  });
});
