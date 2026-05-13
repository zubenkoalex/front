import { CompanyCreative } from "../types/Dashboard";

export interface Company {
    id: string;
    name: string;
    theme: string;
    url: string;
    purpose: string;
    budget: number;
    start: string;
    end: string;
    description: string;
    gender: string;
    age: string;
    country: string | string[];
    interests: string[];
    creatives: CompanyCreative[];
    platform: string;
    strategy: string;
    status: "active" | "pause" | "end";
    statistics: {
        spent: {
            value: number;
            profit: number;
        },
        audienceReach: {
            value: number;
            profit: number;
        },
        ctr: {
            value: number;
            profit: number;
        },
        conversions: {
            value: number;
            profit: number;
        }
    }
    createAt: string;
    endAt?: string;
}