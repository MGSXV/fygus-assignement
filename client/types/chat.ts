export interface IChat {
	context_id: string
	role: EChatRole
	content: string
	created_at: string
}

export enum EChatRole {
	USER = 'user',
	ASSISTANT = 'assistant',
}