import React, { createContext, useEffect, useState } from "react";
import { IUser, TAuthContext } from "@/types";

const AuthContext = createContext<TAuthContext>({
	user: null,
	setUser: () => {},
	handleSetUser: () => {},
	logout: () => {},
	isLoading: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
        const stored_user = localStorage.getItem('user');
        if (stored_user && stored_user !== 'undefined') {
            const parsedUser = JSON.parse(stored_user);
			const u1 = JSON.stringify(parsedUser?.user)
			const u2 = JSON.stringify(user?.user)
            if (!user || u1 !== u2) {
                setUser(parsedUser);
            }
        }
        setIsLoading(false);
    }, []);

	const handleSetUser = (userData: IUser) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null)
		localStorage.removeItem('user')
	}

	return (
		<AuthContext.Provider value={{user, setUser, logout, handleSetUser, isLoading}}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext };