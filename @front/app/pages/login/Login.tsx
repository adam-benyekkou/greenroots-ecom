import type { Route } from "./+types/Login";
import LoginForm from "~/components/features/forms/login/LoginForm";
import { getSession, commitSession } from "~/services/sessions.server";
import { redirect, data, Link } from "react-router";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

type Errors = {
	form?: string;
};

export async function action({ request }: Route.ActionArgs) {
	const session = await getSession(request.headers.get("Cookie"));

	const formData = await request.formData();
	const email = formData.get("email");

	const password = formData.get("password");

	const userData = { email, password };

	const response = await fetch(`${API_URL}/user/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		const errors: Errors = {
			form: "Email ou mot de passe incorrect",
		};

		return data({ errors }, { status: 401 });
	}

	const dataJson = await response.json();
	const token = dataJson.data.token;

	session.set("token", token);

	// Login succeeded, send them to the home page.
	return redirect("/", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
}

export default function Login() {
	return (
		<main className="login-container">
			<h1>Connexion</h1>
			<LoginForm />
			<Link to="">Mot de passe oublié?</Link>
		</main>
	);
}
