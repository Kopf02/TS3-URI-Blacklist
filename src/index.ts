import { ITs3Blacklist } from './interfaces/ITs3BlackList';
import { Ts3BlackListEntity } from './entity/Ts3BlackListEntity';
import { DataSource } from 'typeorm';
import { TsInfo, uriHandler } from './utils/UriHandler';
import { BlacklistType } from './interfaces/BlacklistType';

export class Ts3BlackList<T extends Ts3BlackListEntity>
  implements ITs3Blacklist<T>
{
  private readonly _dataSource: DataSource;

  /**
   * Determinate the BlacklistType of TsInfo Object
   * @param tsInfo
   */
  static getType(tsInfo: TsInfo): BlacklistType {
    if (tsInfo.ip) return BlacklistType.IPV4;
    if (tsInfo.ipv6) return BlacklistType.IPV6;
    return BlacklistType.HOSTNAME;
  }
  static getDetails(uri: string): {
    type: BlacklistType;
    port: number;
    host: string | undefined;
  } {
    const tsInfo = uriHandler(uri);
    const type = this.getType(tsInfo);
    const hostname = () => {
      if (type === BlacklistType.IPV4) return tsInfo.ip;
      if (type === BlacklistType.IPV6) return tsInfo.ipv6;
      return tsInfo.hostname;
    };
    return {
      type: type,
      port: tsInfo.port || 9987,
      host: hostname(),
    };
  }
  private static getDomains(hostname: string | undefined): string[] {
    if (hostname === undefined) return [];
    const results: string[] = [];

    let hostParts = hostname.split('.');
    hostParts = hostParts.filter((element) => element.length > 0);
    results.push(hostParts.join('.'));
    while (hostParts.length > 0) {
      results.push('*.' + hostParts.join('.'));
      hostParts.shift();
    }
    return results;
  }

  constructor(dataSource: DataSource) {
    this._dataSource = dataSource;
  }

  addBlockEntry(_blockEntry: T): Promise<T> {
    const repository = this._dataSource.getRepository<T>(Ts3BlackListEntity);
    return repository.save(_blockEntry);
  }

  /**
   *Read params from URI and check them against the Database
   * @param uri
   * @return Promise<boolean> - True when Blocked
   */
  async checkHost(uri: string): Promise<boolean> {
    const { type, port, host } = Ts3BlackList.getDetails(uri);
    let result;
    console.log(type, port, host);
    switch (type) {
      case BlacklistType.IPV4:
        result = await this._dataSource
          .createQueryBuilder()
          .select('IFNULL(MAX(whitelist), 1)', 'status')
          .from(Ts3BlackListEntity, 'ts')
          .where(
            'ts.enabled = 1 and ts.type = 1 and ts.host = inet_ntoa(inet_aton(:host) & (-1 << (32-ts.subnet))) and (ts.port = 0 OR ts.port = :port)',
            { host, port }
          )
          .execute();
        break;
      case BlacklistType.IPV6:
        result = await this._dataSource
          .createQueryBuilder()
          .select('IFNULL(MAX(whitelist), 1)', 'status')
          .from(Ts3BlackListEntity, 'ts')
          .where(
            "ts.enabled = 1 and ts.type = 2 and ts.host = inet6_ntoa((~INET6_ATON('::') << (128-ts.subnet)) & inet6_aton(:host)) and (ts.port = 0 OR ts.port = :port)",
            { host, port }
          )
          .execute();
        break;
      case BlacklistType.HOSTNAME:
        {
          const domains = Ts3BlackList.getDomains(host);
          console.log(domains);
          if (domains.length === 0) return false;
          result = await this._dataSource
            .createQueryBuilder()
            .select('IFNULL(MAX(whitelist), 1)', 'status')
            .from(Ts3BlackListEntity, 'ts')
            .where(
              'ts.enabled = 1 and ts.type = 0 AND (ts.host IN (:hosts)) AND (ts.port = 0 OR ts.port = :port)',
              {
                hosts: domains,
                port,
              }
            )
            .execute();
        }
        break;
    }

    return result[0]?.status === '0';
  }

  async deleteBlockEntry(id: T['id']): Promise<boolean> {
    const result = await this._dataSource
      .getRepository<T>(Ts3BlackListEntity)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Caused by https://github.com/typeorm/typeorm/issues/9251
      .delete({ id });
    return typeof result.affected === 'number' && result.affected > 0;
  }

  async disableBlockEntry(id: T['id'], disabled: boolean): Promise<boolean> {
    const repo = await this._dataSource.getRepository<T>(Ts3BlackListEntity);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Caused by https://github.com/typeorm/typeorm/issues/9251
    const result = await repo.update({ id }, { enabled: !disabled });
    return typeof result.affected === 'number' && result.affected > 0;
  }

  async getEntryDetails(id: T['id']): Promise<T | null> {
    return (
      this._dataSource
        .getRepository<T>(Ts3BlackListEntity)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Caused by https://github.com/typeorm/typeorm/issues/9251
        .findOneBy({ id })
    );
  }

  async modifyBlockEntry(id: T['id'], part: Partial<T>): Promise<boolean> {
    const result = await this._dataSource
      .getRepository<T>(Ts3BlackListEntity)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Caused by https://github.com/typeorm/typeorm/issues/9251
      .update({ id: id }, part);
    return typeof result.affected === 'number' && result.affected > 0;
  }
}
