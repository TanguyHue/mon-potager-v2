import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as uilIcon } from '@iconify-json/uil'

/**
 * Add heroIcons collection
 */
addCollection(uilIcon)

/**
 * Register the plugin
 */
edge.use(edgeIconify)
