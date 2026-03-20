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

    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKeyDown);

    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
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
          <h2 class="value"></h2>
        </div>

        <div class="flip-card-face flip-card-back">
          <h3 class="question"></h3>
          <button type="button" class="open-answer">?</button>

          <dialog class="answer-dialog">
            <p class="answer"></p>
            <form method="dialog">
              <button type="submit">Close</button>
            </form>
          </dialog>
        </div>
      </div>
    `;

    this.querySelector(".value").textContent = value ? `₡${value}` : "???";
    this.querySelector(".question").textContent = question;
    this.querySelector(".answer").textContent = answer;

    this._updateAria();
  }

  _onClick = (event) => {
    const openButton = event.target.closest(".open-answer");
    const dialog = this.querySelector(".answer-dialog");

    if (openButton) {
      event.preventDefault();
      event.stopPropagation();
      dialog?.showModal();
      return;
    }

    if (event.target.closest("dialog")) {
      return;
    }

    this.toggleAttribute("flipped");
    this._updateAria();
  };

  _onKeyDown = (event) => {
    if (event.target.closest(".open-answer")) return;
    if (event.target.closest("dialog")) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggleAttribute("flipped");
      this._updateAria();
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
export { FlipCard };