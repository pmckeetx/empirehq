import page from 'page';
import React from 'react';
import ReactDOM from 'react-dom';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import request from 'superagent';

import Navigation from '../navigation/components/navigationComponent';
import ChallengeForm from './components/challengeForm';

export default class ChallengesPageController {
	
	constructor() {
		this.handleSave = this.handleSave.bind(this);
	}

	init() {
		this.render();
	}

	handleSave( challenge ) {
		console.log( 'here' );
		request
			.post( '/api/challenges' )
			.send( challenge )
			.end( (err, res) => {
				if( err || !res.ok || !res.body.status ) {
					this.hasError = true;
					this.render();
					return;
				}

				page( '/challenges' );
			})
		;
	}

	render() {

		let errorElement = null;
		if( this.hasError ) {
			errorElement = (
				<h1> ERRORORESSS!!!!</h1>
			);
		}

		ReactDOM.render(
			<div>
				<Navigation page="challenges" />
				<div className="container">
					<div className="row">
				     	<div className="col-xs-12 col-md-6 col-md-offset-3">
				     		{this.hasError ? errorElement : null}
				     		<h1>Challenges</h1>
				     		<h3>Create New Challenge</h3>
							<ChallengeForm mode="create" onSave={this.handleSave}/>
				      </div>
				    </div>
				</div>
			</div>,
			document.getElementById( 'view' )
		);
	}

}