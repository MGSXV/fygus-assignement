import { IChatContext, TChatContext } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

const ChatsContext = createContext<TChatContext>({
	contexts: [],
	setContexts: () => { },
})

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {

	const [contexts, setContexts] = useState<IChatContext[]>([]);

	return (
		<ChatsContext.Provider value={{ contexts, setContexts }}>
			{children}
		</ChatsContext.Provider>
	)
}

export const useChatContext = (): TChatContext => useContext(ChatsContext)