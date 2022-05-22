/**
 * @vitest-enviroment
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LeaderBoard from '../src/views/LeaderBoard.vue'
import SocketIO from "socket.io-client"

const wrapper = mount(LeaderBoard, {
    data() {
        return {
            socket: SocketIO("http://localhost:3030")
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
 