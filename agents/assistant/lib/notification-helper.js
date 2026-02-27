export async function sendNotification(title, message, type = "info") {
  const validTypes = ["info", "warning", "error", "success"];
  const notificationType = validTypes.includes(type) ? type : "info";

  return {
    id: generateId(),
    title,
    message,
    type: notificationType,
    timestamp: new Date().toISOString(),
    status: "sent",
  };
}

export async function scheduleReminder(title, message, time) {
  return {
    id: generateId(),
    title,
    message,
    scheduledTime: time,
    status: "scheduled",
    createdAt: new Date().toISOString(),
  };
}

export async function listReminders() {
  return {
    reminders: [],
    count: 0,
  };
}

function generateId() {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function notifyByChannel(channel, title, message) {
  const channels = {
    telegram: sendTelegram,
    email: sendEmail,
    console: sendConsole,
  };

  const sender = channels[channel] || channels.console;
  return await sender(title, message);
}

async function sendTelegram(title, message) {
  return {
    channel: "telegram",
    title,
    message,
    status: "sent",
    timestamp: new Date().toISOString(),
  };
}

async function sendEmail(title, message) {
  return {
    channel: "email",
    title,
    message,
    status: "sent",
    timestamp: new Date().toISOString(),
  };
}

async function sendConsole(title, message) {
  return {
    channel: "console",
    title,
    message,
    status: "displayed",
    timestamp: new Date().toISOString(),
  };
}
