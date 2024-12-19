# PoE Trade Assistant

A modern desktop application built with Tauri, React, and TypeScript for Path of Exile trading.

## Features

- Quick price checking with global hotkeys
- Item parsing from clipboard
- Real-time market data integration
- Modern, responsive UI with TailwindCSS
- Cross-platform support (Windows, macOS, Linux)

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Lucide Icons
- **Backend**: Tauri 2.0, Rust
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Rust toolchain
- Visual Studio Code (recommended)

## Development Setup

1. Install dependencies:
```bash:README.md
pnpm install
```

2. Start development server:
```bash:README.md
pnpm tauri dev
```

3. Build for production:
```bash:README.md
pnpm tauri build
```

## IDE Setup

Recommended VS Code extensions:
- Tauri
- rust-analyzer
- ESLint
- Prettier
- Tailwind CSS IntelliSense

## Project Structure

poe-trade/ 
├── src/ # React frontend source 
├── src-tauri/ # Rust backend source 
├── public/ # Static assets 
├── vite.config.ts # Vite configuration 
└── tailwind.config.js # Tailwind configuration

# To-Do
- [ ] Add a feature to search for items by name
- [ ] Implement price check system for all available items in the game. (Currently it works only for rare items)
- [ ] Frontend polishing.


## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Acknowledgments

- [Path of Exile](https://www.pathofexile.com/)
- [Tauri Apps](https://tauri.app/)