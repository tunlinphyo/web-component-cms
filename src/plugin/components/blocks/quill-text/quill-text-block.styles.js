export const quillTextBlockStyles = `
  quill-text-block {
    display: block;
  }

  quill-text-block .quill-container {
    box-sizing: border-box;
  }

  quill-text-block .quill-container.ql-container {
    border: 0;
    font: inherit;
  }

  quill-text-block .quill-container .ql-editor {
    box-sizing: border-box;
    min-height: 1em;
    outline: none;
    overflow-wrap: break-word;
    padding: 0;
    white-space: pre-wrap;
  }

  quill-text-block:not([disabled]) .quill-container:focus-within,
  quill-text-block:not([disabled])[active] .quill-container,
  quill-text-block:not([disabled])[has-format-selection] .quill-container {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
  }

  quill-text-block .quill-container .ql-editor.ql-blank::before {
    color: #888;
    content: attr(data-placeholder);
    font-style: normal;
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
  }

  quill-text-block .quill-container .ql-editor > * {
    margin-block: var(--predefined-margin, 0.5rem);
  }

  quill-text-block .quill-container .ql-editor ol,
  quill-text-block .quill-container .ql-editor ul {
    padding-inline-start: 1.5rem;
  }

  quill-text-block .quill-container .ql-editor .ql-align-center {
    text-align: center;
  }

  quill-text-block .quill-container .ql-editor .ql-align-right {
    text-align: right;
  }

  quill-text-block .quill-container .ql-editor .ql-align-justify {
    text-align: justify;
  }

  quill-text-block[disabled] .quill-container {
    cursor: not-allowed;
    opacity: 0.6;
    user-select: none;
  }
`;
