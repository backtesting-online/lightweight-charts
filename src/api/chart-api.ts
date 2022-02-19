import { ChartWidget, MouseEventParamsImpl, MouseEventParamsImplSupplier } from '../gui/chart-widget';

import { assert, ensureDefined } from '../helpers/assertions';
import { Delegate } from '../helpers/delegate';
import { clone, DeepPartial, isBoolean, merge } from '../helpers/strict-type-checks';

import { ChartOptions, ChartOptionsInternal } from '../model/chart-model';
import { Point } from '../model/point';
import { Series } from '../model/series';
import { SeriesPlotRow } from '../model/series-data';
import {
	AreaSeriesOptions,
	AreaSeriesPartialOptions,
	BarSeriesOptions,
	BarSeriesPartialOptions,
	BaselineSeriesOptions,
	BaselineSeriesPartialOptions,
	CandlestickSeriesOptions,
	CandlestickSeriesPartialOptions,
	fillUpDownCandlesticksColors,
	HistogramSeriesOptions,
	HistogramSeriesPartialOptions,
	LineSeriesOptions,
	LineSeriesPartialOptions,
	precisionByMinMove,
	PriceFormat,
	PriceFormatBuiltIn,
	SeriesType,
} from '../model/series-options';
import { Logical, Time } from '../model/time-data';

import { CandlestickSeriesApi } from './candlestick-series-api';
import { DataUpdatesConsumer, isFulfilledData, SeriesDataItemTypeMap } from './data-consumer';
import { DataLayer, DataUpdateResponse, SeriesChanges } from './data-layer';
import { getSeriesDataCreator } from './get-series-data-creator';
import { IChartApi, MouseEventHandler, MouseEventParams } from './ichart-api';
import { IPriceScaleApi } from './iprice-scale-api';
import { ISeriesApi } from './iseries-api';
import { ITimeScaleApi } from './itime-scale-api';
import { chartOptionsDefaults } from './options/chart-options-defaults';
import {
	areaStyleDefaults,
	barStyleDefaults,
	baselineStyleDefaults,
	candlestickStyleDefaults,
	histogramStyleDefaults,
	lineStyleDefaults,
	seriesOptionsDefaults,
} from './options/series-options-defaults';
import { PriceScaleApi } from './price-scale-api';
import { SeriesApi } from './series-api';
import { TimeScaleApi } from './time-scale-api';

function patchPriceFormat(priceFormat?: DeepPartial<PriceFormat>): void {
	if (priceFormat === undefined || priceFormat.type === 'custom') {
		return;
	}
	const priceFormatBuiltIn = priceFormat as DeepPartial<PriceFormatBuiltIn>;
	if (priceFormatBuiltIn.minMove !== undefined && priceFormatBuiltIn.precision === undefined) {
		priceFormatBuiltIn.precision = precisionByMinMove(priceFormatBuiltIn.minMove);
	}
}

function migrateHandleScaleScrollOptions(options: DeepPartial<ChartOptions>): void {
	if (isBoolean(options.handleScale)) {
		const handleScale = options.handleScale;
		options.handleScale = {
			axisDoubleClickReset: handleScale,
			axisPressedMouseMove: {
				time: handleScale,
				price: handleScale,
			},
			mouseWheel: handleScale,
			pinch: handleScale,
		};
	} else if (options.handleScale !== undefined && isBoolean(options.handleScale.axisPressedMouseMove)) {
		const axisPressedMouseMove = options.handleScale.axisPressedMouseMove;
		options.handleScale.axisPressedMouseMove = {
			time: axisPressedMouseMove,
			price: axisPressedMouseMove,
		};
	}

	const handleScroll = options.handleScroll;
	if (isBoolean(handleScroll)) {
		options.handleScroll = {
			horzTouchDrag: handleScroll,
			vertTouchDrag: handleScroll,
			mouseWheel: handleScroll,
			pressedMouseMove: handleScroll,
		};
	}
}

function toInternalOptions(options: DeepPartial<ChartOptions>): DeepPartial<ChartOptionsInternal> {
	migrateHandleScaleScrollOptions(options);

	return options as DeepPartial<ChartOptionsInternal>;
}

export type IPriceScaleApiProvider = Pick<IChartApi, 'priceScale'>;

