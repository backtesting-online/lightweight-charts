import { IPaneView } from '../views/pane/ipane-view';
import { IPriceAxisView } from '../views/price-axis/iprice-axis-view';
import { ITimeAxisView } from '../views/time-axis/itime-axis-view';

import { Pane } from './pane';
import { PriceScale } from './price-scale';
export interface IDataSource {
	zorder(): number | null;
	setZorder(value: number): void;
	// 价格刻度
	priceScale(): PriceScale | null;
	// 设置价格刻度
	setPriceScale(scale: PriceScale | null): void;

	// 更新所有视图
	updateAllViews(): void;

	// 价格坐标轴视图
	priceAxisViews(pane?: Pane, priceScale?: PriceScale): readonly IPriceAxisView[];
	// 时间轴视图
	timeAxisViews(): readonly ITimeAxisView[];
	// 窗格视图
	paneViews(pane: Pane): readonly IPaneView[];

	/**
	 * Pane views that are painted on the most top layer
	 * 绘制在最顶层的窗格视图
	 */
	topPaneViews?(pane: Pane): readonly IPaneView[];

	visible(): boolean;

	destroy?(): void;
}
