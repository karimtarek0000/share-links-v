type ValidationError = { name: string; message: string }
type ValidationFunction<T> = (formState: T) => ValidationError[]

export function useFormValidation<T extends Record<string, any>>(
	formState: T,
	validationFn: ValidationFunction<T>,
) {
	// Form validation state
	const validationErrors = ref<ValidationError[]>([])
	const fieldsToValidate = ref<Set<string>>(new Set())

	// Handle field validation
	const validateField = (fieldName: string) => {
		fieldsToValidate.value.add(fieldName)

		// Run validation only on touched fields
		validationErrors.value = validationFn(formState).filter(error =>
			fieldsToValidate.value.has(error.name),
		)
	}

	// Full form validation
	const validateForm = () => {
		validationErrors.value = validationFn(formState)
		return validationErrors.value.length === 0
	}

	// Helper to get field error
	const getFieldError = (fieldName: string) => {
		return computed(
			() =>
				validationErrors.value.find(error => error.name === fieldName)
					?.message || '',
		)
	}

	// Check if form is valid using computed property
	const isFormValid = computed(() => {
		try {
			// Try to validate the form state without updating errors
			const errors = validationFn(formState)
			return errors.length === 0
		} catch (error) {
			return false
		}
	})

	return {
		validationErrors,
		validateField,
		validateForm,
		getFieldError,
		isFormValid,
	}
}