export class ChartApi implements IChartApi, DataUpdatesConsumer<SeriesType> {
	// 图表控件
	private _chartWidget: ChartWidget;
	// 数据层 TODO:
	private _dataLayer: DataLayer = new DataLayer();
	// series Api -> series 的映射
	private readonly _seriesMap: Map<SeriesApi<SeriesType>, Series> = new Map();
	// series -> series Api 的映射
	private readonly _seriesMapReversed: Map<Series, SeriesApi<SeriesType>> = new Map();
	// 鼠标点击事件的订阅器
	private readonly _clickedDelegate: Delegate<MouseEventParams> = new Delegate();
	// 十字准星移动事件的订阅器
	private readonly _crosshairMovedDelegate: Delegate<MouseEventParams> = new Delegate();
	// 鼠标移出 pane 订阅器
	private readonly _crosshairLeaveDelegate: Delegate = new Delegate();
	// 时间刻度 API 实例
	private readonly _timeScaleApi: TimeScaleApi;

	public constructor(container: HTMLElement, options?: DeepPartial<ChartOptions>) {
		// 将参数转换成内部使用的参数
		const internalOptions = (options === undefined) ?
			clone(chartOptionsDefaults) :
			merge(clone(chartOptionsDefaults), toInternalOptions(options)) as ChartOptionsInternal;

		// 生成图表控件
		this._chartWidget = new ChartWidget(container, internalOptions);

		// 图表控件自身的 clicked 订阅器触发时，需要也触发 chart api 的 clicked 订阅器内的回调
		this._chartWidget.clicked().subscribe(
			(paramSupplier: MouseEventParamsImplSupplier) => {
				if (this._clickedDelegate.hasListeners()) {
					this._clickedDelegate.fire(this._convertMouseParams(paramSupplier()));
				}
			},
			this
		);
		// 图表控件自身的十字准星移动订阅器触发时，需要也触发 chart api 的十字准星移动订阅器内的回调
		this._chartWidget.crosshairMoved().subscribe(
			(paramSupplier: MouseEventParamsImplSupplier) => {
				if (this._crosshairMovedDelegate.hasListeners()) {
					this._crosshairMovedDelegate.fire(this._convertMouseParams(paramSupplier()));
				}
			},
			this
		);

		// 十字准星移出图表事件
		this._chartWidget.crosshairLeave().subscribe(
			() => {
				if (this._crosshairLeaveDelegate.hasListeners()) {
					this._crosshairLeaveDelegate.fire();
				}
			},
			this
		)

		// TODO: 内部实现
		const model = this._chartWidget.model();
		// 创建时间刻度 API 实例
		this._timeScaleApi = new TimeScaleApi(model, this._chartWidget.timeAxisWidget());
	}

	/**
	 * 移除图表 （需要移除所有事件监听器）
	 */
	public remove(): void {
		// 取消所有监听器实例
		this._chartWidget.clicked().unsubscribeAll(this);
		this._chartWidget.crosshairMoved().unsubscribeAll(this);

		// 组件和 API 销毁
		this._timeScaleApi.destroy();
		this._chartWidget.destroy();

		// Map 销毁
		this._seriesMap.clear();
		this._seriesMapReversed.clear();

		// 销毁监听器
		this._clickedDelegate.destroy();
		this._crosshairMovedDelegate.destroy();
		this._crosshairLeaveDelegate.destroy();
		this._dataLayer.destroy();
	}

	// 重置图表的大小
	public resize(width: number, height: number, forceRepaint?: boolean): void {
		this._chartWidget.resize(width, height, forceRepaint);
	}

	// 添加 Area Series (传递配置，返回 Area Series 的 API 实例)
	public addAreaSeries(options: AreaSeriesPartialOptions = {}): ISeriesApi<'Area'> {
		patchPriceFormat(options.priceFormat);

		// 合并默认参数 (浅层合并)
		const strictOptions = merge(clone(seriesOptionsDefaults), areaStyleDefaults, options) as AreaSeriesOptions;
		// TODO: 什么意思？series 和 series api 有什么区别？
		const series = this._chartWidget.model().createSeries('Area', strictOptions);

		// 创建 area series api 实例
		const res = new SeriesApi<'Area'>(series, this, this);
		// 做 series api 与 series 之前的相互 Map
		this._seriesMap.set(res, series);
		this._seriesMapReversed.set(series, res);

		// 返回 area series api 实例
		return res;
	}

