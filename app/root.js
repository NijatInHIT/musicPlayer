import React, {
	Component
} from 'react';
import Header from './components/header.js';
import Player from './components/player.js';
import SearchMusic from './components/searchMusic.js';



class Root extends Component {
	componentWillUnmount() {
		$('#player').unbind($.jPlayer.event.timeupdate);
	}

	render() {
		return (
			<div>
				<Header />
				<hr/><br/>
				<SearchMusic />
				<Player />
			</div>
		);
	}
}

export default Root