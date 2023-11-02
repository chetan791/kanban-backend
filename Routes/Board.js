const express = require('express');
const { Board_Model, Task_Model, Subtask_Model } = require('../Schemas/Board_schema');
const Board_router = express.Router();

Board_router.post('/add',(req,res)=>{
   try{
    const { name } = req.body;
    const newBoard = new Board_Model({ name });
    newBoard.save()
   return res.status(201).send('Board Created');
   }
   catch(err){
     return res.status(500).json({ error: err });
   }
})
Board_router.post('/:boardID/add_task', async (req, res) => {
    try {
      const boardID = req.params.boardID;
      
      const { title, description, status } = req.body;
  
      const found_board = await Board_Model.findById(boardID);
      if (!found_board) {
        return res.status(500).json({ error: 'No Board Found' });
      }
  
      const new_task = new Task_Model({ title, description, status });

      await new_task.save();
  
      
      found_board.tasks.push(new_task);
  
    
      await found_board.save();
  
      return res.status(201).send('Task Created');
    }
     catch (err) {
      return res.status(500).json({ error: err });
    }
  });
Board_router.post('/tasks/:taskId/subtasks',async(req,res)=>{
    try{
    const taskId = req.params.taskId
    
    const {title,isCompleted} = req.body
    let task_found = await Task_Model.findById(taskId)
    
    if(!task_found){
        return res.status(500).json({ error: 'No tasks Found for this ID' });
    }
    const newSubtask = new Subtask_Model({title,isCompleted})
    await newSubtask.save()
    task_found.subtasks.push(newSubtask)
    await task_found.save()
    return res.status(201).send('SubTask Created for this Task');
    }
    catch(err){
        return res.status(500).json({ error: err });
    }


})
Board_router.patch('/tasks/:taskId/subtasks/:subtaskId',async(req,res)=>{
    const taskId = req.params.taskId
    const subtaskId = req.params.subtaskId
    const {isCompleted} = req.body
    try{
        const task_arr = await Task_Model.findById(taskId)
        if(!task_arr){
            return res.status(500).json({ error: 'No tasks Found for this ID' });
        }

        let arr = task_arr.subtasks
        let flag = false
        for(let i = 0;i<arr.length;i++){
            if(arr[i].toString()===subtaskId){

                flag = true
                break
            }
        }
        if(flag){
            const subtaskupdate = await Subtask_Model.findByIdAndUpdate(subtaskId,{isCompleted},{new:true})
            if(!subtaskupdate){
                return res.status(500).json({ error: 'No subtasks Found for this tasks' });
            }
            return res.status(201).send('SubTask Update for this Task');
        }
        else{
            return res.status(500).json({ error: 'User not authorized' });
        }

       
    }
    catch(err){
        return res.status(500).json({ error: err });
    }
})
Board_router.get('/all_boards',async(req,res)=>{
    try{
        const newboard = await Board_Model.find()
        if(!newboard){
            return res.status(500).send('NO boards found');
        }
        return res.status(201).send(newboard);
    }
    catch(err){
        return res.status(500).json({ error: err });
    }
})
Board_router.get('/:boardID/alltasks',async(req,res)=>{
    try {
        const boardID = req.params.boardID;
        
       
    
        const found_board = await Board_Model.findById(boardID).populate('tasks')
        if (!found_board) {
          return res.status(500).json({ error: 'No Board Found' });
        }
       // c
       let tasksids = found_board.tasks.map(task=>task._id)
       const tasks = await Task_Model.find({_id:{$in:tasksids}})
      // console.log(tasks);
       
    
        return res.status(201).send(tasks);
      }
       catch (err) {
        return res.status(500).json({ error: err });
      }
})

Board_router.get('/:taskID/allsubtasks',async(req,res)=>{
    try {
        const taskID = req.params.taskID;
        
       
    
        const found_tasks = await Task_Model.findById(taskID).populate('subtasks')
        if (!found_tasks) {
          return res.status(500).json({ error: 'No task Found' });
        }
       // c
       let subtasksids = found_tasks.subtasks.map(subtask=>subtask._id)
       const subtasks = await Subtask_Model.find({_id:{$in:subtasksids}})
      // console.log(tasks);
       
    
        return res.status(201).send(subtasks);
      }
       catch (err) {
        return res.status(500).json({ error: err });
      }
})
Board_router.delete('/:boardId/delete_board',async(req,res)=>{
    const boardId = req.params.boardId
    try{
        const deleted = await Board_Model.findByIdAndDelete(boardId)
        if(!deleted){
            return res.status(500).json({ error: 'No Board Found to delete' });
        }
        return res.status(201).send('Board Deleted');
    }
    catch(err){
        return res.status(500).json({ error: err });
    }
})
Board_router.delete('/:taskId/delete_task',async(req,res)=>{
    const taskId = req.params.taskId
    try{
        const deleted = await Task_Model.findByIdAndDelete(taskId)
        if(!deleted){
            return res.status(500).json({ error: 'No Task Found to delete' });
        }
        return res.status(201).send('Task Deleted');
    }
    catch(err){
        return res.status(500).json({ error: err });
    }
})
module.exports = {
    Board_router
}