import { apiService } from "../../services/apiService";

export interface CollectionStats {
    totalCollection: number;
    interestCollected: number;
    principalCollected: number;
    overdueCollected: number;
    paidCount: number;
    totalDueCount: number;
}

export interface LoanStatusCounts {
    create: number;
    closed: number;
    overDue: number;
}

export interface RecentUser {
    _id: string;
    firstName: string;
    lastName: string;
    mobile: string;
    img: string;
    createdAt: string;
}

export interface LockerCount {
    metalName: string;
    weight: number;
}

export const dashboardApi = {
    getCollectionStats: (data: any) =>
        apiService.post("/dashboard/collectionStats", data),
    getLoanStatusCounts: (data: any) =>
        apiService.post("/dashboard/loanStatusCounts", data),
    getAccountBalance: (data: any) =>
        apiService.post("/dashboard/accountBalance", data),
    getRecentUsers: (data: any) =>
        apiService.post("/dashboard/recentUsers", data),
    getLockerCount: (data: any) =>
        apiService.post("/dashboard/lockerCount", data),
};
