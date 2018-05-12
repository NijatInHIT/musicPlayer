import React, {
	Component
} from 'react';
import Header from './components/header.js';
import Player from './components/player.js';
import SearchMusic from './components/searchMusic.js';



class Root extends Component {
	constructor(props) {
		super(props);
		this.changeMusicFromSearch = this.changeMusicFromSearch.bind(this);
	}

	componentWillUnmount() {
		$('#player').unbind($.jPlayer.event.timeupdate);
	}

	changeMusicFromSearch(id) {
		this.refs.playMusic.playMp3(id);

	}


	render() {
		return (
			<div>
				<Header />
				<hr/><br/>
				<SearchMusic  tpId={this.changeMusicFromSearch}/>
				<Player ref='playMusic'/>
			</div>
		);
	}
}

export default Root