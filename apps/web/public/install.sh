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

echo "Installing Patchin CLI for $PLATFORM..."

# Create install directory
mkdir -p "$INSTALL_DIR"

# Get download URL
if [ "$VERSION" = "latest" ]; then
  DOWNLOAD_URL="https://github.com/$REPO/releases/latest/download/$BINARY_NAME"
else
  DOWNLOAD_URL="https://github.com/$REPO/releases/download/$VERSION/$BINARY_NAME"
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
  echo ""
  echo "Binary not available yet. Falling back to npm install..."
  echo ""

  if command -v npm &> /dev/null; then
    npm install -g @patchin/cli
    echo ""
    echo "Patchin CLI installed successfully via npm!"
  else
    echo "Error: npm is required as binaries are not yet available for your platform"
    echo ""
    echo "Install Node.js from https://nodejs.org or via your package manager:"
    echo "  brew install node     # macOS"
    echo "  apt install nodejs    # Ubuntu/Debian"
    exit 1
  fi
else
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
