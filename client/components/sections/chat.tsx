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
	const { logout } = useAuth()
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
				setMessages((prevMessages) => {
					const messageExists = prevMessages.some(
						(msg) => typeof msg.id === "string" && msg.id.startsWith("temp-") && msg.content === data.message
					)
		
					if (messageExists) {
						return prevMessages.map((msg) =>
							typeof msg.id === "string" && msg.id.startsWith("temp-") && msg.content === data.message
								? { ...msg, id: data.message_id } // Update ID
								: msg
						)
					} else {
						return [...prevMessages, {
							id: data.message_id,
							content: data.message,
							role: data.role,
						}]
					}
				})
			}
		})
	
		service.onChatCreated((data: any) => {
			console.log("Chat created:")
		})
		service.onError((error: any) => {
			// console.error("WebSocket error")
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
					setMessages([])
					setInput('')
                }
            } else {
                if (chatService.current) {
                    chatService.current.connectToChat(conversation.id)
                }
				setMessages([])
				setInput('')
				axios_private.get(`api/chat/contexts/${conversation.id}/`).then((res) => {
					const messages = res.data.messages
					setMessages(messages)
				}).catch((err) => {
					if (err.status === 401) {
						logout()
					}
				})
            }
		} else {
			if (chatService.current) {
				chatService.current.createNewChat()
				setMessages([])
				setInput('')
			}
		}
	}, [conversation])

	const handleSubmit = (event?: { preventDefault?: () => void }) => {
		event?.preventDefault?.()
		if (!input || !chatService.current) return
		const tempId = `temp-${Date.now()}`
		append({
			id: tempId,
			content: input,
			role: EChatRole.USER,
		})
		// aiHandleSubmit()
		chatService.current.sendMessage(input)
		setInput('')
		if (!conversation || conversation.id === 'new') {
			const cs = [...contexts, {
				id: tempId,
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
		<div className="flex h-full w-full items-center justify-center">
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
					suggestions={[]}
				/>
			</div>
		</div>
	)
}