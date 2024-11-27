"use server";

import {encodedRedirect} from "@/utils/utils";
import {createClient} from "@/utils/supabase/server";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export const signUpAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    if (!email || !password) {
        return encodedRedirect("error", "/sign-up", "Email and password are required");
    }

    const {data: signUpData, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error(error.code + " " + error.message);
        return encodedRedirect("error", "/sign-up", error.message);
    }

    const userId = signUpData.user?.id;

    if (!userId) {
        return encodedRedirect("error", "/sign-up", "Failed to retrieve user ID after sign-up");
    }

    const userName = email.substring(0, email.indexOf("@"));
    const {error: insertError} = await supabase.from("users").insert({username: userName, auth_id: userId});

    if (insertError) {
        console.error(insertError.code + " " + insertError.message);
        return encodedRedirect("error", "/sign-up", insertError.message);
    }
    return encodedRedirect("success", "/sign-up", "Thanks for signing up! Please check your email for a verification link.");
};

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return encodedRedirect("error", "/sign-in", error.message);
    }

    return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect("error", "/forgot-password", "Email is required");
    }

    const {error} = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
        console.error(error.message);
        return encodedRedirect("error", "/forgot-password", "Could not reset password");
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect("success", "/forgot-password", "Check your email for a link to reset your password.");
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        encodedRedirect("error", "/protected/reset-password", "Password and confirm password are required");
    }

    if (password !== confirmPassword) {
        encodedRedirect("error", "/protected/reset-password", "Passwords do not match");
    }

    const {error} = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        encodedRedirect("error", "/protected/reset-password", "Password update failed");
    }

    encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};

// Authenticated Actions
export const fetchTasksAction = async () => {
    const supabase = await createClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const {data: fetchedTasks, error} = await supabase.from("tasks").select().eq("user_id", user.id);
    if (error) {
        console.error(error.code + " " + error.message);
        throw new Error(error.code + " " + error.message);
    }
    return fetchedTasks;
}

export const createTaskAction = async (formData: FormData) => {
    // Parse description from form data
    const description = formData.get("description")?.toString();
    const supabase = await createClient();

    // Get the user from the current session
    const {
        data: {user},
    } = await supabase.auth.getUser();

    // Insert new task
    const {error} = await supabase.from("tasks").insert({user_id: user!.id, description});
    if (error) {
        console.error(error.code + " " + error.message);
        throw new Error(error.code + " " + error.message);
    }

    return {success: "Added task!"};
};

export const updateCompletedAction = async (id: number, completed: boolean) => {
    const supabase = await createClient();

    const {error} = await supabase.from("tasks").update({completed}).eq("id", id);

    if (error) {
        console.error(error.code + " " + error.message);
        throw new Error(error.code + " " + error.message);
    }

    return {success: "Successfully updated task!"};
};

export const deleteTaskAction = async (id: number) => {
    const supabase = await createClient();

    const {error} = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
        console.error(error.code + " " + error.message);
        throw new Error(error.code + " " + error.message);
    }

    return {success: "Successfully deleted task!"};
}

export const fetchUsersAndTasksAction = async () => {
    const supabase = await createClient();

    const {data: users, error} = await supabase
        .from('users')
        .select('*')

    if (error) {
        console.error(error.code + " " + error.message);
        throw new Error(error.code + " " + error.message);
    }

    let usersAndTasks = [];
    for (const user of users) {
        const {data: tasks, error} = await supabase.from("tasks").select().eq("user_id", !user.auth_id);

        if (error) {
            console.error(error.code + " " + error.message);
            throw new Error(error.code + " " + error.message);
        }

        usersAndTasks.push({user, tasks});
    }
    return usersAndTasks;
}