const reqKeys = ["body", "query", "params", "headers"];

export const validationMiddleware = (schema) => {
    return (req, res, next) => {

        const validationErrors = [];

        for (const key of reqKeys) {
            const validationResult = schema[key]?.validate(req[key], {
                abortEarly: false,
            });
            if (validationResult?.error) {
                validationErrors.push(validationResult?.error?.details);
            }
        }

        validationErrors.length
            ? res.status(400).json(validationErrors)
            : next();
    };
};