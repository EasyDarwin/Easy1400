import { GET } from './http';
import configJSON from "./configs.json"
export function FindConfigs(){
    return GET('/system/config')
}