import { Form, useActionData } from "react-router";
import "./LoginForm.css";

function LoginForm() {
	const actionData = useActionData();

	return (
		<Form method="POST">
			{actionData?.errors?.form ? (
				<p className="register-error-text" role="alert">
					{actionData?.errors?.form}
				</p>
			) : null}
			<div className="form-container">
				<div className="field">
					<label htmlFor="email">Email:</label>
					<input id="email" name="email" required />
				</div>
				<div className="field">
					<label htmlFor="password">Mot de passe:</label>
					<input type="password" id="password" name="password" required />
				</div>
				<button type="submit" className="button-connexion">
					Se connecter
				</button>
			</div>
		</Form>
	);
}

export default LoginForm;
