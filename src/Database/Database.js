import Realm from "realm";
import { ObjectId } from "bson";
let initProject = null;

class TaskSchema extends Realm.Object {
    static schema = {
        name: "Task",
        primaryKey: "_id",
        properties: {
            _id: "objectId",
            title: "string",
            isDone: {type: "bool", default: false},
            priority: {type: "bool", default:false},
            comment: "string?",
            createdDate: "date",
            deadlineDate:"date?",
            project: "Project?"
        },


    }
}

class ProjectSchema extends Realm.Object {
    static schema = {
        name: "Project",
        primaryKey: "_id",
        properties: {
            _id: "objectId",
            title:"string",
            isDone: {type: "bool", default: false},
            createdDate:"date",
            deadlineDate:"date?",
            description: {type:"string", default: ""},
            tasks: "Task[]",
            visible: {type:'bool', default: true},
        },

    }
}


class PomodoroTimerSchema extends Realm.Object {
    static schema = {
        name:'PomodoroTimer',
        primaryKey: "_id",
        properties: {
            _id:"objectId",
            tasks:"Task[]",
            startTime:"date",
            endTime:"date?",
            duration:"int?",
            
        },
    }
}
const realm = new Realm({schema: [TaskSchema,ProjectSchema,PomodoroTimerSchema], schemaVersion: 1});

// Task handlers

const createTask = (_title,_priority,_project) => {
    const taskProject = _project != null ? _project : initProject 
    realm.write(() => {
        const task = realm.create("Task", {
            _id: new ObjectId(),
            title: _title,
            createdDate: new Date(),
            priority:_priority,
            project: taskProject,
            comment:"",
        });
        taskProject.tasks.push(task)
    });
}

const getAllTasks = () => {
    return realm.objects("Task").filtered("isDone == false AND project == $0",initProject).sorted("createdDate","Descendig")
}

const getPriorityTasks = () => {
    return realm.objects("Task").filtered("isDone == false AND priority == true").sorted("createdDate","Descendig")
}

const getProjectTasks = (project) => {
    return realm.objects("Task").filtered("isDone == false AND project == $0",project).sorted("createdDate","Descendig")

}

const changePriority = (_task) => {
    realm.write(() => {
        _task.priority = !_task.priority;
    })  
}

const updateIsDone = (_task) => {
    realm.write(() => {
        _task.isDone = !_task.isDone;
    })
}

const deleteTask = (_task) => {
    realm.write(() => {
     realm.delete(_task);
    });
};



// Project handlers

const createProject = (_title,_comment) => {
    realm.write(() => {
        const project = realm.create("Project", {
            _id: new ObjectId(),
            title: _title,
            createdDate: new Date(),
            description:_comment,
        });
    }); 
}

const getAllProjects = () => {
    return realm.objects("Project").filtered("isDone == false AND visible == true").sorted("createdDate","Descendig")
}

// init objects on first run

const initDB = () => {
    if (realm.objects("Project").length < 1){
        realm.write(() => {
            return initProject = realm.create("Project", {
                _id: new ObjectId(),
                title: "Wszystkie sprawy",
                createdDate: new Date(),
                visible:false,
            });
        });
    }
    else {
        return initProject = realm.objects("Project").filtered("visible == false")[0]
    }
}
initDB()

export default realm;

export {
    createTask,
    getAllTasks,
    getPriorityTasks,
    getProjectTasks,
    changePriority,
    updateIsDone,
    deleteTask,
    createProject,
    getAllProjects,
}

