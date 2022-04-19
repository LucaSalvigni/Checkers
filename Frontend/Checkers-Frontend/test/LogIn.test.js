/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '../src/views/LogIn.vue'

const wrapper = mount(Login)
 
describe('Login Mount Test', ()=> {
    it('should mount', () => {
        expect(wrapper.find('.mail').exists()).toBeTruthy()
    })
})

describe('Login Contain Test', ()=> {
    it('should contain', ()=> {

        expect(wrapper.find('h1').exists()).toBeTruthy()

        expect(wrapper.find('.mail').exists()).toBeTruthy()

        expect(wrapper.find('.password').exists()).toBeTruthy()

        expect(wrapper.find('.login-btn').exists()).toBeTruthy()

        expect(wrapper.find('.btn-link').exists()).toBeTruthy()
    })
})

describe('Login Inputs Test', ()=> {
    it('value checks', async ()=> {

        const mailInput = wrapper.find('.mail')
        await mailInput.setValue('value')
        expect(wrapper.find('.mail').element.value).toBe('value')

        const passwordInput = wrapper.find('.password')
        await passwordInput.setValue('pass')
        expect(wrapper.find('.password').element.value).toBe('pass')
    })
})

describe('Login check trigger', ()=> {
    it('should trigger', async ()=> {
        const spy = vi.spyOn(wrapper.vm, 'buttonClick').mockImplementation(() => {})
        await wrapper.find('button').trigger('click')
        expect(spy).toHaveBeenCalled()
    })
})