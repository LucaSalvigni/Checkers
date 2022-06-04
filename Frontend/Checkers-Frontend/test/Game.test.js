import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SocketIO from "socket.io-client"
import store from '../src/store/index.js'
import router from './utils/router/router.js'
import Game from '../src/views/Game.vue'
import CheckerBoard from '../src/components/boardComponents/CheckerBoard.vue'
import Cell from '../src/components/boardComponents/Cell.vue'
import Chat from '../src/components/boardComponents/Chat.vue'
import Player from '../src/components/boardComponents/Player.vue'
import AudioPlayer from './utils/AudioPlayer'


const mockAudio = new AudioPlayer('ciao.mp3')
const wrapper = mount(Game, {
    global: {
        plugins: [store, router]
    },
    attachTo: document.body,
    data() {
        return {
            buttonSound: mockAudio,
            socket: SocketIO("http://localhost:3030"),
        }
    },
})

describe('Game mount test', () => {
    it('should mount', () => {
        expect(wrapper.findComponent(CheckerBoard).exists()).toBeTruthy()

        expect(wrapper.findComponent(Chat).exists()).toBeTruthy()
    })
})

describe('Game Contain Test', ()=> {
    it('should contain', ()=> {
        expect(wrapper.find('.modal').exists()).toBeTruthy()

        expect(wrapper.find('#exit-game-msg').exists()).toBeTruthy()

        expect(wrapper.find('img').exists()).toBeTruthy()

        expect(wrapper.find('.exit').exists()).toBeTruthy()

        expect(wrapper.find('.close').exists()).toBeTruthy()
    })
})

describe('Game Trigger Test', ()=> {
    it('should work', async ()=> {
        await wrapper.vm.closeModal()
        await wrapper.setData({ path: "/"})
        await wrapper.vm.exitGame()
        store.commit("setInGame", true);
        await flushPromises()
        await wrapper.vm.exitGame()
        
        const spy = vi.spyOn(wrapper.vm, 'closeModal').mockImplementation(() => {})
        const spyExit = vi.spyOn(wrapper.vm, 'exitGame').mockImplementation(() => {})

        await wrapper.find('.exit').trigger('click')
        expect(spyExit).toHaveBeenCalled()
        spyExit.mockClear()

        await wrapper.find('.close').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()
    })
})

describe('CheckerBoard mount test', () => {
    it('should mount', async () => {
        const checkerboard = mount(CheckerBoard, {
            global: {
                plugins: [store]
            },
            attachTo: document.body,
            data() {
                return {
                    lobbyId: 1,
                    movePiece: mockAudio,
                    playerTurn: "",
                    myMoves: {16:[], 17:[], 18:[]},
                    moves: {1:[], 2:[], 3:[], 16:[], 17:[], 18:[]},
                }
            },
        })

        await checkerboard.setData({
            board: checkerboard.vm.createGrid(6)
        })
        
        expect(checkerboard.findComponent(Cell).exists()).toBeTruthy()

        expect(checkerboard.findComponent(Player).exists()).toBeTruthy()

        await checkerboard.vm.updatePossibleMoves()

        await checkerboard.vm.colorCells()

        await checkerboard.vm.checkMoves(1)

        await checkerboard.vm.selectCell(1)

        await checkerboard.vm.selectCell(1)

        await checkerboard.vm.release(1)
    })
})

describe('Player Test', () => {
    it('should mount', () => {
        const player = mount(Player, {
            props: {
                player: {
                    avatar: "",
                    username: "Test",
                    stars: 100,
                }
            },
        })

        expect(player.exists()).toBeTruthy()
    })
})

describe('Cell contain test', () => {
    it('should not contain', async () => {
        const cell = mount(Cell, {
            props: {
                cell: 0,
                moves: {1:1, 2:2}
            },
        })
        expect(cell.find('img').exists()).toBeFalsy()

        await cell.setProps({ cell: 1})

        expect(cell.find('img').exists()).toBeTruthy()

        await cell.find('.cell').trigger('click')
        await cell.find('.cell').trigger('mouseover')
        await cell.find('.cell').trigger('mouseleave')

        const spy = vi.spyOn(cell.vm, 'selectCell').mockImplementation(() => {})
        await cell.find('.cell').trigger('click')
        expect(spy).toHaveBeenCalledOnce()

        const spyHover = vi.spyOn(cell.vm, 'hoverCell').mockImplementation(() => {})
        await cell.find('.cell').trigger('mouseover')
        expect(spyHover).toHaveBeenCalledOnce()

        const spyLeave = vi.spyOn(cell.vm, 'leaveCell').mockImplementation(() => {})
        await cell.find('.cell').trigger('mouseleave')
        expect(spyLeave).toHaveBeenCalledOnce()
    })
})

describe('Chat Test', () => {
    it('should work', async () => {
        const chat = mount(Chat, {
            data() {
                return {
                    socket: SocketIO("http://localhost:3030")
                }
            },
        })

        const message1 = {
            data: {
                text: "Ciao"
            },
            type: String
        }
        await chat.vm.onMessageWasSent(message1)
        expect(chat.vm.messageList.includes(message1)).toBeTruthy()

        const message2 = {
            data: {
                text: "Ciao2"
            },
            type: String
        }
        await chat.vm.sendMessage(message2)
        expect(chat.vm.messageList.includes(message2)).toBeTruthy()

        await chat.vm.openChat()
        expect(chat.vm.isChatOpen).toBeTruthy()

        await chat.vm.closeChat()
        expect(chat.vm.isChatOpen).toBeFalsy()

        const nMessage = chat.vm.newMessagesCount
        await chat.vm.sendMessage(message2)
        expect(chat.vm.newMessagesCount).toBe(nMessage+1)
        await chat.vm.openChat()
        await chat.vm.sendMessage(message2)
        expect(chat.vm.newMessagesCount).toBe(0)

        await chat.vm.editMessage(message2)
    })
})