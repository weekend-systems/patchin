import { pgTable, text, timestamp, boolean, integer, bigint } from "drizzle-orm/pg-core";

// Better Auth required tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Patchin-specific tables

// Connected OAuth accounts (external services like Gmail, Outlook, Spotify)
export const connectedAccount = pgTable("connected_account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // 'google', 'microsoft', 'spotify'
  providerAccountId: text("provider_account_id").notNull(),
  providerEmail: text("provider_email"),
  accessTokenEncrypted: text("access_token_encrypted").notNull(),
  refreshTokenEncrypted: text("refresh_token_encrypted"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  scope: text("scope"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// API keys for proxy access
export const apiKey = pgTable("api_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull().unique(), // SHA-256 hash of the key
  keyPrefix: text("key_prefix").notNull(), // First 8 chars for identification
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// API usage tracking
export const apiUsage = pgTable("api_usage", {
  id: text("id").primaryKey(),
  apiKeyId: text("api_key_id")
    .notNull()
    .references(() => apiKey.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  endpoint: text("endpoint").notNull(),
  statusCode: integer("status_code"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Device authorization for agent-initiated auth flow
export const deviceAuthorization = pgTable("device_authorization", {
  id: text("id").primaryKey(),
  deviceCodeHash: text("device_code_hash").notNull().unique(),
  deviceCodePrefix: text("device_code_prefix").notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  apiKeyId: text("api_key_id").references(() => apiKey.id, { onDelete: "set null" }),
  status: text("status").notNull().default("pending"), // pending | completed | expired
  apiKeyEncrypted: text("api_key_encrypted"), // Temporarily stores encrypted key for agent retrieval
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// GitHub App installations
export const githubInstallation = pgTable("github_installation", {
  id: text("id").primaryKey(),
  installationId: bigint("installation_id", { mode: "number" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountLogin: text("account_login").notNull(), // GitHub username or org name
  accountType: text("account_type").notNull(), // "User" or "Organization"
  repositorySelection: text("repository_selection").notNull(), // "all" or "selected"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
