import { randomUUID } from "../../../utils/ids.js";
import { getGroupDefinition } from "../../../registries/group-registry.js";

export class GroupOrder extends HTMLElement {
  connectedCallback() {
    this.addEventListener("add-group-request", this.#openPicker);
    this.addEventListener("delete-group-request", this.#deleteGroup);
    this.addEventListener("group-select", this.#addGroup);

    if (!this.querySelector(":scope > group-picker-dialog")) {
      this.append(document.createElement("group-picker-dialog"));
    }
    if (!this.querySelector(":scope > confirm-dialog")) {
      this.append(document.createElement("confirm-dialog"));
    }
  }

  disconnectedCallback() {
    this.removeEventListener("add-group-request", this.#openPicker);
    this.removeEventListener("delete-group-request", this.#deleteGroup);
    this.removeEventListener("group-select", this.#addGroup);
  }

  init(pageData = []) {
    const groupsById = new Map(
      [...this.children]
        .filter((element) => element.hasAttribute("group-id"))
        .map((group) => [group.getAttribute("group-id"), group]),
    );

    let groupIndex = 0;
    for (const { id, type, blocks, sort } of pageData) {
      if (!Array.isArray(blocks)) continue;

      let group = groupsById.get(id);
      if (!group) {
        const definition = getGroupDefinition(type ?? id);
        const tagName = definition?.tagName;
        if (!customElements.get(tagName)) continue;

        group = document.createElement(tagName);
        group.setAttribute("group-id", id);
        group.setAttribute("group-type", definition.type);
        this.append(group);
        groupsById.set(id, group);
      }

      group.sort = sort ?? groupIndex;
      groupIndex += 1;
    }

    groupsById.forEach((group) => group.requestUpdate?.());
    return this;
  }

  #openPicker = (event) => {
    this.insertAfter = event.detail.after;
    this.querySelector(":scope > group-picker-dialog")?.open();
  };

  #addGroup = (event) => {
    const { type } = event.detail;
    const definition = getGroupDefinition(type);
    if (!definition) return;

    const group = document.createElement(definition.tagName);
    group.setAttribute("group-id", randomUUID());
    group.setAttribute("group-type", definition.type);

    const groups = this.#getGroups();
    const index = groups.indexOf(this.insertAfter) + 1;
    groups.splice(index, 0, group);
    this.insertBefore(group, this.querySelector(":scope > group-picker-dialog"));

    this.#updateOrder(groups);

    const defaultData = group.constructor.defaultJson ?? {};
    group.init(defaultData);
    this.#dispatchChange();
    void group.focusFirstBlock?.();
  };

  #deleteGroup = async (event) => {
    const confirmed = await this.querySelector(":scope > confirm-dialog")?.open({
      title: "Delete group?",
      message: "This group and all of its content will be permanently deleted.",
      confirmLabel: "Delete group",
    });
    if (!confirmed) return;

    event.detail.group.remove();
    this.#updateOrder(this.#getGroups());
    this.#dispatchChange();
  };

  #getGroups() {
    return [...this.children]
      .filter((element) => element.hasAttribute("group-id"))
      .sort((a, b) => a.sort - b.sort);
  }

  #updateOrder(groups) {
    groups.forEach((group, sort) => {
      group.sort = sort;
      group.requestUpdate?.();
    });
  }

  #dispatchChange() {
    this.dispatchEvent(
      new CustomEvent("editor-change", {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("group-order", GroupOrder);
