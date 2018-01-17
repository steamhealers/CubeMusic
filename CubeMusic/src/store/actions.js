import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch } from 'common/js/cache'
// export const selectPlay = function ({ commit, state }, { list, index }) {
//   commit(types.SET_SEQUENCE_LIST, list)
//   commit(types.SET_PLAY_LIST, list)
//   commit(types.SET_CURRENT_INDEX, index)
//   commit(types.SET_FULL_SCREEN, true)
//   commit(types.SET_PLAYING, true)
// }

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const insertSong = function ({ commit, state }, song) {
  let playList = state.playlist.slice()
  let sequenceList = state.sequencelist.slice()
  let currentIndex = state.currentIndex
  let currentSong = playList[currentIndex]

  let fpIndex = findIndex(playList, song)

  currentIndex++
  playList.splice(currentIndex, 0, song)

  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      playList.splice(fsIndex, 1)
      currentSIndex--
    } else {
      playList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({ commit, state }, song) {
  let playList = state.playlist.slice()
  let sequenceList = state.sequencelist.slice()
  let currentIndex = state.currentIndex
  let pIindex = playList.findIndex((item) => {
    return song.id === item.id
  })
  playList.splice(pIindex, 1)
  let sIindex = sequenceList.findIndex((item) => {
    return song.id === item.id
  })
  sequenceList.splice(sIindex, 1)

  if (currentIndex > pIindex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playList.length > 0
  commit(types.SET_PLAYING, playingState)
}

export const deleteSongList = function ({ commit, state }) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING, false)
}