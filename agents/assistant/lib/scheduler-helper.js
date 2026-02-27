export async function scheduleTask(task, cron) {
  console.log(`排程任務: ${task}`);
  console.log(`Cron 表達式: ${cron}`);

  return {
    action: "schedule_created",
    task,
    cron,
    status: "pending",
    nextRun: calculateNextRun(cron),
  };
}

function calculateNextRun(cron) {
  return new Date().toISOString();
}

export async function listTasks() {
  return {
    tasks: [],
    count: 0,
  };
}
