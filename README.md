# Reveal or Die - Decentralized Game Template

A comprehensive template for building decentralized games that use commit+reveal mechanics and run on blockchain networks. This project demonstrates a fully functional on-chain game with a modern web interface, providing a foundation for building trustless, verifiable multiplayer games.

## 🎮 What is this?

**Reveal or Die** is both a working game and a development template. It showcases how to build decentralized games using commit+reveal mechanics to prevent front-running and ensure fair gameplay. The game features:

- **Avatar-based gameplay** where players control digital avatars
- **Multi-zone world** exploration and interaction
- **Time-based epochs** with commit and reveal phases
- **Trustless state management** via smart contracts
- **Real-time web interface** built with Svelte and Pixi.js

## 🏗️ Architecture

This monorepo contains three main components:

### 🌐 Web Application (`/web`)

- **Framework**: Svelte + SvelteKit
- **Graphics**: Pixi.js for high-performance 2D rendering
- **Blockchain**: Viem for Ethereum interactions
- **UI**: TailwindCSS with custom game controls
- **Features**: Real-time game visualization, wallet integration, tutorial system

### ⛓️ Smart Contracts (`/onchain/evm`)

- **Framework**: Hardhat v3 with TypeScript
- **Language**: Solidity ^0.8.0
- **Features**:
  - Commit-reveal game mechanics
  - Avatar management system
  - Zone-based world system
  - Epoch-based time management
  - Multi-network deployment support

### 🔧 Services (`/services`)

- **Bot**: Automated game interactions
- **Missiv**: Messaging service
- **Push Notifications**: Real-time updates

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** package manager
- **Zellij** (recommended for development workflow)

### Installation

You can use this repository in two ways:

#### Option 1: Use as GitHub Template

1. Click the **"Use this template"** button on the GitHub repository page
2. Give your new repository a name and description
3. Clone your new repository:

```bash
git clone <your-new-repository-url>
cd <your-project-name>
pnpm install
```

#### Option 2: Clone Directly

```bash
# Clone and setup
git clone <repository-url>
cd reveal-or-die
pnpm install
```

### Development

```bash
# Start full development environment (requires Zellij)
pnpm start

# Or start components individually
pnpm web:dev          # Start web application
pnpm onchain:dev      # Start smart contract development
```

### Building

```bash
# Build everything
pnpm build

# Build specific components
pnpm web:build        # Build web application
pnpm onchain:build    # Compile and export contracts
```

## 🎯 Game Mechanics

### Commit-Reveal Cycle

The game operates in epochs with two distinct phases:

1. **Commit Phase**: Players submit hashed moves (commitments)
2. **Reveal Phase**: Players reveal their actual moves and secrets

This mechanism ensures:

- **Fairness**: No player can see others' moves before committing
- **Integrity**: All moves are verifiable on-chain
- **Security**: Prevents front-running and manipulation

### Core Game Loop

1. **Purchase Avatar**: Buy or mint your game avatar
2. **Join Game**: Connect your wallet and enter the game world
3. **Commit Move**: During commit phase, submit your intended action
4. **Reveal Move**: During reveal phase, execute your committed action
5. **Progress**: Watch your avatar move and interact in real-time

### World System

- **Zones**: The game world is divided into zones for organization
- **Avatars**: Player-owned characters that can move and interact
- **Epochs**: Time-based rounds that govern game progression

## 🛠️ Development

### Project Structure

```
reveal-or-die/
├── web/                    # Web application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── onchain/   # Blockchain interactions
│   │   │   ├── render/    # Graphics and rendering
│   │   │   ├── ui/        # User interface components
│   │   │   └── ...
│   │   └── routes/        # SvelteKit routes
├── onchain/evm/           # Smart contracts
│   ├── src/
│   │   ├── game/         # Game logic contracts
│   │   ├── avatars/      # Avatar management
│   │   └── utils/        # Utility contracts
│   ├── deploy/           # Deployment scripts
│   └── deployments/      # Network deployments
├── services/             # Additional services
└── dev/                 # Development configuration
```

### Key Technologies

- **Frontend**: Svelte, SvelteKit, Pixi.js, TailwindCSS
- **Blockchain**: Solidity, Hardhat, Viem
- **Graphics**: Pixi.js
- **State Management**: Custom stores with reactive updates
- **Development**: Zellij for terminal multiplexing

### Scripts

```bash
# Development
pnpm web:dev              # Start web dev server
pnpm onchain:compile      # Compile contracts
pnpm test                 # Run contract tests

# Deployment
pnpm onchain:deploy       # Deploy to specified network
pnpm onchain:verify       # Verify contracts on explorer

# Utility
pnpm format              # Format code
pnpm format:check        # Check code formatting
```

## 📖 Contract Documentation

The smart contracts are well-documented and follow modern Solidity patterns:

- **`IGame`**: Main game interface defining core functionality
- **`UsingGameInternal`**: Internal game logic and state management
- **`GameCommit`**: Commit phase implementation
- **`GameReveal`**: Reveal phase implementation
- **`Avatars`**: NFT-based avatar system

## 🎨 Customization

This template is designed to be easily customized:

1. **Game Logic**: Modify contract functions in `/onchain/evm/src/game/`
2. **Graphics**: Update rendering components in `/web/src/lib/render/`
3. **UI/UX**: Customize components in `/web/src/lib/ui/`
4. **World Design**: Define zones and areas in contract data

## 🤝 Contributing

This template serves as a foundation for building various types of decentralized games. When extending or modifying:

1. Maintain the commit-reveal pattern for critical game mechanics
2. Keep all game state on-chain for verifiability
3. Ensure the web interface remains responsive and intuitive
4. Test thoroughly across different network configurations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to build your own decentralized game?** Start by customizing the game logic, graphics, and mechanics to create something unique while maintaining the trustless, verifiable foundation that makes decentralized gaming possible.
