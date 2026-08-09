import env from "@src/config/env";
import { normalizeE164 } from "../utils";
import { evolutionApiLogger } from "../server";

interface MessageDetails {
  zoneName: string;
  serviceName: string;
  description: string | null;
  mixeiroName: string | null;
}

const evolutionServerUrl = env("EVOLUTION_SERVER_URL");
const evolutionAuthenticationApiKey = env("EVOLUTION_AUTHENTICATION_API_KEY");

export async function sendTextMessageAboutBisno(
  mobile: string,
  instanceName: string,
  body: MessageDetails,
) {
  const firstName = body?.mixeiroName?.split(" ")?.[0] || "Mixeiro";

  const message =
    `${firstName}, nas calmas? Entrou um bisno.\n\n` +
    `Serviço: ${body.serviceName}\n` +
    `Zona: ${body.zoneName}\n` +
    `Descrição: ${body?.description || ""}\n\n` +
    `Interessado? Responde *Sim* para receberes os contactos do cliente.`;

  try {
    const mobileNormalized = normalizeE164(mobile);
    const response = await fetch(
      `${evolutionServerUrl}/message/sendText/${instanceName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: evolutionAuthenticationApiKey,
        },
        body: JSON.stringify({
          number: mobileNormalized,
          text: message,
          delay: 800,
        }),
      },
    );

    const data = await response.json();
    evolutionApiLogger.info({ data: body }, `Message sent`);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    evolutionApiLogger.error(
      { error: message, data: body },
      `Failed to send message`,
    );
  }
}

interface MixeiroClosingMessageDetails {
  mixeiroName: string;
  customerName: string;
  customerMobile: string;
  serviceName: string;
  zoneName: string;
}

export async function sendTextMessageBisnoClosedToMixeiro(
  mobile: string,
  instanceName: string,
  body: MixeiroClosingMessageDetails,
) {
  const mixeiroFirstName = body.mixeiroName.split(" ")[0];
  const customerFirstName = body.customerName.split(" ")[0];

  const whatsappLink = `https://wa.me/${normalizeE164(body.customerMobile)}?text=${encodeURIComponent(
    `Olá, ${customerFirstName}. Vim por intermédio da Bisno. Sou o ${mixeiroFirstName} (${body.serviceName}).`,
  )}`;

  const message =
    `${mixeiroFirstName}, o bisno é teu! 🤝\n\n` +
    `*Serviço:* ${body.serviceName}\n` +
    `*Zona:* ${body.zoneName}\n` +
    `*Cliente:* ${body.customerName}\n\n` +
    `Clica no link abaixo para falar directamente com o cliente:\n` +
    `${whatsappLink}\n\n` +
    `Bom bisno.`;

  try {
    const mobileNormalized = normalizeE164(mobile);
    const response = await fetch(
      `${evolutionServerUrl}/message/sendText/${instanceName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: evolutionAuthenticationApiKey,
        },
        body: JSON.stringify({
          number: mobileNormalized,
          text: message,
          delay: 800,
        }),
      },
    );

    const data = await response.json();
    evolutionApiLogger.info({ data: body }, "Message sent to mixeiro");
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    evolutionApiLogger.error(
      { error: message, data: body },
      "Failed to send message to mixeiro",
    );
  }
}

interface ClientClosingMessageDetails {
  customerName: string;
  mixeiroName: string;
  serviceName: string;
}

export async function sendTextMessageBisnoClosedToClient(
  mobile: string,
  instanceName: string,
  body: ClientClosingMessageDetails,
) {
  const clientFirstName = body.customerName.split(" ")[0];
  // const mixeiroFirstName = body.mixeiroName.split(" ")[0];

  const message =
    `${clientFirstName}, encontrámos alguém para si.\n\n` +
    `*Serviço:* ${body.serviceName}\n` +
    `*Mixeiro:* ${body.customerName}\n\n` +
    `Em breve entrará em contacto consigo pelo WhatsApp.\n` +
    `Obrigado por usar a Bisno.`;

  try {
    const mobileNormalized = normalizeE164(mobile);
    const response = await fetch(
      `${evolutionServerUrl}/message/sendText/${instanceName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: evolutionAuthenticationApiKey,
        },
        body: JSON.stringify({
          number: mobileNormalized,
          text: message,
          delay: 800,
        }),
      },
    );

    const data = await response.json();
    evolutionApiLogger.info({ data: body }, "Message sent to client");
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    evolutionApiLogger.error(
      { error: message, data: body },
      "Failed to send message to client",
    );
  }
}
