/** Contact-form fields and validation, shared by the form (client) and its action (server). */
export type Inquiry = { name: string; email: string; company: string; details: string };
export type InquiryField = keyof Inquiry;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

export const inquiryFields: InquiryField[] = ['name', 'email', 'company', 'details'];

export function readInquiry(form: FormData): Inquiry {
    const read = (field: InquiryField) => String(form.get(field) ?? '').trim();
    return { name: read('name'), email: read('email'), company: read('company'), details: read('details') };
}

export function validateField(field: InquiryField, value: string): string | undefined {
    switch (field) {
        case 'name':
            if (!value) return 'Please tell us your name.';
            return value.length > 200 ? 'Please keep your name under 200 characters.' : undefined;
        case 'email':
            if (!value) return 'Please enter your email so we can reply.';
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "That email address doesn't look complete.";
        case 'company':
            return value.length > 200 ? 'Please keep this under 200 characters.' : undefined;
        case 'details':
            if (value.length < 10) return 'A sentence or two about the project helps us reply usefully.';
            return value.length > 5000 ? 'Please keep this under 5,000 characters.' : undefined;
    }
}

export function validateInquiry(inquiry: Inquiry): InquiryErrors {
    const errors: InquiryErrors = {};
    for (const field of inquiryFields) {
        const error = validateField(field, inquiry[field]);
        if (error) errors[field] = error;
    }
    return errors;
}
