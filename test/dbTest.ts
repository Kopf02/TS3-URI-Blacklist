import { AppDataSource } from './lib/dataSource';
import { Ts3BlackListEntity } from '../src/entity/Ts3BlackListEntity';
import { Ts3BlackList } from '../src';
import { DataSource } from 'typeorm';
import * as assert from 'assert';
import { BlacklistType } from '../src/interfaces/BlacklistType';

describe('Database', () => {
  let instance: Ts3BlackList<Ts3BlackListEntity>, dataSource: DataSource;
  before('Connect and clear Table', (done) => {
    AppDataSource.initialize()
      .then((ds) => {
        dataSource = ds;
        AppDataSource.getRepository(Ts3BlackListEntity).query(
          'TRUNCATE ts3_black_list_entity'
        );
      })
      .then(() => {
        instance = new Ts3BlackList(dataSource);
        done();
      })
      .catch(done);
  });
  describe('addBlockEntry', () => {
    it('addBlockEntry - host', (done) => {
      const x = new Ts3BlackListEntity();
      x.port = 0;
      x.type = BlacklistType.HOSTNAME;
      x.host = 'example.com';
      x.subnet = 0;
      instance
        .addBlockEntry(x)
        .then((res) => {
          assert.deepStrictEqual(res, x);
          done();
        })
        .catch(done);
    });
    it('addBlockEntry - host - missing data', (done) => {
      const x = new Ts3BlackListEntity();
      x.port = 0;
      x.subnet = 0;
      instance
        .addBlockEntry(x)
        .then((res) => {
          assert.deepStrictEqual(res, x);
          done();
        })
        .catch((err) => {
          //console.log(err);
          assert.strictEqual(err.code, 'ER_NO_DEFAULT_FOR_FIELD');
          done();
        });
    });
    it('addBlockEntry - IPv4', (done) => {
      const x = new Ts3BlackListEntity();
      x.port = 0;
      x.type = BlacklistType.IPV4;
      x.host = '123.123.123.123';
      x.subnet = 0;
      instance
        .addBlockEntry(x)
        .then((res) => {
          assert.deepStrictEqual(res, x);
          done();
        })
        .catch(done);
    });
    it('addBlockEntry - IPv6', (done) => {
      const x = new Ts3BlackListEntity();
      x.port = 0;
      x.type = BlacklistType.IPV6;
      x.host = '2001:a:f35:8902:3aea:a7ff:fe10:20b0';
      x.subnet = 0;
      instance
        .addBlockEntry(x)
        .then((res) => {
          assert.deepStrictEqual(res, x);
          done();
        })
        .catch(done);
    });
  });
  describe('disableBlockEntry', () => {
    it('disableBlockEntry -disable - non existing entry', (done) => {
      instance
        .disableBlockEntry(0, true)
        .then((res) => {
          assert.deepStrictEqual(res, false);
          done();
        })
        .catch(done);
    });
    it('disableBlockEntry -enable - non existing entry', (done) => {
      instance
        .disableBlockEntry(0, false)
        .then((res) => {
          assert.deepStrictEqual(res, false);
          done();
        })
        .catch(done);
    });
    it('disableBlockEntry -disable - host', (done) => {
      instance
        .disableBlockEntry(1, true)
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('disableBlockEntry -disable - IPv4', (done) => {
      instance
        .disableBlockEntry(2, true)
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('disableBlockEntry -disable - IPv6', (done) => {
      instance
        .disableBlockEntry(3, true)
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('disableBlockEntry -enable - host', (done) => {
      instance
        .disableBlockEntry(1, false)
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('disableBlockEntry -enable - IPv4', (done) => {
      instance
        .disableBlockEntry(2, false)
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('disableBlockEntry -enable - IPv6', (done) => {
      instance
        .disableBlockEntry(3, false)
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
  });
  describe('modifyBlockEntry', () => {
    it('modifyBlockEntry - non existing entry', (done) => {
      instance
        .modifyBlockEntry(0, { host: 'test' })
        .then((res) => {
          assert.deepStrictEqual(res, false);
          done();
        })
        .catch(done);
    });
    it('modifyBlockEntry - host', (done) => {
      instance
        .modifyBlockEntry(1, { host: 'example2.com' })
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('modifyBlockEntry - IPv4', (done) => {
      instance
        .modifyBlockEntry(2, { host: '192.168.168.100' })
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('modifyBlockEntry - IPv6', (done) => {
      instance
        .modifyBlockEntry(3, { host: '2001:a:f35:8902:3aea:a7ff:fe10:20b1' })
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
  });
  describe('getEntryDetails', () => {
    it('getEntryDetails - non existing entry', (done) => {
      instance
        .getEntryDetails(0)
        .then((res) => {
          assert.deepStrictEqual(res, null);
          done();
        })
        .catch(done);
    });
    it('getEntryDetails - host', (done) => {
      instance
        .getEntryDetails(1)
        .then((res) => {
          assert.strictEqual(res?.id, 1);
          assert.strictEqual(res?.host, 'example2.com');
          assert.strictEqual(res?.enabled, true);
          assert.strictEqual(res?.port, 0);
          assert.strictEqual(res?.subnet, 0);
          assert.strictEqual(res?.type, BlacklistType.HOSTNAME);
          assert.strictEqual(res?.whitelist, false);
          assert.strictEqual(res instanceof Ts3BlackListEntity, true);

          done();
        })
        .catch(done);
    });
    it('getEntryDetails - IPv4', (done) => {
      instance
        .getEntryDetails(2)
        .then((res) => {
          assert.strictEqual(res?.id, 2);
          assert.strictEqual(res?.host, '192.168.168.100');
          assert.strictEqual(res?.enabled, true);
          assert.strictEqual(res?.port, 0);
          assert.strictEqual(res?.subnet, 0);
          assert.strictEqual(res?.type, BlacklistType.IPV4);
          assert.strictEqual(res?.whitelist, false);
          assert.strictEqual(res instanceof Ts3BlackListEntity, true);
          done();
        })
        .catch(done);
    });
    it('getEntryDetails - IPv6', (done) => {
      instance
        .getEntryDetails(3)
        .then((res) => {
          assert.strictEqual(res?.id, 3);
          assert.strictEqual(res?.host, '2001:a:f35:8902:3aea:a7ff:fe10:20b1');
          assert.strictEqual(res?.enabled, true);
          assert.strictEqual(res?.port, 0);
          assert.strictEqual(res?.subnet, 0);
          assert.strictEqual(res?.type, BlacklistType.IPV6);
          assert.strictEqual(res?.whitelist, false);
          assert.strictEqual(res instanceof Ts3BlackListEntity, true);
          done();
        })
        .catch(done);
    });
  });
  describe('deleteBlockEntry', () => {
    it('deleteBlockEntry - non existing entry', (done) => {
      instance
        .deleteBlockEntry(0)
        .then((res) => {
          assert.deepStrictEqual(res, false);
          done();
        })
        .catch(done);
    });
    it('deleteBlockEntry - host', (done) => {
      instance
        .deleteBlockEntry(1)
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('deleteBlockEntry - IPv4', (done) => {
      instance
        .deleteBlockEntry(2)
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('deleteBlockEntry - IPv6', (done) => {
      instance
        .deleteBlockEntry(3)
        .then((res) => {
          assert.deepStrictEqual(res, true);
          done();
        })
        .catch(done);
    });
  });
  after('Disconnect DB', (done) => {
    AppDataSource.destroy()
      .then(() => done())
      .catch(done);
  });
});
