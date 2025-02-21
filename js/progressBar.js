class ProgressComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: block;
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .wrapper {
              display: flex;
              gap: 20px;
              flex-wrap: wrap;
              align-items: center;
              align-content: center;
              justify-content: center;
            }
            .wrapper.hide-progress .progress-container {
              visibility: hidden;
            }
            .wrapper.hide-progress .controls-container {
              grid-column: 1 / span 2;
            }
            .progress-container {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 120px;
              height: 120px;
            }
            .controls-container {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            .control {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .control input[type="number"] {
              width: 40px;
              height: 24px;
              border-radius: 12px;
              text-align: center;
              border: 1px solid #ccc;
              font-size: 14px;
              padding: 0;
              margin: 0;
              -moz-appearance: textfield;
            }
            .control input[type=number]::-webkit-outer-spin-button,
            .control input[type=number]::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            .control input[type="checkbox"] {
              width: 40px;
              height: 24px;
              margin: 0;
              background-color: #ddd;
              border-radius: 30px;
              position: relative;
              -webkit-appearance: none;
              appearance: none;
              cursor: pointer;
              outline: none;
              border: none;
            }
            .control input[type="checkbox"]:checked {
              background-color: #1565c0;
            }
            .control input[type="checkbox"]:before {
              content: "";
              position: absolute;
              top: 2px;
              left: 2px;
              width: 20px;
              height: 20px;
              background-color: white;
              border-radius: 50%;
              transition: left 0.2s;
            }
            .control input[type="checkbox"]:checked:before {
              left: calc(100% - 22px);
            }
            svg {
              transform: rotate(-90deg);
            }
            .progress-ring__background,
            .progress-ring__progress {
              fill: none;
              stroke-width: 10;
              stroke-linecap: round;
            }
            .progress-ring__background {
              stroke: #ddd;
            }
            .progress-ring__progress {
              stroke: #1565c0; 
              stroke-dasharray: 314;
              stroke-dashoffset: 314;
              transition: stroke-dashoffset 0.5s ease-in-out;
            }
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            // @media (max-width: 480px) {
            //   .progress-container {
            //     width: 100px;
            //     height: 100px;
            //   }
              .progress-ring__background,
              .progress-ring__progress {
                stroke-width: 8;
              }
            }
          </style>
          <div class="wrapper">
            <div class="progress-container">
              <svg class="progress-ring" width="120" height="120">
                <circle class="progress-ring__background" cx="60" cy="60" r="50"></circle>
                <circle class="progress-ring__progress" cx="60" cy="60" r="50"></circle>
              </svg>
            </div>
            <div class="controls-container">
              <div class="control">
                <input type="number" id="progress-value" min="0" max="100" value="0">
                <span>Value</span>
              </div>
              <div class="control">
                <input type="checkbox" id="animate-toggle">
                <span>Animate</span>
              </div>
              <div class="control">
                <input type="checkbox" id="hide-toggle">
                <span>Hide</span>
              </div>
            </div>
          </div>
        `;
    this.wrapper = this.shadowRoot.querySelector(".wrapper");
    this.progressContainer = this.shadowRoot.querySelector(
      ".progress-container"
    );
    this.progressCircle = this.shadowRoot.querySelector(
      ".progress-ring__progress"
    );
    this.valueInput = this.shadowRoot.getElementById("progress-value");
    this.animateToggle = this.shadowRoot.getElementById("animate-toggle");
    this.hideToggle = this.shadowRoot.getElementById("hide-toggle");

    this.radius = this.progressCircle.r.baseVal.value;
    this.circumference = 2 * Math.PI * this.radius;
    this.progressCircle.style.strokeDasharray = this.circumference;

    this.valueInput.addEventListener("input", (e) => {
      this.setValue(e.target.value);
    });
    this.animateToggle.addEventListener("change", (e) => {
      this.setAnimated(e.target.checked);
    });
    this.hideToggle.addEventListener("change", (e) => {
      this.setHidden(e.target.checked);
    });

    this.setValue(this.getAttribute("value") || 0);
  }

  set value(val) {
    this.setValue(val);
  }

  get value() {
    return this.valueInput.value;
  }

  setValue(value) {
    value = Math.min(Math.max(Number(value), 0), 100);
    const offset = this.circumference - (value / 100) * this.circumference;
    this.progressCircle.style.strokeDashoffset = offset;
    this.valueInput.value = value;
  }

  setAnimated(isAnimated) {
    if (isAnimated) {
      this.progressContainer.style.animation = "rotate 2s linear infinite";
    } else {
      this.progressContainer.style.animation = "none";
    }
  }

  setHidden(isHidden) {
    if (isHidden) {
      this.wrapper.classList.add("hide-progress");
    } else {
      this.wrapper.classList.remove("hide-progress");
    }
  }
}

customElements.define("progress-component", ProgressComponent);
