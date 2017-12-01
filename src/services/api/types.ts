/* Requests */

export interface ErrorResponse {
  message: string
}

export interface RequestVerificationRequest {
  email: string
}

export interface VerifyEmailRequest { }

export interface AcceptCoCRequest {
  email: string
  session_key: string
}

/* Responses */

export interface RequestVerificationSuccessResponse { }

export interface VerifyEmailSuccessResponse {
  session_key: string
  accepted_coc: boolean
}

export interface AcceptCoCSuccessResponse { }
