"use client";
import {useEffect} from "react";
import {fetchUsersAndTasksAction} from "@/app/actions";

export default function ViewDuelistsPage() {
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const result = await fetchUsersAndTasksAction()
        console.log(result);
    }

    return <div>View duelists</div>
}