
//
// Copyright 2016 Kary Foundation, Inc.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace orchestra.regexpImporter {

    //
    // ─── MAKE HIDDEN EFFECT ─────────────────────────────────────────────────────────
    //

        export function checkToSeeIfRegExpImporterNeedsToBeDisabledOnOutClick ( event ) {
            function isChildOf( child, parent ) {
                if ( child.parentNode === parent ) {
                    return true;
                } else if ( child.parentNode === null ) {
                    return false;
                } else {
                    return isChildOf( child.parentNode, parent );
                }}

            let dialog = document.getElementById('regexp-importer')
            if ( !( event.target === document.getElementById('import-regexp-ribbon-button' ) ||
                    isChildOf( event.target, dialog ) ) ) {
                hideImportRegExpDialog( );
            }}

    //
    // ─── REGEX IMPORTER KEYPRESS ────────────────────────────────────────────────────
    //

        export function onRegExImporterOnKeypress ( event: KeyboardEvent ) {
            if ( event.keyCode === 13 )
                onImportRegExp( )
            onCheckRegExpForImporter( )
        }

    //
    // ─── EXPORTER ───────────────────────────────────────────────────────────────────
    //

        export function onOpenOrCloseImportRegExpDialog ( ) {
            let dialog = document.getElementById('regexp-importer')
            if ( dialog.className === 'hide-dialog')
                showImportRegExpDialog( )
            else
                hideImportRegExpDialog( )

            if ( !dialog.hidden )
                document.onclick = checkToSeeIfRegExpImporterNeedsToBeDisabledOnOutClick
            else
                document.onclick = ( ) => { }

            ( <HTMLInputElement> document.getElementById('regexp-importer-input')).value = ''
            onCheckRegExpForImporter( )
        }

        function showImportRegExpDialog ( ) {
            let dialog = document.getElementById('regexp-importer')
            dialog.hidden = false
            dialog.className = 'show-dialog'
        }

        function hideImportRegExpDialog ( ) {
            let dialog = document.getElementById('regexp-importer')
            dialog.className = 'hide-dialog'
            setTimeout( ( ) => {
                dialog.hidden = true
            }, 300 )
        }

    //
    // ─── ON IMPORT REGEXP ───────────────────────────────────────────────────────────
    //

        export function onImportRegExp ( ) {
            let input = ( <HTMLInputElement> document.getElementById('regexp-importer-input')).value
            let quartetXML = compileRegExToQuartetXML( input )
            quartet.updateWorkspaceWithNewXML( quartetXML )
            filesystem.setFileDirty( true )
            onOpenOrCloseImportRegExpDialog( )
        }

    //
    // ─── ON CHECK REGEXP ────────────────────────────────────────────────────────────
    //

        export function onCheckRegExpForImporter ( ) {
            let wildcard = ( <HTMLInputElement> document.getElementById('regexp-importer-input')).value
            try {
                if ( wildcard === '' )
                    return setRegExpImportButtonStatus( false )
                new RegExp( wildcard )
                return setRegExpImportButtonStatus( true )
            } catch ( error ) {
                return setRegExpImportButtonStatus( false )
            }
        }

        function setRegExpImportButtonStatus ( enable: boolean ) {
            let button  = document.getElementById('regexp-importer-button')
            let input   = document.getElementById('regexp-importer-input')
            if ( enable ) {
                setTimeout( ( ) => {
                    button.className    = 'enabled-button'
                }, 300)
                input.className     = 'input-with-button'
                return true
            } else {
                setTimeout( ( ) => {
                    input.className  = 'full-input'
                }, 200)
                button.className = 'disabled-button'
                return false
            }
        }

    //
    // ─── COMPILER ───────────────────────────────────────────────────────────────────
    //

        export function compileRegExToQuartetXML ( regX: string ) {
            try {
                let regulexAST = orchestra.externals.regulex.parse( regX )
                let compiledXML = concerto.compile( regulexAST )
                return compiledXML.replace( /\\"/g, '"' )
            } catch ( error ) {
                throw error
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}