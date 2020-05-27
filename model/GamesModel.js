import { BaseModel } from 'startupjs/orm'

export default class GamesModel extends BaseModel {
  async addSelf () {
    await this.root.add(this.getCollection(), {})
  }
}
