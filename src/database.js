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
    if(this.verifyIfTableExists(table)){
      const itemIndex = this.#database[table].findIndex((item) => item.id === id)

      if(itemIndex > -1){
        this.#database[table].splice(itemIndex, 1)
        this.#persist()
      }else{
        return false
      }
    }else return false
  }
  update(table, id, data){
    if(this.verifyIfTableExists(table)){
      const itemIndex = this.#database[table].findIndex(item => item.id === id)
      if(itemIndex > -1){
        this.#database[table][itemIndex] = {id, ...data}
        this.#persist()
      }else return false
    }else return false
  }
}