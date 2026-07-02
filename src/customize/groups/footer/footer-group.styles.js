import { css, unsafeCSS } from "lit";
import footerBackground from "../../../assets/svg/footer.svg";

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

  .logo-groups {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  image-block::part(picker) {
    width: 6rem;
    height: 6rem;
  }
`;
