import React from 'react';
import ReactDOM from 'react-dom';

export default class Navigation extends React.Component {

    // getInitialState: function() {
    //     return {
    //         activePage: 'dashboard'
    //     };
    // }

    // componentDidMount() {

    // }

    render() {

        return (
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="#">Empire</a>
              </div>
              <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                  <li className={ this.props.page == 'dashboard' ? 'active' : '' }><a href="/">Dashboard</a></li>
                  <li className={ this.props.page == 'challenges' ? 'active' : '' }><a href="/challenges">Challenges</a></li>
                </ul>
              </div>
            </div>
          </nav>
        );
    }
}
