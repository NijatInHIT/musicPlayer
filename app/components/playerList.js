import React, {
	Component
} from 'react';

let rockList = [];
let defaultList = [];
let musicList = [];
let timeout = null;
let promise;



class PlayerList extends Component {
	constructor(props) {
		super(props);
		this.getList = this.getList.bind(this);
		this.chooseListMusic = this.chooseListMusic.bind(this);
		this.mouseInList = this.mouseInList.bind(this);

		this.state = {
			listReady: false,
			mouseInImgId: 0
		};
	}

	leaveList() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			$('.pList').removeClass('slideShow');
		}, 1000);
		$('.albumPreset').css({
			display: 'none'
		});
	}

	chooseListMusic(e) {
		if (e.target.nodeName === 'IMG') {
			this.props.changeSong(e.target.dataset.index);
		}
	}

	getList(id) {
		promise = new Promise((resolve, reject) => {
			$.ajax({
				type: 'get',
				url: 'http://127.0.0.1:3001',
				data: {
					songSheet: id
				},
				success: function(data) {
					rockList = JSON.parse(data);
					defaultList = [];
					musicList = [];
					for (var i = 0; i < (rockList.result.tracks.length < 100 ? rockList.result.tracks.length : 100); i++) {
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
		clearTimeout(timeout);
		$('.albumPreset').css({
			display: 'block',
			top: e.pageY - 100
		});
		if (e.target.nodeName === 'IMG' && e.target.dataset.index != this.state.mouseInImgId) {
			this.setState({
				mouseInImgId: e.target.dataset.index
			});

		}
	}



	render() {
		if (!this.state.listReady) {
			this.getList('376639423');
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
				<div>
				<div className='albumPreset'>
					<p>{musicList[this.state.mouseInImgId].name}</p>
					<hr/>
					<p>{musicList[this.state.mouseInImgId].album}</p>
					<hr/>
					<p>---{musicList[this.state.mouseInImgId].artist}</p>
				</div>
				<div className='pList' onMouseMove={this.mouseInList} onMouseLeave={this.leaveList} onClick={this.chooseListMusic} dangerouslySetInnerHTML={{__html:retTag}}></div>
 				</div>
			);
		}
	}
}


export default PlayerList