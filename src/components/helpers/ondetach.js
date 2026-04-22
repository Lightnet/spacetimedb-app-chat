class OnDetach extends HTMLElement {
  constructor(callback) {
    super();
    this.onDetach = callback;
  }
  disconnectedCallback() {
    if (this.onDetach) this.onDetach();
  }
}
customElements.define("on-detach", OnDetach);
console.log(HTMLElement);
console.log(customElements);

// Helper function
export const onDetach = (callback) => new OnDetach(callback);