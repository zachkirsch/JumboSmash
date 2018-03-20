declare module 'uuid' {
  export default class uuid { /* tslint:disable-line:class-name */
    public static v1: () => string
    public static v4: () => string
    public static v5: () => string
  }
}
