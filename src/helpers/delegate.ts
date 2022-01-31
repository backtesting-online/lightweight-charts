import { Callback, ISubscription } from './isubscription';

interface Listener<T1, T2> {
	callback: Callback<T1, T2>;
	linkedObject?: unknown;
	// 是否只出发单次
	singleshot: boolean;
}

// 代理/委托相关
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class Delegate<T1 = void, T2 = void> implements ISubscription<T1, T2> {
	private _listeners: Listener<T1, T2>[] = [];

	// 订阅某事件
	public subscribe(callback: Callback<T1, T2>, linkedObject?: unknown, singleshot?: boolean): void {
		const listener: Listener<T1, T2> = {
			callback,
			linkedObject,
			singleshot: singleshot === true,
		};
		this._listeners.push(listener);
	}

	// 取消订阅
	public unsubscribe(callback: Callback<T1, T2>): void {
		const index = this._listeners.findIndex((listener: Listener<T1, T2>) => callback === listener.callback);
		if (index > -1) {
			this._listeners.splice(index, 1);
		}
	}

	// 取消订阅所有的 (WHY: 看代码是只保留 linkedObject 相同的)
	public unsubscribeAll(linkedObject: unknown): void {
		this._listeners = this._listeners.filter((listener: Listener<T1, T2>) => listener.linkedObject !== linkedObject);
	}

	// 触发所有的回调函数，用指定的参数
	public fire(param1: T1, param2: T2): void {
		const listenersSnapshot = [...this._listeners];
		this._listeners = this._listeners.filter((listener: Listener<T1, T2>) => !listener.singleshot);
		listenersSnapshot.forEach((listener: Listener<T1, T2>) => listener.callback(param1, param2));
	}

	// 是否有对应的监听器
	public hasListeners(): boolean {
		return this._listeners.length > 0;
	}

	// 销毁
	public destroy(): void {
		this._listeners = [];
	}
}
