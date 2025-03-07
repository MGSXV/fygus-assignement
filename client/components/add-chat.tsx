import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AddChat({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {

	return (
		<Button variant="ghost"
			  size="icon"
			  className={cn("h-7 w-7", className)}>
			<Edit />
		</Button>
	)
}