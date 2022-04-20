/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Profile from '../src/views/Profile.vue'
import DataInfo from '../src/components/profileComponents/DataInfo.vue'
import MatchInfo from '../src/components/profileComponents/MatchInfo.vue'

describe('Profile Mount Test', () => {
    it('should mount Profile', () => {
        const wrapper = mount(Profile)
        expect(wrapper.exists()).toBeTruthy()
    })
})

describe('Profile Contain Test', ()=> {
    it('should contain', ()=> {
        const wrapper = mount(Profile)
        
        expect(wrapper.find('img').exists()).toBeTruthy()

        expect(wrapper.find('h2').exists()).toBeTruthy()

        expect(wrapper.find('.stars').exists()).toBeTruthy()

        expect(wrapper.find('.first_last').exists()).toBeTruthy()

        expect(wrapper.findComponent(DataInfo).exists()).toBeTruthy()

        expect(wrapper.findComponent(MatchInfo).exists()).toBeFalsy()
    })
})

describe('Profile data Test', () => {
    it('setData test', async () => {
        const wrapper = mount(Profile)

        await wrapper.setData({
            avatar: "http://daisyui.com/tailwind-css-component-profile-1@40w.png",
            first_last_name: "First Last",
            username: "Username",
            tabName: "Info",
            stars: "Stars",
        })

        expect(wrapper.vm.avatar).toBe('http://daisyui.com/tailwind-css-component-profile-1@40w.png')

        expect(wrapper.vm.first_last_name).toBe('First Last')

        expect(wrapper.vm.username).toBe('Username')

        expect(wrapper.vm.tabName).toBe('Info')

        expect(wrapper.vm.stars).toBe('Stars')

    })
})

describe('DataInfo set Data Test', () => {
    it('should set', async () => {
        const wrapper = mount(DataInfo)

        await wrapper.setData({
            first_name: "Luca",
            last_name: "Rossi",
            mail: "info@site.com",
            username: "User",
        })

        expect(wrapper.vm.first_name).toBe('Luca')

        expect(wrapper.vm.last_name).toBe('Rossi')

        expect(wrapper.vm.mail).toBe('info@site.com')

        expect(wrapper.vm.username).toBe('User')
    })
})



describe('Profile trigger test', () => {
    it('should trigger', async () => {
        const wrapper = mount(Profile)

        const spySound = vi.spyOn(wrapper.vm, 'buttonClick').mockImplementation(() => {})
        const spyData = vi.spyOn(wrapper.vm, 'dataInfo').mockImplementation(() => {})
        const spyMatch = vi.spyOn(wrapper.vm, 'matchInfo').mockImplementation(() => {})

        await wrapper.vm.buttonClick()
        expect(spySound).toHaveBeenCalled()
        
        await wrapper.find('#dataInfo').trigger('click')
        expect(spyData).toHaveBeenCalled()
        expect(spySound).toHaveBeenCalled()
        expect(wrapper.vm.tabName).toBe('User Info')
        
        await wrapper.find('#matchInfo').trigger('click')
        expect(spyMatch).toHaveBeenCalled()
        expect(spySound).toHaveBeenCalled()
        //expect(wrapper.vm.tabName).toBe('Match History')
    })
})