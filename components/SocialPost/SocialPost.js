// There are the
import { THEME_VARIANTS, FONTS_VARIANTS } from "./constants/index.js";
const { FUNNEL_SANS } = FONTS_VARIANTS;

import { dataLocalUrl } from "./helpers/index.js";
import { heartSvg } from "./assets/svg/heart-svg.js";
import { arrowSvg } from "./assets/svg/arrow-svg.js";


const svgMap = {
  heart: heartSvg,
  arrow: arrowSvg
};

const targetMap = {
  heart: ".like-container",
  arrow: ".arrow-container"
};

const template = document.createElement("template");
const base = import.meta.url;

//https://stackoverflow.com/questions/59943553/web-components-fonts-and-material-icons-not-working-font-face
/* there was some difficulties with fonts - I tried to encapsulate fonts request in the component, but according to my research
there is no option to do it without external framework or bad practises (for example to add into component template tag <head></head> segment).
However, I decided to add font itself into component folder which contains some pros and cons:
- pros:
  1) we have an independent component which looks just as we wanted.
  2) there is no need to obligate developer to connect and write additional lines of code.
-
- cons:
  1) we increased the bundle size.
  2) If the rest of the application already uses the same font, it may be downloaded again unnecessarily within the component's scope,
  leading to duplicate network requests and inefficient resource usage.
 */

// it was the most difficult task for me, because I was out of options how to make it work and keep encapsulated.
// At last, I decided to use CSS_Font_Loading_API.
const loadFonts = async () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API
  try {
    const regular = new FontFace(
        FUNNEL_SANS,
        `url(${dataLocalUrl("./assets/fonts/FunnelSans/FunnelSans-Regular.woff2", base)})`,
        { weight: "400", style: "normal", display: "swap" }
    );

    const medium = new FontFace(
        FUNNEL_SANS,
        `url(${dataLocalUrl("./assets/fonts/FunnelSans/FunnelSans-Medium.woff2", base)})`,
        { weight: "500", style: "normal", display: "swap" }
    );
    // additional check if this font was loaded
    const loaded = await Promise.all([regular.load(), medium.load()]);

    loaded.forEach((font) => {
      if (!document.fonts.has(font)) {
        document.fonts.add(font);
      }
    });

  } catch (error) {
    console.error("Failed to load Funnel Sans fonts:", error);
  }
};

template.innerHTML = `
  <style>
    :host, .social-root {
      font-family: "${FUNNEL_SANS}", sans-serif;
    }
    :host {      
      /*common variables*/
      --spacing-sm: 4px;
      --spacing-md: 8px;
      --spacing-lg: 16px;
      --spacing-xl: 20px;
      
      --font-size-sm: 12px;
      --font-size-md: 14px;
      --font-size-lg: 16px;
      
      --font-weight-normal: 400;
      --font-weight-bold: 500;
      
    }
   
    /* Light Theme by default */
    :host([theme="${THEME_VARIANTS.LIGHT}"]) , :host(:not([theme])) {
      /*theme variables*/    
      --color-icon-border: black;    
      --color-text-primary: #364358;
      --color-text-secondary: #627288;
      --color-background: #FFFFFF;
      --color-border: #DEE4ED;
    }

    /* Dark Theme */
    :host([theme="${THEME_VARIANTS.DARK}"]) {
      /*theme variables*/
      --color-icon-border: white;    
      --color-text-primary: #E8ECF3;
      --color-text-secondary: #A4B1C4;
      --color-background: #21242B;
      --color-border: #A4B1C4;
    }
   ::slotted(*) {
        margin-top: var(--spacing-lg);
        display: block;
   }
    .social-root {
      line-height: 1.5;

      width: 400px;
      
      /* ;) */
      box-sizing: border-box;
      padding: var(--spacing-xl);
      
      border: 1px solid var(--color-border);
      border-radius: 8px;
      
      background-color: var(--color-background);
      color: var(--color-text-primary);
      
    }

    .meta {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      /*fit the whole image in avatar size*/
      object-fit: fill;
    }
    
    .like-container {
        display: flex;
        justify-content: space-between;
        min-width: 30px;
        align-items: center;
        gap: var(--spacing-sm);
        /*prevent blue nondesirable highlights */
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
    
    .likes-count { 
      font-weight: var(--font-weight-bold);
    }
    
    .display-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }
    
    .meta-block-wrapper {
      width: 100%;
    }
    
    .meta-first-row{
      display: flex;
      justify-content: space-between;
    }

    .meta-second-row{
      display: flex;
      gap: var(--spacing-sm);
    }

    .display-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
    }

    .username {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-normal);
      color: var(--color-text-secondary);
    }
    
    .bottom-block {
      position: relative;
    }

    .text {
      margin-top: var(--spacing-lg);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-normal);
      color: var(--color-text-primary);
      
      text-align: justify;
      word-break: break-all; 
    }
    
    .text-arrow-padding {
      padding-right: 30px;
    }
    
    /*hack for hide lines using css instead of js*/
    .text-hide-lines {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .timestamp {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-normal);
      color: var(--color-text-secondary);
    }
    
    .arrow-container {
      position: absolute;
      right: 0;
      bottom: -4px;
    }
    
    .arrow-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
      fill: var(--color-icon-border);
      cursor: pointer;
    }
    
    .arrow-icon.rotated {
      transform: rotate(270deg);
    }
    
    .heart-icon {
      cursor: pointer;
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease, fill 0.2s ease;
      fill: var(--color-icon-border);
    }
    
    .heart-icon.liked path {
      fill: #d31919;
    }
    
    .like-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      user-select: none;
      cursor: pointer;
    }
    
    /* pulse animation */
    .heart-icon.pulse {
      animation: pulse 300ms ease;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      30% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

  </style>
  
  <div class="social-root">
    <div class="meta">
      <img alt="avatar" class="avatar" />
      <div class="meta-block-wrapper">
        <div class="meta-first-row">
            <span class="display-name"></span>
            <div class="like-container">
                <span class="likes-count"></span>
            </div>
        </div>
        <div class="meta-second-row">
            <span class="username"></span>
            <span class="timestamp"></span>
        </div>
      </div>
    </div>
    <div class="bottom-block">
        <div class="text text-hide-lines"></div>
        <div class="arrow-container"></div>
    </div>
    <!--  block for custom content from parent inside the tag body  -->
     <slot></slot>
  </div>
  
`;

