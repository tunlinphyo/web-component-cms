import { css, unsafeCSS } from "lit";
import footerBackground from "../../assets/svg/footer.svg";

export const footerGroupStyles = css`
  [data-group-box] {
    padding: 2rem;
    color: var(--text-white);
    background-image: url("${unsafeCSS(footerBackground)}");
    background-size: auto 100%;
    background-repeat: repeat-x;

    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-block-start: 6rem;
  }

  image-block::part(picker) {
    width: 6rem;
    min-height: 4.5rem;
  }
`;
