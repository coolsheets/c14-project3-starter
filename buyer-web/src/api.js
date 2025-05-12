
export async function signUp(username, email) {
    const response = await fetch('/api/buyers', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email })
    })
    if (!response.ok) {
        throw new Error((await response.text()))
    }
    return await response.json()
}

export async function getAllBuyers() {
    const response = await fetch('/api/buyers')
    if (!response.ok) {
        throw new Error((await response.text()))
    }
    return await response.json()
}