const express = require('express');
const taskRouter = require('./routers/tasks')
const app = express();
const port = 3000;

app.use('/tasks', taskRouter)
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});
