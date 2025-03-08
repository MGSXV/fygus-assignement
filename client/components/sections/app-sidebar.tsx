	"use client"

	import * as React from "react"

	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarRail,
	} from "@/components/ui/sidebar"
	import Image from "next/image"
	import logo_light from "@/assets/logo-light.png"
	import Link from "next/link"
	import { useAuth } from "@/hooks"
	import { NavUser } from "./nav-user"
	import { useAxiosPrivate } from "@/config"
	import { useEffect } from "react"
	import { useChatContext, useConversation } from "@/context"
	import { IChatContext } from "@/types"

	export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

		const { user } = useAuth()
		const axios_private = useAxiosPrivate()
		const { contexts, setContexts } = useChatContext()
		const { setConversation } = useConversation()

		const get_chat_context = async () => {
			axios_private.get("api/chat/contexts/").then((res) => {
				const sorted = res.data.sort((a: any, b: any) => {
					return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
				})
				setContexts([...sorted])
			}).catch((err) => { })
		}

		const handle_click = (item: IChatContext) => {
			setConversation({
				id: item.id,
				chat_context: item
			})
		}


		useEffect(() => {
			if (user) {
				get_chat_context()
			}
		}, [user])

		return (
			<Sidebar {...props}>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild>
								<Link href="/">
						<Image src={logo_light} alt="Logo" width={100} height={100} />
					</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu>
							{
								contexts.length === 0 && (
									<span className="text-muted">No chat yet...</span>
								)
							}
							{contexts.map((item) => (
								<SidebarMenuItem key={item.id}>
									<SidebarMenuButton asChild>
										<span onClick={() => handle_click(item)}
										className="font-medium select-none cursor-pointer">
											{item.title}
										</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				<SidebarRail />
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			</Sidebar>
		)
	}
