# Custom Groups and Group Pickers Migration

## Execution Roadmap

Do this migration in multiple steps, not as one large change. Each step must leave the
application buildable and must be reviewed before starting the next step.

When asked to perform a step:

- perform only that step and its required validation;
- do not start the next step automatically;
- report changed files, validation results, and any remaining risk;
- update the status below from `Pending` to `Complete`;
- stop if a required behavior cannot be preserved.

### Step 0: Record the baseline

**Status:** Complete

- Run `vp check` and `vp build`.
- Record pre-existing failures so they are not attributed to the migration.
- Verify an empty page opens the default group picker.
- Create or select fixture data containing every approved group type.
- Save the fixture's `editor.toJSON()` output for post-migration comparison.

**Exit condition:** Current behavior and known failures are documented without changing
architecture.

#### Step 0 baseline record

Recorded on 2026-07-02:

- `vp check`: failed on pre-existing formatting issues in 39 files. The command stopped
  at formatting, so this baseline does not claim that later lint or type-check phases
  pass.
- `vp build`: passed with 163 transformed modules.
- Empty-page browser check: passed. The `[data-empty-group-picker]` button existed,
  clicking it selected the default `group-picker-dialog`, and its native dialog opened.
- Approved group fixture: saved at
  `src/assets/data/migration-approved-groups.json`.
- Actual `editor.toJSON()` baseline: saved at
  `src/assets/data/migration-approved-groups.expected.json`.
- Repeatable browser harness: saved at `migration-baseline.html`.
- Snapshot comparison: passed for `about`, `footer`, `header`, `hero`, `home-news`,
  `image`, `news`, `paragraph`, and `table`.

Remaining baseline risk: Step 0 verifies initialization, serialization, and empty-picker
opening. It does not automate every interactive editing command; those checks remain in
the validation requirements for the steps that change those paths.

### Step 1: Extract reusable group-list behavior

**Status:** Complete

- Add a reusable `GroupListBase` or equivalent factory to the base/package side.
- Refactor `news-list-group` to configure the reusable behavior instead of duplicating
  it.
- Keep the current `home-news` JSON envelope unchanged.
- Keep list registration synchronous before `editor-selectors.js` loads.
- Add focused tests for add, delete, reorder, min/max, IDs, load, and save if the
  project test setup supports them.

**Exit condition:** `home-news` behaves the same, and a second list-backed group could
be created by configuration rather than copying `news-list-group`.

#### Step 1 validation record

Completed on 2026-07-02:

- Added reusable `GroupListBase` at
  `src/components/lists/base/group-list-base.js`.
- Refactored `NewsListGroup` into configuration for item tag, type, class, limits,
  prefix, placeholder, and sort label.
- Preserved the old `ensureNewsIds()` method as a compatibility alias.
- Kept `news-list` registration synchronous in `src/features/list/index.js`.
- Extended `migration-baseline.html` with browser checks for loading, unique IDs,
  min/max, add, delete, reorder, isolated default-data cloning, empty placeholders,
  `block-group-change`, and saving.
- All focused browser checks passed.
- The approved fixture's `editor.toJSON()` output still exactly matches
  `migration-approved-groups.expected.json`, including the `home-news` envelope.
- Targeted formatting and lint passed.
- `vp build` passed with 164 transformed modules.
- `vp check` still stops on the known repository formatting baseline, now reporting 38
  files because the migrated `news-list-group.js` is formatted.

No standalone test suite existed for these browser custom elements, so Step 1 uses the
repeatable headless-browser migration harness instead of adding a test runner or DOM
dependency.

### Step 2: Create customization entry points

**Status:** Complete

- Create `src/customize/groups/index.js`.
- Create `src/customize/group-pickers/index.js`.
- Wire the entry points into the current feature composition without moving files yet.
- Establish one owner for each `customElements.define()` and registry call.

**Exit condition:** The new composition entry points load synchronously with no duplicate
definitions or registrations.

#### Step 2 validation record

Completed on 2026-07-02:

- Added `src/customize/groups/index.js` as the single group-registration owner.
- Added `src/customize/group-pickers/index.js` as the picker composition entry point.
- Simplified `src/features/group/index.js` to load reusable structure and both
  customization entry points synchronously.
- Targeted format and lint passed.
- `vp build` passed.
- Browser baseline, empty picker, group-list checks, and serialization snapshot passed.

### Step 3: Move the approved groups

**Status:** Complete

- Move only `about`, `footer`, `header`, `hero`, `home-news`, `image`, `news`,
  `paragraph`, `shared`, and `table` to `src/customize/groups`.
