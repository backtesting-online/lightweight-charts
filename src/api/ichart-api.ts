import { DeepPartial } from '../helpers/strict-type-checks';

import { ChartOptions } from '../model/chart-model';
import { Point } from '../model/point';
import { SeriesMarker } from '../model/series-markers';
import {
	AreaSeriesPartialOptions,
	BarSeriesPartialOptions,
	BaselineSeriesPartialOptions,
	CandlestickSeriesPartialOptions,
	HistogramSeriesPartialOptions,
	LineSeriesPartialOptions,
	SeriesType,
} from '../model/series-options';
import { Logical, Time } from '../model/time-data';

import { BarData, HistogramData, LineData } from './data-consumer';
import { IPriceScaleApi } from './iprice-scale-api';
import { ISeriesApi } from './iseries-api';
import { ITimeScaleApi } from './itime-scale-api';

/**
 * Represents a mouse event.
 * 表示鼠标事件。
 */
export interface MouseEventParams {
	/**
	 * Time of the data at the location of the mouse event.
	 *
	 * The value will be `undefined` if the location of the event in the chart is outside the range of available data.
	 */
	time?: Time;
	/**
	 * Logical index
	 */
	logical?: Logical;
	/**
	 * Location of the event in the chart.
	 *
	 * The value will be `undefined` if the event is fired outside the chart, for example a mouse leave event.
	 */
	point?: Point;
	/**
	 * Data of all series at the location of the event in the chart.
	 * 图表中事件所在位置的所有系列的价格。
	 * Keys of the map are {@link ISeriesApi} instances. Values are prices.
	 * Values of the map are original data items
	 */
	seriesData: Map<ISeriesApi<SeriesType>, BarData | LineData | HistogramData>;
	/**
	 * The {@link ISeriesApi} for the series at the point of the mouse event.
	 */
	hoveredSeries?: ISeriesApi<SeriesType>;
	/**
	 * The ID of the marker at the point of the mouse event.
	 */
	hoveredMarkerId?: SeriesMarker<Time>['id'];
}

/**
 * A custom function use to handle mouse events.
 */
export type MouseEventHandler = (param: MouseEventParams) => void;

/**
 * The main interface of a single chart.
 * 图表的主要接口
 */
export interface IChartApi {
	/**
	 * Removes the chart object including all DOM elements. This is an irreversible operation, you cannot do anything with the chart after removing it.
	 * 移除包含所有 DOM 元素的图表对象。这是一个不可逆的操作，移除图表后您将无法对图表执行任何操作。
	 */
	remove(): void;

	/**
	 * Sets fixed size of the chart. By default chart takes up 100% of its container.
	 * 设置图表的固定大小。默认情况下，图表占据其容器的 100%。
	 *
	 * @param width - Target width of the chart.
	 * @param height - Target height of the chart.
	 * @param forceRepaint - True to initiate resize immediately. One could need this to get screenshot immediately after resize.
	 */
	resize(width: number, height: number, forceRepaint?: boolean): void;

	/**
	 * Creates an area series with specified parameters.
	 * 创建 area series
	 *
	 * @param areaOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addAreaSeries();
	 * ```
	 */
	addAreaSeries(areaOptions?: AreaSeriesPartialOptions): ISeriesApi<'Area'>;

	/**
	 * Creates a baseline series with specified parameters.
	 * 创建 baseline series
	 *
	 * @param baselineOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addBaselineSeries();
	 * ```
	 */
	addBaselineSeries(baselineOptions?: BaselineSeriesPartialOptions): ISeriesApi<'Baseline'>;

	/**
	 * Creates a bar series with specified parameters.
	 * 创建 bar series
	 *
	 * @param barOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addBarSeries();
	 * ```
	 */
	addBarSeries(barOptions?: BarSeriesPartialOptions): ISeriesApi<'Bar'>;

	/**
	 * Creates a candlestick series with specified parameters.
	 * 创建 candlestick series (zale TODO: 看下和 bar series 的区别)
	 *
	 * @param candlestickOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addCandlestickSeries();
	 * ```
	 */
	addCandlestickSeries(candlestickOptions?: CandlestickSeriesPartialOptions): ISeriesApi<'Candlestick'>;

