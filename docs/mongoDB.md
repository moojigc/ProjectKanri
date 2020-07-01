# MVP Schemas
## User
* email / username
* first name
* last name
* password storage thing
* create dt
* update dt
* 


## Project
* _id
* title
* description
* Admins: [ref Users]
* Members: [ref Users]
* Tasks : [ref Tasks]



## Task
* _id
* title  
* description
* status
* create Dt
* created by -> ref: one user
* assigned to -> ref: one user
* update dt
* Comments : [ref TaskComments]
* History: [ref TaskHistory]


## TaskComment
* _id
* description
* create dt
* create by -> ref: one user
* update dt



----
# BEYOND MVP

## TaskHistory
* _id
* Task Id -> ref one Task
* title  
* description
* status
* create Dt
* created by -> ref: one user
* assigned to -> ref: one user
* update dt