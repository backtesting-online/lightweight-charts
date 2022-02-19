import { DeepPartial } from '../helpers/strict-type-checks';

import { Coordinate } from '../model/coordinate';
import { Logical, LogicalRange, Range, Time } from '../model/time-data';
import { TimeScaleOptions } from '../model/time-scale';

/**
 * Represents a {@link Time} range.
 */
export type TimeRange = Range<Time>;

/**
 * A custom function used to handle changes to the time scale's time range.
 */
export type TimeRangeChangeEventHandler = (timeRange: TimeRange | null) => void;
/**
 * A custom function used to handle changes to the time scale's logical range.
 */
export type LogicalRangeChangeEventHandler = (logicalRange: LogicalRange | null) => void;
/**
 * A custom function used to handle changes to the time scale's size.
 */
export type SizeChangeEventHandler = (width: number, height: number) => void;

/**
 * Interface to chart time scale
 * 图表的时间刻度接口
 */
export interface ITimeScaleApi {
	/**
	 * Return the distance from the right edge of the time scale to the lastest bar of the series measured in bars.
	 * 返回从时间刻度的右边缘到以条测量的系列的最后一个条的距离。
	 */
	scrollPosition(): number;

	/**
	 * Scrolls the chart to the specified position.
	 * 将图表滚动到指定位置
	 *
	 * @param position - Target data position
	 * @param animated - Setting this to true makes the chart scrolling smooth and adds animation
	 */
	scrollToPosition(position: number, animated: boolean): void;

	/**
	 * Restores default scroll position of the chart. This process is always animated.
	 * 恢复图表的默认滚动位置。这个过程总是动画的
	 */
	scrollToRealTime(): void;

	/**
	 * Returns current visible time range of the chart.
	 * 返回图表的当前可见时间范围
	 *
	 * Note that this method cannot extrapolate time and will use the only currently existent data.
	 * To get complete information about current visible range, please use {@link getVisibleLogicalRange} and {@link ISeriesApi.barsInLogicalRange}.
	 *
	 * @returns Visible range or null if the chart has no data at all.
	 */
	getVisibleRange(): TimeRange | null;

	/**
	 * Sets visible range of data.
	 * 设置可见的数据范围。
	 *
	 * Note that this method cannot extrapolate time and will use the only currently existent data.
	 * Thus, for example, if currently a chart doesn't have data prior `2018-01-01` date and you set visible range with `from` date `2016-01-01`, it will be automatically adjusted to `2018-01-01` (and the same for `to` date).
	 *
	 * But if you can approximate indexes on your own - you could use {@link setVisibleLogicalRange} instead.
	 *
	 * @param range - Target visible range of data.
	 * @example
	 * ```js
	 * chart.timeScale().setVisibleRange({
	 *     from: (new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0))).getTime() / 1000,
	 *     to: (new Date(Date.UTC(2018, 1, 1, 0, 0, 0, 0))).getTime() / 1000,
	 * });
	 * ```
	 */
	setVisibleRange(range: TimeRange): void;

	/**
	 * Returns the current visible [logical range](/time-scale.md#logical-range) of the chart as an object with the first and last time points of the logical range, or returns `null` if the chart has no data.
	 * 将图表当前可见的逻辑范围作为具有逻辑范围的第一个和最后一个时间点的对象返回
	 *
	 * @returns Visible range or null if the chart has no data at all.
	 */
	getVisibleLogicalRange(): LogicalRange | null;

	/**
	 * Sets visible [logical range](/time-scale.md#logical-range) of data.
	 * 设置图表的逻辑范围
	 *
	 * @param range - Target visible logical range of data.
	 * @example
	 * ```js
	 * chart.timeScale().setVisibleLogicalRange({ from: 0, to: Date.now() / 1000 });
	 * ```
	 */
	setVisibleLogicalRange(range: Range<number>): void;

	/**
	 * Restores default zoom level and scroll position of the time scale.
	 * 恢复时间刻度的默认缩放级别和滚动位置。
	 */
	resetTimeScale(): void;

	/**
	 * Automatically calculates the visible range to fit all data from all series.
	 * 自动计算可见范围以适合所有系列的所有数据
	 */
	fitContent(): void;

	/**
	 * Converts a logical index to local x coordinate.
	 * 将逻辑索引转换为局部 x 坐标。
	 *
	 * @param logical - Logical index needs to be converted
	 * @returns x coordinate of that time or `null` if the chart doesn't have data
	 */
	logicalToCoordinate(logical: Logical): Coordinate | null;

