/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import router from './utils/router/router.js'
import App from '../src/App.vue'
import SideBar from '../src/components/sideBarComponents/SideBar.vue'
import SideBarLink from '../src/components/sideBarComponents/SideBarLink.vue'


describe('App Test', () => {
    it('should render child SibeBar and SideBarLink', () => {
        const wrapper = mount(App, {
            global: {
                plugins: [router]
            }
        })
        
        expect(wrapper.findComponent(SideBar).exists()).toBeTruthy()

        expect(wrapper.findComponent(SideBarLink).exists()).toBeTruthy()
    })
})

describe('SidebarLink Test', () => {
    it('should work', async () => {
        const wrapper = mount(SideBarLink, {
            props: {
                to: ""
            },
            global: {
                plugins: [router]
            }
        })

        await wrapper.setProps({ to: "/profile" })

        const spy = vi.spyOn(wrapper.vm, 'buttonClick').mockImplementation(() => {})
        await wrapper.find('button').trigger('click')
        expect(spy).toHaveBeenCalled()
    })
})
