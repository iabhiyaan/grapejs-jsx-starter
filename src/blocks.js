import React from 'react'

import { checkFileExist } from './helpers'
export default async (editor, opts = {}) => {
   let folders = []

   const appsURL = `${window.location.origin}/src/apps`

   if (!checkFileExist(appsURL)) {
      alert('Apps folder not found')
      return
   }

   fetch(appsURL)
      .then((res) => res.text())
      .then((data) => {
         // read folders
         const parser = new DOMParser()
         const html = parser.parseFromString(data, 'text/html')
         const apps = html.querySelectorAll(
            'ul#files li:not(:nth-of-type(1)) a'
         )

         if (apps.length <= 0) {
            alert('Folders not found. Something went wrong')
            return
         }

         // push app's folder name in folders array
         apps.forEach((app) => folders.push(app.getAttribute('title')))

         const bm = editor.BlockManager
         folders.forEach((folder) => {
            return bm.add(folder, {
               label: folder,
               attributes: { class: 'gjs-fonts gjs-f-b1' },
               content: <div></div>,
            })
         })
      })
}
