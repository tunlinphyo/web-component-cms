export class GroupOrder extends HTMLElement {
  connectedCallback() {
    this.addEventListener("add-group-request", this.#openPicker);
    this.addEventListener("delete-group-request", this.#deleteGroup);
    this.addEventListener("group-select", this.#addGroup);

    if (!this.querySelector(":scope > group-picker-dialog")) {
      this.append(document.createElement("group-picker-dialog"));
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
    for (const { id, type, blocks, order } of pageData) {
      if (!Array.isArray(blocks)) continue;

      let group = groupsById.get(id);
      if (!group) {
        const tagName = `${type ?? id}-group`;
        if (!customElements.get(tagName)) continue;

        group = document.createElement(tagName);
        group.setAttribute("group-id", id);
        group.setAttribute("group-type", type ?? id);
        this.append(group);
        groupsById.set(id, group);
      }

      group.order = order ?? groupIndex;
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
    const group = document.createElement(`${type}-group`);
    group.setAttribute("group-id", `${crypto.randomUUID()}`);
    group.setAttribute("group-type", type);

    const groups = this.#getGroups();
    const index = groups.indexOf(this.insertAfter) + 1;
    groups.splice(index, 0, group);
    this.insertBefore(group, this.querySelector(":scope > group-picker-dialog"));

    this.#updateOrder(groups);

    const defaultData = group.constructor.defaultJson ?? {};
    group.init(defaultData);
    group.focusFirstBlock?.();
  };

  #deleteGroup = (event) => {
    event.detail.group.remove();
    this.#updateOrder(this.#getGroups());
  };

  #getGroups() {
    return [...this.children]
      .filter((element) => element.hasAttribute("group-id"))
      .sort((a, b) => a.order - b.order);
  }

  #updateOrder(groups) {
    groups.forEach((group, order) => {
      group.order = order;
      group.requestUpdate?.();
    });
  }
}

customElements.define("group-order", GroupOrder);
