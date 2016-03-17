import React from 'react';
import ReactDOM from 'react-dom';

import request from 'superagent';

import Navigation from '../navigation/components/navigationComponent';
import ChallengesList from './components/challengesList';

export default class ChallengesPageController {
	
	init() {

		request
			.get( '/api/challenges' )
			.end( (err, res) => {
				if( err || !res.ok || !res.body.status ) {
					ReactDOM.render(
						<div>
							<Navigation page="challenges" />
							<div className="container">
								<div className="row">
							     	<div className="col-xs-12">
										<h1>Errors occured</h1>    
							      </div>
							    </div>
							</div>
						</div>,
						document.getElementById( 'view' )
					);
				}

				var body = <p>You have not created a Challenge. <a href="/challenges/create">Let's get started.</a></p>;

				var challenges = res.body.data;
				if( challenges && challenges.length ) {
					body = <ChallengesList challenges={ challenges } />;
				}

				ReactDOM.render(
					<div>
						<Navigation page="challenges" />
						<div className="container">
							<div className="row">
						     	<div className="col-xs-12">
						     		<h1>Challenges</h1>
									{body}
						      </div>
						    </div>
						</div>
					</div>,
					document.getElementById( 'view' )
				);

			})
		;
	}

}