	/**
	 * Converts a coordinate to logical index.
	 * 将坐标转换为逻辑索引
	 *
	 * @param x - Coordinate needs to be converted
	 * @returns Logical index that is located on that coordinate or `null` if the chart doesn't have data
	 */
	coordinateToLogical(x: number): Logical | null;

	/**
	 * Converts a time to local x coordinate.
	 * 将时间转换为局部 x 坐标
	 *
	 * @param time - Time needs to be converted
	 * @returns X coordinate of that time or `null` if no time found on time scale
	 */
	timeToCoordinate(time: Time): Coordinate | null;

	/**
	 * Converts a coordinate to time.
	 * 将坐标转换为时间。
	 *
	 * @param x - Coordinate needs to be converted.
	 * @returns Time of a bar that is located on that coordinate or `null` if there are no bars found on that coordinate.
	 */
	coordinateToTime(x: number): Time | null;

	/**
	 * Returns a width of the time scale.
	 */
	width(): number;

	/**
	 * Returns a height of the time scale.
	 */
	height(): number;

	/**
	 * Subscribe to the visible time range change events.
	 * 订阅可见的时间范围更改事件
	 *
	 * The argument passed to the handler function is an object with `from` and `to` properties of type {@link Time}, or `null` if there is no visible data.
	 *
	 * @param handler - Handler (function) to be called when the visible indexes change.
	 * @example
	 * ```js
	 * function myVisibleTimeRangeChangeHandler(newVisibleTimeRange) {
	 *     if (newVisibleTimeRange === null) {
	 *         // handle null
	 *     }
	 *
	 *     // handle new logical range
	 * }
	 *
	 * chart.timeScale().subscribeVisibleTimeRangeChange(myVisibleTimeRangeChangeHandler);
	 * ```
	 */
	subscribeVisibleTimeRangeChange(handler: TimeRangeChangeEventHandler): void;

	/**
	 * Unsubscribe a handler that was previously subscribed using {@link subscribeVisibleTimeRangeChange}.
	 * 取消订阅以前使用 subscribeVisibleTimeRangeChange 订阅的处理程序。
	 *
	 * @param handler - Previously subscribed handler
	 * @example
	 * ```js
	 * chart.timeScale().unsubscribeVisibleTimeRangeChange(myVisibleTimeRangeChangeHandler);
	 * ```
	 */
	unsubscribeVisibleTimeRangeChange(handler: TimeRangeChangeEventHandler): void;

	/**
	 * Subscribe to the visible logical range change events.
	 * 订阅可见的逻辑范围更改事件。
	 *
	 * The argument passed to the handler function is an object with `from` and `to` properties of type `number`, or `null` if there is no visible data.
	 *
	 * @param handler - Handler (function) to be called when the visible indexes change.
	 * @example
	 * ```js
	 * function myVisibleLogicalRangeChangeHandler(newVisibleLogicalRange) {
	 *     if (newVisibleLogicalRange === null) {
	 *         // handle null
	 *     }
	 *
	 *     // handle new logical range
	 * }
	 *
	 * chart.timeScale().subscribeVisibleLogicalRangeChange(myVisibleLogicalRangeChangeHandler);
	 * ```
	 */
	subscribeVisibleLogicalRangeChange(handler: LogicalRangeChangeEventHandler): void;

	/**
	 * Unsubscribe a handler that was previously subscribed using {@link subscribeVisibleLogicalRangeChange}.
	 * 取消订阅以前使用 subscribeVisibleLogicalRangeChange 订阅的处理程序。
	 *
	 * @param handler - Previously subscribed handler
	 * @example
	 * ```js
	 * chart.timeScale().unsubscribeVisibleLogicalRangeChange(myVisibleLogicalRangeChangeHandler);
	 * ```
	 */
	unsubscribeVisibleLogicalRangeChange(handler: LogicalRangeChangeEventHandler): void;

	/**
	 * Adds a subscription to time scale size changes
	 * 添加对时间尺度大小更改的订阅
	 *
	 * @param handler - Handler (function) to be called when the time scale size changes
	 */
	subscribeSizeChange(handler: SizeChangeEventHandler): void;

	/**
	 * Removes a subscription to time scale size changes
	 * 删除对时间尺度大小更改的订阅
	 *
	 * @param handler - Previously subscribed handler
	 */
	unsubscribeSizeChange(handler: SizeChangeEventHandler): void;

	/**
	 * Applies new options to the time scale.
	 * 将新选项应用于时间尺度。
	 *
	 * @param options - Any subset of options.
	 */
	applyOptions(options: DeepPartial<TimeScaleOptions>): void;

	/**
	 * Returns current options
	 * 返回当前选项
	 *
	 * @returns Currently applied options
	 */
	options(): Readonly<TimeScaleOptions>;
}
