import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as uilIcon } from '@iconify-json/uil'
import { icons as material } from '@iconify-json/material-symbols'

addCollection(uilIcon)
addCollection(material)

edge.use(edgeIconify)
