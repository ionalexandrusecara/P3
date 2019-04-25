// Navbar.js

import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        const colorStyle = {backgroundColor : '#21b526'};
        return(
            <nav class="navbar navbar-expand-lg navbar-dark" style={colorStyle}>
                <a class="navbar-brand" href="#">CS5044 P3</a>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ml-auto">
                    </ul>
                </div>
            </nav>
        )
    }
}
export default Navbar;