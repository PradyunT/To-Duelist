import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
    return (
        <div className="flex flex-col gap-8 items-center">
            <div
                className="mb-8 justify-center items-center text-4xl lg:text-6xl font-black tracking-wide">To-Duelist
            </div>
            <h1 className="sr-only">To-Duelist: A To-do list with competition</h1>
            <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
                A To-do list with <b>competition</b>
                <span className="ml-2">💪</span>
                <span className="text-xl text-gray-400">Track your tasks, compete, and win!</span>
            </p>
            <div className="flex gap-2">
                <Button asChild size="sm" variant={"outline"}>
                    <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm" variant={"default"}>
                    <Link href="/sign-up">Sign up</Link>
                </Button>
            </div>
        </div>
    );
}
