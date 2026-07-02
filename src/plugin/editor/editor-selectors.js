import { getBlockSelector } from "../registries/block-registry.js";
import { getGroupSelector } from "../registries/group-registry.js";
import { getListSelector } from "../registries/list-registry.js";

export const TEXT_BLOCK_SELECTOR = getBlockSelector({ textOnly: true });
export const CONTENT_BLOCK_SELECTOR = getBlockSelector();
export const BLOCK_GROUP_SELECTOR = getListSelector();
export const GROUP_SELECTOR = getGroupSelector();

export const NON_TEXT_BLOCK_SELECTOR = getBlockSelector({ nonTextOnly: true });
export const FORMATTABLE_MEDIA_SELECTOR = getBlockSelector({
  formattableOnly: true,
  nonTextOnly: true,
});
