import { makeFont } from '../helpers/make-font';

import { ChartModel } from '../model/chart-model';

import { PriceAxisViewRendererOptions } from './iprice-axis-view-renderer';

const enum RendererConstants {
	BorderSize = 1,
	TickLength = 5,
}

// 价格轴渲染器选项的 Provider
export class PriceAxisRendererOptionsProvider {
	private readonly _chartModel: ChartModel;

	// 渲染相关的 options
	private readonly _rendererOptions: PriceAxisViewRendererOptions = {
		borderSize: RendererConstants.BorderSize,
		tickLength: RendererConstants.TickLength,
		fontSize: NaN,
		font: '',
		fontFamily: '',
		color: '',
		paneBackgroundColor: '',
		paddingBottom: 0,
		paddingInner: 0,
		paddingOuter: 0,
		paddingTop: 0,
		baselineOffset: 0,
		width: 0,
	};

	public constructor(chartModel: ChartModel) {
		this._chartModel = chartModel;
	}

	// 暴露获取 options 的接口
	public options(): Readonly<PriceAxisViewRendererOptions> {
		const rendererOptions = this._rendererOptions;

		const currentFontSize = this._fontSize();
		const currentFontFamily = this._fontFamily();

		// 如果字体大小或者字体不相同，那么重制下
		if (rendererOptions.fontSize !== currentFontSize || rendererOptions.fontFamily !== currentFontFamily) {
			rendererOptions.fontSize = currentFontSize;
			rendererOptions.fontFamily = currentFontFamily;
			rendererOptions.font = makeFont(currentFontSize, currentFontFamily);
			rendererOptions.paddingTop = 2.5 / 12 * currentFontSize; // 2.5 px for 12px font
			rendererOptions.paddingBottom = rendererOptions.paddingTop;
			rendererOptions.paddingInner = currentFontSize / 12 * rendererOptions.tickLength;
			rendererOptions.paddingOuter = currentFontSize / 12 * rendererOptions.tickLength;
			rendererOptions.baselineOffset = 0;
		}

		rendererOptions.color = this._textColor();
		rendererOptions.width = this._priceScaleWidth();
		rendererOptions.paneBackgroundColor = this._paneBackgroundColor();

		return this._rendererOptions;
	}

	private _priceScaleWidth(): number {
		return this._chartModel.options().priceScaleWidth;
	}

	// 下面的方法都是从 chartModel 上获取 chart options 的数据
	private _textColor(): string {
		return this._chartModel.options().layout.textColor;
	}

	private _paneBackgroundColor(): string {
		return this._chartModel.backgroundTopColor();
	}

	private _fontSize(): number {
		return this._chartModel.options().layout.fontSize;
	}

	private _fontFamily(): string {
		return this._chartModel.options().layout.fontFamily;
	}
}
