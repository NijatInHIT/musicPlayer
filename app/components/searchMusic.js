import React, {
	Component
} from 'react';


let promise = Promise.resolve();
let searchValue = null;
class SearchMusic extends Component {
	constructor(props) {
		super(props);
		this.changeInput = this.changeInput.bind(this);
		this.clickSearch = this.clickSearch.bind(this);
		this.clickSearchedValue = this.clickSearchedValue.bind(this);
		this.enterDown = this.enterDown.bind(this);
		this.clickTab = this.clickTab.bind(this);
		this.mouseOutDetail = this.mouseOutDetail.bind(this);
		this.mouseMoveDetail = this.mouseMoveDetail.bind(this);
		this.state = {
			searchValue: undefined,
			soloDetail: undefined
		};

	}

	enterDown(e) {
		if (e.keyCode == 13) {
			$('.searchDetail').addClass('searchDetail-show');
			searchValue = e.target.value;
			let e1 = {};
			e1.target = {};
			e1.target.keyCode = 13;
			e1.target.nodeName = 'OAW';
			e1.target.innerHTML = 'songs';
			this.removeSearch(e1);
			this.clickTab(e1);
		}

	}

	clickTab(e) {
		if (e.target.nodeName == 'LI') {
			$('.detailTab li').removeClass('liChoosen');
			$(e.target).addClass('liChoosen');
		}
		new Promise((resolve, reject) => {
			$.ajax({
				type: 'GET',
				dataType: 'text',
				url: 'http://127.0.0.1:3001',
				data: {
					typeDetail: e.target.innerHTML,
					searchValue: searchValue
				},
				success: function(data) {
					data = JSON.parse(data);
					resolve(data);

				}
			});
		}).then(data => {
			this.setState({
				soloDetail: data
			});
		});

	}

	clickSearch(e) {
		if ($(e.target).hasClass('searchDiv') && !$(e.target).hasClass('getCross')) {
			$('.searchSuggest').addClass('searchSuggestShow');
			$('#search').focus();
			$('#search')[0].value = '';
			$('.searchDiv').addClass('searchOpen');
			setTimeout(() => {
				$('.searchDiv').addClass('getCross');
			}, 200);
			$('.searchDiv').append('<span class="clickCross"></span>');
			$('.clickCross').on('click', this.removeSearch.bind(this));
		}
	}

	removeSearch(e) {
		$('#search')[0].value = '';
		$('#search').blur();
		$('.searchDiv').removeClass('getCross');
		setTimeout(() => {
			$('.searchDiv').removeClass('searchOpen');
			$('.searchSuggest').removeClass('searchSuggestShow');
			$('.clickCross').remove();
			this.setState({
				searchValue: undefined,
			});
		}, 200);
	}

	mouseOutDetail(e) {
		$('.searchDetail-show').removeClass('searchDetail-show');
		this.setState({
			soloDetail: undefined
		})
	}

	mouseMoveDetail(e) {
		if (e.target.nodeName == 'P') {
			$('.blurImg').addClass('blurImg-show');
			$('.blurImg').css({
				top: e.pageY - 100,
				background: `url(${this.state.soloDetail.result [$(".liChoosen")[0].innerHTML] [$(".detailSolo p").index(e.target)].album.blurPicUrl}`

			});
		} else {
			$('.blurImg').removeClass('blurImg-show');
		}
	}

	clickSearchedValue(e) {
		if (e.target.nodeName === 'P') {
			console.log(e.target);
			let ret = [];

			if (e.target.parentNode.nodeName === 'SPAN') {
				ret[0] = e.target.parentNode.childNodes[0].wholeText.match(/[a-z]+/g)[0];
			} else {
				ret[0] = $('.liChoosen')[0].innerHTML;
			}

			ret[1] = e.target.getAttribute('ids')
			this.props.tpId(ret);
			this.removeSearch.bind(this)();
		}
	}


	changeInput(e) {
		if (e.target.value.length > 2) {
			searchValue = e.target.value;
			new Promise((resolve, reject) => {
				$.ajax({
					type: 'get',
					dataType: 'text',
					url: 'http://127.0.0.1:3001',
					data: {
						suggestSearch: searchValue
					},
					success: function(data) {
						data = JSON.parse(data);
						console.log(data);
						resolve(data);
					}
				});
			}).then(data => {
				this.setState({
					searchValue: data
				});
			});
		} else {
			this.setState({
				searchValue: undefined
			});
		}
	}



	render() {
		let retTag = '';
		let pTag = '';
		let subData = null;
		if (typeof this.state.searchValue === 'object' && this.state.searchValue.result.order) {
			for (let i = 0; i < this.state.searchValue.result.order.length; i++) {
				let newSpan = `<span>${this.state.searchValue.result.order[i]} ➥ `;
				subData = this.state.searchValue.result[this.state.searchValue.result.order[i]];
				pTag = '';
				switch (this.state.searchValue.result.order[i]) {
					case 'artists':
						pTag = '';
						for (let j = 0; j < subData.length; j++) {
							pTag += `<p>${subData[j].name}</p>`;
						}
						newSpan += pTag + '</span>';
						break;
					case 'albums':
						pTag = '';
						for (let j = 0; j < subData.length; j++) {
							pTag += `<p ids=${subData[j].id} >${subData[j].name}---${subData[j].artist.name}</p>`;
						}
						newSpan += pTag + '</span>';
						break;
					case 'playlists':
						pTag = '';
						for (let j = 0; j < subData.length; j++) {
							pTag += `<p ids=${subData[j].id} >${subData[j].name}</p>`;
						}
						newSpan += pTag + '</span>';
						break;


					default:
						pTag = '';
						for (let j = 0; j < subData.length; j++) {
							pTag += `<p ids=${subData[j].id}>${subData[j].name}---${subData[j].artists[0].name}</p>`;
						}
						newSpan += pTag + '</span>';
				}
				retTag += newSpan;
			}

		} else {
			retTag = '';
		}
		let retTag2 = '<div class="blurImg"></div>';
		let parType = !this.state.soloDetail ? null : this.state.soloDetail.parType;
		if (typeof this.state.soloDetail === 'object' && this.state.soloDetail.result[parType].length > 0) {
			pTag = '';
			subData = this.state.soloDetail.result[parType];
			if (this.state.soloDetail.parType.search(/artists|users|playlists/g) === -1) {
				for (let i = 0; i < subData.length; i++) {
					pTag += `<p ids=${subData[i].id}> ${subData[i].name} --- ${subData[i]['artist']?subData[i]['artist'].name:subData[i]['artists'][0].name} </p>`;
				}
				retTag2 += pTag;
			}
		} else {
			retTag2 = retTag2;
		}
		return (
			<div>
			<div className='searchDiv' onClick={this.clickSearch} >
				<input type="text" id='search' onChange={this.changeInput} autoComplete='off' onKeyDown={this.enterDown} />
			</div>
			<div className='searchSuggest' dangerouslySetInnerHTML={{__html:retTag}} onClick={this.clickSearchedValue}>
			</div>
			<div className='searchDetail' onMouseLeave={this.mouseOutDetail} onMouseMove={this.mouseMoveDetail}>
					<div className='detailTab' onClick={this.clickTab}>
						<ul><li className='liChoosen'>songs</li><li>albums</li><li>playlists</li><li>mvs</li><li>artists</li><li>users</li></ul>
					</div>
					<div className='detailSolo' dangerouslySetInnerHTML={{__html:retTag2}} onClick={this.clickSearchedValue}> 
					</div>

			</div>
			</div>
		)
	}

}


export default SearchMusic