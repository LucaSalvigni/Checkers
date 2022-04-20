import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Game from '../src/views/Game.vue'
import CheckerBoard from '../src/components/boardComponents/CheckerBoard.vue'
import Cell from '../src/components/boardComponents/Cell.vue'
import Chat from '../src/components/boardComponents/Chat.vue'
import Player from '../src/components/boardComponents/Player.vue'

describe('Game mount test', () => {
    it('should mount', () => {
        const wrapper = mount(Game)

        expect(wrapper.findComponent(CheckerBoard).exists()).toBeTruthy()

        expect(wrapper.findComponent(Chat).exists()).toBeTruthy()
    })
})

describe('Game Contain Test', ()=> {
    it('should contain', ()=> {
        const wrapper = mount(Game)

        expect(wrapper.find('.modal').exists()).toBeTruthy()

        expect(wrapper.find('#exit-game-msg').exists()).toBeTruthy()
    })
})

describe('CheckerBoard mount test', () => {
    it('should mount', async () => {
        const wrapper = mount(CheckerBoard)

        await wrapper.setData({
            board: wrapper.vm.createGrid(8)
        })
        
        expect(wrapper.findComponent(Cell).exists()).toBeTruthy()

        expect(wrapper.findComponent(Player).exists()).toBeTruthy()
    })
})

describe('Cell contain test', () => {
    it('should not contain', () => {
        const cell = mount(Cell, {
            cell: 0
        })
        expect(cell.find('img').exists()).toBeFalsy()
    })
})

describe('Chat Test', () => {
    it('should work', async () => {
        const wrapper = mount(Chat)

        const message1 = {
            data: {
                text: "Ciao"
            },
            type: String
        }
        await wrapper.vm.onMessageWasSent(message1)
        expect(wrapper.vm.messageList.includes(message1)).toBeTruthy()

        const message2 = {
            data: {
                text: "Ciao2"
            },
            type: String
        }
        await wrapper.vm.sendMessage(message2)
        expect(wrapper.vm.messageList.includes(message2)).toBeTruthy()

        await wrapper.vm.openChat()
        expect(wrapper.vm.isChatOpen).toBeTruthy()

        await wrapper.vm.closeChat()
        expect(wrapper.vm.isChatOpen).toBeFalsy()

        const nMessage = wrapper.vm.newMessagesCount
        await wrapper.vm.sendMessage(message2)
        expect(wrapper.vm.newMessagesCount).toBe(nMessage+1)
        await wrapper.vm.openChat()
        await wrapper.vm.sendMessage(message2)
        expect(wrapper.vm.newMessagesCount).toBe(0)
    })
})