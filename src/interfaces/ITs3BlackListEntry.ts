import { BlacklistType } from './BlacklistType';

export interface ITs3BlackListEntry {
  host: string;
  //Also used as Wildcard for hostname
  subnet: number;
  type: BlacklistType;
  //Port 0 is used as Wildcard
  port: number;
  whitelist: boolean;
  enabled: boolean;
}
