"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { SubmitHandler, useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { axios } from "@/config"
import { IUser } from "@/types"
import { useAuth } from "@/hooks"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import logo_light from "@/assets/logo-light.png"

const LOGIN_ENDPOINT = "/api/auth/login/"

const USERNAME_REGEX = /^[A-Za-z0-9]+$/i
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_#@$%]).+$/

interface ILogin {
	username: string
	password: string
}

const Login = ({ toast }: { toast: any }) => {

	const { register, handleSubmit, formState: { errors } } = useForm<ILogin>()
	const [isLoading, setIsLoading] = useState(false)
	const [loginResponse, setLoginResponse] = useState<IUser | null>(null);
	const login_button = useRef<HTMLButtonElement>(null)
	const { handleSetUser } = useAuth()
	const router = useRouter()
	const from = usePathname()

	const login = async (data: ILogin) => {
		setIsLoading(true)
		axios.post(LOGIN_ENDPOINT, {
			username: data.username,
			password: data.password
		}, {
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true
		}).then((response) => {
			setLoginResponse(response.data)
			toast({
				title: "success",
				description: "login successful",
				variant: "success"
			})
		}).catch((error) => {
			toast({
				title: "Error",
				description: error?.response?.data?.error || 'An error occurred',
				variant: "destructive",
			})
		}).finally(() => {
			setIsLoading(false)
			login_button.current?.focus()
		})
	}

    useEffect(() => {
        if (loginResponse) {
            handleSetUser(loginResponse)
			router.push(from)
        }
    }, [loginResponse, handleSetUser, router, from]);

	const { user } = useAuth()
	useEffect(() => {
		if (user)
			router.push('/chat')
	}, [user])

	const onSubmit: SubmitHandler<ILogin> = (data) => login(data)

	return (
		<TabsContent value="login">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-center">
						<Link href="/">
							<Image src={logo_light} alt="logo" width={100} height={100}
								 className="no-underline" />
						</Link>
					</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<CardContent className="space-y-3">
						<div className="space-y-1">
							<Label htmlFor="username">
								Username
								<span className="text-red-700">{` *`}</span>
							</Label>
							<Input id="username" disabled={isLoading} placeholder="username..."
								{...register('username', { required: true, minLength: 4, maxLength: 20, pattern: USERNAME_REGEX  })}
								aria-invalid={errors.username ? true : false }
								value="testing1" />
						</div>
						<div className="space-y-1">
							<Label htmlFor="password">
								Password
								<span className="text-red-700">{` *`}</span>
							</Label>
							<Input id="password" type="password" disabled={isLoading} placeholder="password..."
								{...register('password', { required: true, minLength: 8, pattern: PASSWORD_REGEX })}
								aria-invalid={errors.password ? true : false }
								value="HelloW0rld@2015" />
						</div>
					</CardContent>
					<CardFooter>
						<Button ref={login_button} type="submit" disabled={isLoading}
							className="w-full cursor-pointer" size="sm">
							{isLoading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
							{isLoading ? "Wait..." : "Login"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</TabsContent>
	)
}

export default Login