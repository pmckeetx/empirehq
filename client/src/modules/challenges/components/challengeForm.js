import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';

export default class ChallengesForm extends React.Component {

	constructor() {
		super();

    	this.state = {
    		challengeName: '',
    		description: '',
    		startDate: null,
    		endDate: null
    	};

    	this.handleChanges = this.handleChanges.bind( this );
    	this.handleSubmit = this.handleSubmit.bind( this );
    	this.validateForm = this.validateForm.bind( this );
  	}

	handleChanges( event ) {
		let state = {};
		state[ event.target.id ] = event.target.value;
		this.setState( state );
	}

	handleSubmit( event ) {
		event.preventDefault();

		if( this.validateForm() ) {
			let challenge = {
				name: this.state.challengeName,
				description: this.state.description,
				startDate: this.state.startDate,
				endDate: this.state.endDate
			}

			this.props.onSave( challenge );
		}
	}

	validateForm() {
		let result = true;
		this.setState({
			challengeNameInvalid: false,
			descriptionInvalid: false,
			startDateInvalid: false,
			endDateInvalid: false,
			startBeforeEndDateInvalid: false
		});
		
		//
		//	Challenge Name
		//
		if( !this.state.challengeName || this.state.challengeName.length == 0 ) {
			this.setState({
				challengeNameInvalid: true
			});
			result = false;
		}
		//
		//	Description
		//	
		if( !this.state.description || this.state.description.length == 0 ) {
			this.setState({
				descriptionInvalid: true
			});
			result = false;
		}
		//
		//	Start & End Date
		//
		if( !this.state.startDate || this.state.startDate.length == 0 ) {
			this.setState({
				startDateInvalid: true,

			});
			result = false;
		} else if( !moment( new Date(this.state.startDate) ).isValid() ) {
			this.setState({
				startDateInvalid: true
			});
			result = false;
		}
		
		if( !this.state.endDate || this.state.endDate.length == 0 ) {
			this.setState({
				endDateInvalid: true
			});
			result = false;
		} else if( !moment( new Date(this.state.endDate) ).isValid() ) {
			this.setState({
				endDateInvalid: true
			});
			result = false;
		}

		if( moment( new Date(this.state.startDate) ).isAfter( moment( new Date(this.state.endDate) ) ) ) {
			this.setState({
				startBeforeEndDateInvalid: true
			});
			result = false;
		}

		return result;
	}

	render() {
		let errorStyle = {
			color: '#a94442'
		};

		return (
			<form onSubmit={this.handleSubmit}>
				<div className={this.state.challengeNameInvalid ? 'form-group has-error' : 'form-group'}>
					<label htmlFor="challengeName">Challenge Name</label>
					<input id="challengeName" type="textbox" className="form-control" value={this.state.challengeName} onChange={this.handleChanges} />
					{ this.state.challengeNameInvalid ? <span className="help-block" style={errorStyle}>A challenge name is required.</span> : null }
				</div>
				<div className={this.state.descriptionInvalid ? 'form-group has-error' : 'form-group'}>
					<label htmlFor="description">Short Description</label>
					<input id="description" type="textbox" className="form-control" value={this.state.description} onChange={this.handleChanges} />
					{ this.state.descriptionInvalid ? <span className="help-block" style={errorStyle}>A description is required.</span> : null }
				</div>
				
				<div className={(this.state.endDateInvalid || this.state.startDateInvalid || this.state.startBeforeEndDateInvalid) ? 'form-group has-error' : 'form-group'}>
					<label htmlFor="endDate">Start/End Date</label>
					<div className="row">
						<div className="col-xs-6">
							<input id="startDate" type="textbox" className="form-control" value={this.state.startDate} onChange={this.handleChanges} />
						</div>
						<div className="col-xs-6">
							<input id="endDate" type="textbox" className="form-control" value={this.state.endDate} onChange={this.handleChanges} />
						</div>
					</div>
					{ this.state.startDateInvalid || this.state.endDateInvalid ? <span className="help-block" style={errorStyle}>A start and end date is required.</span> : null }
					{ this.state.startBeforeEndDateInvalid ? <span className="help-block" style={errorStyle}>The start date must be before the end date.</span> : null }
				</div>
				<button type="submit" className="btn btn-default">Submit</button>
			</form>
		);
	}
}