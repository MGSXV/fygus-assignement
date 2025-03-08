"use client"
 
import { useChat, type UseChatOptions } from "ai/react"
import { Chat } from "@/components/ui/chat"
import { useAuth } from "@/hooks"
import { useEffect } from "react"
import { ChatService } from "@/lib/chat-service"
 
type ChatProps = {
	initialMessages?: UseChatOptions["initialMessages"]
	chat_id: string
}
 
export function ChatInterface(props: ChatProps) {
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		append,
		stop,
		isLoading,
		setMessages,
	} = useChat(props)
	const auth = useAuth()
	const user = auth?.user || null

	useEffect(() => {
		if (!user)
			return
		const service = new ChatService(user.token)
			.connectToChat("chat-id")
			.onOpen(() => console.log("WebSocket connected"))
			.onMessage((data: any) => {
				append(data)
			})
			.onError((error: any) => {
				console.error(error)
			})
	}, [user])
 
	return (
		<div className="flex h-full w-full">
			<Chat
				className="grow"
				messages={messages}
				handleSubmit={handleSubmit}
				input={input}
				handleInputChange={handleInputChange}
				isGenerating={isLoading}
				stop={stop}
				append={append}
				setMessages={setMessages}
				suggestions={[
					"Generate a tasty vegan lasagna recipe for 3 people.",
					"Generate a list of 5 questions for a job interview for a software engineer.",
					"Who won the 2024 FIFA World Cup?",
				]}
			/>
		</div>
	)
}