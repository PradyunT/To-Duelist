import {UserData as UserDataType} from "@/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Accordion, AccordionItem, AccordionTrigger, AccordionContent} from "@/components/ui/accordion";

const DuelistCard = ({userData}: { userData: UserDataType }) => {
    const completedTasks = userData.tasks.filter((task) => task.completed).length;
    const pendingTasks = userData.tasks.length - completedTasks;

    return (
        <Card className="w-full max-w-md border border-gray-300 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{userData.user.username ?? "Unknown User"}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-2">
                    <span className="font-bold">{completedTasks}</span> tasks completed
                </p>
                <p className="text-sm mb-4">
                    <span className="font-bold">{pendingTasks}</span> tasks remaining
                </p>
                <Accordion type="single" collapsible>
                    <AccordionItem value="task-list">
                        <AccordionTrigger className="text-sm font-medium">
                            View Tasks
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-2">
                                {userData.tasks.map((task) => (
                                    <li key={task.id} className="text-sm">
                                        <span
                                            className={`${
                                                task.completed ? "line-through text-gray-300" : "text-white"
                                            }`}
                                        >
                                            {task.description ?? "No description"}
                                        </span>
                                        <span className="text-xs ml-2 text-gray-400">
                                            {task.completed ? "(Completed)" : "(Pending)"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default DuelistCard;
