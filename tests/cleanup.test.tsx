import V, { FunctionComponent, render } from "../src";

describe("cleanup", () => {
  it("runs cleanup handlers when element is removed", () => {
	const handlerBeforeRender = jest.fn();
	const handlerAfterRender = jest.fn();
	const elem = <div>Element</div>;
	elem.cleanup(handlerBeforeRender);
    render(document.body, elem);
	expect(document.body.childElementCount).toBe(1);
	elem.cleanup(handlerAfterRender);
	expect(handlerBeforeRender).not.toHaveBeenCalled()
	expect(handlerAfterRender).not.toHaveBeenCalled()
    elem.remove();
	expect(handlerBeforeRender).toHaveBeenCalledTimes(1);
	expect(handlerAfterRender).toHaveBeenCalledTimes(1);
  });

  it ("runs cleanup handlers for nested element when parent is removed", () => {
	const handlerBeforeRender = jest.fn();
	const handlerAfterRender = jest.fn();
	const child = <div>Child</div>;
	const parent = <div>{child}</div>;
	child.cleanup(handlerBeforeRender);
    render(document.body, parent);
	expect(document.body.childElementCount).toBe(1);
	child.cleanup(handlerAfterRender);
	expect(handlerBeforeRender).not.toHaveBeenCalled()
	expect(handlerAfterRender).not.toHaveBeenCalled()
    parent.remove();
	expect(handlerBeforeRender).toHaveBeenCalledTimes(1);
	expect(handlerAfterRender).toHaveBeenCalledTimes(1);
  })

  it("runs function component cleanup handlers when element is removed", () => {
	const handlerWithinFunction = jest.fn();
	const handlerBeforeRender = jest.fn();
	const handlerAfterRender = jest.fn();
	const Component: FunctionComponent = (props, { cleanup }) => {
		cleanup(handlerWithinFunction)
		return <div>Element</div>;
	}
	const elem = <Component />;
	elem.cleanup(handlerBeforeRender);
    render(document.body, elem);
	expect(document.body.childElementCount).toBe(1);
	elem.cleanup(handlerAfterRender);
	expect(handlerWithinFunction).not.toHaveBeenCalled()
	expect(handlerBeforeRender).not.toHaveBeenCalled()
	expect(handlerAfterRender).not.toHaveBeenCalled()
    elem.remove();
	expect(handlerWithinFunction).toHaveBeenCalledTimes(1);
	expect(handlerBeforeRender).toHaveBeenCalledTimes(1);
	expect(handlerAfterRender).toHaveBeenCalledTimes(1);
  });


  it("runs nested element cleanup handlers when element is removed", () => {
	const handlerWithinFunction = jest.fn();
	const Component: FunctionComponent = () => {
		const elem = <div>Element</div>;
		elem.cleanup(handlerWithinFunction);
		return elem;
	}
	
	const elem = <Component />;
    render(document.body, elem);
	expect(document.body.childElementCount).toBe(1);
	expect(handlerWithinFunction).not.toHaveBeenCalled()
    elem.remove();
	expect(handlerWithinFunction).toHaveBeenCalledTimes(1);
  });

  it("runs passed child element cleanup handlers when element is removed", () => {
	const handlerBeforeRender = jest.fn();
	const handlerAfterRender = jest.fn();
	const Component: FunctionComponent = ({ children }) => {
		return <div>{children}</div>;
	}
	const child = <div>Child</div>;
	const elem = <Component>{child}</Component>
	child.cleanup(handlerBeforeRender);
    render(document.body, elem);
	expect(document.body.childElementCount).toBe(1);
	child.cleanup(handlerAfterRender);
	expect(handlerBeforeRender).not.toHaveBeenCalled()
	expect(handlerAfterRender).not.toHaveBeenCalled()
    elem.remove();
	expect(handlerBeforeRender).toHaveBeenCalledTimes(1);
	expect(handlerAfterRender).toHaveBeenCalledTimes(1);
  });

  it("does not run cleanup handlers for unmounted element", () => {
	const handlerBeforeRender = jest.fn();
	const handlerAfterRender = jest.fn();
	const elem = <div>Element</div>;
	elem.cleanup(handlerBeforeRender);
	expect(document.body.childElementCount).toBe(0);
	elem.cleanup(handlerAfterRender);
	expect(handlerBeforeRender).not.toHaveBeenCalled()
	expect(handlerAfterRender).not.toHaveBeenCalled()
    elem.remove();
	expect(handlerBeforeRender).not.toHaveBeenCalled()
	expect(handlerAfterRender).not.toHaveBeenCalled()
  });

  it("does not run cleanup handlers for unmounted passed children", () => {
	const handlerBeforeRender = jest.fn();
	const handlerAfterRender = jest.fn();
	const Component: FunctionComponent = () => {
		return <div>Element</div>;
	}
	const child = <div>Child</div>;
	const elem = <Component>{child}</Component>
	child.cleanup(handlerBeforeRender);
    render(document.body, elem);
	expect(document.body.childElementCount).toBe(1);
	child.cleanup(handlerAfterRender);
	expect(handlerBeforeRender).not.toHaveBeenCalled()
	expect(handlerAfterRender).not.toHaveBeenCalled()
    elem.remove();
	expect(handlerBeforeRender).not.toHaveBeenCalled()
	expect(handlerAfterRender).not.toHaveBeenCalled()
  });

});
