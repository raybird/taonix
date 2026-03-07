#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs/promises";
import { createRuntime } from "../../core/runtime/index.js";

export async function createCli(argv = process.argv) {
  const runtime = await createRuntime();
  const program = new Command();

  program.name("taonix").description("Taonix AI task runtime");

  program
    .command("run")
    .argument("<intent>")
    .action(async (intent) => {
      const result = await runtime.run(intent);
      console.log(JSON.stringify(result, null, 2));
    });

  program
    .command("task")
    .requiredOption("--file <file>")
    .action(async ({ file }) => {
      const content = await fs.readFile(file, "utf-8");
      const task = JSON.parse(content);
      const result = await runtime.runTask(task);
      console.log(JSON.stringify(result, null, 2));
    });

  program.command("capabilities").action(() => {
    console.log(JSON.stringify(runtime.listCapabilities(), null, 2));
  });

  program.command("doctor").action(() => {
    console.log(JSON.stringify(runtime.doctor(), null, 2));
  });

  await program.parseAsync(argv);
  return program;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await createCli();
}
