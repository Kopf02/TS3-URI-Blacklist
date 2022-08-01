import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ITs3BlackListEntry } from '../interfaces/ITs3BlackListEntry';
import { BlacklistType } from '../interfaces/BlacklistType';

@Entity({ synchronize: true })
@Check('iptype', '"ipv4" is null xor "ipv6" is null')
export class Ts3BlackListEntity implements ITs3BlackListEntry {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  host: string;
  @Column({ type: 'tinyint', unsigned: true })
  subnet: number;
  @Column({ type: 'tinyint', unsigned: true })
  type: BlacklistType;
  @Column({ type: 'smallint', unsigned: true })
  port: number;
  @Column({ default: false })
  whitelist: boolean;
  @Column({ default: true })
  enabled: boolean;
}
