/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LeaderBoard from '../src/views/LeaderBoard.vue'
import SocketIO from "socket.io-client"
import AudioPlayer from './utils/AudioPlayer'

const mockAudio = new AudioPlayer('ciao.mp3')
const wrapper = mount(LeaderBoard, {
    attachTo: document.body,
    data() {
        return {
            buttonSound: mockAudio,
            socket: SocketIO("http://localhost:3030"),
        }
    },
})

describe('LeaderBoard Mount Test', () => {
    it('Should mount LeaderBoard', async () => {
        expect(wrapper.exists()).toBeTruthy()
    })
})

describe('LeaderBoard Contain Test', ()=> {
    it('should contain', ()=> {
        expect(wrapper.find('h1').exists()).toBeTruthy()

        expect(wrapper.find('table').exists()).toBeTruthy()

        expect(wrapper.find('thead').exists()).toBeTruthy()

        expect(wrapper.find('tbody').exists()).toBeTruthy()

        expect(wrapper.find('tr').exists()).toBeTruthy()

        expect(wrapper.find('th').exists()).toBeTruthy()
    })
})
 
describe('LeaderBoard trigger Test', () => {
    it('should work', async () => {
        await wrapper.setData({ leaderboard: [{
            username: 'Tordent97',
            stars: 15200,
            wins: 152,
            losses: 0,
            ties: 0,
            avatar: 'https://picsum.photos/id/1005/400/250'
          },
          {
            username: 'Mosgheo',
            stars: 710,
            wins: 20,
            losses: 18,
            avatar: 'https://picsum.photos/id/1005/400/250'
          },
          {
            username: 'test',
            stars: 0,
            wins: 0,
            losses: 0,
            avatar: 'https://picsum.photos/id/1005/400/250'
          }],
          perPage: 2
        })
        await wrapper.find('.next').trigger('click')
        await wrapper.find('.previous').trigger('click')

        const spy = vi.spyOn(wrapper.vm, 'nextPage').mockImplementation(() => {})
        const spyPrevious = vi.spyOn(wrapper.vm, 'previousPage').mockImplementation(() => {})
        
        await wrapper.find('.previous').trigger('click')
        expect(spyPrevious).toHaveBeenCalled()
        spyPrevious.mockClear()

        await wrapper.find('.next').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()
    })
})