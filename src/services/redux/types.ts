export interface ReduxState {
  rehydrated: boolean
}

export interface LoadableValue<T> {
  prevValue?: T
  localValue?: T
  value: T
  loading: boolean
  errorMessage?: string
}
