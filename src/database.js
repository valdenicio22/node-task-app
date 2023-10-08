import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor(){
    fs.readFile(databasePath, 'utf8')
    .then((data) => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist(){
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  verifyIfTableExists(table){
    if(Array.isArray(this.#database[table])) return true
    return false
  }

  verifyId(table, id){
    return this.#database[table].findIndex((row) => row.id === id)
  }

  select(table, search){
    let data = this.#database[table] ?? []
    if(search){
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    return data
  }
  insert(table, data){
    if(this.verifyIfTableExists(table)){  
      this.#database[table].push(data)
    }else{
      this.#database[table] = [data]
    }
    this.#persist()
    return data
  }
  delete(table, id){
    const itemIndex = this.verifyId(table, id)

    if(itemIndex > -1){
      this.#database[table].splice(itemIndex, 1)
      this.#persist()
    }
  }
  update(table, id, data){
    const itemIndex = this.verifyId(table, id)
      if(itemIndex > -1){
        
        const olddata = this.#database[table][itemIndex]
        this.#database[table][itemIndex] = {
          ...olddata,
          ...data
        }
        this.#persist()
      }
  }
  completedTask(table, id){
    const itemIndex = this.verifyId(table, id)
    if(itemIndex > -1){
      const oldData = this.#database[table][itemIndex]
      const newItemData = {
        ...oldData,
        completed_at: new Date()
      }
      this.#database[table][itemIndex] = newItemData
      this.#persist()
    }
  }

}