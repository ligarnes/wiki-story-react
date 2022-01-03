export default class Configuration {

  private data: Record<string, string> | null;

  constructor() {
    this.data = null;
  }

  public init(): Promise<void> {
    return fetch("/env-config.json")
      .then(res => res.json())
      .then(json => {
        this.data = json
      });
  }

  public useStub(): boolean {
    return this.getProperty("USE_STUB", "false") === 'true';
  }

  public getBackendUrl(): string {
    return this.getProperty("BACKEND_URL", "http://localhost:8081");
  }

  private getData(): Record<string, string> {
    if (this.data) {
      return this.data;
    }
    throw Error("The Configuration must be initialized.");
  }

  private getProperty = (prop: string, defaultValue: string): string => {
    const retrieved: undefined | [string, string] = Object.entries(this.getData()).find(key => key[0] === prop);

    return retrieved ? retrieved[1] : defaultValue;
  }

}