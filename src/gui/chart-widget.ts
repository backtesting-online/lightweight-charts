import { ensureDefined, ensureNotNull } from '../helpers/assertions';
import { drawScaled } from '../helpers/canvas-helpers';
import { Delegate } from '../helpers/delegate';
import { IDestroyable } from '../helpers/idestroyable';
import { ISubscription } from '../helpers/isubscription';
import { DeepPartial } from '../helpers/strict-type-checks';

import { BarPrice, BarPrices } from '../model/bar';
import { ChartModel, ChartOptionsInternal } from '../model/chart-model';
import { Coordinate } from '../model/coordinate';
import {
	InvalidateMask,
	InvalidationLevel,
	TimeScaleInvalidation,
	TimeScaleInvalidationType,
} from '../model/invalidate-mask';
import { Point } from '../model/point';
import { PriceAxisPosition } from '../model/price-scale';
import { Series } from '../model/series';
import { TimePoint, TimePointIndex } from '../model/time-data';

import { createPreconfiguredCanvas, getCanvasDevicePixelRatio, getContext2D, Size } from './canvas-utils';
// import { PaneSeparator, SEPARATOR_HEIGHT } from './pane-separator';
import { PaneWidget } from './pane-widget';
import { TimeAxisWidget } from './time-axis-widget';

// 鼠标事件实现
export interface MouseEventParamsImpl {
	time?: TimePoint;
	point?: Point;
	seriesPrices: Map<Series, BarPrice | BarPrices>;
	hoveredSeries?: Series;
	hoveredObject?: string;
}

export type MouseEventParamsImplSupplier = () => MouseEventParamsImpl;

/**
 * 图表控件
 */
export class ChartWidget implements IDestroyable {
	// ChartApi 透传的 options
	private readonly _options: ChartOptionsInternal;
	// 窗格控件 TODO:类的实现
	private _paneWidgets: PaneWidget[] = [];
	// private _paneSeparators: PaneSeparator[] = [];
	private readonly _model: ChartModel;
	// requestAnimationFrame 返回的 ID 值, 应该是和 draw 相关
	private _drawRafId: number = 0;
	// 存储的图表高度和宽度
	private _height: number = 0;
	private _width: number = 0;
	// 左侧价格轴宽度
	private _leftPriceAxisWidth: number = 0;
	// 右侧价格轴宽度
	private _rightPriceAxisWidth: number = 0;
	// 顶层 Div 元素
	private _element: HTMLElement;
	// table 元素
	private readonly _tableElement: HTMLElement;
	// 时间轴控件
	private _timeAxisWidget: TimeAxisWidget;
	// 无效蒙层 TODO:
	private _invalidateMask: InvalidateMask | null = null;
	// TODO: 像是表示是否已经绘制过了
	private _drawPlanned: boolean = false;
	// 鼠标点击事件的订阅器
	private _clicked: Delegate<MouseEventParamsImplSupplier> = new Delegate();
	// 十字准星移动事件的订阅器
	private _crosshairMoved: Delegate<MouseEventParamsImplSupplier> = new Delegate();
	// 滚轮事件
	private _onWheelBound: (event: WheelEvent) => void;

