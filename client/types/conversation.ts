import { IChatContext } from "./chat-context"

export interface IConversation {
	id: string
	chat_context: IChatContext
}

export type TConversation = {
	conversation: IConversation | undefined,
	setConversation: React.Dispatch<React.SetStateAction<IConversation | undefined>>,
}