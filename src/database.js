
export class Database {
  #database = {}

  verifyIfTableExists(table){
    if(Array.isArray(this.#database[table])) return true
    return false
  }

  select(table){
    const data = this.#database[table] ?? []
    return data
  }
  insert(table, data){
    if(this.verifyIfTableExists(table)){
      this.#database[table].push(data)
    }else{
      this.#database[table] = [data]
    }
    return data
  }
  delete(table, id){
    if(this.verifyIfTableExists(table)){
      const itemIndex = this.#database[table].findIndex((item) => item.id === id)

      if(itemIndex > -1){
        this.#database[table].splice(itemIndex, 1)
      }else{
        return fasle
      }
    }else return false
  }
  update(table, id){
    if(this.verifyIfTableExists(table)){
      const itemIndex = this.#database[table].findIndex(item => item.id === id)
      if(itemIndex > -1){
        this.#database[table].splice(itemIndex, 1)
      }else return false
    }else return false
  }
}