export const fontFamilyOptions = [
  { value: "var(--font-heading)", label: "Heading Font" },
  { value: "var(--font-body)", label: "Body Font" },
  { value: "var(--font-sans)", label: "Google Sans" },
].map((option) => ({ ...option, style: `font-family: ${option.value}` }));

export default fontFamilyOptions;
