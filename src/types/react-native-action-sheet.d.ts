declare module '@expo/react-native-action-sheet' {

  interface ActionSheetOptions {
    options: string[]
    cancelButtonIndex: number
    destructiveButtonIndex: number
  }

  export type ActionSheetProps<T> = T & {
    showActionSheetWithOptions?: (options: ActionSheetOptions, onPress: (buttonIndex: number) => void) => void,
  }

  export const connectActionSheet: any /* tslint:disable-line:no-any */
  export const ActionSheetProvider: any /* tslint:disable-line:no-any variable-name */
}
