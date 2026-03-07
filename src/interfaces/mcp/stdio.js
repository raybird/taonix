#!/usr/bin/env node

import { createMcpHub } from "./index.js";

const hub = await createMcpHub();
await hub.startStdioServer();
