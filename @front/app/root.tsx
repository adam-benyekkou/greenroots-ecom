import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	redirect,
	Scripts,
	ScrollRestoration
} from "react-router";

import { useEffect } from "react";
import type { Route } from "./+types/root";

import "../styles/reset.css";
import "../styles/global.css";

import { Header } from "./components/layout/header/Header";
import { Footer } from "./components/layout/footer/Footer";
import { getSession } from "./services/sessions.server";
import { ServiceWorkerManager } from "./services/serviceWorker";

const API_URL = import.meta.env.VITE_API_URL;

export async function loader({
								 request,
							 }: Route.LoaderArgs) {
	const session = await getSession(
		request.headers.get("Cookie"),
	);

	if (session.has("token")) {
		const token = session.get("token");
		const response = await fetch(`${API_URL}/user/profile`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});

		const data = await response.json();
		const user = data.data.user;

		return { user };
	}

	return { user: null}
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="favicon.svg" />
			<Meta />
			<Links />
		</head>
		<body>
		{children}
		<ScrollRestoration />
		<Scripts />
		</body>
		</html>
	);
}

export default function App(props: Route.ComponentProps) {
	const user = props.loaderData.user;

	// Enregistrer le Service Worker au démarrage de l'application
	useEffect(() => {
		ServiceWorkerManager.getInstance().register();
	}, []);

	return (
		<>
			<Header user={user}/>
			<Outlet />
			<Footer />
		</>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
                <code>{stack}</code>
             </pre>
			)}
		</main>
	);
}