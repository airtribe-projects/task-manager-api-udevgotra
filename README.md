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


    This is a GET request end-point designed to retrieve all tasks from the datastore, initially it checks for error through in-build middleware (express-validator)
           using `validationResult(req)` Incase it find error(s), this API returns HTTP error code 400. Else it returns all the tasks from the datastore.
     However, this API also check for query params, incase it finds any, such as filter by completed or sort by date, it performs]
     the operations accordingly.


   b. `getParticularTaskHandler()`


     This is a GET request end-point designed to retrieve a task depending upon the task id provided in the req params According to the task id provided by the client,
     it searches the task in the datastore. Incase it doesn't matche any entry, the API returns HTTP error code 404 and message as `No Task Found`



 
    c. `getParticularPriorityTaskHandler()`
  

   This API is a GET request that adds a priority attributes to the task, as usual it checks for the error, if encountered it return HTTP error 400 with error message.
   Else, it fetches the priority from query params, and returns data what matches the priority requested by the client. Further, it also checks
   the query params to perform filter or sort operations further.



   d. `createNewTaskHandler()`


   This API is a POST request that inserts a new/fresh data set by the user to the datastore. If this API fails it sends HTTP error code 400 with error message.
   Further it fetches the data from `req.body` in a JSON format and assign each property with the value received from the user. On success adding data it sends HTTP status code 201 OK.




   e. `updateTaskHandler()`


   This API is a PUT request that helps in update one or more property of the the data identified by task:id provided  by the user in req param. The use of PUT would fetch
   the entire data object and then updates the property/properties provided by the user from the `req.body` in JSON format.




   d. `deleteTaskHandler()`



   This API is a DELETE request that deletes a data in the datastore according to task:id provided by the user. The API fetches the task:id from req.param, tries to find the
   entry that matches the id and deletes it from the datastore. Incase there's no task found, it sends HTTP error 404 with error message `task not found`
   
   
   
   
