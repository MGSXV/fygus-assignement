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
import { useChatContext } from "@/context"

// This is sample data.
const data = {
	navMain: [
		{
			title: "Chat context 1",
			url: "#"
		},
		{
			title: "Chat context 2",
			url: "#",
		},
		{
			title: "Chat context 3",
			url: "#",
		},
		{
			title: "Chat context 4",
			url: "#",
		},
		{
			title: "Chat context 6",
			url: "#",
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

	const { user } = useAuth()
	const axios_private = useAxiosPrivate()
	const { contexts, setContexts } = useChatContext()

	const get_chat_context = async () => {
		axios_private.get("api/chat/contexts/").then((res) => {
			setContexts([...res.data])
			console.log(res.data)
		}).catch((err) => {
			
		}).then(() => {
			// always executed
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
							contexts.length <= 0 && (
								<span className="text-muted">No chat yet...</span>
							)
						}
						{contexts.map((item) => (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton asChild>
									<a href={item.id} className="font-medium">
										{item.name}
									</a>
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
