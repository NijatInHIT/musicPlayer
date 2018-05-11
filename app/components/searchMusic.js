import React, {
	Component
} from 'react';



class SearchMusic extends Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div className='searchDiv'>
				<input type="text" name="" id='search' />
				<input type="text" name="" style={{display:'none'}}/>
			</div>
		)
	}

}


export default SearchMusic