
const ULTRAMSG_API_URL = process.env.ULTRAMSG_API_URL || "https://api.ultramsg.com/instance154188/";
const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN || "69gmosmwo8sywz8g";

interface SendMessageParams {
  to: string;
  body: string;
}

interface UltraMsgResponse {
  sent: boolean;
  message?: string;
  id?: string;
}

export async function sendWhatsAppMessage({ to, body }: SendMessageParams): Promise<UltraMsgResponse> {
  const url = `${ULTRAMSG_API_URL}messages/chat`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: ULTRAMSG_TOKEN,
      to: to,
      body: body,
    }),
  });

  if (!response.ok) {
    throw new Error(`UltraMsg API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
