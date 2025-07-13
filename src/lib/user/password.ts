export function validatePasswordInputField(value: string): ResultAction<string> {
	if (value.length < 10) {
		return { success: false, reason: "Password must have a minimum of 10 characters." };
	}

	return { success: true };
}