	public constructor(container: HTMLElement, options: ChartOptionsInternal) {
		this._options = options;

		// 创建顶层的 Div
		this._element = document.createElement('div');
		this._element.classList.add('tv-lightweight-charts');
		this._element.style.overflow = 'hidden';
		this._element.style.width = '100%';
		this._element.style.height = '100%';

		// 禁止元素被选择
		disableSelection(this._element);

		// 创建 table 元素
		this._tableElement = document.createElement('table');
		this._tableElement.setAttribute('cellspacing', '0');
		this._element.appendChild(this._tableElement);

		// 滚轮事件
		this._onWheelBound = this._onMousewheel.bind(this);
		this._element.addEventListener('wheel', this._onWheelBound, { passive: false });

		// 创建图表模型 TODO:
		this._model = new ChartModel(
			this._invalidateHandler.bind(this),
			this._options
		);
		// TODO: 看着 chart model 也有自己的订阅器
		this.model().crosshairMoved().subscribe(this._onPaneWidgetCrosshairMoved.bind(this), this);

		// 创建时间轴控件，在 table 元素下插入这个元素
		this._timeAxisWidget = new TimeAxisWidget(this);
		this._tableElement.appendChild(this._timeAxisWidget.getElement());

		let width = this._options.width;
		let height = this._options.height;

		// 如果没有传递宽度，那么在元素上计算下
		if (width === 0 || height === 0) {
			const containerRect = container.getBoundingClientRect();
			// TODO: Fix it better
			// on Hi-DPI CSS size * Device Pixel Ratio should be integer to avoid smoothing
			// For chart widget we decreases because we must be inside container.
			// For time axis this is not important, since it just affects space for pane widgets
			if (width === 0) {
				width = Math.floor(containerRect.width);
				width -= width % 2;
			}

			if (height === 0) {
				height = Math.floor(containerRect.height);
				height -= height % 2;
			}
		}

		// BEWARE: resize must be called BEFORE _syncGuiWithModel (in constructor only)
		// or after but with adjustSize to properly update time scale
		// 注意：调整大小必须在_syncGuiWithModel之前调用（仅在构造函数中）。
		// 或者在调用之后，但要与调整尺寸一起调用，以正确地更新时间刻度。
		this.resize(width, height);

		this._syncGuiWithModel();

		// 插入 Div
		container.appendChild(this._element);
		// 更新时间轴刻度的可见性
		this._updateTimeAxisVisibility();
		// 订阅 options 的更新 TODO:内部实现
		this._model.timeScale().optionsApplied().subscribe(this._model.fullUpdate.bind(this._model), this);
		this._model.priceScalesOptionsChanged().subscribe(this._model.fullUpdate.bind(this._model), this);
	}

	// 获取 chart model 实例
	public model(): ChartModel {
		return this._model;
	}

	// 获取 chart options
	public options(): Readonly<ChartOptionsInternal> {
		return this._options;
	}

	// 获取窗格控件列表
	public paneWidgets(): PaneWidget[] {
		return this._paneWidgets;
	}

	// 获取时间轴控件实例
	public timeAxisWidget(): TimeAxisWidget {
		return this._timeAxisWidget;
	}

	// 销毁 chart 控件
	public destroy(): void {
		// 事件回调销毁
		this._element.removeEventListener('wheel', this._onWheelBound);
		if (this._drawRafId !== 0) {
			window.cancelAnimationFrame(this._drawRafId);
		}

		// 取消订阅并销毁 model
		this._model.crosshairMoved().unsubscribeAll(this);
		this._model.timeScale().optionsApplied().unsubscribeAll(this);
		this._model.priceScalesOptionsChanged().unsubscribeAll(this);
		this._model.destroy();

		// 移除窗格控件
		for (const paneWidget of this._paneWidgets) {
			this._tableElement.removeChild(paneWidget.getElement());
			paneWidget.clicked().unsubscribeAll(this);
			paneWidget.destroy();
		}
		this._paneWidgets = [];

		// for (const paneSeparator of this._paneSeparators) {
		// 	this._destroySeparator(paneSeparator);
		// }
		// this._paneSeparators = [];

		// 移除时间轴控件
		ensureNotNull(this._timeAxisWidget).destroy();

		// 父组件移除 chart div
		if (this._element.parentElement !== null) {
			this._element.parentElement.removeChild(this._element);
		}

		// 监听器销毁
		this._crosshairMoved.destroy();
		this._clicked.destroy();
	}

	// 调整 chart widget 的大小
	public resize(width: number, height: number, forceRepaint: boolean = false): void {
		if (this._height === height && this._width === width) {
			return;
		}

		this._height = height;
		this._width = width;

		const heightStr = height + 'px';
		const widthStr = width + 'px';

		// 重置最外层 div 的宽高
		ensureNotNull(this._element).style.height = heightStr;
		ensureNotNull(this._element).style.width = widthStr;
		// 重置 table 的宽高
		this._tableElement.style.height = heightStr;
		this._tableElement.style.width = widthStr;

		// TODO: 更新 UI 逻辑
		if (forceRepaint) {
			this._drawImpl(new InvalidateMask(InvalidationLevel.Full));
		} else {
			this._model.fullUpdate();
		}
	}

