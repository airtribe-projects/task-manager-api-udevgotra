**Overview**

This project performs CRUD operations on In-memory datastores. This datastore is a collection of multiple tasks each having it's own set of properties.

**Setup Instructions**

1. Set up environment
       
      a. Install Node.js,npm,git


      b. Command:
   
         curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
         nvm install node
         node -v
         nvm ls
         nvm use ${version}
   
3. Create a new project


       npm init
       npm install express
       npm install nodemon
       
       
   
4. End-Point APIs designed are as follows:

   a.  `getAllTaskHandler()`


    This is a GET request end-point designed to retrieve all tasks from the datastore, initially it checks an API faliure with an in-build middleware (express-validator)
    `validationResult(req)`. Incase it find any error(s), this API returns a HTTP error code 400 with error message. Else, it returns all the tasks from the datastore with success status code
    200. Moreover, this API always keep a check on the query params, incase it finds any, (filter by completed or sort by date), it make use of helper functions('filterTasks()', 'sortTasks()') 
    to perform an operation accordingly.


   b. `getParticularTaskHandler()`


     This is a GET request end-point designed to retrieve a task depending upon the task id provided in the req params. It initially checks an API faliure with `validationResult`.
     This API searches the task in the datastore according to the task id provided by the client and sends it back to the client. Incase it doesn't matche any entry, the API returns HTTP error        code 404 with error message as `No Task Found`.


 
    c. `getParticularPriorityTaskHandler()`
  

   This API is a GET request that adds a priority attributes to the task, as usual it checks for API faliures with `validationResult`. It fetches the priority param from the query params,
   and returns the data object that matches the priority in the query params. In other words, it matches the priority requested by the client. Furthermore, checks on query params to          
   perform filter or sort operations using helper functions provided.



   d. `createNewTaskHandler()`


   This API is a POST request that inserts a new/fresh data sent by the user to the datastore. `validationResult` checks for api faliure. It basically fetches 
   the data provided by the client from `req.body` in a JSON format and assign each property of the created task with the values received from the client with 
   constraints using `Validator` (middleware). On success, it adds data to the dataset and sends HTTP status code 201 OK.




   e. `updateTaskHandler()`


   This API is a PUT request that helps in update one or more property of the the data identified by task:id provided  by the user in req param. Initially, `validationResult` checks for api 
   faliure returning HTTP error code 400. This api returns error code 404, incase task:id provided by the user doesn't match any id from datastore. The use of PUT would fetch the entire data 
   object and then updates the property/properties provided by the user from the `req.body` in JSON format. Again, it makes use of the `validator` (middleware) to meet minimum requirements for 
   data entry provided by the clients. On successful data update it send HTTP code as 200 OK.




   d. `deleteTaskHandler()`



   This API is a DELETE request that deletes a data in the datastore according to task:id provided by the user. Firstly, it checks for api faliure with `validationResult`.
   The API fetches the task:id from `req.param`, tries to find the entry that matches the id and deletes it from the datastore. Incase there's no task found, it sends HTTP error 404 with error      message `task not found`




4. Validation Middleware

      const validateTask = [....]

   
      We create a validation middleware that validates the data entry by user with certains restrictions.


5. Helper functions

      There are two helper functions that helps in perform operations according to the `query.params` provided by the client. These functions are created to maintain the saperation of concerns        with the router request

     a.`filterTasks()`

   
     b.`sortTasks()`
   
   
   
