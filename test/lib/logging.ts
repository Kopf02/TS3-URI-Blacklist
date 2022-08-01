export class Logging {
  private _logging: boolean;
  constructor(logging = false) {
    this._logging = logging;
  }

  log(e: any) {
    if (this._logging) console.log(e);
  }
}