	// 绘图 (窗格控件 + 时间轴控件)
	// TODO:内部实现
	public paint(invalidateMask?: InvalidateMask): void {
		if (invalidateMask === undefined) {
			invalidateMask = new InvalidateMask(InvalidationLevel.Full);
		}

		for (let i = 0; i < this._paneWidgets.length; i++) {
			this._paneWidgets[i].paint(invalidateMask.invalidateForPane(i).level);
		}

		if (this._options.timeScale.visible) {
			this._timeAxisWidget.paint(invalidateMask.fullInvalidation());
		}
	}

	// 应用新的图表 options
	public applyOptions(options: DeepPartial<ChartOptionsInternal>): void {
		// we don't need to merge options here because it's done in chart model
		// and since both model and widget share the same object it will be done automatically for widget as well
		// not ideal solution for sure, but it work's for now ¯\_(ツ)_/¯
		// 我们不需要在这里合并选项，因为它是在图表模型中完成的
        // 由于模型和小部件共享同一对象，因此小部件也将自动完成
        // 肯定不是理想的解决方案，但它现在̄\_(ツ)_/ ̄有效
		this._model.applyOptions(options);
		this._updateTimeAxisVisibility();

		// 重置下大小
		const width = options.width || this._width;
		const height = options.height || this._height;

		this.resize(width, height);
	}

	// 暴露鼠标点击订阅器
	public clicked(): ISubscription<MouseEventParamsImplSupplier> {
		return this._clicked;
	}

	// 暴露十字准星订阅器
	public crosshairMoved(): ISubscription<MouseEventParamsImplSupplier> {
		return this._crosshairMoved;
	}

	// REMOTE:截取屏幕截图
	public takeScreenshot(): HTMLCanvasElement {
		if (this._invalidateMask !== null) {
			this._drawImpl(this._invalidateMask);
			this._invalidateMask = null;
		}
		// calculate target size
		const firstPane = this._paneWidgets[0];
		const targetCanvas = createPreconfiguredCanvas(document, new Size(this._width, this._height));
		const ctx = getContext2D(targetCanvas);
		const pixelRatio = getCanvasDevicePixelRatio(targetCanvas);
		drawScaled(ctx, pixelRatio, () => {
			let targetX = 0;
			let targetY = 0;

			const drawPriceAxises = (position: PriceAxisPosition) => {
				for (let paneIndex = 0; paneIndex < this._paneWidgets.length; paneIndex++) {
					const paneWidget = this._paneWidgets[paneIndex];
					const paneWidgetHeight = paneWidget.getSize().h;
					const priceAxisWidget = ensureNotNull(position === 'left' ? paneWidget.leftPriceAxisWidget() : paneWidget.rightPriceAxisWidget());
					const image = priceAxisWidget.getImage();
					ctx.drawImage(image, targetX, targetY, priceAxisWidget.getWidth(), paneWidgetHeight);
					targetY += paneWidgetHeight;
					// if (paneIndex < this._paneWidgets.length - 1) {
					// 	const separator = this._paneSeparators[paneIndex];
					// 	const separatorSize = separator.getSize();
					// 	const separatorImage = separator.getImage();
					// 	ctx.drawImage(separatorImage, targetX, targetY, separatorSize.w, separatorSize.h);
					// 	targetY += separatorSize.h;
					// }
				}
			};
			// draw left price scale if exists
			if (this._isLeftAxisVisible()) {
				drawPriceAxises('left');
				targetX = ensureNotNull(firstPane.leftPriceAxisWidget()).getWidth();
			}
			targetY = 0;
			for (let paneIndex = 0; paneIndex < this._paneWidgets.length; paneIndex++) {
				const paneWidget = this._paneWidgets[paneIndex];
				const paneWidgetSize = paneWidget.getSize();
				const image = paneWidget.getImage();
				ctx.drawImage(image, targetX, targetY, paneWidgetSize.w, paneWidgetSize.h);
				targetY += paneWidgetSize.h;
				// if (paneIndex < this._paneWidgets.length - 1) {
				// 	const separator = this._paneSeparators[paneIndex];
				// 	const separatorSize = separator.getSize();
				// 	const separatorImage = separator.getImage();
				// 	ctx.drawImage(separatorImage, targetX, targetY, separatorSize.w, separatorSize.h);
				// 	targetY += separatorSize.h;
				// }
			}
			targetX += firstPane.getSize().w;
			if (this._isRightAxisVisible()) {
				targetY = 0;
				drawPriceAxises('right');
			}
			const drawStub = (position: PriceAxisPosition) => {
				const stub = ensureNotNull(position === 'left' ? this._timeAxisWidget.leftStub() : this._timeAxisWidget.rightStub());
				const size = stub.getSize();
				const image = stub.getImage();
				ctx.drawImage(image, targetX, targetY, size.w, size.h);
			};
			// draw time scale
			if (this._options.timeScale.visible) {
				targetX = 0;
				if (this._isLeftAxisVisible()) {
					drawStub('left');
					targetX = ensureNotNull(firstPane.leftPriceAxisWidget()).getWidth();
				}
				const size = this._timeAxisWidget.getSize();
				const image = this._timeAxisWidget.getImage();
				ctx.drawImage(image, targetX, targetY, size.w, size.h);
				if (this._isRightAxisVisible()) {
					targetX += firstPane.getSize().w;
					drawStub('right');
					ctx.restore();
				}
			}
		});
		return targetCanvas;
	}

