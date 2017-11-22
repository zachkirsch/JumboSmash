export interface ApiFailureResponse {
  errorMessage: string
}

export interface ApiLoginSuccessResponse { }

export type ApiLoginResponse =
  Promise<ApiLoginSuccessResponse | ApiFailureResponse>

export interface ApiVerifyEmailSuccessResponse {
  sessionKey: string
  acceptedCoC: boolean
}

export type ApiVerifyEmailResponse =
  Promise<ApiVerifyEmailSuccessResponse | ApiFailureResponse>

export interface ApiAcceptCoCSuccessResponse { }

export type ApiAcceptCoCResponse =
  Promise<ApiAcceptCoCSuccessResponse | ApiFailureResponse>
