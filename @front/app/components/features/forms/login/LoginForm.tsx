import { Form } from "react-router";
import "./LoginForm.css";

function LoginForm() {
	return (
		<Form method="POST">
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