- Move the project-specific `news-list-group` wrapper with `home-news`, unless a
  separate project customization directory is intentionally introduced.
- Update imports without changing element tags, registry types, default JSON, styles,
  or serialization.
- Keep `GroupBase`, `GroupOrder`, and reusable list behavior outside `src/customize`.

**Exit condition:** All approved groups load only from `src/customize/groups`, and the
saved baseline fixture round-trips without changes.

#### Step 3 validation record

Completed on 2026-07-02:

- Moved all approved groups and shared helpers to `src/customize/groups`.
- Moved `news-list-group` beside `home-news`; reusable `GroupListBase` remains in
  `src/components`.
- Moved `news-list` registration from the base list feature to customization.
- Updated temporary excluded-group imports that still use the shared visual helper.
- Targeted format/lint and `vp build` passed.
- Browser behavior and the saved serialization snapshot passed unchanged.

### Step 4: Retire excluded groups

**Status:** Complete

- Remove excluded types from picker allowed-type sets.
- Remove their group registrations and imports.
- Remove dedicated lists and layout previews only when no approved type uses them.
- Delete excluded group files. This migration explicitly drops support for their saved
  JSON types.
- Remove or update fixture and shipped page data that still uses excluded types.
- Ensure specialized pickers contain only approved registered types.

**Exit condition:** No excluded group is registered, selectable, imported, or present in
shipped page data.

#### Step 4 validation record

Completed on 2026-07-02:

- Removed all excluded group implementations, registrations, imports, picker options,
  dedicated list code, previews, schema entry, styles, and unused assets.
- Confirmed no excluded type remains under `src`.
- Targeted format/lint and `vp build` passed.
- Approved groups, list behavior, empty picker, and serialization snapshot passed.

### Step 5: Split and move group pickers

**Status:** Complete

- Extract reusable mechanics into `GroupPickerBase`.
- Keep `GroupPickerBase` outside `src/customize`.
- Move project picker elements and styles to `src/customize/group-pickers`.
- Preserve `open()`, `close()`, picker filtering, and the bubbling `group-select`
  contract.
- Keep `GroupOrder` independent from concrete picker imports and markup.

**Exit condition:** Default and specialized picker tags behave as before, while reusable
picker code has no project dependency.

#### Step 5 validation record

Completed on 2026-07-02:

- Added reusable `GroupPickerBase` under `src/components/group-pickers/base`.
- Moved project picker elements and styles to `src/customize/group-pickers`.
- Kept `GroupOrder` independent from concrete picker imports.
- Targeted format/lint and `vp build` passed.
- Browser open, selection event, close, list behavior, and serialization snapshot
  passed.

### Step 6: Clean the composition boundary

**Status:** Complete

- Update `src/features/group/index.js` to import reusable bases and customization entry
  points.
- Remove or convert the obsolete `src/components/groups/index.js`.
- Remove stale imports and verify reusable modules never import from `src/customize`.
- Update repository documentation that still points to old group paths.

**Exit condition:** Dependency direction is package/base to application customization
only through public APIs, never through reverse imports.

#### Step 6 validation record

Completed on 2026-07-02:

- Removed obsolete `src/components/groups/index.js`.
- Confirmed reusable components do not import from `src/customize`.
- Removed stale old-path references and updated custom-group documentation.
- Targeted format/lint and `vp build` passed.

### Step 7: Add package-facing exports

**Status:** Complete

- Add a public entry module with named exports for supported base classes, registries,
  and contracts.
- Do not export or auto-register project groups and project pickers.
- Verify a small consumer example can define one custom group, one list-backed group,
  and one picker without importing internal paths.
- Run final `vp check`, `vp build`, and behavior validation.

**Exit condition:** The reusable layer can be packaged without including
`src/customize`, and consumers can extend it only through public exports.

#### Step 7 validation record

Completed on 2026-07-02:

- Added `src/public-api.js` with reusable group, group-list, picker, and registry
  exports.
- Added an external-style consumer example and browser verification page.
- Verified the public API can define/register a custom group, group list, and picker.
- Targeted format/lint, `vp build`, and the saved migration baseline passed.
- Final `vp check` still stops on 19 pre-existing formatting issues outside this step.

### Step dependency order

```text
Step 0
  -> Step 1
  -> Step 2
  -> Step 3
  -> Step 4
  -> Step 5
  -> Step 6
  -> Step 7
```

