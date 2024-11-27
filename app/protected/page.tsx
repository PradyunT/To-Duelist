"use client";

import {FormMessage, Message} from "@/components/form-message";
import {Input} from "@/components/ui/input";
import {createTaskAction, deleteTaskAction, fetchTasksAction, updateCompletedAction} from "@/app/actions";
import {PlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Task from "@/components/task";
import {useState, useEffect} from "react";
import {Task as TaskType} from "@/types";

export default function HomePage() {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [numCompleted, setNumCompleted] = useState(0);
    const [formMessage, setFormMessage] = useState<Message | null>(null);

    // Fetch data on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const fetchedTasks = await fetchTasksAction();
            setTasks(fetchedTasks
                    ?.sort((a, b) => Number(a.completed) - Number(b.completed)) // Sort uncompleted tasks first
                || []);
            setNumCompleted(fetchedTasks?.filter((task) => task.completed).length || 0);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setFormMessage({error: "Unable to fetch tasks. Please try again later."});
        }
    };

    // Handle task creation
    const handleCreateTask = async (formData: FormData) => {
        try {
            const response = await createTaskAction(formData);
            setFormMessage(response);

            // Refresh tasks after adding
            await fetchTasks();
        } catch (err) {
            console.error("Error creating task:", err);
            setFormMessage({error: "Failed to create task. Please try again."});
        }
    };

    const handleToggleCheck = async (id: number, completed: boolean) => {
        try {
            const response = await updateCompletedAction(id, completed);
            setFormMessage(response);

            fetchTasks();
        } catch (err) {
            console.error("Error updating completing task:", err);
            setFormMessage({error: "Error updating completing task:" + err});
        }
    }

    const handleDeleteTask = async (id: number) => {
        try {
            const response = await deleteTaskAction(id);
            setFormMessage(response);

            fetchTasks();
        } catch (err) {
            console.error("Error deleting task:", err);
            setFormMessage({error: "Error deleting task:" + err});
        }
    }

    return (
        <div className="flex-1 w-full flex flex-col">
            {/* Tasks Display */}
            <div className="flex flex-col items-start min-w-[60vw] lg:min-w-[40vw]">
                <div>
                    <h2 className="font-bold text-2xl mb-2">You have {tasks.length} Tasks</h2>
                    <p className="text-gray-300">{numCompleted}🔥</p>
                </div>

                <div className="my-10 flex flex-col gap-2">
                    {tasks.length === 0 ? <p>Your tasks will be displayed here</p> : tasks.map((task) => <Task
                        key={task.id} task={task} onToggleCheck={handleToggleCheck} onDeleteTask={handleDeleteTask}/>)}
                </div>

                {/* Task Form */}
                <form className="flex flex-col w-full" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement); // Get form data
                    handleCreateTask(formData);
                }}>
                    <div className="flex flex-row gap-3 mb-3 w-full">
                        <Button type="submit">
                            <PlusIcon/>
                        </Button>
                        <Input name="description" placeholder="Eat a potato" required className="w-full"/>
                    </div>
                    {formMessage && <FormMessage message={formMessage}/>}
                </form>
            </div>
        </div>
    );
}
