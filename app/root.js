import React, {
	Component
} from 'react';
import Header from './components/header.js';
import Player from './components/player.js';



class Root extends Component {
	componentWillUnmount() {
		$('#player').unbind($.jPlayer.event.timeupdate);
	}

	render() {
		return (
			<div>
				<Header />
				<hr/><br/>
				<Player />
			</div>
		);
	}
}

export default Root