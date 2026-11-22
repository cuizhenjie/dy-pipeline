import { createWorkbench } from './app.jsx'

window.__ModuleLoader__.load({
  id: 'dsh-workbench-omni-marketing',
  factory: require => createWorkbench(require),
})
