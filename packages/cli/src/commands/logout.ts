import { clearConfig } from "../config.js";

export async function logout(): Promise<void> {
  clearConfig();
  console.log(JSON.stringify({ status: "logged_out" }));
}
