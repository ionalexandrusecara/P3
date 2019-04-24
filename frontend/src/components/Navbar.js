// Navbar.js

import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        const colorStyle = {backgroundColor : '#21b526'};
        return(
            <nav class="navbar navbar-expand-lg navbar-dark" style={colorStyle}>
                <a class="navbar-brand" href="#">P3</a>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Authenticate</a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}
export default Navbar;