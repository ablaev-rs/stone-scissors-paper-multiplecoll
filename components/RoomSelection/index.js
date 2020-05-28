import React, { useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { observer, useQuery, useValue, useSession, $root, emit } from 'startupjs'
import './index.styl'
import { } from '@startupjs/ui'
import RoomItem from './RoomItem'

export default observer(function RoomSelection ({ style }) {
  const [games, $games] = useQuery('games', {})
  if (!games) throw $games.addSelf()
  const [myId] = useSession('userId')

  /* SAVE USERNAME AND CREATE USERS COLLECION */
  let [enterName, onChangeEnterName] = useState('')
  let [userName, setUserName] = useState('')

  function setEnterNameHandler (name) {
    onChangeEnterName(name)
  }

  function saveNameHandler () {
    setUserName(enterName)
    $root.add('users', { userid: myId, name: enterName })
  }
  /* / */

  /* CREATE ROOM */
  const defaultGame = {
    usersId: [],
    status: 'open',
    round: 1
  }

  const defaultPlayer = {
    answers: []
  }

  const [createGame, $createGame] = useValue(defaultGame)
  const [createPlayer, $createPlayer] = useValue(defaultPlayer)

  function createGameHandler () {
    $createGame.set('creatorId', myId)
    $root.add('games', createGame)
  }
  /* / */

  /* ENTER THE GAME */
  let [selectedGame, setSelectedGame] = useState('')
  let [selectedGameId, setSelectedGameId] = useState('')

  function setSelectedGameHandler (id) {
    setSelectedGame(id)
  }

  async function joinGameHandler () {
    const $game = $root.scope('games.' + selectedGame)
    $game.subscribe()
    const game = $game.get()
    setSelectedGameId(game.id)

    $createPlayer.set('creatorId', game.creatorId)
    $createPlayer.set('userId', myId)
    $createPlayer.set('gameId', game.id)
    $root.add('players', createPlayer)

    if (!game) {
      alert('The game does not exist')
    } else if (game.usersId.length === 2) {
      alert('The room is full')
    } else {
      let followUsers = game.usersId
      followUsers.push(myId)
      $game.set('usersId', followUsers)
      emit('url', '/games/' + game.id)
    }
  }
  /* / */

  return pug`
    View.root

    if !userName
      View.enterBlock
        TextInput.inputField(
          placeholder = 'Enter your name'
          value = enterName
          onChangeText  = setEnterNameHandler)
        Button(title = 'Save' onPress = saveNameHandler)

    else
      Text.textStyle #{userName}, you can
      Text.textStyle Create room

      View.createRoom
        Button(title = 'Create room' onPress = createGameHandler)

      Text.textStyle or select an existing 
    
      View.enterBlock
        TextInput.inputField(
          placeholder = 'Enter the room number to join'
          value = selectedGame
          onChangeText  = setSelectedGameHandler)
        Button(title = 'Join' onPress = joinGameHandler)
      
      Text.textStyle Existing Rooms

      View.listRooms
        if games.length
          each game in games
            View.room(key = game.id)
              RoomItem(id=game.id status=game.status usersId=game.usersId)
        else
          Text.additinalTextStyle Sorry, nothing found
            
  `
})
