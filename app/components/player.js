import React, {
	Component
} from 'react';
import Progress from './progress.js';
import PlayerList from './playerList.js';

let playList = null;
let duration = null;
let nowId = 0;
class Player extends Component {
	constructor(props) {
		super(props);
		this.progressChanged = this.progressChanged.bind(this);
		this.btnPause = this.btnPause.bind(this);
		this.nowPlayingChanged = this.nowPlayingChanged.bind(this);
		this.nextSong = this.nextSong.bind(this);
		this.state = {
			progress: 0,
			volume: 0,
			playState: 'playing',
			nowPlaying: ''
		};
	}

	componentDidMount() {
		$('#player').bind($.jPlayer.event.timeupdate, e => {
			duration = e.jPlayer.status.duration;
			this.setState({
				progress: e.jPlayer.status.currentPercentAbsolute,
			});
			$('.pgs-time').css({
				'width': e.jPlayer.status.currentPercentAbsolute + '%'
			});
		});
	}

	nowPlayingChanged(nowPlaying) {
		playList = nowPlaying;
		nowPlaying = nowPlaying[nowId % 113];
		console.log('over ! ');
		$('#player').jPlayer({
			ready: function() {
				$(this).jPlayer('setMedia', {
					mp3: nowPlaying.mp3
				}).jPlayer('play');
			},
			supplied: 'mp3',
			wmode: 'window',
			volume: 0.5,
			loop: true
		});
		$('.pCover').addClass('coverChange');
		setTimeout(() => {
			$('.pCover').removeClass('coverChange');
		}, 250);
		this.setState({
			nowPlaying: nowPlaying
		});
	}

	nextSong(changedId) {
		if (typeof changedId !== 'object') {
			nowId = changedId;
		} else if ($(changedId.target).hasClass('fa-arrow-circle-right')) {
			nowId = nowId - 0 + 1;
		} else if ($(changedId.target).hasClass('fa-arrow-circle-left')) {
			nowId = nowId - 0 - 1;
			nowId = nowId < 0 ? 113 + nowId : nowId;
		}
		$('#player').jPlayer('setMedia', {
			mp3: playList[nowId % 113].mp3
		}).jPlayer('play');
		$('.header-title')[0].innerHTML = '#' + playList[nowId % 113].name;

		this.setState({
			nowPlaying: playList[nowId % 113]
		});
	}

	progressChanged(newPgs) {
		$('#player').jPlayer('play', duration * newPgs);
		$('.fai').removeClass('fa-play-circle').addClass('fa-pause-circle');
		this.setState({
			progress: newPgs * 100,
			playState: 'playing'
		});
	}

	btnPause(e) {
		if (this.state.playState === 'playing') {
			$('#player').jPlayer('pause');
			$('.fai').removeClass('fa-pause-circle').addClass('fa-play-circle');
			this.setState({
				playState: 'paused'
			});
		} else {
			this.setState({
				playState: 'playing'
			});
			$('#player').jPlayer('play');
			$('.fai').removeClass('fa-play-circle').addClass('fa-pause-circle');
		}
	}

	toggleList() {
		$('.pList').toggleClass('slideShow');
	}

	render() {
		return (
			<div id='holeP'>
				<div className='playerDiv'>
					<div className='pCover' style={{backgroundImage: `url(${this.state.nowPlaying.albumUrl})`}}>
						<div className='allBtn'>
							<button className='btn'><i className="fa  fa-arrow-circle-left" onClick={this.nextSong}></i></button>
							<button className="btn btn-pause" onClick={this.btnPause}><i className="fai fa  fa-pause-circle"></i> </button>
							<button className='btn'><i className="fa  fa-arrow-circle-right" onClick={this.nextSong}></i></button>
							<button className='btn'><i className="fa  fa-list" onClick={this.toggleList}></i></button>
						</div>
					</div>
					<div style={{overflowX:'hidden'}}>
						<PlayerList nowPlaying={this.nowPlayingChanged} changeSong={this.nextSong}/>
					</div>
					<div>
						<Progress pgsChanged={this.progressChanged} progress={this.state.progress}/>
					</div>
				</div>



			
		</div>
		)
	}
}

export default Player