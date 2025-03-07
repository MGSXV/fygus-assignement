"use client"

import AddChat from "@/components/add-chat"
import { AppSidebar } from "@/components/sections/app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle";

export default function Chat() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 justify-between shrink-0 items-center gap-2 border-b">
					<div className="flex items-center gap-2 px-3">
						<SidebarTrigger className="cursor-pointer" />
						<AddChat className="cursor-pointer" />
					</div>
					<div className="flex items-center gap-2 px-3">
						<ModeToggle />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
