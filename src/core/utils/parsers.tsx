import { IMinerLog } from '../session-data/session-data.interface';

export const parseLogLineRegex = /^\[[\d-]+\s([\d]+:[\d]+:[\d]+).*\]\s+([a-z]+)\s+(.*)$/mi;
export const parseLogLine = (line:string):IMinerLog => {
  let m;
  // eslint-disable-next-line no-cond-assign
  if ((m = parseLogLineRegex.exec(line)) !== null) {
    // The result can be accessed through the `m`-variable.
    if (m.length > 0) {
      return {
        ts: m[1],
        module: m[2],
        message: m[3],
      };
    }
  }
  return {
    message: line,
  };
};

export const filterLogLineRegex = /GET\s\/2\//;
