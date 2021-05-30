import React from 'react'

import { checkFileExist } from './helpers'
import loadBlocks from './blocks'

export default (editor, opts = {}) => {
   const options = {
      ...{
         i18n: {},
         // default options
      },
      ...opts,
   }

   loadBlocks(editor, options)
   const modal = editor.Modal
   editor.on('load', () => {
      editor.setComponents(
         <div>
            <h3>Hello World</h3>
            <ul>
               <li>
                  <a href="#">Hello World</a>
               </li>
               <li>
                  <a href="#">Hello World</a>
               </li>
               <li>
                  <a href="#">Hello World</a>
               </li>
               <li>
                  <a href="#">Hello World</a>
               </li>
            </ul>
         </div>
      )
   })
   editor.on('block:drag:stop', (cmp, block) => {
      if (!cmp) return
      const appId = block.id
      let images = []

      const thumbURL = `${window.location.origin}/src/apps/${appId}/thumbs`

      if (!checkFileExist(thumbURL)) {
         alert('Thumb folder not found')
         modal.close()
         return
      }
      fetch(thumbURL)
         .then((res) => res.text())
         .then((data) => {
            // read folders
            const parser = new DOMParser()
            const html = parser.parseFromString(data, 'text/html')
            const apps = html.querySelectorAll(
               'ul#files li:not(:nth-of-type(1)) a'
            )

            if (apps.length <= 0) {
               alert('File not found. Something went wrong')
               return
            }

            // push img file in images array
            apps.forEach((app) => {
               return images.push({
                  src: app.getAttribute('href'),
                  appName: appId.toLowerCase(),
               })
            })

            const divEl = document.createElement('div')
            divEl.innerHTML = `
            <div style="display: flex;">
                ${images.map(
                   (image, i) => `
                   <div style="margin-right: 12px; cursor: pointer;">
                    <img class="selectDesign" width="100" src="${
                       image.src
                    }" data-id="${image.appName}${++i}" />
                    <div>
                      <button
                        class="selectDesign"
                        data-id="${image.appName}${++i}">
                              Select
                      </button>
                    </div>
                   </div>
                   `
                )}
            </div>
            `
            modal.setContent(divEl)
            modal.open()

            function appendHTML(e) {
               const contentId = e.target.dataset['id']
               const contentURL = `${window.location.origin}/src/apps/${appId}/${contentId}/index.html`

               if (!checkFileExist(contentURL)) {
                  alert('File not found')
                  modal.close()
                  return
               }

               fetch(contentURL)
                  .then((res) => res.text())
                  .then((html) => {
                     cmp.append(html)
                     modal.close()
                  })
                  .catch((err) => console.error(err))
            }
            const selectDesignBtns = document.querySelectorAll('.selectDesign')
            selectDesignBtns.forEach((btn) => {
               btn.addEventListener('click', appendHTML)
            })
         })
         .catch((err) => {
            console.log(err)
         })
   })
}
