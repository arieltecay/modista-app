const API_URL = import.meta.env.VITE_API_URL;

export const getCourses = async () => {
    const response = await fetch(`${API_URL}/api/courses`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
    }

export const getTestimonials = async () => {
    const response = await fetch(`${API_URL}/api/courses/testimonials`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export const createPreference = async (course, external_reference) => {
    const response = await fetch(`${API_URL}/api/payment/create-preference`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course, external_reference }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}
