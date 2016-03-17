import page from 'page';
import React from 'react';
import ReactDOM from 'react-dom';

import NotFound from '../modules/core/components/notFound/notFound';

import Navigation from '../modules/navigation/components/navigationComponent';
import ChallengesPageController from '../modules/challenges/challengesPageController.js';
import ChallengesCreateController from '../modules/challenges/challengesCreateController.js';


page( '/', () => {
	page( '/dashboard' );
});

page( '/dashboard', () => {
	ReactDOM.render( 
		<div>
			<Navigation page="dashboard" />
			<div className="container">
				<div className="row">
			     	<div className="col-xs-12">
						<h1>Dashboard</h1>
			      </div>
			    </div>
			</div>
		</div>,
		document.getElementById( 'view' )
	);
});
//
//	CHALLENGES
//
page( '/challenges', () => {
	var controller = new ChallengesPageController();
	controller.init();
});

page( '/challenges/create', () => {
	var controller = new ChallengesCreateController();
	controller.init();
});

page( '*', () => {
	ReactDOM.render( 
		<NotFound />,
		document.getElementById( 'view' )
	);
});

var router = {
	start: page.start
}

export default router;