	// 添加 baseline series
	public addBaselineSeries(options: BaselineSeriesPartialOptions = {}): ISeriesApi<'Baseline'> {
		patchPriceFormat(options.priceFormat);

		// to avoid assigning fields to defaults we have to clone them
		const strictOptions = merge(clone(seriesOptionsDefaults), clone(baselineStyleDefaults), options) as BaselineSeriesOptions;
		// TODO: 什么意思？series 和 series api 有什么区别？
		const series = this._chartWidget.model().createSeries('Baseline', strictOptions);

		// 创建 area series api 实例并返回
		const res = new SeriesApi<'Baseline'>(series, this, this);
		this._seriesMap.set(res, series);
		this._seriesMapReversed.set(series, res);

		return res;
	}

	// 添加 Bar series
	public addBarSeries(options: BarSeriesPartialOptions = {}): ISeriesApi<'Bar'> {
		patchPriceFormat(options.priceFormat);

		const strictOptions = merge(clone(seriesOptionsDefaults), barStyleDefaults, options) as BarSeriesOptions;
		// TODO: 什么意思？series 和 series api 有什么区别？
		const series = this._chartWidget.model().createSeries('Bar', strictOptions);

		// 创建对应的 API 实例对象并返回
		const res = new SeriesApi<'Bar'>(series, this, this);
		this._seriesMap.set(res, series);
		this._seriesMapReversed.set(series, res);

		return res;
	}

	// 添加 candlestick series
	public addCandlestickSeries(options: CandlestickSeriesPartialOptions = {}): ISeriesApi<'Candlestick'> {
		fillUpDownCandlesticksColors(options);
		patchPriceFormat(options.priceFormat);

		const strictOptions = merge(clone(seriesOptionsDefaults), candlestickStyleDefaults, options) as CandlestickSeriesOptions;
		// TODO: 什么意思？series 和 series api 有什么区别？
		const series = this._chartWidget.model().createSeries('Candlestick', strictOptions);

		// CandlestickSeriesApi 与 SeriesApi 区别在于重写了 applyOptions 方法
		// 因为需要对 options 进行参数转换 (fillUpDownCandlesticksColors)
		const res = new CandlestickSeriesApi(series, this, this);
		this._seriesMap.set(res, series);
		this._seriesMapReversed.set(series, res);

		return res;
	}

	// 添加 Histogram series
	public addHistogramSeries(options: HistogramSeriesPartialOptions = {}): ISeriesApi<'Histogram'> {
		patchPriceFormat(options.priceFormat);

		const strictOptions = merge(clone(seriesOptionsDefaults), histogramStyleDefaults, options) as HistogramSeriesOptions;
		// TODO: 什么意思？series 和 series api 有什么区别？
		const series = this._chartWidget.model().createSeries('Histogram', strictOptions);

		// 创建对应的 API 实例对象并返回
		const res = new SeriesApi<'Histogram'>(series, this, this);
		this._seriesMap.set(res, series);
		this._seriesMapReversed.set(series, res);

		return res;
	}

	// 添加 line series
	public addLineSeries(options: LineSeriesPartialOptions = {}): ISeriesApi<'Line'> {
		patchPriceFormat(options.priceFormat);

		const strictOptions = merge(clone(seriesOptionsDefaults), lineStyleDefaults, options) as LineSeriesOptions;
		// TODO: 什么意思？series 和 series api 有什么区别？
		const series = this._chartWidget.model().createSeries('Line', strictOptions);

		// 创建对应的 API 实例对象并返回
		const res = new SeriesApi<'Line'>(series, this, this);
		this._seriesMap.set(res, series);
		this._seriesMapReversed.set(series, res);

		return res;
	}

	// 移除某个 series
	public removeSeries(seriesApi: SeriesApi<SeriesType>): void {
		const series = ensureDefined(this._seriesMap.get(seriesApi));

		// TODO: 从 datalayer 和 widget 中删除 series
		const update = this._dataLayer.removeSeries(series);
		const model = this._chartWidget.model();
		model.removeSeries(series);

		// TODO:
		this._sendUpdateToChart(update);

		// series map 中删除这个 series
		this._seriesMap.delete(seriesApi);
		this._seriesMapReversed.delete(series);
	}

