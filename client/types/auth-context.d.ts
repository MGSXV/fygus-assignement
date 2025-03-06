import { IUser } from "./current-user";

export type TAuthContext = {
	user: IUser | null;
	setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
	handleSetUser: Function
	logout: Function
	isLoading: boolean
};
