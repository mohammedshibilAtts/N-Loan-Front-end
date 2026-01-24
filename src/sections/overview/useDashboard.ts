import { useState, useCallback } from "react";
import { dashboardApi, CollectionStats, LoanStatusCounts, RecentUser, LockerCount } from "./dashboard.api";
import { Toast } from "../../components/toast/toast";

export function useDashboard() {
    const [collectionStats, setCollectionStats] = useState<CollectionStats | null>(null);
    const [loanStatusCounts, setLoanStatusCounts] = useState<LoanStatusCounts | null>(null);
    const [accountBalance, setAccountBalance] = useState<number>(0);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [lockerCount, setLockerCount] = useState<LockerCount[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = useCallback(async (params: any) => {
        setLoading(true);
        try {
            // Fetch all data in parallel
            const [
                collectionRes,
                loanStatusRes,
                balanceRes,
                usersRes,
                lockerRes
            ] = await Promise.allSettled([
                dashboardApi.getCollectionStats(params),
                dashboardApi.getLoanStatusCounts(params),
                dashboardApi.getAccountBalance(params),
                dashboardApi.getRecentUsers(params),
                dashboardApi.getLockerCount(params)
            ]);

            // Handle Collection Stats
            console.log("collectionRes ==> ", collectionRes);
            if (collectionRes.status === 'fulfilled' && collectionRes.value?.status === 200 ) {
                setCollectionStats(collectionRes.value.data);
            }

            // Handle Loan Status Counts
            if (loanStatusRes.status === 'fulfilled' && loanStatusRes.value?.status === 200) {
                setLoanStatusCounts(loanStatusRes.value.data);
            }

            // Handle Account Balance
            if (balanceRes.status === 'fulfilled' && balanceRes.value?.status === 200) {
                setAccountBalance(balanceRes.value.data);
            }

            // Handle Recent Users
            if (usersRes.status === 'fulfilled' && usersRes.value?.status === 200) {
                setRecentUsers(usersRes.value.data || []);
            }

            // Handle Locker Count
            if (lockerRes.status === 'fulfilled' && lockerRes.value?.status === 200) {
                setLockerCount(lockerRes.value.data || []);
            }

        } catch (err: any) {
            console.error("Error fetching dashboard data:", err);
            Toast.show({
                message: "Failed to fetch some dashboard data",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        collectionStats,
        loanStatusCounts,
        accountBalance,
        recentUsers,
        lockerCount,
        loading,
        fetchDashboardData,
    };
}
