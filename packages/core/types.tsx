/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};
export type ScreenPackage = Record<string, {
  component: React.ComponentType<any>,
  title: string,
  url: string| Record<string, any>,
  params?: Record<string, any>
}>

export const DrawerParamList:Record<string, Record<string, any> | undefined> = {}