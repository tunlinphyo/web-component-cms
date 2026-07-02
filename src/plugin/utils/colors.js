export const COLOR_FAMILIES = [
  {
    name: "Gray",
    colors: [
      { shade: "White", value: "#FFFFFF" },
      { shade: "25", value: "#F7F7F7" },
      { shade: "50", value: "#F0F0F0" },
      { shade: "100", value: "#E8E8E8" },
      { shade: "200", value: "#D1D1D1" },
      { shade: "300", value: "#B3B3B3" },
      { shade: "400", value: "#8D8D8D" },
      { shade: "500", value: "#676767" },
      { shade: "600", value: "#525252" },
      { shade: "700", value: "#414141" },
      { shade: "800", value: "#1B1B1B" },
      { shade: "900", value: "#0D0D0D" },
      { shade: "Black", value: "#000000" },
    ],
  },
  {
    name: "Pink",
    colors: [
      { shade: "50", value: "#FEF0F4" },
      { shade: "100", value: "#FEDFE7" },
      { shade: "200", value: "#F2ADC0" },
      { shade: "300", value: "#EC83A1" },
      { shade: "400", value: "#EA6288" },
      { shade: "500", value: "#E8426E" },
      { shade: "600", value: "#D6295A" },
      { shade: "700", value: "#A12B4C" },
      { shade: "800", value: "#73263C" },
      { shade: "900", value: "#511F2D" },
    ],
  },
  {
    name: "Yellow",
    colors: [
      { shade: "50", value: "#FFF9E6" },
      { shade: "100", value: "#FFF6DA" },
      { shade: "200", value: "#FFEECB" },
      { shade: "300", value: "#FFC107" },
      { shade: "400", value: "#E6AE06" },
      { shade: "500", value: "#CC9A06" },
      { shade: "600", value: "#BF9105" },
      { shade: "700", value: "#997404" },
      { shade: "800", value: "#735703" },
      { shade: "900", value: "#594402" },
    ],
  },
  {
    name: "Green",
    colors: [
      { shade: "50", value: "#E9F9E9" },
      { shade: "100", value: "#DEF5DE" },
      { shade: "200", value: "#BAEBBB" },
      { shade: "300", value: "#21BF25" },
      { shade: "400", value: "#1EAC21" },
      { shade: "500", value: "#1A991E" },
      { shade: "600", value: "#198F1C" },
      { shade: "700", value: "#147316" },
      { shade: "800", value: "#0F5611" },
      { shade: "900", value: "#0C430D" },
    ],
  },
  {
    name: "Red",
    colors: [
      { shade: "50", value: "#F7D6D4" },
      { shade: "100", value: "#F1B8B7" },
      { shade: "200", value: "#EA9A93" },
      { shade: "300", value: "#E3786E" },
      { shade: "400", value: "#DC564A" },
      { shade: "500", value: "#D53426" },
      { shade: "600", value: "#B22B20" },
      { shade: "700", value: "#8E2319" },
      { shade: "800", value: "#6B1A13" },
      { shade: "900", value: "#47110D" },
    ],
  },
  {
    name: "Orange",
    colors: [
      { shade: "50", value: "#FEEDDD" },
      { shade: "100", value: "#FDD0B1" },
      { shade: "200", value: "#FCB98B" },
      { shade: "300", value: "#FBA164" },
      { shade: "400", value: "#FA8A3D" },
      { shade: "500", value: "#F97216" },
      { shade: "600", value: "#D05F12" },
      { shade: "700", value: "#A64C0F" },
      { shade: "800", value: "#7D390B" },
      { shade: "900", value: "#532607" },
    ],
  },
  {
    name: "Blue",
    colors: [
      { shade: "50", value: "#D4E6FF" },
      { shade: "100", value: "#B7D6FF" },
      { shade: "200", value: "#93C2FF" },
      { shade: "300", value: "#6EADFF" },
      { shade: "400", value: "#4A99FF" },
      { shade: "500", value: "#2684FF" },
      { shade: "600", value: "#206ED5" },
      { shade: "700", value: "#1958AA" },
      { shade: "800", value: "#134280" },
      { shade: "900", value: "#0D2C55" },
    ],
  },
  {
    name: "Purple",
    colors: [
      { shade: "50", value: "#ECD9FD" },
      { shade: "100", value: "#DFCDFB" },
      { shade: "200", value: "#D0A0FA" },
      { shade: "300", value: "#C080F8" },
      { shade: "400", value: "#B061F6" },
      { shade: "500", value: "#A041F4" },
      { shade: "600", value: "#8536CB" },
      { shade: "700", value: "#6B2BA3" },
      { shade: "800", value: "#50217A" },
      { shade: "900", value: "#351651" },
    ],
  },
];

export const COLOR_PICKER_COLUMNS = 10;

export const EDITOR_COLORS = COLOR_FAMILIES.flatMap((family) => createColorFamilyItems(family));

export const EDITOR_COLOR_SWATCHES = createEditorColorSwatches();

export const EDITOR_COLOR_SWATCHES_WITH_UNSET = createEditorColorSwatches({ leadingCells: 1 });

export function createEditorColorSwatches({ leadingCells = 0 } = {}) {
  let column = leadingCells % COLOR_PICKER_COLUMNS;

  return COLOR_FAMILIES.flatMap((family) => {
    const colors = createColorFamilyItems(family);
    column = (column + colors.length) % COLOR_PICKER_COLUMNS;

    const spacers = createSpacerItems(family, column);
    column = (column + spacers.length) % COLOR_PICKER_COLUMNS;

    return [...colors, ...spacers];
  });
}

function createColorFamilyItems(family) {
  return family.colors.map((color) => ({
    ...color,
    family: family.name,
    label: `${family.name} ${color.shade}`,
  }));
}

function createSpacerItems(family, column) {
  const count = (COLOR_PICKER_COLUMNS - column) % COLOR_PICKER_COLUMNS;

  return Array.from({ length: count }, (_, index) => ({
    spacer: true,
    family: family.name,
    id: `${family.name.toLowerCase()}-spacer-${index}`,
  }));
}
