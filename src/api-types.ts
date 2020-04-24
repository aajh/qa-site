export interface Answer {
    id: string
    author: string
    body: string
    created: string
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
