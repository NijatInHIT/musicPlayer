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
		this.playMp3 = this.playMp3.bind(this);
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
		$('#player').bind($.jPlayer.event.ended, e => {
			this.playMp3(playList[++nowId % playList.length]);
		});
	}

	playMp3(toPlay) {
		let promise = Promise.resolve();
		if (typeof toPlay !== 'object') {
			promise = promise.then(() => {
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'get',
						url: 'http://127.0.0.1:3001',
						data: {
							detail: toPlay
						},
						success: function(data) {
							data = JSON.parse(data);
							playList.unshift({
								id: data.songs[0].id,
								name: data.songs[0].name,
								artist: data.songs[0].artists[0].name,
								album: data.songs[0].album.name,
								albumUrl: data.songs[0].album.picUrl
							});
							toPlay = playList[0];
							nowId = 0;
							resolve();
						}
					});
				});
			})
		}
		promise.then(() => {
			return new Promise((resolve, reject) => {
				console.log(' GETTING MP3 ADDRESS of ----> ', toPlay.name, ' ----> ', 'DatabaseId : ', toPlay.id);
				$.ajax({
					type: 'get',
					url: 'http://127.0.0.1:3001',
					data: {
						mp3: toPlay.id
					},
					dataType: 'text',
					success: function(data) {
						data = JSON.parse(data);
						$('#player').jPlayer('setMedia', {
							mp3: data.data[0].url
						}).jPlayer('play');
						$('.header-title')[0].innerHTML = '#' + playList[nowId % playList.length].name;
						resolve();
					}
				});
			});
		}).then(() => {
			this.setState({
				nowPlaying: playList[nowId % playList.length]
			});
		})

	}

	nowPlayingChanged(nowPlaying) {
		playList = nowPlaying;
		nowPlaying = nowPlaying[nowId % playList.length];
		$('#player').jPlayer({
			supplied: 'mp3',
			wmode: 'window',
			volume: 0.5,
			loop: true
		});
		nowId = 0;
		this.playMp3(nowPlaying);
		$('.pCover').addClass('coverChange');
		setTimeout(() => {
			$('.pCover').removeClass('coverChange');
		}, 250);
	}

	nextSong(changedId) {
		if (typeof changedId !== 'object') {
			nowId = changedId;
		} else if ($(changedId.target).hasClass('fa-arrow-circle-right')) {
			nowId = nowId - 0 + 1;
		} else if ($(changedId.target).hasClass('fa-arrow-circle-left')) {
			nowId = nowId - 0 - 1;
			nowId = nowId < 0 ? playList.length + nowId : nowId;
		}
		this.playMp3(playList[nowId % playList.length]);
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
						<PlayerList ref='playList' nowPlaying={this.nowPlayingChanged} changeSong={this.nextSong}/>
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