	/**
	 * Creates a histogram series with specified parameters.
	 * 创建一个 histogram series (直方图序列, 比如成交量用的就是这个)
	 *
	 * @param histogramOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addHistogramSeries();
	 * ```
	 */
	addHistogramSeries(histogramOptions?: HistogramSeriesPartialOptions): ISeriesApi<'Histogram'>;

	/**
	 * Creates a line series with specified parameters.
	 * create line series （线图，比如 EMA）
	 *
	 * @param lineOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addLineSeries();
	 * ```
	 */
	addLineSeries(lineOptions?: LineSeriesPartialOptions): ISeriesApi<'Line'>;

	/**
	 * Removes a series of any type. This is an irreversible operation, you cannot do anything with the series after removing it.
	 * 删除一个 series
	 *
	 * @example
	 * ```js
	 * chart.removeSeries(series);
	 * ```
	 */
	removeSeries(seriesApi: ISeriesApi<SeriesType>): void;

	/**
	 * Subscribe to the chart click event.
	 * 订阅图表的点击事件
	 *
	 * @param handler - Handler to be called on mouse click.
	 * @example
	 * ```js
	 * function myClickHandler(param) {
	 *     if (!param.point) {
	 *         return;
	 *     }
	 *
	 *     console.log(`Click at ${param.point.x}, ${param.point.y}. The time is ${param.time}.`);
	 * }
	 *
	 * chart.subscribeClick(myClickHandler);
	 * ```
	 */
	subscribeClick(handler: MouseEventHandler): void;

	moveCrosshair(point: Point | null): void;

	clearCrossHair(): void;

	/**
	 * Unsubscribe a handler that was previously subscribed using {@link subscribeClick}.
	 * 取消订阅某事件监听器
	 *
	 * @param handler - Previously subscribed handler
	 * @example
	 * ```js
	 * chart.unsubscribeClick(myClickHandler);
	 * ```
	 */
	unsubscribeClick(handler: MouseEventHandler): void;

	/**
	 * Subscribe to the crosshair move event.
	 * 订阅十字准线移动事件。
	 *
	 * @param handler - Handler to be called on crosshair move.
	 * @example
	 * ```js
	 * function myCrosshairMoveHandler(param) {
	 *     if (!param.point) {
	 *         return;
	 *     }
	 *
	 *     console.log(`Crosshair moved to ${param.point.x}, ${param.point.y}. The time is ${param.time}.`);
	 * }
	 *
	 * chart.subscribeClick(myCrosshairMoveHandler);
	 * ```
	 */
	subscribeCrosshairMove(handler: MouseEventHandler): void;

	/**
	 * Unsubscribe a handler that was previously subscribed using {@link subscribeCrosshairMove}.
	 * 取消订阅以前订阅的十字准线移动事件
	 *
	 * @param handler - Previously subscribed handler
	 * @example
	 * ```js
	 * chart.unsubscribeCrosshairMove(myCrosshairMoveHandler);
	 * ```
	 */
	unsubscribeCrosshairMove(handler: MouseEventHandler): void;

	/**
	 * Returns API to manipulate a price scale.
	 * 返回 API 以操纵价格刻度
	 *
	 * @param priceScaleId - ID of the price scale.  价格刻度的ID
	 * @returns Price scale API. 价格缩放 API
	 */
	priceScale(priceScaleId: string): IPriceScaleApi;

	/**
	 * Returns API to manipulate the time scale
	 * 返回 API 以操作时间刻度
	 *
	 * @returns Target API
	 */
	timeScale(): ITimeScaleApi;

	/**
	 * Applies new options to the chart
	 * 添加新的选项配置到图表上
	 *
	 * @param options - Any subset of options.
	 */
	applyOptions(options: DeepPartial<ChartOptions>): void;

	/**
	 * Returns currently applied options
	 * 返回当前使用的选项配置
	 *
	 * @returns Full set of currently applied options, including defaults
	 */
	options(): Readonly<ChartOptions>;

	/**
	 * Make a screenshot of the chart with all the elements excluding crosshair.
	 * 制作图表的屏幕截图，其中包含除十字准线之外的所有元素。
	 *
	 * @returns A canvas with the chart drawn on. Any `Canvas` methods like `toDataURL()` or `toBlob()` can be used to serialize the result.
	 */
	takeScreenshot(): HTMLCanvasElement;

	subscribeCrosshairLeave(handler: () => void): void;
	unsubscribeCrosshairLeave(handler: () => void): void;
}
