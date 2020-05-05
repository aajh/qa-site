export interface Login {
    token: string
}

export interface JWTPayload {
    id: string
    username: string
    iat: number
}
export function checkTokenIsValid(p: JWTPayload) {
    return typeof p.id === 'string' && typeof p.username === 'string' && typeof p.iat === 'number';
}

export interface Answer {
    id: string
    author: string
    body: string
    created: string
    votes: number
}

export interface Question {
    id: string,
    author: string,
    title: string,
    body: string,
    created: string,
    answers: Answer[]
}

export interface QuestionSummary {
    id: string,
    author: string,
    title: string,
    created: string,
}