Do not reorder Steps 1-4. `home-news` currently couples its project list to a concrete
group import, registration is captured during startup, and excluded groups still appear
in picker definitions. Resolving those concerns in order keeps every intermediate state
valid.

## Goal

Separate reusable editor structure from project-specific customization so the reusable
code can later become a custom-element package.

The package must expose stable APIs that an application can use to create:

- custom group elements;
- custom group picker elements;
- group registrations;
- a `group-order` host that can add, move, delete, serialize, and restore those groups.

Project-specific group layouts and picker choices belong under `src/customize`.

## Target Ownership

```text
src/
  components/
    groups/
      base/
        group-base.js
        group-base.styles.js
        group-order.js
    group-pickers/
      base/
        group-picker-base.js

  customize/
    groups/
      index.js
      about/
      footer/
      header/
      hero/
      home-news/
      image/
      news/
      paragraph/
      shared/
      table/

    group-pickers/
      index.js
      group-picker-dialog.js
      group-picker-dialog.styles.js
      header-footer-group-picker-dialog.js
      home-group-picker-dialog.js
      partner-group-picker.js

    layout-designs/
      index.js
      layout-design.js
      layout-design.styles.js
```

`src/components/groups/base` remains reusable structure. Only the concrete groups shown
in the target tree and their visual helpers move to `src/customize/groups`.

The approved project group types are:

- `about`;
- `footer`;
- `header`;
- `hero`;
- `home-news`;
- `image`;
- `news`;
- `paragraph`;
- `table`.

These retained groups are example implementations. They provide reference patterns for
package consumers creating future custom groups; they are not package-owned built-in
groups and must not be exported automatically by the reusable package.

Use them as references for:

- simple text and media groups;
- header and footer composition;
- default JSON and stable block IDs;
- custom group styles and feature declarations;
- custom `init()` and `toJSON()` behavior;
- nested list-backed groups through `home-news` and `news`.

`shared` is a helper directory, not a registered group type. Groups outside this list
must be removed instead of copied into `src/customize`. Their old saved JSON types are
intentionally unsupported after this migration. Remove their imports, registrations,
picker options, unused list registrations, fixtures, page data, and files.

`confirm-dialog` remains a reusable dialog and must not move with group pickers.

## Package Boundary

The future package should export reusable contracts, not this project's page designs.

Package candidates:

- `GroupBase`;
- `GroupOrder`;
- a generic picker base class;
- `registerGroup`, `getGroupDefinition`, and `listGroupDefinitions`;
- group, picker, and editor event contracts;
- serialization and normalization helpers needed by those public elements;
- required reusable block, list, toolbar, and dialog elements.

Application-owned customization:

- concrete group classes and styles;
- group default JSON;
- group registration metadata;
- allowed group lists for specialized pickers;
- picker presentation and layout previews;
- project assets, fonts, colors, and page data.

Do not publish project-specific group names such as `home-news` as package API.

## Required Picker Split

The current `GroupPickerDialog` mixes reusable mechanics with project presentation:

- reusable: `open()`, `close()`, selection state, and the `group-select` event;
- project-specific: dialog markup, layout preview elements, labels, filtering choices,
  and styles.

Before extracting the package, introduce a reusable `GroupPickerBase` under
`src/components/group-pickers/base`. The project-owned
`src/customize/group-pickers/group-picker-dialog.js` should extend it and define the
`group-picker-dialog` custom element.

`GroupOrder` must depend only on the picker element contract:

```js
picker.open();
```

The picker must return a selection through:

```js
new CustomEvent("group-select", {
  bubbles: true,
  detail: { type },
});
```

`GroupOrder` must not import a concrete project picker. It selects a picker by the
`picker-dialog` attribute and defaults to the `group-picker-dialog` tag.

## Current Runtime Contracts That Must Stay Stable

### Registration order

Group definitions must be registered before `src/editor/editor-selectors.js` is
evaluated. That module currently captures `GROUP_SELECTOR` once at module load.

Keep this startup order:

1. define blocks, lists, custom groups, and picker custom elements;
2. call `registerGroup()` for every group;
3. load `rich-text-editor` and modules that import `editor-selectors.js`;
4. call `editor.init(pageData)`.

Do not move group registration behind a dynamic import or after editor initialization
without first changing selectors to resolve dynamically.

### Group identity

For every migrated group, preserve all of these values exactly:

- registry `type`;
- registry `tagName`;
- registry `selector`;
- `customElements.define()` tag;
- JSON `type`;
- existing stable block IDs in `defaultJson` and rendered `block-id` attributes.

