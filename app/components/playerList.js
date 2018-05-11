import React, {
	Component
} from 'react';

let rockList = [];
let defaultList = [];
let musicList = [];

let promise;



class PlayerList extends Component {
	constructor(props) {
		super(props);
		this.getList = this.getList.bind(this);
		this.chooseListMusic = this.chooseListMusic.bind(this);

		this.state = {
			listReady: false
		};
	}

	leaveList() {
		//$('.pList').removeClass('slideShow');
		$('.albumPreset').css({
			display: 'none'
		});
	}

	chooseListMusic(e) {
		if (e.target.nodeName === 'IMG') {
			this.props.changeSong(e.target.dataset.index);
		}
	}

	getList() {
		promise = new Promise((resolve, reject) => {
			$.ajax({
				type: 'get',
				url: 'http://127.0.0.1:3001',
				data: {
					songSheet: 89187756
				},
				success: function(data) {
					rockList = JSON.parse(data);
					for (var i = 0; i < rockList.result.tracks.length; i++) {
						defaultList.push(rockList.result.tracks[i].id);
						musicList.push({
							id: rockList.result.tracks[i].id,
							name: rockList.result.tracks[i].name,
							artist: rockList.result.tracks[i].artists[0].name,
							album: rockList.result.tracks[i].album.name,
							albumUrl: rockList.result.tracks[i].album.picUrl
						});
					}
					resolve();
				}
			});
		});
		promise.then(() => {
			this.props.nowPlaying(musicList);
			this.setState({
				listReady: true
			});
		});
	}

	mouseInList(e) {
		$('.albumPreset').css({
			display: 'block',
			top: e.pageY - 100
		});
	}


	render() {
		if (!this.state.listReady) {
			this.getList();
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
				<div className='pList'  onMouseMove={this.mouseInList} onMouseLeave={this.leaveList} onClick={this.chooseListMusic} dangerouslySetInnerHTML={{__html:retTag}}>
				</div>
			);
		}
	}
}


export default PlayerList