"use client";

import {FC} from "react";
import {Task as TaskType} from "@/types";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {TrashIcon} from "lucide-react";

interface TaskProps {
    task: TaskType;
    onToggleCheck: (id: number, completed: boolean) => void;
    onDeleteTask: (id: number) => void;
}

const Task: FC<TaskProps> = ({task, onToggleCheck, onDeleteTask}) => {
    return (
        <div className="flex text-lg items-center justify-between w-full gap-4 ">
            <div className="flex flex-1 items-center gap-4">
                <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => onToggleCheck(task.id, Boolean(checked))}
                    className="w-6 h-6"
                />
                <span className={` ${task.completed ? "line-through text-gray-500" : "text-gray-100"}`}>
                    {task.description}
                </span>
            </div>
            <Button variant={"outline"} onClick={() => onDeleteTask(task.id)}>
                <TrashIcon className="w-6 h-6"/>
            </Button>
        </div>
    );
};

export default Task;
