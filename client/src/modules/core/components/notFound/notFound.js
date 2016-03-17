import React from 'react';
import ReactDOM from 'react-dom';

export default class NoFound extends React.Component {
	render() {
		return (
			<div>
				<div className="container">
					<div className="row">
				     	<div className="col-xs-12">
				     		<h1>Not Found</h1>
							<h3>I don't think these are the droids you are looking for.</h3>
							<h4><a href="/">Go back to where you came from</a></h4>
				      </div>
				    </div>
				</div>
			</div>
		);
	}
}