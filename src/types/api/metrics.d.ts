// commons response 
declare interface IMonitorOceanResponse {
	metric: string;
	vt: number;
	bt: number;
	r: number;
	n: number;
	contrib: number;
	new_ocean_score: IOcean;
	mechanismFeedback: IMechanismFeedback;
	reason: string;
}

declare interface IMechanismFeedback {
	awareness: string;
	motivation: string;
	capability: string;
	opportunity: string;
}
// Per request

declare interface IBaseMetricParams {
	weight?: number;
	direction?: string;
	sigma_r?: number;
	alpha?: number;
	ocean_score: IOcean;
}

// avg daily spending params
declare interface IDailySpendingParams extends IBaseMetricParams {
	daily_total: number;
	base_avg: number;
}

// avg daily distance
declare interface IDailyMovingParams extends IBaseMetricParams {
	distance_today: number;
	base_avg_distance: number;
}

// list adherence params
declare interface ITodo {
	task: string;
	done: boolean;
}
declare interface ITodoAffectParams extends IBaseMetricParams {
	todos: Array<ITodo>,
	base_likert: number
}

// night out params
declare interface INightOutParams extends IBaseMetricParams {
	night_out_count: number;
	base_night_out: number;
}