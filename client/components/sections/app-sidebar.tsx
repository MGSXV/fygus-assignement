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
						{data.navMain.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<a href={item.url} className="font-medium">
										{item.title}
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
