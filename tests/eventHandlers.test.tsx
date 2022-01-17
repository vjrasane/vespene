
import V, { render } from "../src";

describe("eventHandlers", () => {
	describe("onClick", () => {
		it("triggers when button is clicked", () => {
			const handler = jest.fn();
			render(document.body, 
				<button id="button" onClick={handler} />
			);
			const button = document.getElementById("button");
			expect(button).toBeTruthy();
			button?.click();
			expect(handler).toHaveBeenCalledTimes(1);
		});
	});
});