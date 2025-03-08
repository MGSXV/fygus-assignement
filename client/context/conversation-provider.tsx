import { IConversation, TConversation } from "@/types";
import { createContext, ReactNode, useContext } from "react";

const ChatsContext = createContext<TConversation>({
	conversation: undefined,
	setConversation: () => { },
})

export const ConversationProvider = ({ children }: { children: ReactNode }) => {

	return (
		<ChatsContext.Provider value={{ conversation: undefined, setConversation: () => { } }}>
			{children}
		</ChatsContext.Provider>
	)
}

export const useConversation = (): TConversation => useContext(ChatsContext)