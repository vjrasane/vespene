
import V, { render } from "../src/vespene";

describe("test", () => {
	it("tests", () => {
		render(document.body, <div>HELLO WORLD!</div>);
		expect(document.body).toMatchInlineSnapshot(`
<body>
  <div>
    HELLO WORLD!
  </div>
</body>
`);
	})
})