/**
 * Learn more about createDrawerNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps, createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Button } from 'react-native';

import Colors from '../packages/core/constants/Colors';
import useColorScheme from '../packages/core/hooks/useColorScheme';
import { DrawerParamList } from '../types'
import Config from './Config'

const Drawer = createDrawerNavigator<typeof DrawerParamList>();
const Navigators = Config.packages.reduce((previousValue, currentValue)=>{
  const Package = require('../packages/'+ currentValue +'/screens')
  return previousValue.concat(Object.keys(Package.default).map((value)=>DrawerNavigatorGeneric(value, Package.default[value].component, Package.default[value].title)))
} , [] as JSX.Element[])

export default function DrawerNavigator() {
  const colorScheme = useColorScheme();
  //  drawerActiveTintColor: Colors[colorScheme].tint
  return (
    <Drawer.Navigator
      initialRouteName={Config.initialRouteName as keyof typeof DrawerParamList}
      screenOptions={{ }}
      drawerContentOptions={{activeTintColor: Colors[colorScheme].tint }}
    >
      { Navigators }
    </Drawer.Navigator>
  );
}

function DrawerNavigatorGeneric(name:string, component:React.ComponentType<any>, headerTitle:string){
  const drawerName = name.substring(0, name.lastIndexOf("Screen"))
  DrawerParamList[drawerName] = undefined
  return (
    <Drawer.Screen
      key={drawerName}
      name={drawerName}
      component={StackNavigatorGeneric(name, component, headerTitle)}
      options={{
        drawerIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
      }}
    />
  )
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
function StackNavigatorGeneric<RouteName extends keyof typeof DrawerParamList>(name:string, component:React.ComponentType<any>, headerTitle:string){
  const ParamList:Record<string, object | undefined> = {}
  ParamList[name] = undefined
  const TabStack = createStackNavigator<typeof ParamList>();
  function TabNavigator({navigation}: DrawerScreenProps<typeof DrawerParamList, RouteName>) {
    return (
      <TabStack.Navigator>
        <TabStack.Screen
          name={name}
          component={component}
          options={{
            headerTitle: headerTitle,
            headerLeft: () => (
              <Button
                onPress={() => navigation.openDrawer()}
                title="Menu"
                color="#888"
              />
            ),
          }}
        />
      </TabStack.Navigator>
    );
  }
  return TabNavigator
}
