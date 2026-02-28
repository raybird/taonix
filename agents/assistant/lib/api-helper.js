export async function callAPI(url, options = {}) {
  const { method = "GET", headers = {}, body = null } = options;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
      ok: response.ok,
    };
  } catch (error) {
    return {
      error: error.message,
      ok: false,
    };
  }
}

export async function createEndpoint(path, handler) {
  return {
    path,
    method: "POST",
    handler: handler.toString(),
    registeredAt: new Date().toISOString(),
  };
}

export async function listEndpoints() {
  return {
    endpoints: [],
    count: 0,
  };
}

export async function webhookTrigger(url, event, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, payload }),
    });

    return {
      success: response.ok,
      status: response.status,
      event,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      event,
    };
  }
}
