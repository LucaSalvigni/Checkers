/**
 * @vitest-enviroment
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LeaderBoard from '../src/views/LeaderBoard.vue'

describe('LeaderBoard Mount Test', () => {
    it('should mount LeaderBoard', () => {
        const wrapper = mount(LeaderBoard)
        expect(wrapper.exists()).toBeTruthy()
    })
})

describe('LeaderBoard Contain Test', ()=> {
    it('should contain', ()=> {
        const wrapper = mount(LeaderBoard)
        
        expect(wrapper.find('h1').exists()).toBeTruthy()

        expect(wrapper.find('table').exists()).toBeTruthy()

        expect(wrapper.find('thead').exists()).toBeTruthy()

        expect(wrapper.find('tbody').exists()).toBeTruthy()

        expect(wrapper.find('tr').exists()).toBeTruthy()

        expect(wrapper.find('th').exists()).toBeTruthy()

        expect(wrapper.find('td').exists()).toBeTruthy()
    })
})
 