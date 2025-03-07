export interface IUser {
	refresh: string
	access: string
	user: {
		id: number
		username: string
		first_name: string
		last_name: string
	}
}
