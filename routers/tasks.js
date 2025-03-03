const express = require("express")
const { body, validationResult } = require("express-validator");
const moment = require("moment"); // date validation

const router = express.Router()
router.use(express.json())

const filterTasks = (tasks, completed) => {

    if (completed) {
        const completedBool = completed === "true";
        console.log("Filtering operation applied....");
        return tasks.filter(task => task.completed === completedBool);
    }
    return tasks;
};

const sortTasks = (tasks, sortBy) => {

    if (sortBy) { //check if query param is to sortby date
        console.log("Sorting operation applied....")
        tasks.sort((a, b) => {
            return moment(a.date, "YYYY-MM-DD").toDate() - moment(b.date, "YYYY-MM-DD").toDate();
        })
    }
    return tasks;
};


// GET all tasks
const getAllTaskHandler = (req,res) => {

    console.log(`GET request for all tasks :)`);
    const errors = validationResult(req)
    
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })
    
    let fetchTask = [...tasks]

    // Operations for query params
    const { completed, sortBy } = req.query;
    console.log("query params=", req.query)
    fetchTask = filterTasks(fetchTask,completed)
    fetchTask = sortTasks(fetchTask, sortBy)
    return res.status(200).send(fetchTask);
}

// GET request particular task
const getParticularTaskHandler = (req, res)=>{

    console.log(`GET request for task id:${req.params.id}`)
    const id = req.params.id;
    const task = tasks.find((task) => task.id === parseInt(id))
    if (!task)
        res.status(404).send(`Task not found`);
    
    res.send(task);
}

// GET request for particular PRIORITY of task
const getParticularPriorityTaskHandler =  (req, res)=>{

    console.log(`GET request for priority: ${req.params.level}`)
    const errors = validationResult(req)

    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const priority = req.params.level
    console.log("priority=", priority)
    let priorityTasks=[]

    tasks.forEach((task) => {
        if (task.level == priority){
            priorityTasks.push(task)
        }
    })
    if(priorityTasks.length == 0)
        res.status(404).send("No task with requested prioroty")
    
    // Operations for query params
    const { completed, sortBy } = req.query;
    console.log("query params=", req.query)

    if (completed) {  // check if query param is to filter task
        const completedBool = completed == 'true' ? true : false
        console.log("Filtering operation applied....")
        let taskFiltered = []

        priorityTasks.filter((element) => {
            if (element.completed == completedBool)
                taskFiltered.push(element)
        })
        priorityTasks = taskFiltered
    }

    if (sortBy) { //check if query param is to sortby date
        console.log("Sorting operation applied....")
        priorityTasks.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA - dateB
        })
        console.log(priorityTasks)
    }

    res.status(200).send(priorityTasks)
}

//Create new task
const createNewTaskHandler = (req,res) =>{
    
    console.log(`POST request to add new task`)

    const newTask = req.body
    newTask.id = tasks.length + 1
    tasks.push(newTask)
    console.log(newTask)
    res.status(201).json(newTask)
}

//Update an existing task by ID
const updateTaskHandler = (req, res)=>{

    console.log(`PUT request to update task by id: ${req.params.id}`)

    const id = req.params.id;
    const task = tasks.find((task) => task.id === parseInt(id))

    if (!task)
        return res.status(404).json({ task:"Invalid task selection !!" });

    task.title = req.body.title;
    task.description = req.body.description;
    task.completed = req.body.completed;
    task.date=req.body.date;
    task.level = req.body.level;

    console.log(`Requested task id:${id} has been updated in db`, task)
    res.status(200).json(task)
}

//Delete an existing task
const deleteTaskHandler = (req, res)=>{
    console.log(`DELETE request for task id: ${req.params.id}`)

    const id = req.params.id;
    const task = tasks.find((task) => task.id === parseInt(req.params.id))

    if (!task)
        res.status(404).send(`task not found`)
    const index = tasks.indexOf(task)
    tasks.splice(index, 1)
    console.log(`tass deleted successfully `, task)
    res.send(task)
}

