#!/bin/bash
set -e

# Patchin CLI installer
# Usage: curl -fsSL https://patchin.sh/install.sh | bash

INSTALL_DIR="${PATCHIN_INSTALL_DIR:-$HOME/.local/bin}"
REPO="weekend-systems/patchin"
VERSION="${PATCHIN_VERSION:-latest}"

# Detect OS and architecture
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$ARCH" in
  x86_64) ARCH="x64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

case "$OS" in
  darwin) PLATFORM="darwin-$ARCH" ;;
  linux) PLATFORM="linux-$ARCH" ;;
  *) echo "Unsupported OS: $OS"; exit 1 ;;
esac

BINARY_NAME="patchin-$PLATFORM"

normalize_version() {
  if [ "$VERSION" = "latest" ]; then
    echo "latest"
    return
  fi

  if [[ "$VERSION" == cli-v* ]]; then
    echo "$VERSION"
    return
  fi

  echo "cli-v$VERSION"
}

echo "Installing Patchin CLI for $PLATFORM..."

# Create install directory
mkdir -p "$INSTALL_DIR"

# Get download URL
RESOLVED_VERSION="$(normalize_version)"
if [ "$RESOLVED_VERSION" = "latest" ]; then
  DOWNLOAD_URL="https://github.com/$REPO/releases/latest/download/$BINARY_NAME"
  CHECKSUM_URL="https://github.com/$REPO/releases/latest/download/checksums.txt"
else
  DOWNLOAD_URL="https://github.com/$REPO/releases/download/$RESOLVED_VERSION/$BINARY_NAME"
  CHECKSUM_URL="https://github.com/$REPO/releases/download/$RESOLVED_VERSION/checksums.txt"
fi

# Download binary
echo "Downloading from $DOWNLOAD_URL..."
if command -v curl &> /dev/null; then
  HTTP_CODE=$(curl -fsSL -w "%{http_code}" -o "$INSTALL_DIR/patchin" "$DOWNLOAD_URL" 2>/dev/null) || true
elif command -v wget &> /dev/null; then
  wget -q -O "$INSTALL_DIR/patchin" "$DOWNLOAD_URL" 2>/dev/null && HTTP_CODE="200" || HTTP_CODE="404"
else
  echo "Error: curl or wget is required"
  exit 1
fi

# Check if download succeeded
if [ "$HTTP_CODE" != "200" ] || [ ! -s "$INSTALL_DIR/patchin" ]; then
  rm -f "$INSTALL_DIR/patchin"
  echo "Error: binary not available for $PLATFORM ($RESOLVED_VERSION)"
  exit 1
else
  # Verify checksum
  TMP_CHECKSUM="$(mktemp)"
  if command -v curl &> /dev/null; then
    curl -fsSL -o "$TMP_CHECKSUM" "$CHECKSUM_URL" 2>/dev/null || true
  else
    wget -q -O "$TMP_CHECKSUM" "$CHECKSUM_URL" 2>/dev/null || true
  fi

  if [ ! -s "$TMP_CHECKSUM" ]; then
    rm -f "$INSTALL_DIR/patchin" "$TMP_CHECKSUM"
    echo "Error: could not download checksums from $CHECKSUM_URL"
    exit 1
  fi

  EXPECTED_HASH="$(grep " $BINARY_NAME$" "$TMP_CHECKSUM" | awk '{print $1}')"
  if [ -z "$EXPECTED_HASH" ]; then
    rm -f "$INSTALL_DIR/patchin" "$TMP_CHECKSUM"
    echo "Error: checksum for $BINARY_NAME not found"
    exit 1
  fi

  if command -v sha256sum &> /dev/null; then
    ACTUAL_HASH="$(sha256sum "$INSTALL_DIR/patchin" | awk '{print $1}')"
  elif command -v shasum &> /dev/null; then
    ACTUAL_HASH="$(shasum -a 256 "$INSTALL_DIR/patchin" | awk '{print $1}')"
  else
    rm -f "$INSTALL_DIR/patchin" "$TMP_CHECKSUM"
    echo "Error: sha256sum or shasum is required for verification"
    exit 1
  fi

  rm -f "$TMP_CHECKSUM"

  if [ "$EXPECTED_HASH" != "$ACTUAL_HASH" ]; then
    rm -f "$INSTALL_DIR/patchin"
    echo "Error: checksum verification failed"
    exit 1
  fi

  # Make binary executable
  chmod +x "$INSTALL_DIR/patchin"

  echo ""
  echo "Patchin CLI installed successfully to $INSTALL_DIR/patchin"
  echo ""

  # Check if install dir is in PATH
  if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
    echo "Add the following to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
    echo ""
    echo "  export PATH=\"\$PATH:$INSTALL_DIR\""
    echo ""
  fi
fi

echo "Get started:"
echo "  patchin login     # Authenticate"
echo "  patchin accounts  # List connected accounts"
echo "  patchin --help    # Show all commands"
