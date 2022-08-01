import { uriHandler } from '../src/utils/UriHandler';
import * as assert from 'assert';
import { Logging } from './lib/logging';

describe('Uri Handler #urihandler', () => {
  const logger = new Logging(false);
  describe('domain', () => {
    it('domain', () => {
      const x = uriHandler('example.com');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: undefined,
      });
    });
    it('domain in capslock', () => {
      const x = uriHandler('EXAMPLE.com');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'EXAMPLE.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: undefined,
      });
    });
    it('domain in full-capslock', () => {
      const x = uriHandler('EXAMPLE.COM');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'EXAMPLE.COM',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: undefined,
      });
    });
    it('domain in full-half-capslock', () => {
      const x = uriHandler('TEST.example.com');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'TEST.example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'test.example.com',
        path: undefined,
      });
    });
    it('domain in half-full-capslock', () => {
      const x = uriHandler('test.EXAMPLE.COM');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'test.EXAMPLE.COM',
        ipv6: undefined,
        ip: undefined,
        hostname: 'test.example.com',
        path: undefined,
      });
    });
    it('domain in half-capslock', () => {
      const x = uriHandler('eXaMpLe.CoM');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'eXaMpLe.CoM',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: undefined,
      });
    });
    it('domain with whitespace', () => {
      const x = uriHandler('    example.com    ');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: undefined,
      });
    });
    it('domain with :', () => {
      const x = uriHandler('example.com:');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: undefined,
      });
    });
    it('domain with trailing .', () => {
      const x = uriHandler('example.com.');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'example.com.',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com.',
        path: undefined,
      });
    });
    it('domain with port', () => {
      const x = uriHandler('example.com:9986');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: undefined,
        port: 9986,
      });
    });
    it('domain with param', () => {
      const x = uriHandler('example.com:9986?channel=test');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: undefined,
        port: 9986,
        parameters: {
          channel: 'test',
        },
      });
    });
    it('domain with param with slash', () => {
      const x = uriHandler('example.com:9986/?channel=test');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
        },
      });
    });
    it('domain with multiple params with slash', () => {
      const x = uriHandler('example.com:9986/?channel=test&password=bla');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
          serverPassword: 'bla',
        },
      });
    });
    it('domain with all params with slash', () => {
      const x = uriHandler(
        'example.com:9986/?channel=test&password=bla&nickname=nope&channelpassword=1&token=124&addbookmark=1'
      );
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: 'example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
          serverPassword: 'bla',
          nickname: 'nope',
          channelPassword: '1',
          token: '124',
          addBookmark: '1',
        },
      });
    });
    it('domain with all params with slash with protocol', () => {
      const x = uriHandler(
        'ts3server://example.com:9986/?channel=test&password=bla&nickname=nope&channelpassword=1&token=124&addbookmark=1'
      );
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: 'ts3server',
        address: 'example.com',
        ipv6: undefined,
        ip: undefined,
        hostname: 'example.com',
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
          serverPassword: 'bla',
          nickname: 'nope',
          channelPassword: '1',
          token: '124',
          addBookmark: '1',
        },
      });
    });
  });
  describe('IPv4', () => {
    it('IPv4', () => {
      const x = uriHandler('123.123.123.123');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: undefined,
      });
    });
    it('IPv4 with whitespace', () => {
      const x = uriHandler('    123.123.123.123    ');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: undefined,
      });
    });
    it('IPv4 with :', () => {
      const x = uriHandler('123.123.123.123:');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: undefined,
      });
    });
    it('IPv4 with trailing .', () => {
      const x = uriHandler('123.123.123.123.');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: undefined,
      });
    });
    it('IPv4 with port', () => {
      const x = uriHandler('123.123.123.123:9986');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: undefined,
        port: 9986,
      });
    });
    it('IPv4 with param', () => {
      const x = uriHandler('123.123.123.123:9986?channel=test');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: undefined,
        port: 9986,
        parameters: {
          channel: 'test',
        },
      });
    });
    it('IPv4 with param with slash', () => {
      const x = uriHandler('123.123.123.123:9986/?channel=test');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
        },
      });
    });
    it('IPv4 with multiple params with slash', () => {
      const x = uriHandler('123.123.123.123:9986/?channel=test&password=bla');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
          serverPassword: 'bla',
        },
      });
    });
    it('IPv4 with all params with slash', () => {
      const x = uriHandler(
        '123.123.123.123:9986/?channel=test&password=bla&nickname=nope&channelpassword=1&token=124&addbookmark=1'
      );
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
          serverPassword: 'bla',
          nickname: 'nope',
          channelPassword: '1',
          token: '124',
          addBookmark: '1',
        },
      });
    });
    it('IPv4 with all params with slash with protocol', () => {
      const x = uriHandler(
        'ts3server://123.123.123.123:9986/?channel=test&password=bla&nickname=nope&channelpassword=1&token=124&addbookmark=1'
      );
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: 'ts3server',
        address: '123.123.123.123',
        ipv6: undefined,
        ip: '123.123.123.123',
        hostname: undefined,
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
          serverPassword: 'bla',
          nickname: 'nope',
          channelPassword: '1',
          token: '124',
          addBookmark: '1',
        },
      });
    });
  });
  describe('IPv6', () => {
    it('IPv6', () => {
      const x = uriHandler('2001:a:f35:8902:3aea:a7ff:fe10:20b0');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ipv6: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ip: undefined,
        hostname: undefined,
        path: undefined,
      });
    });
    it('IPv6 with whitespaces', () => {
      const x = uriHandler('   2001:a:f35:8902:3aea:a7ff:fe10:20b0    ');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ipv6: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ip: undefined,
        hostname: undefined,
        path: undefined,
      });
    });
    it('IPv6 with port W/O brackets', () => {
      const x = uriHandler('2001:a:f35:8902:3aea:a7ff:fe10:20b0:9987');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ipv6: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ip: undefined,
        hostname: undefined,
        path: undefined,
        port: 9987,
      });
    });
    it('IPv6 with port', () => {
      const x = uriHandler('[2001:a:f35:8902:3aea:a7ff:fe10:20b0]:9986');
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]',
        ipv6: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ip: undefined,
        hostname: undefined,
        path: undefined,
        port: 9986,
      });
    });
    it('IPv6 with param', () => {
      const x = uriHandler(
        '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]:9986?channel=test'
      );
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]',
        ipv6: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ip: undefined,
        hostname: undefined,
        path: undefined,
        port: 9986,
        parameters: {
          channel: 'test',
        },
      });
    });
    it('IPv6 with param with slash', () => {
      const x = uriHandler(
        '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]:9986/?channel=test'
      );
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]',
        ipv6: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ip: undefined,
        hostname: undefined,
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
        },
      });
    });
    it('IPv6 with multiple params with slash', () => {
      const x = uriHandler(
        '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]:9986/?channel=test&password=bla'
      );
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]',
        ipv6: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ip: undefined,
        hostname: undefined,
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
          serverPassword: 'bla',
        },
      });
    });
    it('IPv6 with all params with slash', () => {
      const x = uriHandler(
        '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]:9986/?channel=test&password=bla&nickname=nope&channelpassword=1&token=124&addbookmark=1'
      );
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: undefined,
        address: '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]',
        ipv6: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ip: undefined,
        hostname: undefined,
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
          serverPassword: 'bla',
          nickname: 'nope',
          channelPassword: '1',
          token: '124',
          addBookmark: '1',
        },
      });
    });
    it('IPv6 with all params with slash and protocol', () => {
      const x = uriHandler(
        'ts3server://[2001:a:f35:8902:3aea:a7ff:fe10:20b0]:9986/?channel=test&password=bla&nickname=nope&channelpassword=1&token=124&addbookmark=1'
      );
      logger.log(x);
      assert.deepStrictEqual(x, {
        protocol: 'ts3server',
        address: '[2001:a:f35:8902:3aea:a7ff:fe10:20b0]',
        ipv6: '2001:a:f35:8902:3aea:a7ff:fe10:20b0',
        ip: undefined,
        hostname: undefined,
        path: '/',
        port: 9986,
        parameters: {
          channel: 'test',
          serverPassword: 'bla',
          nickname: 'nope',
          channelPassword: '1',
          token: '124',
          addBookmark: '1',
        },
      });
    });
  });
  it('null', () => {
    const x = uriHandler(null as unknown as string);
    logger.log(x);
    assert.deepStrictEqual(x, {
      protocol: undefined,
      address: 'null',
      ipv6: undefined,
      ip: undefined,
      hostname: 'null',
      path: undefined,
    });
  });
  it('undefined (empty)', () => {
    const x = uriHandler(void 0 as unknown as string);
    logger.log(x);
    assert.deepStrictEqual(x, {
      protocol: undefined,
      address: 'undefined',
      ipv6: undefined,
      ip: undefined,
      hostname: 'undefined',
      path: undefined,
    });
  });
  it('empty string', () => {
    const x = uriHandler('');
    logger.log(x);
    assert.deepStrictEqual(x, {});
  });
});
