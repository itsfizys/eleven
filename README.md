# Eleven

A feature-rich, high-performance Discord music bot  built with **TypeScript**, **discord.js v14**, **Shoukaku** (Lavalink), **PostgreSQL**, and **Redis**.

Featuring hybrid sharding, audio filters, custom playlist management, autoplay, 24/7 mode, and Spotify integration.

---

## Features

- **Stable Audio Streaming**: Powered by [Lavalink](https://github.com/lavalink-devs/Lavalink) and [Shoukaku](https://github.com/shipgirlproject/Shoukaku).
- **Scalable Architecture**: Multi-cluster hybrid sharding via [discord-hybrid-sharding](https://github.com/Deividas/discord-hybrid-sharding).
- **Audio Filters**: Bassboost, nightcore, vaporwave, 8D, tremolo, and custom equalizer settings.
- **Queue Management**: Autoplay, fairplay queue mode, duplicate removal, track seeking, loop, and shuffle.
- **Database & Cache**: PostgreSQL for user/server data, playlists, and settings; Redis for fast caching.
- **Personal Library**: Custom playlists, track favorites, listening history, and AI playlist generator.
- **Integrations**: Spotify playlist support, Top.gg vote webhooks, and premium tier handling.
- **Server Customization**: 24/7 voice channel mode, default volume, fairplay roles, and guild-level configs.

---

## Prerequisites

Before running the bot, ensure you have:

- [Node.js](https://nodejs.org/) `>= 20.0.0` (or [Bun](https://bun.sh/))
- [PostgreSQL](https://www.postgresql.org/) 16+
- [Redis](https://redis.io/) 7+
- A running [Lavalink v4](https://github.com/lavalink-devs/Lavalink) node
- A [Discord Bot Application](https://discord.com/developers/applications) with bot token & client ID

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/openUwU/eleven.git
cd eleven
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
| :--- | :--- |
| `DISCORD_TOKEN` | Discord Bot Token from Developer Portal |
| `DISCORD_CLIENT_ID` | Discord Bot Application Client ID |
| `SUPPORT_LINK` | Discord invite link to your support server (`https://discord.com/invite/Ez4gCJQDxB`) |
| `NODE_ENV` | `development` or `production` |
| `POSTGRES_URL` | PostgreSQL connection string (`postgres://user:pass@host:5432/db`) |
| `REDIS_URL` | Redis connection URL (`redis://host:6379`) |
| `LAVALINK_HOST` | Lavalink server host / IP |
| `LAVALINK_PORT` | Lavalink server port (e.g. `2333`) |
| `LAVALINK_AUTH` | Lavalink node password |
| `LAVALINK_SECURE` | Set to `true` if Lavalink uses SSL/WSS, otherwise `false` |
| `LAVALINK_NODE_NAME` | Name/identifier for Lavalink node (default: `Main`) |
| `WEBHOOK_PORT` | Port for internal webhook server (e.g. `6969`) |
| `TOPGG_WEBHOOK_SECRET` | Secret key for Top.gg vote webhooks |
| `PREMIUM_WEBHOOK_SECRET`| Secret key for premium webhooks |
| `backupWebhook` | Discord webhook URL for database backup notifications |

### 3. Run Database Migrations

Apply pending SQL schema migrations to your PostgreSQL database:

```bash
npm run migrate
```

Optional preview without applying:
```bash
npx tsx --env-file=.env scripts/migrate.ts --dry
```

### 4. Run the Bot

#### Development Mode:
```bash
npm run dev
```

#### Production Mode:
```bash
npm run build
npm run start
```

---

## Docker Setup

You can deploy the entire stack (PostgreSQL, Redis, migrations, Portainer, and bot) using Docker Compose:

1. Update `.env` with your desired database credentials and bot configuration.
2. Run:

```bash
docker compose up -d
```

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the bot in development mode with `tsx` |
| `npm run build` | Compiles TypeScript source to `dist/` |
| `npm run start` | Runs the compiled bot from `dist/index.js` |
| `npm run migrate` | Executes all pending database schema migrations |
| `npm run typecheck` | Validates TypeScript types without emitting code |
| `npm run lint` | Runs Biome linter on `./src` |
| `npm run format` | Auto-formats code using Biome |

---

## Common Commands

| Category | Commands |
| :--- | :--- |
| **Music** | `/play`, `/pause`, `/resume`, `/skip`, `/previous`, `/queue`, `/nowplaying`, `/seek`, `/volume`, `/shuffle`, `/loop`, `/filter`, `/stop`, `/clearqueue` |
| **Library** | `/favourite`, `/favourites`, `/history`, `/playlistcreate`, `/playlistadd`, `/playlisttracks`, `/playlistlist`, `/playlistai` |
| **Config** | `/config`, `/twentyfour_seven`, `/defaultvolume`, `/defaultautoplay`, `/defaultfairplay`, `/fairplayrole` |
| **General** | `/help`, `/botinfo`, `/ping`, `/support`, `/invite`, `/vote`, `/links`, `/documentation` |

---

## Support & Resources

- **Support Server**: Join our Discord for support, updates, and help: [Discord Support Server](https://discord.com/invite/Ez4gCJQDxB)
- **Documentation**: [https://ele1.mintlify.app/](https://ele1.mintlify.app/)
- **Vote on Top.gg**: [Top.gg Bot Page](https://top.gg/bot/1277525844319014955/vote)
- **Legal**: [Privacy Policy](https://ele1.mintlify.site/legal/privacy) - [Terms of Service](https://ele1.mintlify.site/legal/terms)

---

## License & Attribution

This project is licensed under the **OpenUwU Source-Available License (OUSL) v1**. See the [LICENSE](LICENSE) file for details.

### Credits
- **Created by**: [@mooncarli](https://github.com/mooncarli), [@bre4d777](https://github.com/bre4d777), [@dev-prayag](https://github.com/dev-prayag), and [OpenUwU](https://github.com/openUwU) Contributors.

### Acknowledgements
- **[NodeLink](https://github.com/PerformanC/NodeLink)**: For the lyrics fetching implementation ported into the `/lyrics` command.
