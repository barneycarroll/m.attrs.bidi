( function package( factory ){
	if( typeof define === 'function' && define.amd ){
		define( [ 'mithril' ], factory )
	}
	else if( typeof exports === 'object' ){
		module.exports = factory( require( 'mithril' ) )
	}
	else{
		factory( m )
	}
}( function define( m ){
	function bidi( node, prop ){
		var type = node.tag === 'select'
			? node.attrs.multi
				? 'multi'
				: 'select'
			: node.attrs.type

		// Setup: bind listeners
		if( type === 'multi' ){
			node.attrs.onchange = function(){
				prop( [].slice.call( this.selectedOptions, function( x ){
					return x.value
				} ) )
			}
		}
		else if( type === 'select' ){
			node.attrs.onchange = function( e ){
				prop( this.selectedOptions[ 0 ].value )
			}
		}
		else if( type === 'checkbox' ){
			node.attrs.onchange = function( e ){
				prop( this.checked )
			}
		}
		else {
			node.attrs.onchange = node.attrs.oninput = function( e ){
				prop( this.value )
			}
		}

		if( node.tag === 'select' ){
			node.children.forEach( function( option ){
				if( option.attrs.value === prop() || option.children[ 0 ] === prop() ){
					option.attrs.selected = true
				}
			} )
		}
		else if( type === 'checkbox' ){
			node.attrs.checked = prop()
		}
		else if( type === 'radio' ){
			node.attrs.checked = prop() === node.attrs.value
		}
		else {
			node.attrs.value   = prop()
		}

		return node
	}

	bidi.view = function( ctrl, node, prop ){
	  return bidi( node, node.attrs.bidi )
	}

	if( m.attrs ) m.attrs.bidi = bidi

	return bidi
} ) )