Changing a type, tag, or block ID can make existing page JSON fail to restore.

### Registry metadata

Preserve:

- `label`;
- `picker`;
- `addable`;
- `defaultStyle`;
- registration order when picker display order matters.

`addable: false` must continue to hide a group from pickers while still allowing saved
JSON containing that group to deserialize.

### Group class contract

Custom groups must:

- extend `GroupBase`, directly or through another compatible group;
- call `customElements.define()` once;
- render editable blocks with stable `block-id` values;
- preserve `static defaultJson`, `static features`, and custom `init()` or `toJSON()`
  behavior;
- include `${this.renderSortControls()}` where the current group includes it;
- keep any list registration and selector dependencies used by nested groups.

### List-backed group contract

`home-news` is the reference for a group containing a sortable list of other groups.
Its current implementation works, but creating another list-backed group requires too
much copied code. The future package should provide a reusable `GroupListBase` or a
small `createGroupList()` factory.

The reusable list API should accept configuration instead of hard-coding `news-group`:

```js
class NewsListGroup extends GroupListBase {
  static itemTag = "news-group";
  static itemType = "news";
  static itemClass = NewsGroup;
  static defaultMin = 0;
  static defaultMax = 6;
}
```

The package implementation should own:

- min/max enforcement;
- stable unique item IDs;
- add, delete, and reorder operations;
- empty-list placeholder behavior;
- `block-group-change` event dispatch;
- item lookup for an active nested block;
- labels used by sorting controls;
- cloning item default JSON without sharing nested arrays or objects.

The custom list should provide only:

- item custom-element tag and registered type;
- item default-data factory;
- label block ID;
- project-specific list layout styles.

A list-backed parent group still owns the JSON envelope. Follow the `home-news`
contract:

```json
{
  "id": "news",
  "type": "news",
  "children": []
}
```

Its `init()` must wait for Lit rendering, read `children`, sort them by `sort`, and call
the list element's `setBlockData()`. Its `toJSON()` must serialize every child through
`item.toJSON()` and write the current child order back to `sort`.

Do not treat nested list items as top-level `group-order` children. Do not let the
parent's normal `this.blocks` serialization duplicate items already stored under
`children`.

To add a new list-backed group after `GroupListBase` exists:

1. create and register the item group;
2. create the configured list element;
3. register the list selector before `editor-selectors.js` loads;
4. create the parent group with a stable list `id` and `type`;
5. implement the parent JSON envelope using shared list serialization helpers;
6. import the item, list, and parent from `src/customize/groups/index.js`;
7. validate add, delete, reorder, undo, redo, load, and save.

Do not add another copy of `news-list-group.js` with only tag names changed. Generalize
the reusable list behavior first so package consumers can create list-backed groups
without editing package internals.

### Group picker contract

Custom picker elements must:

- expose an `open()` method;
- emit bubbling `group-select` with `detail.type`;
- return only registered group types;
- honor `addable: false`;
- preserve `picker` filtering for the default picker;
- contain only approved, registered group types in specialized allowed-type sets.

### Group order contract

Preserve these events and details:

| Event                  | Required detail     |
| ---------------------- | ------------------- |
| `move-group-request`   | `{ group, offset }` |
| `add-group-request`    | `{ after }`         |
| `delete-group-request` | `{ group }`         |
| `group-select`         | `{ type }`          |
| `editor-change`        | no required detail  |

Preserve the `picker` and `picker-dialog` attributes. The empty “Add Section” button
must continue to use the same picker flow as add controls on existing groups.

## Migration Sequence

Perform the migration in small, buildable stages.

### 1. Create customization entry points

Create:

- `src/customize/groups/index.js`;
- `src/customize/group-pickers/index.js`.

The group entry point should define concrete group custom elements and register their
metadata. The picker entry point should define the default and specialized picker
custom elements.

Avoid having two entry points register the same custom element.

### 2. Move concrete groups

Move only `about`, `footer`, `header`, `hero`, `home-news`, `image`, `news`,
`paragraph`, `shared`, and `table` into `src/customize/groups`.

Retire the other current project groups. Before deleting one:

1. remove it from every picker allowed-type set;
2. remove its `registerGroup()` definition;
3. remove direct and transitive imports;
4. remove a dedicated list only when no approved group uses it;
5. remove or update shipped page JSON and fixtures containing its type;
6. delete its implementation and styles.

Update imports according to ownership:

- `GroupBase` imports point to `src/components/groups/base/group-base.js`;
- project group-to-group imports stay inside `src/customize/groups`;
- reusable lists and registries continue to point to `src/components` and
  `src/registries`;
