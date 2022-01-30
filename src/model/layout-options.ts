/**
 * Represents a type of color.
 * 颜色类型
 */
export const enum ColorType {
	/** Solid color */
	// 固体
	Solid = 'solid',
	/** Vertical gradient color */
	// 垂直渐变
	VerticalGradient = 'gradient',
}

/**
 * Represents a solid color.
 */
export interface SolidColor {
	/**
	 * Type of color.
	 */
	type: ColorType.Solid;

	/**
	 * Color.
	 */
	color: string;
}

/**
 * Represents a vertical gradient of two colors.
 * 表示两种颜色的垂直渐变
 */
export interface VerticalGradientColor {
	/**
	 * Type of color.
	 */
	type: ColorType.VerticalGradient;

	/**
	 * Top color
	 */
	topColor: string;

	/**
	 * Bottom color
	 */
	bottomColor: string;
}

/**
 * Represents the background color of the chart.
 */
export type Background = SolidColor | VerticalGradientColor;

/** Represents layout options */
export interface LayoutOptions {
	/**
	 * Chart and scales background color.
	 * 图表和缩放区域的背景色
	 *
	 * @defaultValue `{ type: ColorType.Solid, color: '#FFFFFF' }`
	 */
	background: Background;

	/**
	 * @deprecated Use background instead.
	 */
	backgroundColor: string;

	/**
	 * Color of text on the scales.
	 *
	 * @defaultValue `'#191919'`
	 */
	textColor: string;

	/**
	 * Font size of text on scales in pixels.
	 *
	 * @defaultValue `11`
	 */
	fontSize: number;

	/**
	 * Font family of text on the scales.
	 *
	 * @defaultValue `'Trebuchet MS', Roboto, Ubuntu, sans-serif`
	 */
	fontFamily: string;
}

export type LayoutOptionsInternal = Omit<LayoutOptions, 'backgroundColor'>;
