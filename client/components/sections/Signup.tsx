import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SubmitHandler, useForm } from "react-hook-form"
import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import logo_light from "@/assets/logo-light.png"
import { ReloadIcon } from "@radix-ui/react-icons"
import { axios } from "@/config"

const SIGNUP_ENDPOINT = "/api/auth/signup"

const USERNAME_REGEX = /^[A-Za-z0-9]+$/i
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_#@$%]).+$/

interface ISignup {
	username: string
	firstname: string
	lastname?: string
	password: string
	confirm_password: string
}

const Signup = ({ toast }: { toast: any }) => {

	const { register, handleSubmit, formState: { errors } } = useForm<ISignup>()
	const [isLoading, setIsLoading] = useState(false)
	const signup_button = useRef<HTMLButtonElement>(null)

	const signup = (data: ISignup) => {
		setIsLoading(true)
		axios.post(SIGNUP_ENDPOINT, {
			username: data.username,
			password: data.password,
			firstname: data.firstname,
			lastname: data.lastname || ''
		}, {
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true
		}).then((response) => {
			toast({
				title: "success",
				description: "Your account has been created successfully",
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
			signup_button.current?.focus()
		})
	}

	const onSubmit: SubmitHandler<ISignup> = (data) => signup(data)

	return (
		<TabsContent value="signup">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-center">
						<Link href="/">
							<Image src={logo_light} alt="logo" width={100} height={100} />
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
								aria-invalid={errors.username ? true : false } />
						</div>
						<div className="space-y-1 grid md:grid-cols-2 grid-cols-1 gap-2">
							<div className="space-y-1">
								<Label htmlFor="firstname">
									Firstname
									<span className="text-red-700">{` *`}</span>
								</Label>
								<Input id="firstname" disabled={isLoading} placeholder="firstname..."
									{...register('firstname', { required: true, minLength: 4, maxLength: 20 })}
									aria-invalid={errors.firstname ? true : false } />
							</div>
							<div className="space-y-1">
								<Label htmlFor="lastname">Last name</Label>
								<Input id="lastname" disabled={isLoading} placeholder="Last name..."
									{...register('lastname', { required: false, minLength: 4, maxLength: 20 })}
									aria-invalid={errors.lastname ? true : false } />
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor="password">
								Password
								<span className="text-red-700">{` *`}</span>
							</Label>
							<Input id="password" disabled={isLoading} placeholder="password..."
								{...register('password', { required: true, minLength: 8, maxLength: 20, pattern: PASSWORD_REGEX })}
								aria-invalid={errors.password ? true : false } />
						</div>
						<div className="space-y-1">
							<Label htmlFor="confirm_password">
								Confirm Password
								<span className="text-red-700">{` *`}</span>
							</Label>
							<Input id="confirm_password" disabled={isLoading} placeholder="confirm password..."
								{...register('confirm_password', { required: true, minLength: 8, maxLength: 20, pattern: PASSWORD_REGEX })}
								aria-invalid={errors.confirm_password ? true : false } />
						</div>
					</CardContent>
					<CardFooter>
						<Button ref={signup_button} type="submit" disabled={isLoading}
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

export default Signup