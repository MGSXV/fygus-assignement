"use client"
 
import { useChat, type UseChatOptions } from "@ai-sdk/react"
import { Chat } from "@/components/ui/chat"
import { useAuth } from "@/hooks"
import { FormEvent, useEffect, useRef, useState } from "react"
import { ChatService } from "@/lib/chat-service"
import { EChatRole } from "@/types"
import { useChatContext, useConversation } from "@/context"
import { useAxiosPrivate } from "@/config"
 
type ChatProps = {
	initialMessages?: UseChatOptions["initialMessages"]
	chat_id: string
}
 
export function ChatInterface(props: ChatProps) {
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit: aiHandleSubmit,
		append,
		stop,
		isLoading,
		setMessages,
		setInput,
	} = useChat({ initialMessages: props.initialMessages })
	const auth = useAuth()
	const user = auth?.user || null
	const chatService = useRef<ChatService | null>(null)
	const { contexts, setContexts } = useChatContext()
	const { conversation } = useConversation()
	const axios_private = useAxiosPrivate()
	
	useEffect(() => {
		if (!user)
			return
		const service = new ChatService(user.access)
		chatService.current = service
		service.onOpen(() => console.log("Connected to WebSocket"))
		service.onMessage((data: any) => {
			if (data.type === 'message') {
				append({
					id: data.message_id,
					content: data.message,
					role: data.role
				})
			}
		})
		service.onChatCreated((data: any) => {
			console.log("Chat created:", data)
		})
		service.onError((error: any) => {
			console.error("WebSocket error:", error)
		})
		service.onClose((event: any) => {
			console.log("Connection closed:", event)
		})

		return () => {
			service.socket?.close()
		}
	}, [user, props.chat_id, append])

	useEffect(() => {
		if (conversation) {
			if (conversation.id === 'new') {
                if (chatService.current) {
                    chatService.current.createNewChat()
                }
            } else {
                if (chatService.current) {
                    chatService.current.connectToChat(conversation.id)
                }
            }
			setMessages([])
			setInput('')
			axios_private.get(`api/chat/contexts/${conversation.id}/`).then((res) => {
				const messages = res.data.messages
				setMessages(messages)
			}).catch((err) => {
				console.error(err)
			})
		}
	}, [conversation])

	const handleSubmit = (event?: { preventDefault?: () => void }) => {
		event?.preventDefault?.()
		if (!input || !chatService.current) return
		
		chatService.current.sendMessage(input)
		setInput('')
		if (conversation?.id === 'new') {
			const cs = [...contexts, {
				id: conversation?.id || 'new',
				title: "New Chat",
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}].sort((a, b) => {
				return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
			})
			setContexts([...cs])
		}
	}
 
	return (
		<div className="flex h-full max-h-[500px] w-full">
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