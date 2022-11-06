import TabOneScreen from './TabOneScreen'
import TabTwoScreen from './TabTwoScreen'
import TabThreeScreen from './TabThreeScreen'

export default {
    key: "default",
    screens:{
        TabOneScreen:{
            stacks: {defaultStack:TabOneScreen},
            title: 'Tab One Title',
            url: 'one'
        },
        TabTwoScreen:{
            stacks: {defaultStack:TabTwoScreen},
            title: 'Tab Two Title',
            url: 'two'
        },
        TabThreeScreen:{
            stacks: {defaultStack:TabThreeScreen},
            title: 'Tab Three Title',
            url: 'three'
        }
    }
}
