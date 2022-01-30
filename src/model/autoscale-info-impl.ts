import { PriceRangeImpl } from './price-range-impl';
import { AutoscaleInfo } from './series-options';

/**
 * Represents the margin used when updating a price scale.
 * 更新一个价格刻度时用的边距
 */
export interface AutoScaleMargins {
	/** The number of pixels for bottom margin */
	// 下边距的像素数
	below: number;
	/** The number of pixels for top margin */
	// 上边距的像素数
	above: number;
}

export class AutoscaleInfoImpl {
	private readonly _priceRange: PriceRangeImpl | null;
	private readonly _margins: AutoScaleMargins | null;

	public constructor(priceRange: PriceRangeImpl | null, margins?: AutoScaleMargins | null) {
		this._priceRange = priceRange;
		this._margins = margins || null;
	}

	public priceRange(): PriceRangeImpl | null {
		return this._priceRange;
	}

	public margins(): AutoScaleMargins | null {
		return this._margins;
	}

	public toRaw(): AutoscaleInfo | null {
		if (this._priceRange === null) {
			return null;
		}
		return {
			priceRange: this._priceRange.toRaw(),
			margins: this._margins || undefined,
		};
	}

	public static fromRaw(raw: AutoscaleInfo | null): AutoscaleInfoImpl | null {
		return (raw === null) ? null : new AutoscaleInfoImpl(PriceRangeImpl.fromRaw(raw.priceRange), raw.margins);
	}
}