export class SocialPost extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(template.content.cloneNode(true));
    // likes initial state
    this.likeCount = Number(this.getAttribute("likes")) || 0;
    this.liked = false;
    // comments initial state
    this.commentExpanded = false;

    // bind handlers
    this.handleHeartClick = this.handleHeartClick.bind(this);
    this.handleArrowClick = this.handleArrowClick.bind(this);
  }
  static get observedAttributes() {
    // added additional attribute "likes", because it should be provided from parent component
    return ["display-name", "username", "timestamp", "avatar", "text", "likes"];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case "display-name":
        this.shadow.querySelector(".display-name").textContent = newValue;
        break;
      case "username":
        // check for the first @ symbol - if not add.
        this.shadow.querySelector(".username").textContent =
          newValue.startsWith("@") ? `${newValue}` : `@${newValue}`;
        break;
      case "timestamp":
        this.shadow.querySelector(".timestamp").textContent = newValue;
        break;
      case "avatar":
        this.shadow.querySelector(".avatar").src = newValue;
        break;
      case "text":
        this.shadow.querySelector(".text").textContent = newValue;
        break;
      case "likes":
        this.shadow.querySelector(".likes-count").textContent = this.likeCount;
        break;
      default:
        return;
    }
  }

  connectedCallback() {
    // check for fonts and do request if necessary
    this.loadFontIfNeeded();
    this.renderSvgElement("heart");
    this.setupListeners("heart");
  }

  // in this method we wait then DOM fonts will be ready, after that we check if necessary fonts were loaded.
  // if not - we initialize the function for load local fonts.
  loadFontIfNeeded() {
    document.fonts.ready
        .then(() => {
          const hasFunnelSans = Array.from(document.fonts).some(
              (font) => font.family === FUNNEL_SANS
          );
          if (!hasFunnelSans) {
            return loadFonts();
          }
        })
        .catch((error) => {
          console.error("Error while checking or loading fonts:", error);
        })
        .finally(() => {
          // textEl.scrollHeight > textEl.clientHeight could be different after font load
          this.renderExpandIfNeeded();
        });
  }

  renderExpandIfNeeded() {
    const textEl = this.shadow.querySelector('.text');
    const isClamped = textEl.scrollHeight > textEl.clientHeight;
    if (isClamped) {
      textEl.classList.add("text-arrow-padding");
      this.renderSvgElement("arrow")
      this.setupListeners("arrow")
    }
  }

  renderSvgElement(name) {
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
    const parser = new DOMParser();
    const markup = svgMap[name];
    const containerSelector = targetMap[name];
    if (!markup || !containerSelector) {
      return;
    }

    const icon = parser.parseFromString(markup, "image/svg+xml").documentElement;
    icon.classList.add(`${name}-icon`);
    this.shadow.querySelector(containerSelector).appendChild(icon);
  }

  handleHeartClick() {
    const likesContainer = this.shadow.querySelector(".like-container");
    const heartIcon = likesContainer.querySelector(".heart-icon");
    const counterElement = likesContainer.querySelector(".likes-count");

    this.liked = !this.liked;
    this.likeCount += this.liked ? 1 : -1;
    counterElement.textContent = this.likeCount;

    // NOTE: this tag only represents the interview needs. For the real one we need to provide one more attribute
    // which represent user layer and if the like was already pushed.
    // So we will need to use other mechanism instead of toggle.
    heartIcon.classList.toggle("liked");
    heartIcon.classList.toggle("pulse");
  }

  handleArrowClick() {
    const textEl = this.shadow.querySelector(".text");
    const arrowIcon = this.shadow.querySelector(".arrow-icon");

    this.commentExpanded = !this.commentExpanded;

    arrowIcon.classList.toggle("rotated", this.commentExpanded);
    textEl.classList.toggle("text-hide-lines", !this.commentExpanded);
  }


  setupListeners(name) {
    const likesContainer = this.shadow.querySelector(".like-container");

    const handlers = {
      heart: () => {
        const heartIcon = likesContainer.querySelector(".heart-icon");
        heartIcon.addEventListener("click", this.handleHeartClick);
      },

      arrow: () => {
        const arrowIcon = this.shadow.querySelector(".arrow-icon");
        arrowIcon.addEventListener("click", this.handleArrowClick);
      }
    };
    handlers[name]?.();
  }


  disconnectedCallback() {
    const heartIcon = this.shadow.querySelector(".heart-icon");
    heartIcon?.removeEventListener("click", this.handleHeartClick);

    const arrowIcon = this.shadow.querySelector(".arrow-icon");
    arrowIcon?.removeEventListener("click", this.handleArrowClick);
  }

}

customElements.define("social-post", SocialPost);
