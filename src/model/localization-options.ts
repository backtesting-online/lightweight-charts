import { PriceFormatterFn } from './price-formatter-fn';
import { Time } from './time-data';

/**
 * A custom function used to override formatting of a time to a string.
 */
export type TimeFormatterFn = (time: Time) => string;

/**
 * Represents options for formatting dates, times, and prices according to a locale.
 * 表示用于根据区域设置设置日期、时间和价格格式的选项。
 */
export interface LocalizationOptions {
	/**
	 * Current locale used to format dates. Uses the browser's language settings by default.
	 * 用于设置日期格式的当前区域设置。默认情况下使用浏览器的语言设置。
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
	 * @defaultValue `navigator.language`
	 */
	locale: string;

	/**
	 * Override formatting of the price scale crosshair label. Can be used for cases that can't be covered with built-in price formats.
	 * 覆盖价格刻度十字准线标签的格式。可用于无法使用内置价格格式覆盖的情况。
	 *
	 * @see {@link PriceFormatCustom}
	 * @defaultValue `undefined`
	 */
	priceFormatter?: PriceFormatterFn;

	/**
	 * Override formatting of the time scale crosshair label.
	 * 覆盖时间刻度十字准线标签的格式。
	 *
	 * @defaultValue `undefined`
	 */
	timeFormatter?: TimeFormatterFn;

	/**
	 * Date formatting string.
	 * 日期格式字符串。
	 * Can contain `yyyy`, `yy`, `MMMM`, `MMM`, `MM` and `dd` literals which will be replaced with corresponding date's value.
	 *
	 * Ignored if {@link timeFormatter} has been specified.
	 *
	 * @defaultValue `'dd MMM \'yy'`
	 */
	dateFormat: string;
}
