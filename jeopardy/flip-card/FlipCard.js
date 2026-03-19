class FlipCard extends HTMLElement {
  #data = {};

  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;

    this.classList.add("flip-card");

    if (!this.hasAttribute("tabindex")) {
      this.tabIndex = 0;
    }

    this.setAttribute("role", "button");

    this.addEventListener("click", this._onToggle);
    this.addEventListener("keydown", this._onKeyDown);

    this.render(); // initial render
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onToggle);
    this.removeEventListener("keydown", this._onKeyDown);
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = value || {};
    this.render();
  }

  render() {
    const { question = "", answer = "", value = "" } = this.#data;

    this.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-face flip-card-front">
          <h2>₡${value}</h2>
        </div>
        <div class="flip-card-face flip-card-back">
          <h3>${question}</h3>
        </div>
      </div>
    `;

    this._updateAria();
  }

  _onToggle = () => {
    this.toggleAttribute("flipped");
    this._updateAria();
  };

  _onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._onToggle();
    }
  };

  _updateAria() {
    this.setAttribute(
      "aria-pressed",
      this.hasAttribute("flipped") ? "true" : "false"
    );
  }
}

customElements.define("flip-card", FlipCard);
export {
  FlipCard
}