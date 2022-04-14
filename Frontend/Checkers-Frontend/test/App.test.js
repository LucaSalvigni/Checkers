/**
 * @vitest-enviroment
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import router from './utils/router/router.js'
import App from '../src/App.vue'
import SideBar from '../src/components/sideBarComponents/SideBar.vue'
import SideBarLink from '../src/components/sideBarComponents/SideBarLink.vue'


describe('App Test', () => {
    it('should render child SibeBar', () => {
        const wrapper = mount(App, {
            global: {
                plugins: [router]
            }
        })
        
        expect(wrapper.findComponent(SideBar).exists()).toBe(true)
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

        //await wrapper.vm.buttonClick()
    })
})
