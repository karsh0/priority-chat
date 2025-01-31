
export enum SupportedMessage {
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT"
}

export type MessagePayload = {
    roomId: string,
    name: string,
    message: string,
    upvotes: number
}

export type IncomingMessage = {
    type: SupportedMessage.AddChat,
    payload: MessagePayload  
} | {
    type: SupportedMessage.UpdateChat,
    payload: MessagePayload  
} 