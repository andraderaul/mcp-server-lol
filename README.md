# MCP Server League of Legends

Servidor MCP (Model Context Protocol) para acessar dados dos esports de League of Legends em tempo real. Fornece informações sobre partidas ao vivo, cronogramas, ligas, detalhes de eventos e VODs através de uma interface padronizada.

## 🎯 Funcionalidades

- **🔴 Partidas ao vivo**: Monitore jogos happening agora
- **📅 Cronograma**: Visualize próximas partidas e eventos
- **🏆 Ligas**: Explore todas as ligas disponíveis por região
- **📊 Detalhes de eventos**: Informações completas sobre partidas específicas
- **📺 VODs**: Acesse gravações de partidas finalizadas
- **⏭️ Próximas partidas**: Lista de jogos futuros

## 🚀 Início Rápido

### 1. Instalação

```bash
# Clone e instale dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### 2. Configuração

Edite o arquivo `.env` com suas configurações:

```bash
# League of Legends eSports API Configuration
LOL_API_BASE_URL=https://esports-api.lolesports.com
LOL_API_KEY=your_api_key_here

# Server Configuration
HTTP_TIMEOUT=10000
```

### 3. Build e Execução

```bash
# Compilar
npm run build

# Executar
npm start

# Ou desenvolvimento com watch
npm run dev
```

## ⚙️ Configuração no Cursor

Para usar este servidor MCP no Cursor, configure o arquivo `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "league-of-legends": {
      "command": "node",
      "args": ["./dist/index.js"],
      "cwd": "/path/to/your/mcp-server-lol",
      "env": {
        "NODE_ENV": "production",
        "LOL_API_BASE_URL": "https://esports-api.lolesports.com",
        "LOL_API_KEY": ""
      }
    }
  }
}
```

> **Nota**: Substitua `/path/to/your/mcp-server-lol` pelo caminho real do projeto no seu sistema.

## 🛠️ Ferramentas Disponíveis

| Ferramenta             | Descrição                     | Parâmetros                        |
| ---------------------- | ----------------------------- | --------------------------------- |
| `get-schedule`         | Cronograma de esports do LoL  | `language`, `leagueId` (opcional) |
| `get-live-matches`     | Partidas ao vivo              | `language`                        |
| `get-leagues`          | Ligas disponíveis             | `language`, `region` (opcional)   |
| `get-event-details`    | Detalhes de evento específico | `eventId`, `language`             |
| `get-match-vods`       | VODs de partida               | `eventId`, `language`             |
| `get-upcoming-matches` | Próximas partidas             | `language`, `limit`               |

### Idiomas Suportados

`en-US`, `es-ES`, `fr-FR`, `de-DE`, `it-IT`, `pt-BR`, `ru-RU`, `tr-TR`, `ja-JP`, `ko-KR`, `zh-CN`, `zh-TW`

## 📁 Estrutura do Projeto

```
src/
├── index.ts              # Servidor MCP principal
├── core/                 # Configurações base
│   ├── config.ts         # Gerenciamento de env vars
│   └── http-client.ts    # Cliente HTTP customizado
├── domains/              # Funcionalidades específicas
│   └── live/             # API de League of Legends
│       ├── tools.ts      # Ferramentas MCP
│       ├── service.ts    # Lógica de negócio
│       ├── types.ts      # Tipos TypeScript
│       └── index.ts      # Exports
└── examples/             # Exemplos de uso
```

## 🔧 Scripts NPM

| Script           | Descrição                          |
| ---------------- | ---------------------------------- |
| `npm run build`  | Compila TypeScript para JavaScript |
| `npm run dev`    | Desenvolvimento com watch mode     |
| `npm start`      | Executa o servidor compilado       |
| `npm run lint`   | Executa linting do código          |
| `npm run format` | Formata código com Biome           |
| `npm run check`  | Lint + format completo             |

## 🌐 Stack Tecnológica

- **Runtime**: Node.js com ESM
- **Linguagem**: TypeScript
- **Protocolo**: MCP (Model Context Protocol)
- **Validação**: Zod com schema JSON
- **Code Quality**: Biome (linting + formatting)
- **HTTP Client**: Fetch customizado
- **Gerenciamento de Env**: dotenv

## 🔒 Segurança

- Todas as configurações sensíveis são carregadas via variáveis de ambiente
- Arquivo `.env` incluído no `.gitignore`
- Validação obrigatória de variáveis críticas
- Timeouts configuráveis para requisições HTTP

## 📄 Licença

ISC
