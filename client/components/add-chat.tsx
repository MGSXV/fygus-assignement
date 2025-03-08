import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConversation } from "@/context";

export default function AddChat({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {

	const { conversation, setConversation } = useConversation()

	const handleClick = () => {
		setConversation({
			id: "new",
			chat_context: {
				id: "new",
				title: "New chat",
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}
		})
	}

	return (
		<Button variant="ghost"
			  size="icon"
			  onClick={handleClick}
			  className={cn("h-7 w-7", className)}>
			<Edit />
		</Button>
	)
}