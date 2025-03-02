const express = require("express")
const { body, validationResult } = require("express-validator");

const router = express.Router()
router.use(express.json())

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

    if(completed){  // check if query param is to filter task
        const completedBool = completed == 'true' ? true : false
        console.log("Filtering operation applied....")
        let taskFiltered = []

        tasks.filter((element) => {
            if (element.completed == completedBool)
                taskFiltered.push(element)
        })
        fetchTask = taskFiltered
    }

    if (sortBy) { //check if query param is to sortby date
        console.log("Sorting operation applied....")
        fetchTask.sort((a,b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA - dateB
        })
        console.log(fetchTask)
    }

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

    console.log(`POST request to create new task`)
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()})
    
    const newTask = req.body
    
    newTask.id = tasks.length + 1
    tasks.push(newTask)
    console.log(newTask)
    res.status(201).json(newTask)
}

//Update an existing task by ID
const updateTaskHandler = (req, res)=>{

    console.log(`PUT request to update task by id: ${req.params.id}`)
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

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


//CRUD Operations
router.get("/", getAllTaskHandler)
router.get("/:id", getParticularTaskHandler)
router.get("/priority/:level", getParticularPriorityTaskHandler)

router.post("/", 
    //Validator
    [
        body("title").isString().isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
        body("description").optional().isString().isLength({ max: 100 }).withMessage("Description can't exceed 100 characters"),
        body("completed").optional().isBoolean().withMessage("Completed must be a boolean") 
    ], 
    //callback 
    createNewTaskHandler)

router.put("/:id", 
    [
        body("title").isString().isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
        body("description").optional().isString().isLength({ max: 100 }).withMessage("Description can't exceed 100 characters"),
        body("completed").optional().isBoolean().withMessage("Completed must be a boolean")        
    ],
    //callback
    updateTaskHandler)

router.delete("/:id", deleteTaskHandler)


// Datastore
const tasks = [
    {
        "id": 1,
        "title": "Set up environment",
        "description": "Install Node.js, npm, and git",
        "completed": true,
        "date": "3",
        "level": "high"
    },
    {
        "id": 2,
        "title": "Create a new project",
        "description": "Create a new project using the Express application generator",
        "completed": true,
        "date": "1",
        "level": "medium"
    },
    {
        "id": 3,
        "title": "Install nodemon",
        "description": "Install nodemon as a development dependency",
        "completed": true,
        "date": "2",
        "level": "low"
    },
    {
        "id": 4,
        "title": "Install Express",
        "description": "Install Express",
        "completed": false,
        "date": "5",
        "level": "high"
    },
    {
        "id": 5,
        "title": "Install Mongoose",
        "description": "Install Mongoose",
        "completed": false,
        "date": "4",
        "level": "medium"
    },
    {
        "id": 6,
        "title": "Install Morgan",
        "description": "Install Morgan",
        "completed": false,
        "date": "6",
        "level": "low"
    },
    {
        "id": 7,
        "title": "Install body-parser",
        "description": "Install body-parser",
        "completed": false,
        "date": "7",
        "level": "high"
    },
    {
        "id": 8,
        "title": "Install cors",
        "description": "Install cors",
        "completed": false,
        "date": "9",
        "level": "medium"
    },
    {
        "id": 9,
        "title": "Install passport",
        "description": "Install passport",
        "completed": false,
        "date": "8",
        "level": "low"
    },
    {
        "id": 10,
        "title": "Install passport-local",
        "description": "Install passport-local",
        "completed": false,
        "date": "1",
        "level": "high"
    },
    {
        "id": 11,
        "title": "Install passport-local-mongoose",
        "description": "Install passport-local-mongoose",
        "completed": false,
        "date": "14",
        "level": "medium"
    },
    {
        "id": 12,
        "title": "Install express-session",
        "description": "Install express-session",
        "completed": false,
        "date": "11",
        "level": "low"
    },
    {
        "id": 13,
        "title": "Install connect-mongo",
        "description": "Install connect-mongo",
        "completed": false,
        "date": "12",
        "level": "high"
    },
    {
        "id": 14,
        "title": "Install dotenv",
        "description": "Install dotenv",
        "completed": false,
        "date": "10",
        "level": "medium"
    },
    {
        "id": 15,
        "title": "Install jsonwebtoken",
        "description": "Install jsonwebtoken",
        "completed": false,
        "date": "13",
        "level": "low"
    }
]

module.exports = router;
