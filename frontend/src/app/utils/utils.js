function sendPostRequest(url, data)
{
    const formData = new FormData();

    for (const key in data) {
        formData.append(key, data[key]);
    }

    return fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.text();
    });
}

export { sendPostRequest };