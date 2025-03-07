"use client"

import { useAuth, useToast } from "@/hooks";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/sections/Login";
import Signup from "@/components/sections/Signup";
import { useRouter } from "next/navigation";

export default function Home() {

	const [tab, setTab] = useState("login");
	const { toast } = useToast();
	const auth = useAuth();
	const user = auth?.user || null;
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push("/chat");
		}
	}, [user, router]);

	const tabChange = () => setTab(tab === "login" ? "signup" : "login")

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="w-full h-full flex items-center justify-center">
				<Tabs defaultValue="login" value={tab} onValueChange={tabChange} id="form-container" className="w-[400px]">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger className="cursor-pointer" value="login">Login</TabsTrigger>
						<TabsTrigger className="cursor-pointer" value="signup">Signup</TabsTrigger>
					</TabsList>
					<Login toast={toast} />
					<Signup toast={toast} />
				</Tabs>
			</div>
		</div>
	)
}
