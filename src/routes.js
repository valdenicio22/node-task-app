import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const {search} = req.query
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const {title, description} = req.body

      if (!title || !description) {
        return response.writeHead(400).end(JSON.stringify({
          message: "Title and description are required."
        }));
      }

      const newTask = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      database.insert('tasks', newTask)
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler:(req, res) => {
      
      const {id} = req.params
      const {title, description} = req.body
      const idExist = database.verifyId('tasks', id)
      if(idExist < 0){
        return res.writeHead(400).end(JSON.stringify({
          message: "Id not found"
        }))
      }
      if(!title || !description){
        return res.writeHead(400).end(JSON.stringify({
          message: 'Title and description must be provided'
        }))
      }
      database.update('tasks', id, {title, description, updated_at: new Date()})
      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params

      const idExist = database.verifyId('tasks', id);
      if(idExist < 0){
        return res.writeHead(400).end(JSON.stringify({
          message: 'Id not found'
        }))
      }
      database.delete('tasks', id)
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler:(req, res) => {
      const {id} = req.params
      const idExist = database.verifyId('tasks', id)
      if(idExist < 0){
        return res.writeHead(400).end(JSON.stringify({
          message: 'Id not found'
        }))
      }
      database.update('tasks', id, {
        completed_at: new Date(),
        updated_at: new Date()
      })
      return res.writeHead(200).end(JSON.stringify(database.select('tasks', {id})))
    }
  }
]