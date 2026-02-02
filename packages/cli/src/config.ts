import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface Config {
  api_key?: string;
  base_url: string;
}

const CONFIG_DIR = path.join(os.homedir(), ".patchin");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
const DEFAULT_BASE_URL = "https://patchin.sh";

function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
}

export function loadConfig(): Config {
  const config: Config = {
    base_url: DEFAULT_BASE_URL,
  };

  // Load from file if exists
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const fileContent = fs.readFileSync(CONFIG_FILE, "utf-8");
      const fileConfig = JSON.parse(fileContent);
      if (fileConfig.api_key) config.api_key = fileConfig.api_key;
      if (fileConfig.base_url) config.base_url = fileConfig.base_url;
    } catch {
      // Ignore parse errors, use defaults
    }
  }

  // Environment overrides
  if (process.env.PATCHIN_API_KEY) {
    config.api_key = process.env.PATCHIN_API_KEY;
  }
  if (process.env.PATCHIN_BASE_URL) {
    config.base_url = process.env.PATCHIN_BASE_URL;
  }

  return config;
}

export function saveConfig(config: Partial<Config>): void {
  ensureConfigDir();

  let existing: Partial<Config> = {};
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      existing = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    } catch {
      // Ignore parse errors
    }
  }

  const merged = { ...existing, ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", {
    mode: 0o600,
  });
}

export function clearConfig(): void {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
}

export function getApiKey(): string | undefined {
  return loadConfig().api_key;
}

export function getBaseUrl(): string {
  return loadConfig().base_url;
}
