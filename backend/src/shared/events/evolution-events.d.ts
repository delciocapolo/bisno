type IEventNames =
  | "messages.upsert"
  | "contacts.update"
  | "chats.update"
  | "messages.update"
  | "messages.update"
  | "chats.upsert";

export interface IEvolutionMessageKey {
  remoteJid: string;
  remoteJidAlt?: string;
  fromMe: boolean;
  id: string;
  participant?: string;
  addressingMode?: string;
}

export interface IEvolutionMessageData {
  key: IEvolutionMessageKey;
  pushName?: string;
  status?: "SERVER_ACK" | "DELIVERY_ACK" | "READ" | "PENDING" | string;
  message: {
    conversation?: string;
    // Outros tipos de mensagem podem ser adicionados depois
    [key: string]: any;
  };
  messageType:
    "conversation" | "imageMessage" | "videoMessage" | "audioMessage" | string;
  messageTimestamp: number;
  instanceId?: string;
  source?: string;
}

export type IEvolutionConnectionUpdateData =
  | { instance: string; state: "connecting"; statusReason: 200 }
  | { instance: string; state: "close"; statusReason: 401 }
  | {
      wuid: string;
      state: "open";
      instance: string;
      profileName: string;
      profilePictureUrl: string;
      statusReason: 200;
    };

export interface IEvolutionEventPayload {
  event: IEventNames; // ex: 'messages.upsert'
  instance: string; // nome da instância
  data: IEvolutionMessageData;
  server_url: string;
  date_time: string; // ISO string
  sender: string;
  apikey: string | null;
}

// messages.upsert event
export interface IMessageUpsertEvent extends IEvolutionEventPayload {
  event: "messages.upsert";
  data: IEvolutionMessageData;
}

// connection.update event
export interface IConnectionUpdateEvent extends IEvolutionEventPayload {
  event: "connection.update";
  data: IEvolutionConnectionUpdateData;
}