	// TODO: 应用新的数据
	public applyNewData<TSeriesType extends SeriesType>(series: Series<TSeriesType>, data: SeriesDataItemTypeMap[TSeriesType][]): void {
		this._sendUpdateToChart(this._dataLayer.setSeriesData(series, data));
	}

	// TODO: 更新数据
	public updateData<TSeriesType extends SeriesType>(series: Series<TSeriesType>, data: SeriesDataItemTypeMap[TSeriesType]): void {
		this._sendUpdateToChart(this._dataLayer.updateSeriesData(series, data));
	}

	// 订阅点击事件
	public subscribeClick(handler: MouseEventHandler): void {
		this._clickedDelegate.subscribe(handler);
	}

	// 取消订阅的点击事件
	public unsubscribeClick(handler: MouseEventHandler): void {
		this._clickedDelegate.unsubscribe(handler);
	}

	// 订阅十字准星移动事件
	public subscribeCrosshairMove(handler: MouseEventHandler): void {
		this._crosshairMovedDelegate.subscribe(handler);
	}

	// 取消订阅十字准星移动事件
	public unsubscribeCrosshairMove(handler: MouseEventHandler): void {
		this._crosshairMovedDelegate.unsubscribe(handler);
	}

	public priceScale(priceScaleId: string): IPriceScaleApi {
		return new PriceScaleApi(this._chartWidget, priceScaleId);
	}

	public subscribeCrosshairLeave(handler: () => void): void  {
		this._crosshairLeaveDelegate.subscribe(handler)
	}

	public unsubscribeCrosshairLeave(handler: () => void): void  {
		this._crosshairLeaveDelegate.unsubscribe(handler)
	}

	// 返回时间刻度 API 实例
	public timeScale(): ITimeScaleApi {
		return this._timeScaleApi;
	}

	// 应用新的 Chart Options TODO:内部实现
	public applyOptions(options: DeepPartial<ChartOptions>): void {
		this._chartWidget.applyOptions(toInternalOptions(options));
	}

	// 获取当前的 chart options TODO:内部实现
	public options(): Readonly<ChartOptions> {
		return this._chartWidget.options() as Readonly<ChartOptions>;
	}

	// 获取屏幕截图 TODO:内部实现
	public takeScreenshot(): HTMLCanvasElement {
		return this._chartWidget.takeScreenshot();
	}

	public moveCrosshair(point: Point | null): void {
		if (!point) {
			return;
		}

		const paneWidgets = this._chartWidget.paneWidgets();
		const event = {
			localX: point.x,
			localY: point.y,
		};

		paneWidgets[0].mouseMoveEvent(event);
	}

	public clearCrossHair(): void {
		const paneWidgets = this._chartWidget.paneWidgets();
		paneWidgets[0].clearCrossHair();
	}

	// 发送更新到图表 TODO:内部实现
	private _sendUpdateToChart(update: DataUpdateResponse): void {
		const model = this._chartWidget.model();

		model.updateTimeScale(update.timeScale.baseIndex, update.timeScale.points, update.timeScale.firstChangedPointIndex);
		update.series.forEach((value: SeriesChanges, series: Series) => series.setData(value.data, value.info));

		// 重新计算所有窗格
		model.recalculateAllPanes();
	}

	// 根据 series 获取 series api (对于非法 series 会抛出错误)
	private _mapSeriesToApi(series: Series): ISeriesApi<SeriesType> {
		return ensureDefined(this._seriesMapReversed.get(series));
	}

	// 转换到鼠标Event参数, 看着只是参数的转换，没有啥副作用 TODO:内部实现
	private _convertMouseParams(param: MouseEventParamsImpl): MouseEventParams {
		const seriesData: MouseEventParams['seriesData'] = new Map();
		param.seriesData.forEach((plotRow: SeriesPlotRow, series: Series) => {
			const data = getSeriesDataCreator(series.seriesType())(plotRow);
			assert(isFulfilledData(data));
			seriesData.set(this._mapSeriesToApi(series), data);
		});

		const hoveredSeries = param.hoveredSeries === undefined ? undefined : this._mapSeriesToApi(param.hoveredSeries);

		return {
			time: param.time as Time | undefined,
			logical: param.index as Logical | undefined,
			point: param.point,
			hoveredSeries,
			hoveredMarkerId: param.hoveredObject,
			seriesData,
		};
	}
}
