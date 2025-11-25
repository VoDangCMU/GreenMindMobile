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
declare interface IDailySpending extends IBaseMetricParams {
    daily_total: number;
    base_avg: number;
}