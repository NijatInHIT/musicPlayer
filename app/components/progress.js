import React, {
	Component
} from 'react';

class Progress extends Component {

	constructor(props) {
		super(props);
		this.changeProgress = this.changeProgress.bind(this);
	}


	changeProgress(e) {
		const newPgs = ((e.pageX - 780) / e.currentTarget.offsetWidth);
		this.props.pgsChanged(newPgs);
	}

	render() {
		return (
			<div className='cpt-pgs' onClick={this.changeProgress}>
				<div className='pgs-time'>{`----${this.props.progress}%----`}</div>
			</div>);
	}
}

export default Progress