// Validation Middleware
const validateTask = [
    body("title").isString().isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
    body("description").optional().isString().isLength({ max: 100 }).withMessage("Description can't exceed 100 characters"),
    body("completed").optional().isBoolean().withMessage("Completed must be a boolean"),
    body("date").custom((value) => {
            if (!moment(value, "YYYY-MM-DD", true).isValid()) {
                throw new Error("Date must be in YYYY-MM-DD format");
            }
            return true;
        }),
    body("level").optional().isIn(["high", "medium", "low"]).withMessage('Priority must be either "high", "medium", or "low"'),

    // Middleware to check validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Continue to next middleware or route handler
    }
];

//CRUD Operations
router.get("/", getAllTaskHandler)
router.get("/:id", getParticularTaskHandler)
router.get("/priority/:level", getParticularPriorityTaskHandler)
router.post("/", validateTask, createNewTaskHandler)               // Apply validation middleware
router.put("/:id", validateTask, updateTaskHandler)                // Apply validation middleware
router.delete("/:id", deleteTaskHandler)


// Datastore
const tasks = [
    {
        "id": 1,
        "title": "Set up environment",
        "description": "Install Node.js, npm, and git",
        "completed": true,
        "date": "11-02-2020",
        "level": "high"
    },
    {
        "id": 2,
        "title": "Create a new project",
        "description": "Create a new project using the Express application generator",
        "completed": true,
        "date": "02-02-2020",
        "level": "medium"
    },
    {
        "id": 3,
        "title": "Install nodemon",
        "description": "Install nodemon as a development dependency",
        "completed": true,
        "date": "16-02-2020",
        "level": "low"
    },
    {
        "id": 4,
        "title": "Install Express",
        "description": "Install Express",
        "completed": false,
        "date": "12-02-2020",
        "level": "high"
    },
    {
        "id": 5,
        "title": "Install Mongoose",
        "description": "Install Mongoose",
        "completed": false,
        "date": "22-02-2020",
        "level": "medium"
    },
    {
        "id": 6,
        "title": "Install Morgan",
        "description": "Install Morgan",
        "completed": false,
        "date": "24-02-2020",
        "level": "low"
    },
    {
        "id": 7,
        "title": "Install body-parser",
        "description": "Install body-parser",
        "completed": false,
        "date": "18-02-2020",
        "level": "high"
    },
    {
        "id": 8,
        "title": "Install cors",
        "description": "Install cors",
        "completed": false,
        "date": "20-02-2020",
        "level": "medium"
    },
    {
        "id": 9,
        "title": "Install passport",
        "description": "Install passport",
        "completed": false,
        "date": "19-02-2020",
        "level": "low"
    },
    {
        "id": 10,
        "title": "Install passport-local",
        "description": "Install passport-local",
        "completed": false,
        "date": "07-02-2020",
        "level": "high"
    },
    {
        "id": 11,
        "title": "Install passport-local-mongoose",
        "description": "Install passport-local-mongoose",
        "completed": false,
        "date": "16-02-2020",
        "level": "medium"
    },
    {
        "id": 12,
        "title": "Install express-session",
        "description": "Install express-session",
        "completed": false,
        "date": "01-02-2020",
        "level": "low"
    },
    {
        "id": 13,
        "title": "Install connect-mongo",
        "description": "Install connect-mongo",
        "completed": false,
        "date": "18-02-2020",
        "level": "high"
    },
    {
        "id": 14,
        "title": "Install dotenv",
        "description": "Install dotenv",
        "completed": false,
        "date": "28-02-2020",
        "level": "medium"
    },
    {
        "id": 15,
        "title": "Install jsonwebtoken",
        "description": "Install jsonwebtoken",
        "completed": false,
        "date": "02-02-2020",
        "level": "low"
    }
]

module.exports = router;
