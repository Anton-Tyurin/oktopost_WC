// two different folders to keep component encapsulated
import { THEME_VARIANTS } from "./constants/index.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        .toggle {
          position: relative;
          width: 50px;
          height: 26px;
          background: #9d9c9c;
          border-radius: 13px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .toggle::after {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }
        .toggle.checked {
          background: #31ca55;
        }
        .toggle.checked::after {
          transform: translateX(24px);
        }
  </style>
  <div class="toggle"></div>
`;

export class SocialPostThemeSwitcher extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.appendChild(template.content.cloneNode(true));
        this.selfSelector = this.shadowRoot.querySelector('.toggle');

        this.handleClick = this.handleClick.bind(this); //bind method
    }

    connectedCallback() {
        this.targetSelector = this.getAttribute("target");
        this.targetElements = this.targetSelector ? document.querySelectorAll(this.targetSelector) : [];

        if (!this.targetSelector || this.targetElements.length === 0) {
            return
        }

        this.selfSelector.addEventListener("click", this.handleClick);
        // init state of toggle
        this.updateVisual();
    }

    handleClick() {
        this.toggle();
    }

    toggle() {
        this.targetElements.forEach(el => {
            const current = el.getAttribute('theme');
            const next = (current === THEME_VARIANTS.DARK) ? THEME_VARIANTS.LIGHT : THEME_VARIANTS.DARK;
            el.setAttribute('theme', next);
        });
        this.updateVisual();
    }

    updateVisual() {
        // for the interview purpose - if at least one of elems is dark - the toggle will be in active position.
        const isDark = Array.from(this.targetElements).some(el => el.getAttribute('theme') === THEME_VARIANTS.DARK);
        this.selfSelector.classList.toggle('checked', isDark);
    }

    disconnectedCallback() {
        this.selfSelector?.removeEventListener("click", this.handleClick);
    }
}

customElements.define("post-theme-switcher", SocialPostThemeSwitcher);
