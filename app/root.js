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
		switch (id[0]) {
			case 'songs':
				this.refs.playMusic.playMp3(id[1]);
				break;
			case 'playlists':
				this.refs.playMusic.refs.playList.getList(id[1]);
				break;
			default:
				console.log(id[0]);
		}
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