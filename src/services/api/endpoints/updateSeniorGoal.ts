import { PostEndpoint } from './Endpoint'

interface Request {
  senior_goal: string
}

interface Response {
}

export const updateSeniorGoal = new PostEndpoint<Request, Response>('/users/update_senior_goal', true)
export type UpdateSeniorGoalResponse = Response
