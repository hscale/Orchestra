
//
// Copyright 2016 Kary Foundation, Inc.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── INIT WINDOW ────────────────────────────────────────────────────────────────
//

    function initWindow ( ) {
        setupWorkspace( )
        onNewFile( )
        handleWindowArgs( )
        initMainMenu( )
        setMenuEnableFactor( true )
        appendTrafficLightEvents( )
    }

//
// ─── HANDLE WINDOW ARGS ─────────────────────────────────────────────────────────
//

    function handleWindowArgs ( ) {
        let options = JSON.parse( decodeURI( window.location.search.substring( 1 ) ) )
        if ( options.file !== undefined | null | '' )
            openFileWithPath( options.file )
        else if ( options.regexp !== undefined | null | '' )
            importRegExp( options.regexp )
    }

//
// ─── CHANGE COLOR MODE ──────────────────────────────────────────────────────────
//

    function changeColorMode ( ) {
        if ( WindowTheme === 'dark' )
            setWindowColorMode( 'light' )
        else
            setWindowColorMode( 'dark' )
    }

//
// ─── SET WINDOW COLOR MODE ──────────────────────────────────────────────────────
//

    function setWindowColorMode ( mode ) {
        if ( mode === 'light' ) {
            WindowTheme = 'light'
            setViewColorModeMenuActivation( false )
            document.body.className = ''
        } else {
            WindowTheme = 'dark'
            setViewColorModeMenuActivation( true )
            document.body.className = 'dark'
        }

        changePlaygroundThemeTo( mode )
    }

//
// ─── CHOOSE RANDOMLY FROM ARRAY ─────────────────────────────────────────────────
//

    function chooseRandom ( arr ) {
        return arr[ Math.floor( Math.random( ) * arr.length ) ]
    }

//
// ─── PUSH ERROR NOTIFICATION ────────────────────────────────────────────────────
//

    function report ( text ) {
        console.error( text )
        let notification = new Notification( 'Orchestra', {
            body: text,
            sticky: true
        })
        notification.onclick = ( ) => {
            OrchestraWindow.openDevTools( )
            notification = null
        }
    }

//
// ─── ON CLOSE ───────────────────────────────────────────────────────────────────
//

    function fireWindowCloseRequest ( ) {
        if ( onBeforeWindowClose( 'Close') )
            OrchestraWindow.close( );
    }

//
// ─── ON QUIT ────────────────────────────────────────────────────────────────────
//

    function fireAppQuitRequest ( ) {
        if ( onBeforeWindowClose( 'Quit' ) )
            ipcRenderer.send( 'app-quit' )
    }

//
// ─── ON BEFORE WINDOW CLOSE ─────────────────────────────────────────────────────
//

    function onBeforeWindowClose ( closeButtonText ) {
        if ( getFileDirtStatus( ) ) {
            const ans = dialog.showMessageBox( getWindowForDialogSheets( ), {
                buttons: [ "Let's Save",  "Don't Close", `Nah! Just ${ closeButtonText }`],
                title: "Orchestra",
                message: 'You have changes that are not saved. Should we do something or pretend this conversation never happened?',
                detail: "A Jedi always takes care of it's files. Be in the good side and may the Force be with you.",
            })

            if ( ans === 0 )
                onSaveFile( )
            else if ( ans === 1 )
                return false
        }
        setMenuEnableFactor( false )
        return true
    }

//
// ─── ON MINIMIZE ────────────────────────────────────────────────────────────────
//

    function fireWindowMinimizeRequest ( ) {
        OrchestraWindow.minimize( )
    }

//
// ─── ON MAXIMIZE ────────────────────────────────────────────────────────────────
//

    function fireWindowMaximizeRequest ( ) {
        if ( OrchestraWindow.isMaximized( ) )
            OrchestraWindow.unmaximize( )
        else
            OrchestraWindow.maximize( )
    }

//
// ─── WINDOW BUTTONS BLUR ────────────────────────────────────────────────────────
//

    function makeWindowButtonsBlur ( ) {
        document.getElementById('window-button-close').className = 'window-buttons-blur-mode'
        document.getElementById('window-button-minimize').className = 'window-buttons-blur-mode'
        document.getElementById('window-button-maximize').className = 'window-buttons-blur-mode'
    }

//
// ─── MAKE WINDOW BUTTONS ACTIVE ─────────────────────────────────────────────────
//

    function makeWindowButtonsActive ( ) {
        document.getElementById('window-button-close').className = 'window-button-close-active'
        document.getElementById('window-button-minimize').className = 'window-button-minimize-active'
        document.getElementById('window-button-maximize').className = 'window-button-maximize-active'
    }

//
// ─── RESIZE ─────────────────────────────────────────────────────────────────────
//

    window.onresize = ( ) => {
        if ( playgroundEditor !== undefined )
            playgroundEditor.layout( )
    }

//
// ─── OPEN NEW WINDOW ────────────────────────────────────────────────────────────
//

    function openNewWindow ( ) {
        ipcRenderer.send( 'open-new-window' )
    }

//
// ─── ON OPEN HELP PAGE ──────────────────────────────────────────────────────────
//

    function onOpenHelpPage ( ) {
        ipcRenderer.send( 'open-help-page' )
    }

//
// ─── OPEN HELP WINDOW FOR REFERENCE ─────────────────────────────────────────────
//

    function openHelpWindowForReference ( refID ) {
        ipcRenderer.send( 'open-help-for-ref', refID )
    }

//
// ─── OPEN ABOUT PAGE ────────────────────────────────────────────────────────────
//

    function openAboutPage ( ) {
        ipcRenderer.send( 'open-about-page' )
    }

//
// ─── BLUR ───────────────────────────────────────────────────────────────────────
//

    OrchestraWindow.addListener( 'blur', ( ) => {
        setMenuEnableFactor( false )
        makeWindowButtonsBlur( )
        OrchestraWindow.blurWebView( )
    })

//
// ─── GAIN FOCUS ─────────────────────────────────────────────────────────────────
//

    OrchestraWindow.addListener( 'focus', ( ) => {
        setMenuEnableFactor( true )
        makeWindowButtonsActive( )
        OrchestraWindow.focusOnWebView( )
    })

//
// ─── MORE EVENTS ────────────────────────────────────────────────────────────────
//

    document.addEventListener( 'dragover', event => event.preventDefault( ) )
    document.addEventListener( 'drop', event => event.preventDefault( ) )

// ────────────────────────────────────────────────────────────────────────────────