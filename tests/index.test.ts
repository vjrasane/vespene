

describe("test", () => {
	it("tests", () => {
		const handler = jest.fn();
		document.body.addEventListener("click", handler);
		document.body.click();
		expect(handler).toHaveBeenCalledTimes(1);
	})
})