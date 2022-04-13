/**
 * @vitest-enviroment
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import router from './utils/router/router.js'
import App from '../src/App.vue'
import SideBar from '../src/components/sideBarComponents/SideBar.vue'

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
