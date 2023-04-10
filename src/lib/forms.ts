export function errorsToText(
	errors: string[],
	validationInfo: { min: number; max: number } | object = {}
) {
	const { min, max } = validationInfo;
	const readableError = errors.map((errorName) => {
		switch (errorName) {
			case 'not_an_email':
				return 'This field is not an email';
			case 'required':
				return 'This field is required';
			case 'match_field':
				// not generic but proably not needed elsewhere for now
				return 'The passwords do not match';
			case 'min':
				return min ? `This should be at least ${min} characters` : 'This is too short';
			case 'max':
				return max ? `This should be at most ${max} characters` : 'This is too long';
			default:
				return 'This is not valid';
		}
	});
	return readableError.join(', ');
}
