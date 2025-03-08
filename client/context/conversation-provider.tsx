import { IConversation, TConversation } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

const ChatsContext = createContext<TConversation>({
	conversation: undefined,
	setConversation: () => { },
})

export const ConversationProvider = ({ children }: { children: ReactNode }) => {

	const [conversation, setConversation] = useState<IConversation | undefined>(undefined)

	return (
		<ChatsContext.Provider value={{ conversation, setConversation }}>
			{children}
		</ChatsContext.Provider>
	)
}

export const useConversation = (): TConversation => useContext(ChatsContext)