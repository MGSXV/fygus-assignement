export interface IUser {
	token: string
	user: {
		id: number
		username: string
		roles: string[]
	}
}
