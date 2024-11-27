"use client";
import {useEffect, useState} from "react";
import {fetchUsersAndTasksAction} from "@/app/actions";
import DuelistCard from "@/components/DuelistCard";
import {UserData} from "@/types";

export default function ViewDuelistsPage() {
    let [userData, setUserData] = useState<UserData[]>();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const result = await fetchUsersAndTasksAction()
        setUserData(result);
    }

    return <div className="flex flex-row gap-2">
        {userData && userData.map((userAndTaskData) => <DuelistCard key={userAndTaskData.user.id}
                                                                    userData={userAndTaskData}/>)}
    </div>
}