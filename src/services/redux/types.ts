export interface ReduxState {
  rehydrated: boolean
}

export interface LoadableValue<T> {
  prevValue?: T
  value: T
  loading: boolean
  errorMessage?: string
}
