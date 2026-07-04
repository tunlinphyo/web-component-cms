const configOptions = new Map();

export function registerConfig(config) {
  for (const [key, options] of Object.entries(config)) {
    configOptions.set(key, options);
  }
}

export function resolveConfigOptions(key, fallback = []) {
  return configOptions.get(key) ?? fallback;
}
