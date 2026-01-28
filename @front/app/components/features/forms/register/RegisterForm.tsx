import { Form, useActionData } from "react-router";
import "./RegisterForm.css";

function RegisterForm() {
	const actionData = useActionData();

	return (
		// returns form-related errors (e.g. email already in use)
		<Form method="POST">
			{actionData?.errors?.form ? (
				<p className="register-error-text" role="alert">
					{actionData?.errors?.form}
				</p>
			) : null}
			{/* form fields */}
			<div className="form-container">
				<div className="field">
					<label htmlFor="first_name">First Name*</label>
					<input
						id="first_name"
						name="first_name"
						aria-describedby={
							actionData?.errors?.first_name ? "first_name-error" : undefined
						}
					/>
					{actionData?.errors?.first_name ? (
						<p className="register-error-text" id="first_name-error">
							{actionData?.errors?.first_name}
						</p>
					) : null}
				</div>
				<div className="field">
					<label htmlFor="last_name">Last Name*</label>
					<input
						id="last_name"
						name="last_name"
						aria-describedby={
							actionData?.errors?.last_name ? "last_name-error" : undefined
						}
					/>
					{actionData?.errors?.last_name ? (
						<p className="register-error-text" id="last_name-error">
							{actionData?.errors?.last_name}
						</p>
					) : null}
				</div>
				<div className="field">
					<label htmlFor="email">Email*</label>
					<input
						id="email"
						name="email"
						required
						aria-describedby={
							actionData?.errors?.email ? "email-error" : undefined
						}
					/>
					{actionData?.errors?.email ? (
						<p className="register-error-text" id="email-error">
							{actionData?.errors?.email}
						</p>
					) : null}
				</div>
				<div className="field">
					<label htmlFor="phone_number">Phone Number</label>
					<input
						id="phone_number"
						name="phone_number"
						aria-describedby={
							actionData?.errors?.phone_number
								? "phone_number-error"
								: undefined
						}
					/>
					{actionData?.errors?.phone_number ? (
						<p className="register-error-text" id="phone_number-error">
							{actionData?.errors?.phone_number}
						</p>
					) : null}
				</div>
				<div className="field">
					<label htmlFor="password">Password*</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						aria-describedby={
							actionData?.errors?.password ? "password-error" : undefined
						}
					/>
					{actionData?.errors?.password ? (
						<p className="register-error-text" id="password-error">
							{actionData?.errors?.password}
						</p>
					) : null}
				</div>
				<div className="field">
					<label htmlFor="confirm-password">Confirm Password:*</label>
					<input
						type="password"
						id="confirm-password"
						name="confirm-password"
						required
					/>
				</div>
				{/* submit button */}
				<button type="submit" className="button-submission">
					Create Account
				</button>
			</div>
		</Form>
	);
}

export default RegisterForm;
