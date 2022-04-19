/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorView from '../src/views/ErrorView.vue'

const wrapper = mount(ErrorView)
//const playToasty = vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation( () => {})
//expect(playToasty).toHaveBeenCalled()

describe('ErrorView mount test', ()=> {
    it('should mount', () => {
        expect(wrapper.find('#notfound').exists()).toBeTruthy()
    })
})

describe('ErrorView contain test', ()=> {
    it('should coontain', () => {

        expect(wrapper.find('#notfound').exists()).toBeTruthy()

        expect(wrapper.find('.notfound').exists()).toBeTruthy()

        expect(wrapper.find('.notfound-404').exists()).toBeTruthy()
        const div404 = wrapper.find('.notfound-404')
        expect(div404.find('h1').exists()).toBeTruthy()

        expect(wrapper.find('p').exists()).toBeTruthy()
    })
})

/*describe('ErrorView trigger click test', ()=> {
    it('should trigger', async ()=> {
        const spy = vi.spyOn(wrapper.vm, 'buttonClick').mockImplementation(() => {})
        await wrapper.find('button').trigger('click')
        expect(spy).toHaveBeenCalled()
    }) 
})*/