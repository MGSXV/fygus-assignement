"use client"

import AddChat from "@/components/add-chat"
import { AppSidebar } from "@/components/sections/app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatContextProvider } from "@/context";

export default function Chat() {

	const auth = useAuth();
	const user = auth?.user || null;
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push("/");
		}

	}, [user, router]);

	return (
		<ChatContextProvider>
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
						{/* <Chat /> */}
						<div>zbi</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</ChatContextProvider>
	)
}
