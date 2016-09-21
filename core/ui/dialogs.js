
//
// Copyright 2016 Kary Foundation, Inc.
//   Author: Pouya Kary <k@karyfoundation.org>
//

//
// ─── ON NEW FILE ────────────────────────────────────────────────────────────────
//

    function onNewFile ( ) {
        // reset the file
        currentFile = defaultFileObject;
        // setupWorkspaceWithNewFile( );
    }

//
// ─── ON OPEN FILE ───────────────────────────────────────────────────────────────
//

    function onOpenFile ( ) {
        let filePath = dialog.showOpenDialog( getWindowForDialogSheets( ), {
            properties: [ 'openFile' ],
            filters: [{
                name: 'Quartet Language',
                extensions: [ 'quartet' ]
            }]
        });
        if ( filePath === undefined ) return;
    }

//
// ─── ON SAVE FILE ───────────────────────────────────────────────────────────────
//

    function onSaveFile ( force = false ) {
        if ( checkPathAndAskForPathIfNeeded( force ) ) {
            saveFileWithInfo( );
        }
    }

//
// ─── ON SAVE FILE AS ────────────────────────────────────────────────────────────
//

    function onSaveFileAs ( ) {
        onSaveFile( true );
    }

//
// ─── GET WINDOW FOR DIALOG SHEETS ───────────────────────────────────────────────
//

    function getWindowForDialogSheets ( ) {
        return ( OrchestraWindow.isMaximized( ) )? OrchestraWindow : null;
    }

//
// ─── CHECK AND ASK FOR FILE PATH ────────────────────────────────────────────────
//

    function checkPathAndAskForPathIfNeeded ( forceAsk = false ) {
        if ( currentFile.path === defaultEmptyPath || forceAsk ) {
            const newPath = dialog.showSaveDialog( getWindowForDialogSheets( ), {
                filters: [{
                    name: 'Quartet',
                    extensions: [ 'quartet' ],
                }]
            });

            if ( newPath !== undefined ) {
                currentFile.path = newPath;
                return true;
            } else {
                currentFile = defaultFileObject;
                return false;
            }
        }
        return true;
    }

// ────────────────────────────────────────────────────────────────────────────────
