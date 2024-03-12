import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as uilIcon } from '@iconify-json/uil'

addCollection(uilIcon)
edge.use(edgeIconify)
