import React, {
	Component
} from 'react';
import rockList from './rockList.js';


let defaultList = [];
for (var i = 0; i < rockList.result.tracks.length; i++) {
	defaultList.push(rockList.result.tracks[i].id);
}
let musicList = [];



class PlayerList extends Component {
	constructor(props) {
		super(props);
		this.playFirst = this.playFirst.bind(this);
		this.chooseListMusic = this.chooseListMusic.bind(this);

		this.state = {
			listReady: false
		};
	}

	leaveList() {
		$('.pList').removeClass('slideShow');
	}

	chooseListMusic(e) {
		if (e.target.nodeName === 'IMG') {
			this.props.changeSong(e.target.dataset.index);
		}
	}

	playFirst() {
		let lastPromise = this.getMp3();
		Promise.all(lastPromise).then(value => {
			console.log('promise All!');
			this.setState({
				listReady: true
			});
			this.props.nowPlaying(musicList);
		});
	}

	getMp3() {
		let ret = defaultList.map((one, i) => {
			musicList.push({
				id: rockList.result.tracks[i].id,
				name: rockList.result.tracks[i].name,
				artist: rockList.result.tracks[i].artists[0].name,
				album: rockList.result.tracks[i].album.name,
				albumUrl: rockList.result.tracks[i].album.picUrl
			});


			return new Promise((resolve, reject) => {
				console.log(' GETTING MP3 ADDRESS of ----> ', rockList.result.tracks[i].name, ' ----> ', one);
				$.ajax({
					type: 'get',
					url: 'http://127.0.0.1:3001',
					data: {
						mp3: one
					},
					dataType: 'text',
					success: function(data) {
						data = JSON.parse(data);
						for (let i = 0; i < musicList.length; i++) {
							if (data.data[0].id === musicList[i].id) {
								musicList[i].mp3 = data.data[0].url;
							}
						}
						resolve();
					}
				});
			})
		});
		console.log(musicList);
		return ret;
	}


	render() {
		if (!this.state.listReady) {
			this.playFirst();
			return (<div className='pList' onMouseLeave={this.leaveList}>
					<h3> not ready!</h3>
				</div>);
		} else {
			let retTag = ``;
			for (let i = 0; i < musicList.length; i++) {
				retTag += `<li><img class='blurAlbum' src=${musicList[i].albumUrl} data-index=${i}></img></li>`
			}
			retTag = `<ul style='list-style:none'>${retTag}</ul>`;
			return (
				<div className='pList' onMouseLeave={this.leaveList} onClick={this.chooseListMusic} dangerouslySetInnerHTML={{__html:retTag}}>
				</div>
			);
		}
	}
}


export default PlayerList