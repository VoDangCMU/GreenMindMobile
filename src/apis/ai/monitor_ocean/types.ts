export interface IMonitorOceanResponse {
    metric: string;
    vt: number;
    bt: number;
    r: number;
    n: number;
    contrib: number;
    new_ocean_score: OceanScore;
    mechanismFeedback: IMechanismFeedback;
    reason: string;
}

export interface OceanScore {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
}

export interface IMechanismFeedback {
    awareness: string;
    motivation: string;
    capability: string;
    opportunity: string;
}

export const example_response = {
    "metric": "avg_daily_spend",
    "vt": 450000.0,
    "bt": 500000.0,
    "r": -0.09999999999999998,
    "n": 0.5249791874789399,
    "contrib": 0.009991674991575961,
    "new_ocean_score": {
        "O": 0.5,
        "C": 0.604995837495788,
        "E": 0.4,
        "A": 0.7,
        "N": 0.3
    }
}