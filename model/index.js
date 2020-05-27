import GamesModel from './GamesModel'

export default function (racer) {
  racer.orm('gamesCollection.*', GamesModel)
}
