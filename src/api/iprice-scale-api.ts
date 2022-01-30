import { DeepPartial } from '../helpers/strict-type-checks';

import { PriceScaleOptions } from '../model/price-scale';

/**
 * Interface to control chart's price scale
 * 图表刻度接口
 * */
export interface IPriceScaleApi {
	/**
	 * Applies new options to the price scale
	 * 将新选项应用于价格范围
	 *
	 * @param options - Any subset of options.
	 */
	applyOptions(options: DeepPartial<PriceScaleOptions>): void;

	/**
	 * Returns currently applied options of the price scale
	 *
	 * @returns Full set of currently applied options, including defaults
	 */
	options(): Readonly<PriceScaleOptions>;

	/**
	 * Returns a width of the price scale if it's visible or 0 if invisible.
	 */
	width(): number;
}