	// 获取价格轴宽度
	public getPriceAxisWidth(position: PriceAxisPosition): number {
		if (position === 'none') {
			return 0;
		}

		if (position === 'left' && !this._isLeftAxisVisible()) {
			return 0;
		}

		if (position === 'right' && !this._isRightAxisVisible()) {
			return 0;
		}

		if (this._paneWidgets.length === 0) {
			return 0;
		}

		// we don't need to worry about exactly pane widget here
		// because all pane widgets have the same width of price axis widget
		// see _adjustSizeImpl
		// 我们不需要担心这里的窗格部件
		// 因为所有的窗格部件都有与价格轴部件相同的宽度
		// 见 _adjustSizeImpl
		// TODO: _paneWidgets 里面是装什么的, 在哪里赋值
		const priceAxisWidget = position === 'left'
			? this._paneWidgets[0].leftPriceAxisWidget()
			: this._paneWidgets[0].rightPriceAxisWidget();
		return ensureNotNull(priceAxisWidget).getWidth();
	}

	// 调整大小的实现 TODO:内部实现
	// eslint-disable-next-line complexity
	private _adjustSizeImpl(): void {
		let totalStretch = 0;
		let leftPriceAxisWidth = 0;
		let rightPriceAxisWidth = 0;

		for (const paneWidget of this._paneWidgets) {
			if (this._isLeftAxisVisible()) {
				leftPriceAxisWidth = Math.max(leftPriceAxisWidth, ensureNotNull(paneWidget.leftPriceAxisWidget()).optimalWidth());
			}
			if (this._isRightAxisVisible()) {
				rightPriceAxisWidth = Math.max(rightPriceAxisWidth, ensureNotNull(paneWidget.rightPriceAxisWidget()).optimalWidth());
			}

			totalStretch += paneWidget.stretchFactor();
		}

		const width = this._width;
		const height = this._height;

		const paneWidth = Math.max(width - leftPriceAxisWidth - rightPriceAxisWidth, 0);

		// const separatorCount = this._paneSeparators.length;
		// const separatorHeight = SEPARATOR_HEIGHT;
		const separatorsHeight = 0; // separatorHeight * separatorCount;
		const timeAxisVisible = this._options.timeScale.visible;
		let timeAxisHeight = timeAxisVisible ? this._timeAxisWidget.optimalHeight() : 0;
		// TODO: Fix it better
		// on Hi-DPI CSS size * Device Pixel Ratio should be integer to avoid smoothing
		if (timeAxisHeight % 2) {
			timeAxisHeight += 1;
		}
		const otherWidgetHeight = separatorsHeight + timeAxisHeight;
		const totalPaneHeight = height < otherWidgetHeight ? 0 : height - otherWidgetHeight;
		const stretchPixels = totalPaneHeight / totalStretch;

		let accumulatedHeight = 0;
		for (let paneIndex = 0; paneIndex < this._paneWidgets.length; ++paneIndex) {
			const paneWidget = this._paneWidgets[paneIndex];
			paneWidget.setState(this._model.panes()[paneIndex]);

			let paneHeight = 0;
			let calculatePaneHeight = 0;

			if (paneIndex === this._paneWidgets.length - 1) {
				calculatePaneHeight = totalPaneHeight - accumulatedHeight;
			} else {
				calculatePaneHeight = Math.round(paneWidget.stretchFactor() * stretchPixels);
			}

			paneHeight = Math.max(calculatePaneHeight, 2);

			accumulatedHeight += paneHeight;

			paneWidget.setSize(new Size(paneWidth, paneHeight));
			if (this._isLeftAxisVisible()) {
				paneWidget.setPriceAxisSize(leftPriceAxisWidth, 'left');
			}
			if (this._isRightAxisVisible()) {
				paneWidget.setPriceAxisSize(rightPriceAxisWidth, 'right');
			}

			if (paneWidget.state()) {
				this._model.setPaneHeight(paneWidget.state(), paneHeight);
			}
		}

		this._timeAxisWidget.setSizes(
			new Size(timeAxisVisible ? paneWidth : 0, timeAxisHeight),
			timeAxisVisible ? leftPriceAxisWidth : 0,
			timeAxisVisible ? rightPriceAxisWidth : 0
		);

		this._model.setWidth(paneWidth);
		if (this._leftPriceAxisWidth !== leftPriceAxisWidth) {
			this._leftPriceAxisWidth = leftPriceAxisWidth;
		}
		if (this._rightPriceAxisWidth !== rightPriceAxisWidth) {
			this._rightPriceAxisWidth = rightPriceAxisWidth;
		}
	}

