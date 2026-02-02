#!/bin/bash
set -e

# Patchin CLI installer
# Usage: curl -fsSL https://patchin.sh/install.sh | bash

INSTALL_DIR="${PATCHIN_INSTALL_DIR:-$HOME/.patchin/bin}"
REPO="patchin/cli"

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

echo "Installing Patchin CLI..."

# Create install directory
mkdir -p "$INSTALL_DIR"

# For now, install via npm (will switch to binary downloads later)
if command -v npm &> /dev/null; then
  npm install -g @patchin/cli
  echo ""
  echo "Patchin CLI installed successfully!"
  echo ""
  echo "Get started:"
  echo "  patchin login     # Authenticate"
  echo "  patchin accounts  # List connected accounts"
  echo "  patchin --help    # Show all commands"
else
  echo "Error: npm is required to install the Patchin CLI"
  echo ""
  echo "Install Node.js from https://nodejs.org or via your package manager:"
  echo "  brew install node     # macOS"
  echo "  apt install nodejs    # Ubuntu/Debian"
  exit 1
fi
