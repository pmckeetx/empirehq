import React from 'react';
import ReactDOM from 'react-dom';

export default class ChallengesList extends React.Component {
	render() {
		let challenges = this.props.challenges.map( (challenge ) => {
			return (
				<li key={challenge._id}>{challenge.name}</li> 
			);
		})
		return (
			<div>
				<ul>{challenges}</ul>
			</div>
		);
	}
}