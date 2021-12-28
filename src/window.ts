const proxy = function (type: keyof typeof window["history"]) {
  const orig = window.history[type];
  return function (this: typeof window) {
    const result = orig.apply(this, arguments);
    window.dispatchEvent(new Event(type));
    return result;
  };
};

window.history.pushState = proxy("pushState");
window.history.replaceState = proxy("replaceState");

export {};
