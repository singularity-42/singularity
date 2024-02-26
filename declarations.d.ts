// radio-browser-api.d.ts
declare module 'radio-browser-api' {
    export class RadioBrowserApi {
      constructor(fetch: any, appName: string);
      searchStations(options: any): Promise<any[]>;
    }
  }
  