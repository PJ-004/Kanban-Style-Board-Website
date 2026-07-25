import type { Task } from "../utils/Data-Task"

const UserTask = ({task}: {task: Task}) => {
    return  <div className="border rounded-lg px-2 m-2 bg-gray-200 w-56">
                <div className="text-base font-semibold py-1 m-1">
                    {task.title}
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                    <div>ID: {task.id} </div>
                    <div>Due At: {task.due_date.toLocaleDateString()}</div>
                </div>
            </div>
}

export default UserTask