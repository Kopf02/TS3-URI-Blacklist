import { Ts3BlackListEntity } from '../entity/Ts3BlackListEntity';

export interface ITs3Blacklist<T extends Ts3BlackListEntity> {
  //check Functions
  /**
   * Check if given host is blocked by black-/whitelist
   * check for invalid ports (1024 < port < 65535) (port must be in this range)
   * check for local ip-address-ranges (class A, B, C aka 127.0.0.x up to 10.x.x.x over 192.168.x.x and 172.16.x.x as well as private ipv6 addresses (prefix fe80::XXXX) and make an option to block these as well because this input can be stupid
   * maybe try to check if a srv record does exist and resolve this to block this address
   */
  checkHost(host: string): Promise<boolean>;
  /** Fetch more infos about a block-entry*/
  getEntryDetails(id: T['id']): Promise<T | null>;
  //"admin" functions
  /** Adds a new entry to the block-/whitelist*/
  addBlockEntry(blockEntry: T): Promise<T>;
  /** Removes an entry from the database (do not use normally - prefer disableBlockEntry)*/
  deleteBlockEntry(id: T['id']): Promise<boolean>;
  /** Disables an entry from the list*/
  disableBlockEntry(id: T['id'], disabled: boolean): Promise<boolean>;
  /** Updates an entry of the list*/
  modifyBlockEntry(id: T['id'], part: Partial<T>): Promise<boolean>;
}
