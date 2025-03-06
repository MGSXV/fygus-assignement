import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import logo from "@/assets/logo-max.svg"

const Signup = () => {

	return (
		<TabsContent value="signup">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-center">
						<a href="/">
							<img src={"logo"} alt="logo" className="no-underline" />
						</a>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 flex items-center justify-center h-[220px]">
					<h1 className="text-2xl font-bold select-none">
						Signup is disabled for now
					</h1>
				</CardContent>
			</Card>
		</TabsContent>
	)
}

export default Signup