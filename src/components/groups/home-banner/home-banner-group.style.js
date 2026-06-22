import { css, unsafeCSS } from "lit";
import messageBackground from "../../../assets/svg/message.svg";
import sectionBackground from "../../../assets/svg/section.svg";

export const hostGroupStyles = css`
  :host {
    display: block;
  }

  [data-group-box] {
    display: grid;
    grid-template-columns: 1fr 0.8fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "message hero"
      "content hero";
    place-content: center;
    place-items: center;
    gap: 0;
    padding: 4rem;
    position: relative;
  }

  [data-group-box]::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 8rem;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("${unsafeCSS(sectionBackground)}");
    background-position: top center;
    background-size: 100% auto;
  }

  .message {
    grid-area: message;
    justify-self: center;
    aspect-ratio: 3/1;
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem 2rem 2rem;
  }

  .message::before {
    content: "";
    position: absolute;
    pointer-events: none;
    inset: -2rem;
    z-index: 0;
    width: auto;
    height: auto;
    background-image: url("${unsafeCSS(messageBackground)}");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .message rich-text-block {
    position: relative;
    z-index: 1;
  }

  .content {
    grid-area: content;
    justify-self: center;
    align-self: start;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin-top: -1rem;
  }

  .hero {
    grid-area: hero;
    justify-self: center;

    image-block {
      width: 22rem;
    }
  }

  .store-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.75rem;

    image-block {
      height: 3rem;
    }
  }

  image-block[block-id="logo"] {
    width: 15rem;
  }

  image-block::part(picker) {
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  image-block::part(image) {
    width: 100%;
    height: 100%;
    min-height: 0;
    object-fit: cover;
  }
`;
