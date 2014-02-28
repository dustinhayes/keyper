(function () {
    'use strict';

    var keyper = {};
    keyper.__selectors = {};

    keyper.__KEYS = {
        // [A-Z]
        65:"a", 66:"b", 67:"c", 68:"d",
        69:"e", 70:"f", 71:"g", 72:"h",
        73:"i", 74:"j", 75:"k", 76:"l",
        77:"m", 78:"n", 79:"o", 80:"p",
        81:"q", 82:"r", 83:"s", 84:"t",
        85:"u", 86:"v", 87:"w", 88:"x",
        89:"y", 90:"z",

        // [0-9]
        48:"0", 49:"1", 50:"2", 51:"3",
        52:"4", 53:"5", 54:"6", 55:"7",
        56:"8", 57:"9",

        // Punctuation
        59:";", 61:"=", 186:";", 187:"=",
        188:",", 189:"-", 190:".", 191:"/",
        192:"`", 219:"[", 220:"\\", 221:"]",
        222:"'",

        // Named
        8:"backspace", 9:"tab", 13:"enter",
        20:"caps", 27:"esc", 32:"space",
        37:"left", 38:"up", 39:"right",
        40:"down",
    };

    keyper.create = function( selector, keymap ) {
        var keyids, keyid;

        this.__listen( selector );

        selector = this.__selectors[ selector ] = {};
        selector.keymap = keymap;

        keyids = selector.keyids = [];

        for ( keyid in keymap )
            keyids.push(keyid);

        return this;
    };

    keyper.extend = function( selector, keyid, fn ) {
        var keymap, keyids, noKeyid,
            search = function( key ) {
                return key !== keyid;
            };

        selector = this.__selectors[ selector ];
        keymap = selector.keymap;
        keyids = selector.keyids;
        
        keymap[ keyid ] = fn;

        noKeyid = keyids.every( search );

        if ( noKeyid )
            keyids.push( keyid );

        return this;
    };

    keyper.delete = function( selector, keyid ) {
        var index, keyids;

        selector = this.__selectors[ selector ];
        
        delete selector.keymap[ keyid ];

        keyids = selector.keyids;
        index = keyids.indexOf(keyid);
        keyids.splice( index, 1 );

        return this;
    };

    keyper.__listen = function( selector ) {
        var addEvent = function( element ) {
                var handler = function( event ) {
                        keyper.__handle( event, selector, element );
                    };
                element.addEventListener( "keydown", handler, false );
            },
            addTabIndex = function( element ) {
                element.tabIndex = element.tabIndex;
            },
            elements;

        switch( selector ) {
            case 'window':
                addEvent( window );
                break;
            case 'document':
                addEvent( document );
                break;
            default:
                elements = document.querySelectorAll( selector );
                [].forEach.call( elements, addEvent );
                [].forEach.call( elements, addTabIndex );
        }
    };

    keyper.__handle = function( event, selector, element ) {
        var modifiers = '',
            keyname,
            keyid,
            fn;

        keyname = this.__KEYS[ event.keyCode ];
        if ( ! keyname ) return;

        if ( event.altKey ) modifiers += 'alt_';
        if ( event.ctrlKey ) modifiers += 'ctrl_';
        if ( event.metaKey ) modifiers += 'meta_';
        if ( event.shiftKey ) modifiers += 'shift_';

        keyid = modifiers + keyname;

        fn = this.__selectors[selector].keymap[keyid];
        if ( fn ) fn.call( element, event );
        
        if ( selector === '*' ) event.stopPropagation();
    };

    window.keyper = Object.freeze(keyper);
}());