-- Add is_default column for multi-account support
ALTER TABLE connected_account ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT false;

-- Set existing accounts as default (one per user/provider)
UPDATE connected_account SET is_default = true WHERE is_default = false;

-- Add unique constraint on user_id + provider + provider_account_id
CREATE UNIQUE INDEX IF NOT EXISTS connected_account_user_provider_account
  ON connected_account(user_id, provider, provider_account_id);
