const paramMapper = {
  nickname: 'nickname',
  password: 'serverPassword',
  channel: 'channel',
  channelpassword: 'channelPassword',
  token: 'token',
  addbookmark: 'addBookmark',
} as const;
type paramMapperKeys = keyof typeof paramMapper;
type paramMapperValues = typeof paramMapper[paramMapperKeys];

interface RawTsInfo {
  protocol?: string;
  address: string;
  ipv6?: string;
  ip?: string;
  hostname?: string;
  port?: string;
  parameters?: Record<string, string>;
}

export interface TsInfo extends Omit<RawTsInfo, 'port' | 'parameters'> {
  port?: number;
  parameters?: Partial<Record<paramMapperValues, string>>;
}

/**
 * Define Regular Expression for extracting Information from TS3 URI
 * @author Nico Wagner
 */
const expression =
  /(?:(?<protocol>ts3server|ts3|ts?):\/\/)?(?<address>(?:(?:\[?)(?<ipv6>(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?)(?:\]?))|(?<ip>\d+(?:\.\d+){3})|(?<hostname>(?!.{256})[A-Za-z0-9.-]+))(?::?)(?:(?<port>\d{0,5}))?(?<path>\/[^\s|?|#]*)?(?:\?(?<parameters>(?:&?\S+?=[^&|#\s]+)+))?/;

/**
 * Get Parameters from an Ts3 Uri
 * @param {string}uri  - String to extract Information from
 * @author Jens Hummel
 */
export const uriHandler = (uri: string): TsInfo => {
  //Apply regular Expression
  const matches = expression.exec(uri);
  //Extract Information that have to be handled again
  const { parameters, port, ...rest } =
    (matches?.groups as unknown as RawTsInfo) ?? {};
  //Convert to correct Type after extraction
  const tsInfo = <TsInfo>rest;

  //Parse extracted Data
  const searchParams = new URLSearchParams(parameters);
  //port to integer
  if (port && port.length > 0) tsInfo.port = parseInt(port);
  //hostname toLowerCase
  if (tsInfo.hostname) tsInfo.hostname = tsInfo.hostname.toLowerCase();

  //Parse and Assign Parameters to TsInfo
  let paramMapperKey: keyof typeof paramMapper;
  for (paramMapperKey in paramMapper) {
    if (searchParams.has(paramMapperKey)) {
      if (!tsInfo.parameters) tsInfo.parameters = {};
      tsInfo.parameters[<paramMapperValues>paramMapper[paramMapperKey]] =
        searchParams!.get(paramMapperKey)!;
    }
  }

  return tsInfo;
};
