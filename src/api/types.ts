export interface Login {
    token: string
}

export interface User {
    id: string
    username: string
}

export interface Answer {
    id: string
    author: string
    body: string
    created: string
    votes: number
    voteDirection: 1 | -1 | null
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
