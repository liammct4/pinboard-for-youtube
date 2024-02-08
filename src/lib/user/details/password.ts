export function validatePasswordInputField(value: string): string | null {
	if (value.length < 10) {
		return "Password must have a minimum of 10 characters.";
	}

	return null;
}
