export const apiCore = async (
  endpoint: string,
  requestBody: Record<string, unknown>,
  method = "POST",
) => {
  const data = JSON.stringify({
    jsonrpc: "2.0",
    params: { ...requestBody },
  });
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rg${endpoint}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
    next: { revalidate: 0 },
  })
    .then((response) => {
      if (!response?.ok) {
        throw new Error("Network response was not ok");
      }
      return response?.json(); // Convert response to JSON
    })
    .then((responseData) => {
      return responseData; // Return the JSON data
    })
    .catch((error) => {
      return error;
    });
};

export const apiCoreXML = async (
  endpoint: string,
  requestBody: Record<string, unknown>,
  method = "POST",
) => {
  const data = JSON.stringify({
    jsonrpc: "2.0",
    params: { ...requestBody },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
        next: { revalidate: 0 },
      },
    );
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    // Try JSON first
    const text = await response.text();

    try {
      const json = JSON.parse(text);
      return json;
    } catch {
      // Not JSON → return raw XML string
      return { result: text };
    }
  } catch (error) {
    console.error("apiCoreXML error:", error);
    return { error: true, message: (error as Error).message };
  }
};

export const getPublicIP = async (): Promise<string> => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (err) {
    console.error("Failed to get IP:", err);
    return "";
  }
};
export const generatePaymentRefId = (prefix = "PAY"): any => {
  const timestamp = Date.now(); // milliseconds since epoch
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${prefix}${timestamp}${randomPart}`;
};

export const formatDateForApi = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