- asset imports continue to point to `src/assets`.

Do not rewrite group implementations during the move. Path migration and behavior
refactoring should be separate changes.

### 3. Split and move group pickers

Extract reusable picker mechanics into `GroupPickerBase`, then move project picker
implementations and styles to `src/customize/group-pickers`.

Layout previews live in `src/customize/layout-designs` because they represent
project-specific group designs. The custom picker imports them explicitly.

### 4. Update the feature composition root

`src/features/group/index.js` is the current composition root. Update it to import:

- reusable `GroupOrder` and `confirm-dialog`;
- `src/customize/groups/index.js`;
- `src/customize/group-pickers/index.js`;
- reusable group toolbar controls.

Keep registration synchronous in this import graph.

`src/components/groups/index.js` is not currently referenced by the active startup
path. Remove it or convert it to a base-only entry point after all imports are updated.
Do not leave stale imports to files that were moved.

### 5. Prepare package exports

Add a package-facing entry module only after the internal move is stable. Export named
classes and registry functions. Do not require consumers to import internal file paths.

The package entry must not automatically register project groups. Applications should
import their customization entry point explicitly.

Recommended application composition:

```js
import { GroupBase, GroupPickerBase, registerGroup } from "editor-elements";
import "./customize/groups/index.js";
import "./customize/group-pickers/index.js";
import "editor-elements/rich-text-editor";
```

The exact package name is intentionally undecided.

## Do

- Keep moves mechanical before changing architecture.
- Use explicit `.js` extensions in local imports.
- Keep one owner for each `customElements.define()` call.
- Keep one owner for each `registerGroup()` call.
- Preserve custom-element tags and serialized JSON types.
- Preserve current default data and styles.
- Preserve synchronous registration before editor selector creation.
- Keep project registrations in a single customization entry point.
- Verify both an existing populated page and an empty page.
- Verify default and specialized picker tags.
- Use `vp` commands for formatting, checking, testing, and building.

## Do Not

- Do not move `GroupBase` or `GroupOrder` into `src/customize`.
- Do not move `confirm-dialog` into project customization.
- Do not make reusable base modules import from `src/customize`.
- Do not create a circular dependency between the package layer and customization.
- Do not rename custom-element tags, registry types, or stable block IDs.
- Do not register groups after `editor-selectors.js` has captured selectors.
- Do not define the same custom element from both old and new entry points.
- Do not leave both old and new group files active during the same build.
- Do not silently drop `defaultJson`, features, styles, picker metadata, or custom
  serialization methods.
- Do not keep or register project groups outside the approved group inventory.
- Do not preserve excluded groups only for backward compatibility; removing their
  implementations and old JSON types is explicitly part of this migration.
- Do not leave fixture or shipped page JSON referencing an excluded group after its
  implementation is removed.
- Do not create another project-specific group-list implementation by copying
  `news-list-group`; extract reusable list behavior.
- Do not couple `GroupOrder` to picker markup or shadow DOM.
- Do not import project assets or layout previews from a package base class.
- Do not combine this migration with redesigning group markup or page JSON.
- Do not use npm, pnpm, Yarn, Vitest, Oxlint, or Oxfmt directly; use Vite+ (`vp`).

## Validation Checklist

After each migration stage:

1. Run targeted formatting on moved files.
2. Run `vp check`.
3. Run `vp build`.
4. Load `page-one.json` and confirm every saved group renders.
5. Serialize with `editor.toJSON()` and confirm group types, IDs, sort order, styles,
   and blocks are retained.
6. Start with `{ "version": 1, "groups": [] }` and confirm the empty picker button
   opens the default picker.
7. Add, move, delete, undo, and redo a group.
8. Confirm `picker` filtering and each `picker-dialog` custom tag.
9. Confirm non-addable saved groups deserialize but do not appear in pickers.
10. Confirm there are no imports from reusable components back into `src/customize`.

## Completion Criteria

The migration is complete when:

- project groups exist only under `src/customize/groups`;
- `src/customize/groups` contains only the approved groups and `shared` helpers;
- project picker implementations exist only under
  `src/customize/group-pickers`;
- reusable base code has no dependency on `src/customize`;
- editor initialization and existing JSON behavior are unchanged;
- consumers can implement a new group and picker using exported base APIs without
  editing package internals;
- consumers can create list-backed groups through a reusable package API instead of
  copying the `home-news` list implementation;
- checks and build pass, apart from separately documented pre-existing failures.
