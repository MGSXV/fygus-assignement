export interface IChatContext {
	id: string
	name: string
	created_at: string
	updated_at: string
}

export type TChatContext = {
	contexts: IChatContext[],
	setContexts: React.Dispatch<React.SetStateAction<IChatContext[]>>,
}