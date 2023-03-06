import { ensureDirSync } from 'fs-extra'
import { appLogPath, appConfigPath } from '../../constants/index'
ensureDirSync(appConfigPath)
ensureDirSync(appLogPath)
