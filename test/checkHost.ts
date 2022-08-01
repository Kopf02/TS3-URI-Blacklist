import * as assert from 'assert';
import { Ts3BlackList } from '../src';
import { Ts3BlackListEntity } from '../src/entity/Ts3BlackListEntity';
import { DataSource } from 'typeorm';
import { AppDataSource } from './lib/dataSource';
import { BlacklistType } from '../src/interfaces/BlacklistType';

describe('CheckHost', () => {
  let instance: Ts3BlackList<Ts3BlackListEntity>, dataSource: DataSource;
  before('Connect and clear Table', (done) => {
    AppDataSource.initialize()
      .then((ds) => {
        dataSource = ds;
        AppDataSource.getRepository(Ts3BlackListEntity).query(
          'TRUNCATE ts3_black_list_entity'
        );
        AppDataSource.createQueryBuilder()
          .insert()
          .into(Ts3BlackListEntity)
          .values([
            {
              type: BlacklistType.HOSTNAME,
              port: 0,
              subnet: 0,
              host: 'example',
            },
            {
              type: BlacklistType.HOSTNAME,
              port: 0,
              subnet: 0,
              host: 'example.tld',
            },
            {
              type: BlacklistType.HOSTNAME,
              port: 0,
              subnet: 0,
              host: '*.example.tld',
            },
            {
              type: BlacklistType.HOSTNAME,
              port: 0,
              subnet: 0,
              host: 'test.example.tld',
            },
            {
              type: BlacklistType.HOSTNAME,
              port: 9988,
              subnet: 0,
              host: 'whitelist.test.example.tld',
              whitelist: true,
            },
            {
              type: BlacklistType.IPV4,
              port: 0,
              subnet: 24,
              host: '127.0.0.0',
            },
            {
              type: BlacklistType.IPV4,
              port: 0,
              subnet: 32,
              host: '1.1.1.1',
            },
            {
              type: BlacklistType.IPV4,
              port: 0,
              subnet: 24,
              host: '192.168.178.0',
            },
            {
              type: BlacklistType.IPV4,
              port: 1234,
              subnet: 32,
              host: '192.168.178.123',
              whitelist: true,
            },
            {
              type: BlacklistType.IPV4,
              port: 1235,
              subnet: 32,
              host: '192.168.178.123',
              enabled: false,
            },
            {
              type: BlacklistType.IPV4,
              port: 0,
              subnet: 8,
              host: '10.0.0.0',
            },
            {
              type: BlacklistType.IPV6,
              port: 0,
              subnet: 64,
              host: 'fe80::',
            },
            {
              type: BlacklistType.IPV4,
              port: 0,
              subnet: 24,
              host: '80.111.1.0',
            },
            {
              type: BlacklistType.IPV6,
              port: 0,
              subnet: 64,
              host: '2001:820:9511::',
            },
            {
              type: BlacklistType.IPV6,
              port: 9899,
              subnet: 64,
              host: '2001:0820:9511:0000:0000:0000:0000:0001',
              whitelist: true,
            },
            {
              type: BlacklistType.HOSTNAME,
              port: 123,
              subnet: 0,
              host: 'test.example.com',
              whitelist: true,
            },
            {
              type: BlacklistType.HOSTNAME,
              port: 123,
              subnet: 0,
              host: '*.example.com',
            },
          ])
          .execute();
      })
      .then(() => {
        instance = new Ts3BlackList(dataSource);
        done();
      })
      .catch(done);
  });
  describe('Domains / TSDNS', () => {
    it('simple tsdns name "example"', (done) => {
      instance
        .checkHost('example')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple tsdns name "  example " with whitespaces', (done) => {
      instance
        .checkHost('  example ')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });

    it('simple tsdns name "EXAMPLE" in capslock', (done) => {
      instance
        .checkHost('EXAMPLE')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple tsdns name " EXAMPLE " in capslock with whitespaces', (done) => {
      instance
        .checkHost(' EXAMPLE ')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple tsdns name "eXaMpLe" in half-capslock', (done) => {
      instance
        .checkHost('eXaMpLe')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple domain name "example.tld"', (done) => {
      instance
        .checkHost('example.tld')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple tsdns name "example."', (done) => {
      instance
        .checkHost('example.')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple domain name "example.tld."', (done) => {
      instance
        .checkHost('example.tld.')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple domain name "example..tld."', (done) => {
      instance
        .checkHost('example..tld.')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple domain name "example.tld.."', (done) => {
      instance
        .checkHost('example.tld..')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple domain name "example..tld.."', (done) => {
      instance
        .checkHost('example..tld..')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple domain name "example.tld:1234"', (done) => {
      instance
        .checkHost('example.tld:1234')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple domain name " example.tld:1234" with whitespaces', (done) => {
      instance
        .checkHost(' example.tld:1234')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple tsdns name "example:1234"', (done) => {
      instance
        .checkHost('example:1234')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple subdomain name "test.example.tld"', (done) => {
      instance
        .checkHost('test.example.tld')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('simple subdomain name "test.example.tld."', (done) => {
      instance
        .checkHost('test.example.tld.')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('subdomain name "test.test.example.tld"', (done) => {
      instance
        .checkHost('test.test.example.tld')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('subdomain name "whitelist.test.example.tld"', (done) => {
      instance
        .checkHost('test.test.example.tld')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('subdomain name "whitelist.test.example.tld:9988"', (done) => {
      instance
        .checkHost('test.test.example.tld')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('subdomain name "test.test.example.tld."', (done) => {
      instance
        .checkHost('test.test.example.tld.')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('subdomain name "test.test.example.tld:1234"', (done) => {
      instance
        .checkHost('test.test.example.tld:1234')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('subdomain name "test.test.example.tld:1235"', (done) => {
      instance
        .checkHost('test.test.example.tld:1235')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
  });
  describe('IPv4', () => {
    it('IPv4 "1.1.1.1"', (done) => {
      instance
        .checkHost('1.1.1.1')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 whitelisted "1.1.1.2"', (done) => {
      instance
        .checkHost('1.1.1.2')
        .then((res) => {
          assert.strictEqual(res, false);
          done();
        })
        .catch(done);
    });
    it('IPv4 "1.1.1.1:1234"', (done) => {
      instance
        .checkHost('1.1.1.1:1234')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 "1.1.1.1:1234   " with whitespaces', (done) => {
      instance
        .checkHost('1.1.1.1:1234   ')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 "127.0.0.1"', (done) => {
      instance
        .checkHost('127.0.0.1')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 "127.0.0.1:1234"', (done) => {
      instance
        .checkHost('127.0.0.1:1234')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 "192.168.178.123"', (done) => {
      instance
        .checkHost('192.168.178.123')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 "192.168.178.123:1234"', (done) => {
      instance
        .checkHost('192.168.178.123:1234')
        .then((res) => {
          assert.strictEqual(res, false);
          done();
        })
        .catch(done);
    });
    it('IPv4 "192.168.178.123:1235"', (done) => {
      instance
        .checkHost('192.168.178.123:1235')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 "80.111.1.9"', (done) => {
      instance
        .checkHost('80.111.1.9')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 "80.111.001.09"', (done) => {
      instance
        .checkHost('80.111.001.09')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 "80.111.001.09:00900"', (done) => {
      instance
        .checkHost('80.111.001.09:00900')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 subnet "10.0.0.1"', (done) => {
      instance
        .checkHost('10.0.0.1')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv4 subnet "10.250.100.198"', (done) => {
      instance
        .checkHost('10.250.100.198')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
  });
  describe('IPv6', () => {
    it('IPv6 "2001:0820:9511:0000:0000:0000:0000:0000"', (done) => {
      instance
        .checkHost('2001:0820:9511:0000:0000:0000:0000:0000')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv6 "[2001:0820:9511:0000:0000:0000:0000:0000]"', (done) => {
      instance
        .checkHost('[2001:0820:9511:0000:0000:0000:0000:0000]')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv6 "[2001:0820:9511:0000:0000:0000:0000:0000]:1234"', (done) => {
      instance
        .checkHost('[2001:0820:9511:0000:0000:0000:0000:0000]:1234')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv6 " [2001:0820:9511:0000:0000:0000:0000:0000]:1234  " with whitespaces', (done) => {
      instance
        .checkHost(' [2001:0820:9511:0000:0000:0000:0000:0000]:1234  ')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv6 whitelist "[2001:0820:9511:0000:0000:0000:0000:0001]:9899"', (done) => {
      instance
        .checkHost('[2001:0820:9511:0000:0000:0000:0000:0001]:9899')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv6 "[2001:0820:9511:0000:0000:0000:0000:0000]:"', (done) => {
      instance
        .checkHost('[2001:0820:9511:0000:0000:0000:0000:0000]:')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv6 "fe80::1"', (done) => {
      instance
        .checkHost('fe80::1')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv6 "[fe80::1]:1234"', (done) => {
      instance
        .checkHost('[fe80::1]:1234')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
    it('IPv6 subnet "fe80::3cf4:913c:ca88:4e7"', (done) => {
      instance
        .checkHost('fe80::3cf4:913c:ca88:4e7')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
  });
  describe('ts3server uris', () => {
    it('ts3server whitelist "ts3server://test.example.com:123/?password=lol"', (done) => {
      instance
        .checkHost('ts3server://test.example.com:123/?password=lol')
        .then((res) => {
          assert.strictEqual(res, false);
          done();
        })
        .catch(done);
    });
    it('ts3server "ts3server://bla.example.com:123/?password=lol"', (done) => {
      instance
        .checkHost('ts3server://bla.example.com:123/?password=lol')
        .then((res) => {
          assert.strictEqual(res, true);
          done();
        })
        .catch(done);
    });
  });
  it('testing empty input', (done) => {
    instance
      .checkHost('')
      .then((res) => {
        assert.strictEqual(res, false);
        done();
      })
      .catch(done);
  });
  it('testing empty input "  "', (done) => {
    instance
      .checkHost('  ')
      .then((res) => {
        assert.strictEqual(res, false);
        done();
      })
      .catch(done);
  });
  it('testing domain not in DB', (done) => {
    instance
      .checkHost('ts3server://not-in-db.test.com:123/?password=lol')
      .then((res) => {
        assert.strictEqual(res, false);
        done();
      })
      .catch(done);
  });
  after('Disconnect DB', (done) => {
    AppDataSource.destroy()
      .then(() => done())
      .catch(done);
  });
});
