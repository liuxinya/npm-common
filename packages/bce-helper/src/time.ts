import * as dayjs from 'dayjs';

export function utcToBJ(value: string, formatRule = 'YYYY.MM.DD HH:mm') {
    return dayjs(value).format(formatRule);
}
