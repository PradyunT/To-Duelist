export type Task = {
    completed: boolean;
    created_at: string;
    description: string | null;
    id: number;
    user_id: string;
};

export type User = {
    auth_id: string | null;
    id: string;
    username: string | null;
};

export type UserData = {
    user: User;
    tasks: Task[];
};