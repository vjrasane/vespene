import V, { render } from "../src";

describe("onClick", () => {
  it("triggers when button is clicked", () => {
    const handler = jest.fn();
    render(document.body, <button id="button" onClick={handler} />);
    const button = document.getElementById("button");
    expect(button).toBeTruthy();
    button?.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("triggers when child element is clicked", () => {
    const handler = jest.fn();
    render(
      document.body,
      <div id="parent" onClick={handler}>
        <div id="child"></div>
      </div>
    );
    const child = document.getElementById("child");
    expect(child).toBeTruthy();
    child?.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not trigger when parent element is clicked", () => {
    const handler = jest.fn();
    render(
      document.body,
      <div id="parent">
        <div id="child" onClick={handler}></div>
      </div>
    );
    const parent = document.getElementById("parent");
    expect(parent).toBeTruthy();
    parent?.click();
    expect(handler).not.toHaveBeenCalled();
  });

  it("triggers individually for siblings", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();
    render(
      document.body,
      <div id="parent">
        <div id="child1" onClick={handler1}></div>
        <div id="child2" onClick={handler2}></div>
        <div id="child3" onClick={handler3}></div>
      </div>
    );
    const child1 = document.getElementById("child1");
    const child2 = document.getElementById("child2");
    const child3 = document.getElementById("child3");
    expect(child1).toBeTruthy();
    expect(child2).toBeTruthy();
    expect(child3).toBeTruthy();
    child1?.click();
    child2?.click();
    child3?.click();
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler3).toHaveBeenCalledTimes(1);
  });
});