	// 鼠标滚动事件
	private _onMousewheel(event: WheelEvent): void {
		// WHY: 为什么要除以100
		// 滚轮的横向滚动量 (往右为正， 往左为负)
		let deltaX = event.deltaX / 100;
		// 滚轮的纵向滚动量 (deltaY 往上为正，往下为负)
		let deltaY = -(event.deltaY / 100);

		// 如果用户禁止滚动或者横纵向没有滚动距离，直接返回
		if ((deltaX === 0 || !this._options.handleScroll.mouseWheel) &&
			(deltaY === 0 || !this._options.handleScale.mouseWheel)) {
			return;
		}

		// 取消默认行为
		if (event.cancelable) {
			event.preventDefault();
		}

		// WHY: deltaX 和 deltaY 的计算逻辑
		switch (event.deltaMode) {
			case event.DOM_DELTA_PAGE:
				// one screen at time scroll mode
				// 滚动量单位为像素
				deltaX *= 120;
				deltaY *= 120;
				break;

			case event.DOM_DELTA_LINE:
				// one line at time scroll mode
				// 滚动量单位为行
				deltaX *= 32;
				deltaY *= 32;
				break;
		}

		// 在 Y 轴上执行了缩放
		if (deltaY !== 0 && this._options.handleScale.mouseWheel) {
			// Math.sign: 返回一个数字的符号, 指示数字是正数，负数还是零
			// Math.abs: 计算绝对值
			// 缩放比例
			const zoomScale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY));
			// 当前鼠标滚动的位置（要减去 chart element 左侧的位置）
			const scrollPosition = event.clientX - this._element.getBoundingClientRect().left;
			// TODO:内部实现
			this.model().zoomTime(scrollPosition as Coordinate, zoomScale);
		}

		// 在 X 轴上执行了缩放, 需要滚动图表
		if (deltaX !== 0 && this._options.handleScroll.mouseWheel) {
			// TODO: 内部实现
			this.model().scrollChart(deltaX * -80 as Coordinate); // 80 is a made up coefficient, and minus is for the "natural" scroll
		}
	}

	// TODO:绘图的实现
	private _drawImpl(invalidateMask: InvalidateMask): void {
		const invalidationType = invalidateMask.fullInvalidation();

		// actions for full invalidation ONLY (not shared with light)
		// 仅用于完全无效的行动（不与light共享）
		if (invalidationType === InvalidationLevel.Full) {
			this._updateGui();
		}

		// light or full invalidate actions
		// 轻度或完全无效操作
		if (
			invalidationType === InvalidationLevel.Full ||
			invalidationType === InvalidationLevel.Light
		) {
			this._applyMomentaryAutoScale(invalidateMask);
			this._applyTimeScaleInvalidations(invalidateMask);

			this._timeAxisWidget.update();
			this._paneWidgets.forEach((pane: PaneWidget) => {
				pane.updatePriceAxisWidgets();
			});

			// In the case a full invalidation has been postponed during the draw, reapply
			// the timescale invalidations. A full invalidation would mean there is a change
			// in the timescale width (caused by price scale changes) that needs to be drawn
			// right away to avoid flickering.
			if (this._invalidateMask?.fullInvalidation() === InvalidationLevel.Full) {
				this._invalidateMask.merge(invalidateMask);

				this._updateGui();

				this._applyMomentaryAutoScale(this._invalidateMask);
				this._applyTimeScaleInvalidations(this._invalidateMask);

				invalidateMask = this._invalidateMask;
				this._invalidateMask = null;
			}
		}

		this.paint(invalidateMask);
	}

	private _applyTimeScaleInvalidations(invalidateMask: InvalidateMask): void {
		const timeScaleInvalidations = invalidateMask.timeScaleInvalidations();
		for (const tsInvalidation of timeScaleInvalidations) {
			this._applyTimeScaleInvalidation(tsInvalidation);
		}
	}

	private _applyMomentaryAutoScale(invalidateMask: InvalidateMask): void {
		const panes = this._model.panes();
		for (let i = 0; i < panes.length; i++) {
			if (invalidateMask.invalidateForPane(i).autoScale) {
				panes[i].momentaryAutoScale();
			}
		}
	}

	// 应用时间刻度失效: TODO:
	private _applyTimeScaleInvalidation(invalidation: TimeScaleInvalidation): void {
		const timeScale = this._model.timeScale();
		switch (invalidation.type) {
			case TimeScaleInvalidationType.FitContent:
				timeScale.fitContent();
				break;
			case TimeScaleInvalidationType.ApplyRange:
				timeScale.setLogicalRange(invalidation.value);
				break;
			case TimeScaleInvalidationType.ApplyBarSpacing:
				timeScale.setBarSpacing(invalidation.value);
				break;
			case TimeScaleInvalidationType.ApplyRightOffset:
				timeScale.setRightOffset(invalidation.value);
				break;
			case TimeScaleInvalidationType.Reset:
				timeScale.restoreDefault();
				break;
		}
	}

	// 无效视图的 handler TODO:
	private _invalidateHandler(invalidateMask: InvalidateMask): void {
		if (this._invalidateMask !== null) {
			this._invalidateMask.merge(invalidateMask);
		} else {
			this._invalidateMask = invalidateMask;
		}

		if (!this._drawPlanned) {
			this._drawPlanned = true;
			this._drawRafId = window.requestAnimationFrame(() => {
				this._drawPlanned = false;
				this._drawRafId = 0;

				if (this._invalidateMask !== null) {
					const mask = this._invalidateMask;
					this._invalidateMask = null;
					this._drawImpl(mask);
				}
			});
		}
	}

	// 更新 UI
	private _updateGui(): void {
		this._syncGuiWithModel();
	}

	// private _destroySeparator(separator: PaneSeparator): void {
	// 	this._tableElement.removeChild(separator.getElement());
	// 	separator.destroy();
	// }

	// 同步 GUI TODO: 内部实现
	private _syncGuiWithModel(): void {
		// 获取窗格控件
		const panes = this._model.panes();
		const targetPaneWidgetsCount = panes.length;
		const actualPaneWidgetsCount = this._paneWidgets.length;

		// Remove (if needed) pane widgets and separators
		// 删除（如果需要）窗格微件
		for (let i = targetPaneWidgetsCount; i < actualPaneWidgetsCount; i++) {
			const paneWidget = ensureDefined(this._paneWidgets.pop());
			this._tableElement.removeChild(paneWidget.getElement());
			paneWidget.clicked().unsubscribeAll(this);
			paneWidget.destroy();

			// const paneSeparator = this._paneSeparators.pop();
			// if (paneSeparator !== undefined) {
			// 	this._destroySeparator(paneSeparator);
			// }
		}

		// Create (if needed) new pane widgets and separators
		// 创建（如果需要）窗格微件
		for (let i = actualPaneWidgetsCount; i < targetPaneWidgetsCount; i++) {
			const paneWidget = new PaneWidget(this, panes[i]);
			paneWidget.clicked().subscribe(this._onPaneWidgetClicked.bind(this), this);

			this._paneWidgets.push(paneWidget);

			// create and insert separator
			// if (i > 1) {
			// 	const paneSeparator = new PaneSeparator(this, i - 1, i, true);
			// 	this._paneSeparators.push(paneSeparator);
			// 	this._tableElement.insertBefore(paneSeparator.getElement(), this._timeAxisWidget.getElement());
			// }

			// insert paneWidget
			this._tableElement.insertBefore(paneWidget.getElement(), this._timeAxisWidget.getElement());
		}

		// 更新窗格控件
		for (let i = 0; i < targetPaneWidgetsCount; i++) {
			const state = panes[i];
			const paneWidget = this._paneWidgets[i];
			if (paneWidget.state() !== state) {
				paneWidget.setState(state);
			} else {
				paneWidget.updatePriceAxisWidgetsStates();
			}
		}

		// 调整大小
		this._updateTimeAxisVisibility();
		this._adjustSizeImpl();
	}

	// 获取鼠标事件参数 TODO:内部实现
	private _getMouseEventParamsImpl(index: TimePointIndex | null, point: Point | null): MouseEventParamsImpl {
		const seriesPrices = new Map<Series, BarPrice | BarPrices>();
		if (index !== null) {
			const serieses = this._model.serieses();
			serieses.forEach((s: Series) => {
				// TODO: replace with search left
				const prices = s.dataAt(index);
				if (prices !== null) {
					seriesPrices.set(s, prices);
				}
			});
		}
		let clientTime: TimePoint | undefined;
		if (index !== null) {
			const timePoint = this._model.timeScale().indexToTime(index);
			if (timePoint !== null) {
				clientTime = timePoint;
			}
		}

		const hoveredSource = this.model().hoveredSource();

		const hoveredSeries = hoveredSource !== null && hoveredSource.source instanceof Series
			? hoveredSource.source
			: undefined;

		const hoveredObject = hoveredSource !== null && hoveredSource.object !== undefined
			? hoveredSource.object.externalId
			: undefined;

		return {
			time: clientTime,
			point: point || undefined,
			hoveredSeries,
			seriesPrices,
			hoveredObject,
		};
	}

	// 窗格控件组件触发鼠标点击事件
	private _onPaneWidgetClicked(time: TimePointIndex | null, point: Point): void {
		this._clicked.fire(() => this._getMouseEventParamsImpl(time, point));
	}

	// 窗格上的小工具十字准星移动时触发
	private _onPaneWidgetCrosshairMoved(time: TimePointIndex | null, point: Point | null): void {
		this._crosshairMoved.fire(() => this._getMouseEventParamsImpl(time, point));
	}

	// 更新时间轴刻度的可见性
	private _updateTimeAxisVisibility(): void {
		const display = this._options.timeScale.visible ? '' : 'none';
		this._timeAxisWidget.getElement().style.display = display;
	}

	// 左边坐标轴是否可见
	private _isLeftAxisVisible(): boolean {
		return this._paneWidgets[0].state().leftPriceScale().options().visible;
	}

	// 右边坐标轴是否可见
	private _isRightAxisVisible(): boolean {
		return this._paneWidgets[0].state().rightPriceScale().options().visible;
	}
}

function disableSelection(element: HTMLElement): void {
	element.style.userSelect = 'none';
	// eslint-disable-next-line deprecation/deprecation
	element.style.webkitUserSelect = 'none';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access
	(element.style as any).msUserSelect = 'none';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access
	(element.style as any).MozUserSelect = 'none';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access
	(element.style as any).webkitTapHighlightColor = 'transparent';
}
