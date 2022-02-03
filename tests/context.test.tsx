import V, { FunctionComponent, render } from "../src";
import { Context } from "../src/vespene/context";

describe("context", () => {
	it("uses default value if context not set", () => {
		const Ctx = new Context<string | undefined>("default");
		render(document.body, 
				<Ctx.Consumer>
					{(value) => <div>{value}</div>}
				</Ctx.Consumer>
		);
		expect(document.body).toMatchSnapshot();
	})

	it("uses default value in function component if context not set", () => {
		const Ctx = new Context<string | undefined>("default");
		const Component : FunctionComponent = (props, { getContext }) => <div>{getContext(Ctx)}</div>;
		render(document.body, 
				<Component />
		);
		expect(document.body).toMatchSnapshot();
	})

	it("passes correct value to child", () => {
		const Ctx = new Context<string | undefined>(undefined);
		render(document.body, 
		<Ctx.Provider value="context">
			<Ctx.Consumer>
				{(value) => <div>{value}</div>}
			</Ctx.Consumer>
		</Ctx.Provider>);
		expect(document.body).toMatchSnapshot();
	});

	it("passes innermost provider value to child", () => {
		const Ctx = new Context<string | undefined>(undefined);
		render(document.body, 
		<Ctx.Provider value="first">
			<Ctx.Provider value="second">
				<Ctx.Provider value="third">
					<Ctx.Consumer>
						{(value) => <div>{value}</div>}
					</Ctx.Consumer>
				</Ctx.Provider>
			</Ctx.Provider>
		</Ctx.Provider>
		);
		expect(document.body).toMatchSnapshot();
	});

	it("passes correct value after appending", () => {
		const Ctx = new Context<string | undefined>(undefined);
		const element = <div>Element</div>;
		render(document.body, 
		<Ctx.Provider value="context">
			{element}
		</Ctx.Provider>);
		element.append(	<Ctx.Consumer>
			{(value) => <div>{value}</div>}
		</Ctx.Consumer>)
		expect(document.body).toMatchSnapshot();
	});

	it("passes correct value after appending to", () => {
		const Ctx = new Context<string | undefined>(undefined);
		const element = <div>Element</div>;
		render(document.body, 
		<Ctx.Provider value="context">
			{element}
		</Ctx.Provider>);
		(<Ctx.Consumer>
			{(value) => <div>{value}</div>}
		</Ctx.Consumer>).appendTo(element)
		expect(document.body).toMatchSnapshot();
	})

	it("passes correct value after replacing", () => {
		const Ctx = new Context<string | undefined>(undefined);
		const element = <div>Element</div>;
		render(document.body, 
		<Ctx.Provider value="context">
			{element}
		</Ctx.Provider>);
		element.replace(<Ctx.Consumer>
			{(value) => <div>{value}</div>}
		</Ctx.Consumer>);
		expect(document.body).toMatchSnapshot();
	});

	it("passes correct value to function component", () => {
		const Ctx = new Context<string | undefined>(undefined);
		const Component : FunctionComponent = (props, { getContext }) => <div>{getContext(Ctx)}</div>;
		render(document.body, 
			<Ctx.Provider value="context">
				<Component/>
			</Ctx.Provider>);
			expect(document.body).toMatchSnapshot();
	});
})