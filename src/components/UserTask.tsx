import type { Task } from "../utils/Data-Task"

const UserTask = ({task}: {task: Task}) => {
    return  <div className="border rounded-lg px-2 m-2 bg-gray-50">
                <div className="text-4xl font-semibold py-1 m-1">
                    {task.title}
                </div>
                <div className="flex justify-between">
                    <div>{task.id}</div>
                    <div>{task.due_date.toLocaleDateString()}</div>
                </div>
            </div>
}

export default UserTask